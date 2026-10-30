// ============================================================================
// market.js - METAVISION Biržos Variklis, Grafikas, Risk Co-Pilot ir Web3 DEX
// ============================================================================

window.currentLang = 'lt';
window.soundEnabled = true;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function playTone(freq, type, duration) {
    if (!window.soundEnabled) return;
    try {
        if (!audioCtx) audioCtx = new AudioCtx();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
}

function sfxBeep() { playTone(920, 'sine', 0.09); }
function sfxWin() { playTone(587, 'triangle', 0.12); setTimeout(() => playTone(880, 'triangle', 0.22), 110); }
function sfxError() { playTone(180, 'sawtooth', 0.28); }
function sfxLiquidationAlarm() {
    playTone(220, 'sawtooth', 0.2);
    setTimeout(() => playTone(160, 'sawtooth', 0.35), 210);
}

window.toggleSound = function() {
    window.soundEnabled = !window.soundEnabled;
    document.getElementById('soundBtn').innerText = window.soundEnabled ? '🔊 Garsas: ĮJ.' : '🔇 Garsas: IŠJ.';
};

window.toggleModal = function(id, show) {
    const el = document.getElementById(id);
    if (el) el.style.display = show ? 'flex' : 'none';
};

// ----------------------------------------------------------------------------
// ŽAIDĖJO IR PORTFELIO BŪSENA
// ----------------------------------------------------------------------------
window.trader = {
    id: '',
    name: 'Svečias',
    balance: 1000.00,
    equity: 1000.00,
    currentMissionIdx: 0,
    correctCount: 0,
    answeredCount: 0,
    accuracy: 0,
    proUnlocked: false,
    certId: '',
    positions: [],
    history: {}
};

// ----------------------------------------------------------------------------
// RINKOS KAINOS, CANDLESTICK GRAFIKAS IR BINANCE WEBSOCKET
// ----------------------------------------------------------------------------
window.marketPairs = {
    BTCUSDT: { label: 'BTC/USDT', basePrice: 68450.00, price: 68450.00, decimals: 2, candles: [] },
    ETHUSDT: { label: 'ETH/USDT', basePrice: 3420.00, price: 3420.00, decimals: 2, candles: [] },
    SOLUSDT: { label: 'SOL/USDT', basePrice: 178.50, price: 178.50, decimals: 2, candles: [] },
    MVISUSDT: { label: 'MVIS/USDT', basePrice: 1.2500, price: 1.2500, decimals: 4, candles: [] }
};

window.activePair = 'BTCUSDT';
window.brokerShockMultiplier = 1.0;
window.orderDirection = 'LONG';

// Sugeneruojame 45 pradines žvakides kiekvienai porai
Object.keys(window.marketPairs).forEach(sym => {
    const p = window.marketPairs[sym];
    let cur = p.basePrice;
    for (let i = 0; i < 45; i++) {
        const delta = cur * (Math.random() - 0.495) * 0.008;
        const open = cur;
        const close = cur + delta;
        const high = Math.max(open, close) + cur * Math.random() * 0.004;
        const low = Math.min(open, close) - cur * Math.random() * 0.004;
        p.candles.push({ open, high, low, close });
        cur = close;
    }
    p.price = cur;
    p.basePrice = cur;
});

// Prisijungiame prie Binance WebSocket gyvoms kainoms
function initBinanceStream() {
    try {
        const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker/ethusdt@ticker/solusdt@ticker');
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data && data.s && window.marketPairs[data.s]) {
                const rawPrice = parseFloat(data.c);
                if (rawPrice > 0) {
                    window.marketPairs[data.s].basePrice = rawPrice;
                }
            }
        };
    } catch (e) {}
}

// Kiekvieną sekundę atnaujiname kainas, žvakides ir tikriname Stop-Loss / Likvidacijas
function tickMarketEngine() {
    Object.keys(window.marketPairs).forEach(sym => {
        const p = window.marketPairs[sym];
        const microNoise = p.basePrice * (Math.random() - 0.498) * 0.0025;
        p.basePrice = Math.max(0.01, p.basePrice + microNoise);
        p.price = p.basePrice * window.brokerShockMultiplier;

        const lastCandle = p.candles[p.candles.length - 1];
        lastCandle.close = p.price;
        if (p.price > lastCandle.high) lastCandle.high = p.price;
        if (p.price < lastCandle.low) lastCandle.low = p.price;

        // Kas 6 sekundes pradedame naują žvakidę
        if (Math.random() < 0.18) {
            p.candles.push({
                open: p.price,
                high: p.price,
                low: p.price,
                close: p.price
            });
            if (p.candles.length > 50) p.candles.shift();
        }

        const tickEl = document.getElementById('tick_' + sym);
        if (tickEl) {
            const isUp = lastCandle.close >= lastCandle.open;
            const color = isUp ? 'var(--accent-green)' : 'var(--accent-red)';
            tickEl.innerHTML = `${p.label}: <strong style="color:${color}">${p.price.toFixed(p.decimals)}</strong>`;
        }
    });

    const curPairObj = window.marketPairs[window.activePair];
    const livePriceEl = document.getElementById('chartLivePrice');
    if (livePriceEl && curPairObj) {
        livePriceEl.innerText = curPairObj.price.toFixed(curPairObj.decimals) + ' USDT';
    }

    evaluateOpenPositions();
    drawPriceChart();
}

// ----------------------------------------------------------------------------
// HTML5 CANVAS ŽVAKIDŽIŲ GRAFIKAS SU SL / LIQ LINIJOMIS
// ----------------------------------------------------------------------------
window.drawPriceChart = function() {
    const canvas = document.getElementById('priceChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const pairObj = window.marketPairs[window.activePair];
    const candles = pairObj.candles;
    if (!candles || candles.length === 0) return;

    let minP = Infinity;
    let maxP = -Infinity;
    candles.forEach(c => {
        if (c.low < minP) minP = c.low;
        if (c.high > maxP) maxP = c.high;
    });

    // Įtraukiame aktyvios pozicijos SL ir Likvidacijos linijas į mastelį
    window.trader.positions.forEach(pos => {
        if (pos.pair === window.activePair) {
            if (pos.sl && pos.sl < minP) minP = pos.sl * 0.995;
            if (pos.sl && pos.sl > maxP) maxP = pos.sl * 1.005;
        }
    });

    const pad = (maxP - minP) * 0.12 || 1;
    minP -= pad;
    maxP += pad;

    const priceToY = (p) => h - 20 - ((p - minP) / (maxP - minP)) * (h - 40);

    // Tinklelis
    ctx.strokeStyle = '#151e32';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
        const y = (h / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();

        const labelP = maxP - ((i / 5) * (maxP - minP));
        ctx.fillStyle = '#64748b';
        ctx.font = '11px Consolas, monospace';
        ctx.fillText(labelP.toFixed(pairObj.decimals), w - 75, y - 4);
    }

    // Žvakidės
    const step = (w - 85) / candles.length;
    const candleW = Math.max(4, step * 0.62);

    candles.forEach((c, idx) => {
        const x = 10 + idx * step;
        const isBull = c.close >= c.open;
        ctx.strokeStyle = isBull ? '#4ade80' : '#f87171';
        ctx.fillStyle = isBull ? '#4ade80' : '#f87171';

        // Dagtis (Wick)
        ctx.beginPath();
        ctx.moveTo(x + candleW / 2, priceToY(c.high));
        ctx.lineTo(x + candleW / 2, priceToY(c.low));
        ctx.stroke();

        // Kūnas (Body)
        const yOpen = priceToY(c.open);
        const yClose = priceToY(c.close);
        const top = Math.min(yOpen, yClose);
        const bodyH = Math.max(2, Math.abs(yClose - yOpen));
        ctx.fillRect(x, top, candleW, bodyH);
    });

    // Dabartinės kainos punktyrinė linija
    const curY = priceToY(pairObj.price);
    ctx.strokeStyle = '#38bdf8';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, curY);
    ctx.lineTo(w - 80, curY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Atvirų pozicijų ENTRY, SL ir LIQ linijos
    window.trader.positions.forEach(pos => {
        if (pos.pair !== window.activePair) return;
        const eY = priceToY(pos.entryPrice);
        ctx.strokeStyle = '#facc15';
        ctx.beginPath();
        ctx.moveTo(0, eY);
        ctx.lineTo(w - 85, eY);
        ctx.stroke();
        ctx.fillStyle = '#facc15';
        ctx.fillText(`ENTRY ${pos.direction}`, 12, eY - 4);

        if (pos.sl > 0) {
            const slY = priceToY(pos.sl);
            if (slY > 10 && slY < h - 10) {
                ctx.strokeStyle = '#fb923c';
                ctx.beginPath();
                ctx.moveTo(0, slY);
                ctx.lineTo(w - 85, slY);
                ctx.stroke();
                ctx.fillStyle = '#fb923c';
                ctx.fillText(`STOP-LOSS (${pos.sl.toFixed(pairObj.decimals)})`, 12, slY - 4);
            }
        }
    });
};

window.selectPair = function(pairKey) {
    if (!window.marketPairs[pairKey]) return;
    window.activePair = pairKey;
    document.querySelectorAll('.ticker-pair').forEach(el => el.classList.remove('active'));
    const activeEl = document.getElementById('tick_' + pairKey);
    if (activeEl) activeEl.classList.add('active');

    const p = window.marketPairs[pairKey];
    document.getElementById('chartPairTitle').innerText = p.label;
    document.getElementById('chartLivePrice').innerText = p.price.toFixed(p.decimals) + ' USDT';
    document.getElementById('orderSlInput').value = '';
    document.getElementById('orderTpInput').value = '';
    updateCoPilotAnalysis();
    drawPriceChart();
};

// ----------------------------------------------------------------------------
// METAVISION RISK CO-PILOT (SKAITMENINIS VEDLYS)
// ----------------------------------------------------------------------------
window.setOrderDirection = function(dir) {
    window.orderDirection = dir;
    const bLong = document.getElementById('dirBtnLong');
    const bShort = document.getElementById('dirBtnShort');
    if (dir === 'LONG') {
        bLong.className = 'btn btn-green';
        bShort.className = 'btn';
    } else {
        bLong.className = 'btn';
        bShort.className = 'btn btn-danger';
    }
    updateCoPilotAnalysis();
};

window.setMarginPercent = function(pct) {
    const amt = Math.max(10, Math.floor(window.trader.balance * pct));
    document.getElementById('orderMarginInput').value = amt;
    updateCoPilotAnalysis();
};

window.setAutoStopLoss = function() {
    const p = window.marketPairs[window.activePair];
    const sl = window.orderDirection === 'LONG' ? p.price * 0.97 : p.price * 1.03;
    document.getElementById('orderSlInput').value = sl.toFixed(p.decimals);
    updateCoPilotAnalysis();
};

window.setAutoTakeProfit = function() {
    const p = window.marketPairs[window.activePair];
    const tp = window.orderDirection === 'LONG' ? p.price * 1.06 : p.price * 0.94;
    document.getElementById('orderTpInput').value = tp.toFixed(p.decimals);
    updateCoPilotAnalysis();
};

window.applyCoPilotSafeSetup = function() {
    sfxBeep();
    const p = window.marketPairs[window.activePair];
    const safeMargin = Math.max(20, Math.round(window.trader.balance * 0.20));
    const safeLev = 5;
    // 2% viso portfelio rizika = 10% nuo 20% maržos -> su 5x svertu tai yra 2% kainos pokytis
    const slPrice = window.orderDirection === 'LONG' ? p.price * 0.98 : p.price * 1.02;
    const tpPrice = window.orderDirection === 'LONG' ? p.price * 1.05 : p.price * 0.95;

    document.getElementById('orderMarginInput').value = safeMargin;
    document.getElementById('orderLeverageInput').value = safeLev;
    document.getElementById('orderSlInput').value = slPrice.toFixed(p.decimals);
    document.getElementById('orderTpInput').value = tpPrice.toFixed(p.decimals);
    updateCoPilotAnalysis();
};

window.updateCoPilotAnalysis = function() {
    const p = window.marketPairs[window.activePair];
    const margin = parseFloat(document.getElementById('orderMarginInput').value) || 0;
    const lev = parseFloat(document.getElementById('orderLeverageInput').value) || 1;
    const sl = parseFloat(document.getElementById('orderSlInput').value) || 0;
    const notional = margin * lev;

    document.getElementById('levLabel').innerText = lev + 'x';
    document.getElementById('notionalLabel').innerText = `Pozicija: ${notional.toFixed(0)} USDT`;

    const liqPrice = window.orderDirection === 'LONG'
        ? p.price * (1 - (1 / lev) * 0.95)
        : p.price * (1 + (1 / lev) * 0.95);

    let portfolioRiskPct = (margin / Math.max(1, window.trader.equity)) * 100;
    if (sl > 0) {
        const slDistPct = Math.abs(p.price - sl) / p.price;
        const lossUsd = Math.min(margin, notional * slDistPct);
        portfolioRiskPct = (lossUsd / Math.max(1, window.trader.equity)) * 100;
    }

    const badge = document.getElementById('copilotRiskBadge');
    const advice = document.getElementById('copilotAdviceText');
    const mathEl = document.getElementById('copilotMathText');

    mathEl.innerText = `Likvidacija: ${liqPrice.toFixed(p.decimals)} USDT | Portfelio rizika: ${portfolioRiskPct.toFixed(1)}%`;

    if (lev >= 15 && sl <= 0) {
        badge.className = 'status-pill pill-orange';
        badge.innerText = '🚨 AUKŠTA LIKVIDACIJOS RIZIKA';
        advice.innerHTML = `Pasirinkote <strong>${lev}x</strong> svertą be <strong>Stop-Loss</strong>! Maklerio „Flash Crash“ išlikviduos visą ${margin} USDT maržą. Paspauskite „Auto-Guard“ arba įrašykite Stop-Loss.`;
    } else if (portfolioRiskPct <= 3.5 && sl > 0) {
        badge.className = 'status-pill pill-open';
        badge.innerText = '✅ OPTIMALUS RIZIKOS VALDYMAS';
        advice.innerHTML = `Puiki drausmė: Stop-Loss apsaugo poziciją nuo likvidacijos, o maksimalus nuostolis neviršija <strong>${portfolioRiskPct.toFixed(1)}%</strong> portfelio.`;
    } else {
        badge.className = 'status-pill pill-purple';
        badge.innerText = '⚠️ VIDUTINĖ RIZIKA';
        advice.innerHTML = `Rekomenduojama nustatyti Stop-Loss ir išlaikyti vieno sandorio riziką iki 2–3% viso portfelio.`;
    }
};

// ----------------------------------------------------------------------------
// POZICIJŲ ATIDARYMAS, UŽDARYMAS IR LIKVIDACIJŲ PATIKRA
// ----------------------------------------------------------------------------
window.openPaperPosition = function() {
    const p = window.marketPairs[window.activePair];
    const margin = parseFloat(document.getElementById('orderMarginInput').value) || 0;
    const lev = parseFloat(document.getElementById('orderLeverageInput').value) || 1;
    const sl = parseFloat(document.getElementById('orderSlInput').value) || 0;
    const tp = parseFloat(document.getElementById('orderTpInput').value) || 0;

    if (margin < 10 || margin > window.trader.balance) {
        sfxError();
        alert('Nepakankamas laisvas USDT balansas arba per maža marža (min. 10 USDT)!');
        return;
    }

    if (sl > 0) {
        if (window.orderDirection === 'LONG' && sl >= p.price) {
            alert('LONG pozicijos Stop-Loss turi būti žemiau dabartinės rinkos kainos!');
            return;
        }
        if (window.orderDirection === 'SHORT' && sl <= p.price) {
            alert('SHORT pozicijos Stop-Loss turi būti aukščiau dabartinės rinkos kainos!');
            return;
        }
    }

    const liqPrice = window.orderDirection === 'LONG'
        ? p.price * (1 - (1 / lev) * 0.95)
        : p.price * (1 + (1 / lev) * 0.95);

    window.trader.balance -= margin;
    window.trader.positions.push({
        id: 'pos_' + Date.now(),
        pair: window.activePair,
        direction: window.orderDirection,
        margin: margin,
        leverage: lev,
        entryPrice: p.price,
        liqPrice: liqPrice,
        sl: sl,
        tp: tp,
        pnl: 0
    });

    sfxWin();
    evaluateOpenPositions();
    syncArenaState();
};

function evaluateOpenPositions() {
    let totalMargin = 0;
    let totalUnrealizedPnl = 0;
    const remaining = [];

    window.trader.positions.forEach(pos => {
        const curPrice = window.marketPairs[pos.pair].price;
        const priceDiffRatio = pos.direction === 'LONG'
            ? (curPrice - pos.entryPrice) / pos.entryPrice
            : (pos.entryPrice - curPrice) / pos.entryPrice;

        pos.pnl = pos.margin * pos.leverage * priceDiffRatio;

        // 1. Tikriname Stop-Loss suveikimą
        const slHit = pos.sl > 0 && (
            (pos.direction === 'LONG' && curPrice <= pos.sl) ||
            (pos.direction === 'SHORT' && curPrice >= pos.sl)
        );

        // 2. Tikriname Take-Profit suveikimą
        const tpHit = pos.tp > 0 && (
            (pos.direction === 'LONG' && curPrice >= pos.tp) ||
            (pos.direction === 'SHORT' && curPrice <= pos.tp)
        );

        // 3. Tikriname LIKVIDACIJĄ
        const liqHit = (pos.direction === 'LONG' && curPrice <= pos.liqPrice) ||
                       (pos.direction === 'SHORT' && curPrice >= pos.liqPrice) ||
                       (pos.pnl <= -pos.margin * 0.95);

        if (slHit) {
            sfxBeep();
            const returned = Math.max(0, pos.margin + pos.pnl);
            window.trader.balance += returned;
        } else if (tpHit) {
            sfxWin();
            window.trader.balance += (pos.margin + pos.pnl);
        } else if (liqHit) {
            sfxLiquidationAlarm();
            // Likvidacija: visa pozicijos marža sudega
        } else {
            totalMargin += pos.margin;
            totalUnrealizedPnl += pos.pnl;
            remaining.push(pos);
        }
    });

    window.trader.positions = remaining;
    window.trader.equity = Math.max(0, window.trader.balance + totalMargin + totalUnrealizedPnl);
    renderPositionsTable();
    updateHudDisplay();
}

window.closePositionById = function(posId) {
    const idx = window.trader.positions.findIndex(p => p.id === posId);
    if (idx === -1) return;
    const pos = window.trader.positions[idx];
    window.trader.balance += Math.max(0, pos.margin + pos.pnl);
    window.trader.positions.splice(idx, 1);
    sfxBeep();
    evaluateOpenPositions();
    syncArenaState();
};

function renderPositionsTable() {
    const tbody = document.getElementById('openPositionsBody');
    if (!tbody) return;

    if (window.trader.positions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--text-sub);">Nėra atvirų pozicijų. Naudokite Co-Pilot vedlį ir atidarykite sandorį!</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    window.trader.positions.forEach(pos => {
        const decimals = window.marketPairs[pos.pair].decimals;
        const roePct = (pos.pnl / pos.margin) * 100;
        const pnlColor = pos.pnl >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${pos.pair}</strong> <span class="status-pill ${pos.direction === 'LONG' ? 'pill-open' : 'pill-orange'}">${pos.direction}</span></td>
            <td>${pos.margin.toFixed(0)} $ (${pos.leverage}x)</td>
            <td>${pos.entryPrice.toFixed(decimals)}</td>
            <td style="color:var(--accent-red); font-weight:bold;">${pos.liqPrice.toFixed(decimals)}</td>
            <td>SL: ${pos.sl > 0 ? pos.sl.toFixed(decimals) : 'Nėra'} | TP: ${pos.tp > 0 ? pos.tp.toFixed(decimals) : '-'}</td>
            <td style="color:${pnlColor}; font-weight:800;">${pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)} $ (${roePct.toFixed(1)}%)</td>
            <td><button class="btn btn-danger" style="padding:4px 10px; font-size:0.76rem;" onclick="closePositionById('${pos.id}')">Uždaryti</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// ----------------------------------------------------------------------------
// MAKLERIO ŠOKAI (FLASH CRASH / PUMP)
// ----------------------------------------------------------------------------
window.triggerBrokerShock = function(pctChange, label) {
    if (pctChange === 0) {
        window.brokerShockMultiplier = 1.0;
    } else {
        window.brokerShockMultiplier = Math.max(0.2, window.brokerShockMultiplier * (1 + pctChange));
    }
    const totalShockPct = ((window.brokerShockMultiplier - 1) * 100).toFixed(1);
    const banner = document.getElementById('marketShockBanner');
    if (banner) {
        banner.innerText = `⚡ Rinka: ${label} | Maklerio šokas: ${totalShockPct}%`;
    }
    sfxBeep();
    tickMarketEngine();
};

// ----------------------------------------------------------------------------
// 3 PAKOPA: WEB3 DEX AMM (x * y = k) IR SERTIFIKATO ATRAKINIMAS
// ----------------------------------------------------------------------------
window.dexPool = {
    mvisReserve: 100000,
    usdtReserve: 125000,
    k: 100000 * 125000
};

window.calculateDexSwapPreview = function() {
    const usdtIn = parseFloat(document.getElementById('dexSwapInput').value) || 0;
    const fee = usdtIn * 0.0015;
    const netUsdtIn = Math.max(0, usdtIn - fee);

    const newUsdtReserve = window.dexPool.usdtReserve + netUsdtIn;
    const newMvisReserve = window.dexPool.k / newUsdtReserve;
    const mvisOut = Math.max(0, window.dexPool.mvisReserve - newMvisReserve);

    const spotPrice = window.dexPool.usdtReserve / window.dexPool.mvisReserve;
    const execPrice = mvisOut > 0 ? netUsdtIn / mvisOut : spotPrice;
    const slippagePct = ((execPrice - spotPrice) / spotPrice) * 100;

    document.getElementById('dexOutMvis').innerText = mvisOut.toFixed(2) + ' MVIS';
    document.getElementById('dexSlippage').innerText = slippagePct.toFixed(2) + '%';
    document.getElementById('dexFee').innerText = fee.toFixed(2) + ' USDT';
};

window.executeDexSwap = function() {
    const usdtIn = parseFloat(document.getElementById('dexSwapInput').value) || 0;
    if (usdtIn < 10 || usdtIn > window.trader.balance) {
        sfxError();
        alert('Nepakankamas USDT balansas DEX Swap operacijai!');
        return;
    }

    const fee = usdtIn * 0.0015;
    const netUsdtIn = usdtIn - fee;
    const newUsdtReserve = window.dexPool.usdtReserve + netUsdtIn;
    const newMvisReserve = window.dexPool.k / newUsdtReserve;

    window.dexPool.usdtReserve = newUsdtReserve;
    window.dexPool.mvisReserve = newMvisReserve;
    window.marketPairs.MVISUSDT.basePrice = window.dexPool.usdtReserve / window.dexPool.mvisReserve;

    // Atrakina PRO statusą ir nemokamą PDF sertifikatą
    window.trader.proUnlocked = true;
    if (!window.trader.certId) {
        window.trader.certId = 'MV-2026-' + Math.floor(1000 + Math.random() * 8999);
    }

    document.getElementById('dexPoolInfo').innerText = `${Math.round(window.dexPool.mvisReserve).toLocaleString()} MVIS / ${Math.round(window.dexPool.usdtReserve).toLocaleString()} USDT`;
    sfxWin();
    updateHudDisplay();
    syncArenaState();
    alert('✅ AMM Swap įvykdytas! Jūsų PRO vedlys ir 4 ak. val. ES MiCA PDF sertifikatas atrakinti nemokamai (0 €)!');
};

window.connectWeb3Wallet = async function() {
    const btn = document.getElementById('walletBtn');
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const shortAddr = accounts[0].slice(0, 6) + '...' + accounts[0].slice(-4);
            btn.innerText = '🟢 ' + shortAddr;
            sfxWin();
        } catch (e) {
            btn.innerText = '🟢 0x71C...9A2B (Sim)';
        }
    } else {
        btn.innerText = '🟢 0x71C...9A2B (Web3 Sim)';
        sfxWin();
    }
};

window.unlockStage3Demo = function() {
    window.trader.proUnlocked = true;
    window.trader.accuracy = Math.max(window.trader.accuracy, 80);
    if (!window.trader.certId) {
        window.trader.certId = 'MV-2026-' + Math.floor(1000 + Math.random() * 8999);
    }
    document.getElementById('stage3LockedNotice').style.display = 'none';
    updateHudDisplay();
    sfxWin();
};

window.downloadOfficialCertificate = function() {
    if (!window.trader.certId) {
        window.trader.certId = 'MV-2026-' + Math.floor(1000 + Math.random() * 8999);
    }
    updateHudDisplay();
    window.print();
};

// ----------------------------------------------------------------------------
// NAVIGACIJA, HUD ATNAUJINIMAS IR REZERVINIS PALEIDIMAS
// ----------------------------------------------------------------------------
window.switchStage = function(stageKey) {
    ['stage1', 'stage2', 'stage3'].forEach(s => {
        const view = document.getElementById('view_' + s);
        const tab = document.getElementById('tab_' + s);
        if (view) view.style.display = (s === stageKey) ? 'block' : 'none';
        if (tab) tab.classList.toggle('active', s === stageKey);
    });
    if (stageKey === 'stage2') {
        updateCoPilotAnalysis();
        drawPriceChart();
    }
    if (stageKey === 'stage3') {
        calculateDexSwapPreview();
    }
};

window.startArenaSession = function() {
    const inp = document.getElementById('playerNameInput');
    const nameVal = (inp && inp.value.trim()) ? inp.value.trim() : 'Prekiautojas_' + Math.floor(100 + Math.random() * 899);
    window.trader.id = nameVal.toLowerCase().replace(/[^a-z0-9]/g, '') + '_' + Math.floor(100 + Math.random() * 899);
    window.trader.name = nameVal;
    window.trader.certId = 'MV-2026-' + Math.floor(1000 + Math.random() * 8999);

    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainWorkspace').style.display = 'block';
    document.getElementById('certHolderName').innerText = window.trader.name;

    updateHudDisplay();
    if (window.loadQuantMission) window.loadQuantMission();
    syncArenaState();
};

window.updateHudDisplay = function() {
    document.getElementById('hudName').innerText = window.trader.name;
    document.getElementById('hudBalance').innerText = window.trader.balance.toFixed(2) + ' $';
    document.getElementById('hudEquity').innerText = window.trader.equity.toFixed(2) + ' $';
    document.getElementById('dexUsdtBal').innerText = window.trader.balance.toFixed(2);
    document.getElementById('hudAccuracy').innerText = `${window.trader.accuracy}% (${window.trader.correctCount}/${window.trader.answeredCount || 10})`;
    document.getElementById('hudProStatus').innerText = window.trader.proUnlocked ? '🌟 PRO + PDF' : 'BAZINIS';

    if (window.trader.certId) {
        document.getElementById('certIdBadge').innerText = 'ID: ' + window.trader.certId;
    }
    if (window.trader.accuracy >= 60 || window.trader.proUnlocked) {
        const notice = document.getElementById('stage3LockedNotice');
        if (notice) notice.style.display = 'none';
        document.getElementById('tab3Badge').innerText = '🔓 ATRAKINTA';
        document.getElementById('tab3Badge').className = 'status-pill pill-open';
    }
};

window.openBrokerModal = function() {
    toggleModal('brokerModal', true);
};

function syncArenaState() {
    if (window.syncTraderToFirebase) {
        window.syncTraderToFirebase(window.trader);
    } else {
        // Lokalus TOP 15 atvaizdavimas, kol dar neįkeltas admin.js
        const lb = document.getElementById('leaderboardList');
        if (lb) {
            lb.innerHTML = `
                <div class="lb-row me">
                    <div><strong style="color:var(--accent-yellow);">#1</strong> <strong>${window.trader.name}</strong></div>
                    <div style="color:var(--accent-green); font-weight:800;">${window.trader.equity.toFixed(2)} $</div>
                </div>
            `;
        }
    }
}

initBinanceStream();
setInterval(tickMarketEngine, 1000);