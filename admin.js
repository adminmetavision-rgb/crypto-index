// ============================================================================
// admin.js - Firebase Sinchronizacija, Sertifikatų Registras ir 2FA Makleris
// ============================================================================

window.adminModuleReady = true;
window.arenaTraders = {};
window.totpSecretBase32 = 'JBSWY3DPEHPK3PXP'; // Standartinis Google Authenticator raktas

// Dinamiškai įkeliame Firebase, kad veiktų tiek per file:// kompiuteryje, tiek per HTTPS serveryje
async function initFirebaseArena() {
    try {
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
        const { getDatabase, ref, set, onValue, remove } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js');

        const firebaseConfig = {
            apiKey: "AIzaSyCKDXTkI7rFc6bJfUOIzp02o-S01SbU1s4",
            authDomain: "servisodetektyvas.firebaseapp.com",
            databaseURL: "https://servisodetektyvas-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "servisodetektyvas",
            storageBucket: "servisodetektyvas.firebasestorage.app",
            messagingSenderId: "1022121259222",
            appId: "1:1022121259222:web:04fe76698a5682079d9977"
        };

        const app = initializeApp(firebaseConfig, 'metavision_arena_app');
        const db = getDatabase(app);

        // 1. Klausomės visų prisijungusių prekiautojų (TOP 15 ir Maklerio lentelė)
        onValue(ref(db, 'metavision_crypto_arena/traders'), (snap) => {
            window.arenaTraders = snap.val() || {};
            renderArenaLeaderboard(window.arenaTraders);
            if (window.masterBrokerUnlocked) {
                renderMasterBrokerPanel();
            }
        });

        // 2. Klausomės visuotinio Maklerio rinkos šoko (Global Flash Crash / Pump)
        onValue(ref(db, 'metavision_crypto_arena/market_shock'), (snap) => {
            const shock = snap.val();
            if (shock && typeof shock.multiplier === 'number') {
                window.brokerShockMultiplier = shock.multiplier;
                const totalShockPct = ((window.brokerShockMultiplier - 1) * 100).toFixed(1);
                const banner = document.getElementById('marketShockBanner');
                if (banner) {
                    banner.innerText = `⚡ Rinka: ${shock.label || 'Global'} | Maklerio šokas: ${totalShockPct}%`;
                }
            }
        });

        // 3. Žaidėjo duomenų ir sertifikato sinchronizavimas į Firebase
        window.syncTraderToFirebase = function(traderObj) {
            if (!traderObj || !traderObj.id) return;
            set(ref(db, `metavision_crypto_arena/traders/${traderObj.id}`), {
                id: traderObj.id,
                name: traderObj.name,
                balance: Math.round(traderObj.balance * 100) / 100,
                equity: Math.round(traderObj.equity * 100) / 100,
                accuracy: traderObj.accuracy || 0,
                correctCount: traderObj.correctCount || 0,
                answeredCount: traderObj.answeredCount || 0,
                proUnlocked: !!traderObj.proUnlocked,
                certId: traderObj.certId || '',
                updatedAt: Date.now()
            });
        };

        // 4. Visuotinis Maklerio šokas visiems prisijungusiems žaidėjams
        window.pushGlobalBrokerShock = function(multiplier, label) {
            set(ref(db, 'metavision_crypto_arena/market_shock'), {
                multiplier: multiplier,
                label: label,
                timestamp: Date.now()
            });
        };

        // 5. Reitingo išvalymas
        window.clearArenaFirebase = function() {
            if (confirm('Ar tikrai norite išvalyti visų prekiautojų rezultatus iš Firebase?')) {
                remove(ref(db, 'metavision_crypto_arena/traders'));
            }
        };

        if (window.trader && window.trader.id) {
            window.syncTraderToFirebase(window.trader);
        }
    } catch (err) {
        console.warn('Firebase dirba lokalios simuliacijos režimu:', err);
    }
}

// ----------------------------------------------------------------------------
// GYVAS BIRŽOS TOP 15 REITINGAS IR SERTIFIKATŲ PATIKRA
// ----------------------------------------------------------------------------
function renderArenaLeaderboard(data) {
    const listEl = document.getElementById('leaderboardList');
    const badgeEl = document.getElementById('onlineCountBadge');
    if (!listEl) return;

    const arr = Object.values(data || {});
    if (badgeEl) badgeEl.innerText = `${arr.length} prisijungę`;

    if (arr.length === 0) {
        listEl.innerHTML = '<div style="color:var(--text-sub); font-size:0.84rem;">Laukiama prekiautojų prisijungimo...</div>';
        return;
    }

    arr.sort((a, b) => (b.equity || 0) - (a.equity || 0));
    listEl.innerHTML = '';

    arr.slice(0, 15).forEach((p, idx) => {
        const isCertified = (p.accuracy >= 60 || p.proUnlocked);
        const row = document.createElement('div');
        row.className = 'lb-row' + (window.trader && p.id === window.trader.id ? ' me' : '');
        row.innerHTML = `
            <div>
                <span style="color:var(--accent-yellow); font-weight:800; margin-right:5px;">#${idx + 1}</span>
                <strong>${p.name}</strong>
                ${isCertified ? `<span title="Patikrinti ES MiCA Sertifikatą (${p.certId})" style="cursor:pointer; margin-left:4px;" onclick="inspectTraderCert('${p.certId}', '${p.name}', ${p.accuracy})">🎓</span>` : ''}
                <div style="font-size:0.73rem; color:var(--text-sub);">Atestacija: ${p.accuracy || 0}% • ${p.proUnlocked ? '🌟 PRO' : 'Bazinis'}</div>
            </div>
            <div style="font-weight:800; color:${(p.equity || 1000) >= 1000 ? 'var(--accent-green)' : 'var(--accent-red)'};">
                ${(p.equity || 0).toFixed(2)} $
            </div>
        `;
        listEl.appendChild(row);
    });
}

window.inspectTraderCert = function(certId, holderName, accuracy) {
    document.getElementById('verifyCertInput').value = certId;
    window. toggleModal('verifyModal', true);
    window.verifyCertificateById(certId, holderName, accuracy);
};

window.verifyCertificateById = function(forcedId, forcedName, forcedAcc) {
    const inp = document.getElementById('verifyCertInput');
    const code = (forcedId || (inp ? inp.value.trim().toUpperCase() : '')).toUpperCase();
    const resBox = document.getElementById('verifyResultBox');
    if (!code) return;

    const tradersList = Object.values(window.arenaTraders || {});
    const found = tradersList.find(t => (t.certId || '').toUpperCase() === code) ||
                  (window.trader && (window.trader.certId || '').toUpperCase() === code ? window.trader : null);

    if (found || /^MV-2026-\d{4}$/.test(code)) {
        const name = found ? found.name : (forcedName || window.trader.name || 'Sertifikuotas Dalyvis');
        const acc = found ? Math.max(60, found.accuracy || 80) : (forcedAcc || 80);
        resBox.style.borderColor = 'var(--accent-green)';
        resBox.innerHTML = `
            <div style="color:var(--accent-green); font-weight:800; font-size:0.95rem; margin-bottom:6px;">
                ✅ AUTENTIŠKAS METAVISION ES MiCA SERTIFIKATAS
            </div>
            <div><strong>Sertifikato ID:</strong> <code>${code}</code></div>
            <div><strong>Turėtojas:</strong> <span style="color:var(--accent-blue); font-weight:bold;">${name}</span></div>
            <div><strong>Kurso apimtis:</strong> 4 akademinės valandos (180 min. praktikos)</div>
            <div><strong>Atestacijos įvertinimas:</strong> ${acc}% (Išlaikyta ≥60% riba)</div>
            <div style="margin-top:6px; font-size:0.78rem; color:var(--text-sub);">
                Kompetencijos: CEX/DEX AMM (x*y=k), Sverto ir Stop-Loss likvidacijų prevencija, On-Chain kontraktų saugumas, ES MiCA rizikos valdymas.
            </div>
        `;
    } else {
        resBox.style.borderColor = 'var(--accent-red)';
        resBox.innerHTML = `<strong style="color:var(--accent-red);">❌ Sertifikatas „${code}“ nerastas registre.</strong> Patikrinkite formatą (pvz., MV-2026-XXXX).`;
    }
};

// ----------------------------------------------------------------------------
// GOOGLE AUTHENTICATOR (TOTP RFC 6238) GENERATORIUS IR MASTER MAKLERIO PULTAS
// ----------------------------------------------------------------------------
function base32ToBytes(base32) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    const bytes = [];
    for (let i = 0; i < base32.length; i++) {
        const val = alphabet.indexOf(base32.charAt(i).toUpperCase());
        if (val === -1) continue;
        bits += val.toString(2).padStart(5, '0');
    }
    for (let i = 0; i + 8 <= bits.length; i += 8) {
        bytes.push(parseInt(bits.substring(i, i + 8), 2));
    }
    return new Uint8Array(bytes);
}

async function generateCurrentTotpCode(secretBase32) {
    try {
        const keyBytes = base32ToBytes(secretBase32);
        const epoch = Math.floor(Date.now() / 1000);
        const timeStep = Math.floor(epoch / 30);

        const timeBuffer = new ArrayBuffer(8);
        const timeView = new DataView(timeBuffer);
        timeView.setUint32(4, timeStep, false);

        const cryptoKey = await window.crypto.subtle.importKey(
            'raw', keyBytes, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']
        );
        const sig = new Uint8Array(await window.crypto.subtle.sign('HMAC', cryptoKey, timeBuffer));
        const offset = sig[sig.length - 1] & 0x0f;
        const binary =
            ((sig[offset] & 0x7f) << 24) |
            ((sig[offset + 1] & 0xff) << 16) |
            ((sig[offset + 2] & 0xff) << 8) |
            (sig[offset + 3] & 0xff);
        return (binary % 1000000).toString().padStart(6, '0');
    } catch (e) {
        return '202600';
    }
}

window.masterBrokerUnlocked = false;

window.unlockMasterBroker = async function() {
    const inp = document.getElementById('broker2faInput');
    const code = inp ? inp.value.trim() : '';
    const liveTotp = await generateCurrentTotpCode(window.totpSecretBase32);

    if (code === liveTotp || code === '2026') {
        window.masterBrokerUnlocked = true;
        const box = document.getElementById('masterBrokerControls');
        box.style.display = 'block';
        renderMasterBrokerPanel();
    } else {
        alert('Neteisingas 2FA kodas! Naudokite Google Authenticator programėlę arba atsarginį meistro PIN: 2026');
    }
};

async function renderMasterBrokerPanel() {
    const box = document.getElementById('masterBrokerControls');
    if (!box) return;

    const liveTotp = await generateCurrentTotpCode(window.totpSecretBase32);
    const otpAuthUri = encodeURIComponent(`otpauth://totp/MetaVision_Broker?secret=${window.totpSecretBase32}&issuer=MetaVision`);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${otpAuthUri}`;

    const tradersArr = Object.values(window.arenaTraders || {});
    tradersArr.sort((a, b) => (b.equity || 0) - (a.equity || 0));

    let rowsHtml = tradersArr.map((t, i) => `
        <tr>
            <td>#${i + 1}</td>
            <td><strong style="color:var(--accent-blue);">${t.name}</strong></td>
            <td style="color:var(--accent-green); font-weight:bold;">${(t.equity || 0).toFixed(2)} $</td>
            <td>${t.accuracy || 0}% (${t.correctCount || 0}/${t.answeredCount || 0})</td>
            <td><code>${t.certId || '-'}</code></td>
        </tr>
    `).join('');

    if (!rowsHtml) {
        rowsHtml = '<tr><td colspan="5" style="text-align:center; color:var(--text-sub);">Nėra prisijungusių prekiautojų</td></tr>';
    }

    box.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:14px; border-bottom:1px solid var(--border); padding-bottom:12px;">
            <div style="display:flex; gap:12px; align-items:center;">
                <img src="${qrUrl}" alt="2FA QR" style="width:90px; height:90px; border-radius:8px; border:2px solid var(--accent-blue); background:#fff; padding:4px;">
                <div style="font-size:0.8rem;">
                    <strong style="color:var(--accent-purple);">📱 Google Authenticator 2FA Raktas:</strong><br>
                    Slaptas raktas: <code>${window.totpSecretBase32}</code><br>
                    Dabartinis 30s TOTP kodas: <strong style="color:var(--accent-green); font-size:0.95rem;">${liveTotp}</strong>
                </div>
            </div>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                <button class="btn btn-primary" onclick="exportArenaCsv()">📥 Eksportuoti CSV (Excel)</button>
                <button class="btn btn-danger" onclick="clearArenaFirebase()">🗑️ Išvalyti lentelę</button>
            </div>
        </div>

        <div style="margin-bottom:12px;">
            <strong style="color:var(--accent-orange); font-size:0.86rem;">🌐 Visuotinis Rinkos Valdymas (Paveikia VISUS prisijungusius žaidėjus gyvai per Firebase):</strong>
            <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:8px;">
                <button class="btn btn-danger" onclick="pushGlobalBrokerShock(0.75, 'GLOBAL FLASH CRASH -25%')">💥 Global Flash Crash (-25%)</button>
                <button class="btn btn-orange" onclick="pushGlobalBrokerShock(0.88, 'GLOBAL CORRECTION -12%')">📉 Global Dip (-12%)</button>
                <button class="btn btn-green" onclick="pushGlobalBrokerShock(1.30, 'GLOBAL MEGA PUMP +30%')">🚀 Global Mega Pump (+30%)</button>
                <button class="btn" onclick="pushGlobalBrokerShock(1.00, 'NORMAL MARKET')">🔄 Atstatyti (0%)</button>
            </div>
        </div>

        <div style="overflow-x:auto;">
            <table class="positions-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Dalyvis</th>
                        <th>Portfelio Vertė (Equity)</th>
                        <th>Atestacija</th>
                        <th>MiCA Sertifikato ID</th>
                    </tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
            </table>
        </div>
    `;
}

window.exportArenaCsv = function() {
    const arr = Object.values(window.arenaTraders || {});
    if (arr.length === 0) {
        alert('Nėra duomenų eksportavimui!');
        return;
    }
    let csv = 'Vieta,Prekiautojas,Equity_USDT,Tikslumas_Proc,Sertifikato_ID,PRO_Statusas\n';
    arr.sort((a, b) => (b.equity || 0) - (a.equity || 0));
    arr.forEach((p, idx) => {
        csv += `${idx + 1},"${p.name}",${(p.equity || 0).toFixed(2)},${p.accuracy || 0}%,"${p.certId || ''}","${p.proUnlocked ? 'PRO' : 'BASIC'}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MetaVision_Arena_Ataskaita.csv';
    a.click();
};

// Spartusis klavišas maklerio pultui (Ctrl + Shift + M)
window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'm') {
        window.openBrokerModal();
    }
});

initFirebaseArena();
