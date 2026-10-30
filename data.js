// ============================================================================
// data.js - METAVISION 10 Situacijų (LT/EN), Akademijos Gidas ir Kalbų Variklis
// ============================================================================

window.UI_TEXTS = {
    lt: {
        subBrand: 'Praktinė Biržos Akademija, Prop Firm Simuliatorius ir Web3 DEX • ES MiCA (4 ak. val.)',
        guideBtn: '📖 Akademijos Gidas ir Špargalkė',
        verifyBtn: '🎓 Patikrinti Sertifikatą',
        tab1Title: '1. 🔬 Quant ir Krizių Laboratorija',
        tab1Sub: 'Išmokite atpažinti Rugpull spąstus, likvidacijas ir surinkite ≥60% atestacijai',
        tab2Title: '2. 📈 Prop Firm Birža (Paper Trading)',
        tab2Sub: 'Prekiaukite realiu laiku su 1 000 USDT, Stop-Loss ir išgyvenkite Maklerio šokus',
        tab3Title: '3. 🌐 Web3 DEX ir MiCA Sertifikatas',
        tab3Sub: 'Atsiimkite 4 ak. val. ES MiCA sertifikatą ir prekiaukite per x*y=k DEX šliuzą',
        lockNotice: '🔒 Sprendimas užrakintas! Pirmiausia paspauskite bent 2 analizės įrankius:',
        unlockNotice: '✅ Duomenys nuskaityti! Pasirinkite techniškai teisingą sprendimą:',
        seqTitle: 'Jūsų sudėliota veiksmų tvarka (spauskite ant žingsnių nuo pirmo iki paskutinio):',
        nextBtn: 'Kita situacija ➡️'
    },
    en: {
        subBrand: 'Practical Exchange Academy, Prop Firm Simulator & Web3 DEX • EU MiCA (4 Acad. Hrs)',
        guideBtn: '📖 Academy Guide & Cheat Sheet',
        verifyBtn: '🎓 Verify Certificate',
        tab1Title: '1. 🔬 Quant & Crisis Laboratory',
        tab1Sub: 'Learn to spot Rugpulls, calculate liquidations, and score ≥60% for certification',
        tab2Title: '2. 📈 Prop Firm Exchange (Paper Trading)',
        tab2Sub: 'Trade live with 1,000 USDT, Stop-Loss protection, and survive Broker shocks',
        tab3Title: '3. 🌐 Web3 DEX & MiCA Certificate',
        tab3Sub: 'Claim your 4 Acad. Hrs EU MiCA certificate and trade via x*y=k DEX gateway',
        lockNotice: '🔒 Decision locked! First click at least 2 analytical tools:',
        unlockNotice: '✅ Telemetry complete! Select the correct institutional action:',
        seqTitle: 'Your selected execution order (click steps from first to last):',
        nextBtn: 'Next Scenario ➡️'
    }
};

window.QUANT_MISSIONS = {
    lt: [
        {
            id: 1, type: 'sim', reward: 150, minTools: 2,
            category: '🔬 On-Chain Saugumo Auditas',
            title: 'Situacija #1: Naujo DeFi žetono „Likvidumo Spąstai“ (Rugpull patikra)',
            story: 'Socialiniuose tinkluose reklamuojamas naujas žetonas „AI-MOON“, kurio kaina per valandą pakilo +320%. Prieš perkant per DEX, patikrinkite likvidumo baseiną ir išmanųjį kontraktą 2 įrankiais!',
            tools: [
                { name: '💧 DEXScreener Likvidumo Skeneris', out: '[LP SCAN]: Baseine yra 180,000 USDT, tačiau likvidumas NĖRA užrakintas (LP Unlocked – 0 dienų).' },
                { name: '🔐 Kontrakto Teisių Patikra', out: '[CONTRACT]: Savininko piniginė turi aktyvią funkciją mint() ir laiko 94% visų LP žetonų.' },
                { name: '📊 Top Laikytojų Žemėlapis', out: '[HOLDERS]: 1 kūrėjo piniginė valdo beveik visą likvidumo baseiną.' }
            ],
            options: [
                { text: 'Kritinė „Rugpull“ rizika – kūrėjas gali bet kurią sekundę išimti neužrakintą likvidumą (LP) arba prispausdinti naujų žetonų.', correct: true },
                { text: 'Saugus projektas, nes baseine jau sukaupta 180,000 USDT ir kaina sparčiai kyla.', correct: false },
                { text: 'Reikia pirkti su 20x svertu, nes aktyvi mint() funkcija garantuoja greitą likvidumą.', correct: false },
                { text: 'Tai oficialus ES MiCA patvirtintas stabilusis žetonas (Stablecoin).', correct: false }
            ],
            explanation: 'Jei likvidumo baseinas (LP) neužrakintas ir kūrėjas neatšaukė (Renounced) „mint“ teisių, jis gali vienu sandoriu ištuštinti visą USDT baseiną.'
        },
        {
            id: 2, type: 'sim', reward: 160, minTools: 2,
            category: '📐 Sverto ir Likvidacijos Matematika',
            title: 'Situacija #2: 20x Svertas be Stop-Loss ir Rinkos Susvyravimas',
            story: 'Prekiautojas atidarė BTC/USDT LONG poziciją ties 68,000 USDT su 200 USDT marža ir 20x svertu (bendra pozicijos vertė – 4,000 USDT), bet nenustatė Stop-Loss. Atlikite 2 skaičiavimus!',
            tools: [
                { name: '🧮 Likvidacijos Kainos Skaičiuoklė', out: '[LIQ MATH]: Su 20x svertu 5% kainos kritimas sudaro 100% maržos nuostolį. Likvidacijos riba: ~64,770 USDT.' },
                { name: '📉 Orderbook Streso Testas', out: '[STRESS TEST]: Įprastas rinkos susvyravimas (-5%) visiškai sudegins 200 USDT maržą, jei nėra Stop-Loss.' }
            ],
            options: [
                { text: 'Net nedidelis ~4.8–5% BTC kainos kritimas be Stop-Loss visiškai išlikviduos 200 USDT maržą.', correct: true },
                { text: 'Pozicija bus likviduota tik tada, jei BTC kaina nukris 50% (iki 34,000 USDT).', correct: false },
                { text: '20x svertas padidina tik pelną, o nuostolis visada skaičiuojamas kaip 1x.', correct: false },
                { text: 'Birža automatiškai kompensuoja likvidacijos nuostolius pagal ES indėlių draudimą.', correct: false }
            ],
            explanation: 'Formulė paprasta: 100% / 20x = 5%. Kiekvienas 1% kainos judėjimas prieš jus su 20x svertu atima 20% jūsų maržos.'
        },
        {
            id: 3, type: 'osint', reward: 170,
            category: '🌐 Web3 DEX AMM Mechanika',
            title: 'Situacija #3: Automatinio Rinkos Formuotojo (AMM) Formulė',
            story: 'Kokia klasikine matematine lygtimi (3 simboliai be tarpų, žr. Akademijos Gidą) veikia decentralizuotų biržų („Uniswap“, „MetaVision DEX“) likvidumo baseinai?',
            placeholder: 'Pvz.: x*y=k',
            acceptedAnswers: ['x*y=k', 'x * y = k', 'xy=k'],
            explanation: 'Konstantinės sandaugos formulė x * y = k užtikrina, kad perkant vieną žetoną iš baseino, jo kaina automatiškai kyla priklausomai nuo sandorio dydžio.'
        },
        {
            id: 4, type: 'sim', reward: 160, minTools: 2,
            category: '🕵️‍♂️ Išmaniųjų Kontraktų Saugumas',
            title: 'Situacija #4: „Honeypot“ Spąstai – Kaina tik kyla, niekas neparduoda!',
            story: 'Matote žetoną, kurio grafikas turi 40 žalių žvakidžių iš eilės ir nė vienos raudonos. Patikrinkite, kodėl niekas nefiksuoja pelno!',
            tools: [
                { name: '🧪 TokenSniffer Pardavimo Simuliacija', out: '[SIMULATION]: Buy Tax: 0% | Sell Tax: 100% (Pardavimo sandoris atmetamas su klaida TRANSFER_FAILED).' },
                { name: '📜 Solidity Kodo Inspektorius', out: '[CODE]: Funkcijoje _transfer() įrašytas „require(from == owner)“, leidžiantis parduoti tik kūrėjui.' }
            ],
            options: [
                { text: 'Tai „Honeypot“ apgaulė – išmanusis kontraktas leidžia žetoną nusipirkti, bet programiškai blokuoja jo pardavimą.', correct: true },
                { text: 'Grafikas žalias todėl, kad visi investuotojai nusprendė laikyti žetoną 10 metų.', correct: false },
                { text: 'Pardavimui atrakinti reikia tiesiog padidinti Slippage iki 49%.', correct: false },
                { text: 'Tai techninis CEX biržos grafiko atvaizdavimo sutrikimas.', correct: false }
            ],
            explanation: 'Honeypot kontrakte pirkimo funkcija veikia normaliai, tačiau pardavimo (Sell) funkcija yra užblokuota visiems adresams, išskyrus sukčiaus piniginę.'
        },
        {
            id: 5, type: 'quiz', reward: 150,
            category: '⚡ Quant ir Arbitražo Laboratorija',
            title: 'Situacija #5: CEX ir DEX Kainų Arbitražas',
            story: 'Pastebėjote, kad „Binance“ (CEX) biržoje ETH kainuoja 3,400 USDT, o decentralizuotame DEX baseine tuo pačiu metu – 3,468 USDT (+2.0% brangiau). Tinklo ir apsikeitimo mokesčiai sudaro 0.30%. Kaip veikia arbitražo variklis?',
            options: [
                { text: 'Nuperka ETH pigiau CEX biržoje (už 3,400 USDT), parduoda brangiau DEX baseine (už 3,468 USDT), užfiksuoja ~1.7% grynąjį pelną ir suvienodina rinkos kainas.', correct: true },
                { text: 'Perka ETH brangiau DEX baseine ir parduoda pigiau CEX biržoje.', correct: false },
                { text: 'Atidaro 50x svertą be Stop-Loss ir laukia savaitę.', correct: false },
                { text: 'Arbitražas įmanomas tik tada, kai abiejose biržose kaina yra visiškai vienoda.', correct: false }
            ],
            explanation: 'Arbitražo prekiautojai ir robotai nuperka turtą ten, kur jis pigesnis, ir parduoda ten, kur brangesnis, taip išlygindami kainas tarp biržų.'
        },
        {
            id: 6, type: 'osint', reward: 160,
            category: '🇪🇺 ES Reglamentavimas ir Standartai',
            title: 'Situacija #6: Europos Sąjungos Kriptoturto Reglamentas',
            story: 'Kokiu 4 raidžių trumpiniu vadinamas Europos Sąjungos kriptoturto rinkų reglamentas (Markets in Crypto-Assets), pagal kurį reikalaujama skaidrumo ir klientų rizikos suvokimo patikros?',
            placeholder: 'Įrašykite 4 raides...',
            acceptedAnswers: ['mica'],
            explanation: 'MiCA (Markets in Crypto-Assets) yra vieningas ES reglamentas, nustatantis vartotojų apsaugos ir rizikos atskleidimo standartus.'
        },
        {
            id: 7, type: 'sim', reward: 170, minTools: 2,
            category: '🛡️ Krizių ir „Black Swan“ Valdymas',
            title: 'Situacija #7: „Flash Crash (-25%)“ – Dveji Skirtingi Prekiautojai',
            story: 'Makleris ar stambus banginis sukėlė staigią rinkos griūtį (-25%). Abu prekiautojai turėjo po 1,000 USDT ir naudojo 5x svertą. Palyginkite jų rezultatus!',
            tools: [
                { name: '👤 Prekiautojas A (Be Stop-Loss)', out: '[TRADER A]: 25% kritimas su 5x svertu = -125% nuostolis. Įvyko pilna LIKVIDACIJA, balansas: 0 USDT.' },
                { name: '🛡️ Prekiautojas B (Su Co-Pilot -2% Stop-Loss)', out: '[TRADER B]: Suveikė automatinis Stop-Loss prie -2% kainos pokyčio. Išsaugota 900 USDT kapitalo!' }
            ],
            options: [
                { text: 'Stop-Loss ir 2% portfelio rizikos taisyklė apsaugo kapitalą nuo staigių „Black Swan“ griūčių ir leidžia tęsti prekybą.', correct: true },
                { text: 'Stop-Loss naudoti neverta, nes rinka visada per 5 sekundes grįžta atgal.', correct: false },
                { text: 'Krentant rinkai reikia atjungti internetą, kad nesuveiktų likvidacija.', correct: false },
                { text: 'Abu prekiautojai prarado vienodai, nes naudojo 5x svertą.', correct: false }
            ],
            explanation: 'Likvidacija įvyksta biržos serveryje nepriklausomai nuo to, ar jūsų naršyklė įjungta. Tik iš anksto nustatytas Stop-Loss išsaugo kapitalą.'
        },
        {
            id: 8, type: 'seq', reward: 190,
            category: '🧩 Operacinė Drausmė',
            title: 'Situacija #8: Saugaus Web3 ir Biržos Sandorio Protokolas',
            story: 'Sudėliokite profesionalią prekiautojo veiksmų eigą nuo žetono patikros iki pozicijos valdymo:',
            steps: [
                '1. Patikrinti išmaniojo kontrakto adresą, LP likvidumo užraktą ir Honeypot riziką.',
                '2. Su MetaVision Risk Co-Pilot apskaičiuoti saugią maržą (iki 2% portfelio rizikos).',
                '3. Nustatyti privalomą Stop-Loss ribą ir tik tada atidaryti poziciją arba vykdyti DEX Swap.',
                '4. Po Web3 operacijų peržiūrėti ir atšaukti nebereikalingus leidimus per Revoke.cash.'
            ],
            explanation: 'Nuosekli patikra prieš sandorį ir rizikos ribojimas su Stop-Loss yra pagrindinis profesionalaus prekiautojo standartas.'
        },
        {
            id: 9, type: 'sim', reward: 170, minTools: 2,
            category: '💧 DEX Likvidumas ir Slippage',
            title: 'Situacija #9: Kodėl dingo 20% sumos keičiant per mažą DEX baseiną?',
            story: 'Prekiautojas bando vienu sandoriu iškeisti 25,000 USDT į MVIS žetonus mažame DEX baseine, kuriame iš viso yra tik 50,000 USDT likvidumo. Atlikite 2 matavimus!',
            tools: [
                { name: '📐 AMM Kainos Poveikio (Price Impact) Skaičiuoklė', out: '[AMM IMPACT]: Pagal x*y=k formulę, įdėjus 50% baseino vertės, vykdymo kaina pašoka +33%!' },
                { name: '🤖 MEV Sandwich Botų Radaras', out: '[MEV RADAR]: Aptiktas didelis Slippage nustatymas – arbitražo botas įsiterpė prieš ir po sandorio.' }
            ],
            options: [
                { text: 'Dėl mažo baseino likvidumo įvyko didžiulis kainos praslydimas (Slippage / Price Impact) – stambius sandorius būtina skaidyti į mažesnes dalis arba naudoti DEX agregatorių.', correct: true },
                { text: 'Blockchain tinklas paėmė 20% komisinį mokestį už interneto ryšį.', correct: false },
                { text: 'Mažuose baseinuose visada geriau prekiauti vienu milžinišku pavedimu.', correct: false },
                { text: 'x*y=k formulė garantuoja fiksuotą kainą bet kokiai sumai.', correct: false }
            ],
            explanation: 'Kuo didesnė jūsų sandorio suma lyginant su DEX baseino likvidumu, tuo didesnį kainos praslydimą (Slippage) sukelia x*y=k kreivė.'
        },
        {
            id: 10, type: 'quiz', reward: 220,
            category: '🎓 Galutinė ES MiCA ir Prop Firm Atestacija',
            title: 'Situacija #10: 4 Ak. Val. Kurso Sintezė',
            story: 'Kuris iš šių teiginių tiksliausiai apibendrina saugios prekybos ir ES MiCA rizikos valdymo taisykles?',
            options: [
                { text: 'Kriptoturtas nėra apdraustas valstybiniu indėlių draudimu; svertas reikalauja griežto Stop-Loss (1–2% rizikos); o DEX prekyboje būtina tikrinti LP užraktą ir Slippage.', correct: true },
                { text: 'Kuo didesnis svertas (50x) be Stop-Loss, tuo mažesnė likvidacijos tikimybė.', correct: false },
                { text: 'Honeypot žetonai yra patys saugiausi, nes jų grafikas niekada nekrenta.', correct: false },
                { text: 'ES MiCA reglamentas garantuoja 100% pelną kiekvienam biržos dalyviui.', correct: false }
            ],
            explanation: 'Sveikiname! Sėkmingai įsisavinote CEX/DEX architektūrą, sverto ir likvidacijos matematiką, On-Chain saugumą bei ES MiCA principus!'
        }
    ],
    en: [
        {
            id: 1, type: 'sim', reward: 150, minTools: 2,
            category: '🔬 On-Chain Security Audit',
            title: 'Scenario #1: DeFi Token Liquidity Trap (Rugpull Audit)',
            story: 'A new token "AI-MOON" pumped +320% in one hour. Before swapping on a DEX, inspect its liquidity pool and smart contract using 2 tools!',
            tools: [
                { name: '💧 DEXScreener Liquidity Scanner', out: '[LP SCAN]: Pool holds 180,000 USDT, but Liquidity is UNLOCKED (0 days lock).' },
                { name: '🔐 Contract Authority Check', out: '[CONTRACT]: Owner wallet retains active mint() function and holds 94% of LP tokens.' },
                { name: '📊 Top Holders Map', out: '[HOLDERS]: Single deployer wallet controls almost the entire liquidity pool.' }
            ],
            options: [
                { text: 'Critical Rugpull risk – the deployer can drain unlocked liquidity (LP) or mint infinite tokens at any second.', correct: true },
                { text: 'Safe investment because 180,000 USDT is already in the pool.', correct: false },
                { text: 'Open a 20x Long immediately because active mint() guarantees liquidity.', correct: false },
                { text: 'This is an official EU MiCA regulated stablecoin.', correct: false }
            ],
            explanation: 'Unlocked LP combined with active mint privileges allows the creator to drain all USDT from the pool in a single transaction.'
        },
        {
            id: 2, type: 'sim', reward: 160, minTools: 2,
            category: '📐 Leverage & Liquidation Math',
            title: 'Scenario #2: 20x Leverage Without Stop-Loss',
            story: 'A trader opened a BTC/USDT LONG at 68,000 USDT with 200 USDT margin and 20x leverage (4,000 USDT position size) without a Stop-Loss. Run 2 checks!',
            tools: [
                { name: '🧮 Liquidation Calculator', out: '[LIQ MATH]: At 20x leverage, a 5% adverse move equals 100% margin loss. Liquidation price: ~64,770 USDT.' },
                { name: '📉 Orderbook Stress Test', out: '[STRESS TEST]: A routine -5% market dip will completely wipe out the 200 USDT margin.' }
            ],
            options: [
                { text: 'A routine ~4.8–5% BTC price drop without a Stop-Loss will completely liquidate the 200 USDT margin.', correct: true },
                { text: 'Liquidation only happens if BTC drops 50% to 34,000 USDT.', correct: false },
                { text: '20x leverage only multiplies profits, while losses stay at 1x.', correct: false },
                { text: 'EU deposit insurance automatically refunds liquidated leverage trades.', correct: false }
            ],
            explanation: '100% / 20x = 5%. Every 1% move against a 20x position wipes out 20% of the isolated margin.'
        },
        {
            id: 3, type: 'osint', reward: 170,
            category: '🌐 Web3 DEX AMM Mechanics',
            title: 'Scenario #3: Automated Market Maker (AMM) Formula',
            story: 'What classic mathematical formula (type 5 characters, see Academy Guide) powers decentralized exchange liquidity pools like Uniswap and MetaVision DEX?',
            placeholder: 'e.g., x*y=k',
            acceptedAnswers: ['x*y=k', 'x * y = k', 'xy=k'],
            explanation: 'The constant product formula x * y = k automatically adjusts token prices based on reserve ratios during every swap.'
        },
        {
            id: 4, type: 'sim', reward: 160, minTools: 2,
            category: '🕵️‍♂️ Smart Contract Security',
            title: 'Scenario #4: The Honeypot Trap – 40 Green Candles in a Row',
            story: 'You spot a token with 40 consecutive green candles and zero sell volume. Investigate why nobody is taking profit!',
            tools: [
                { name: '🧪 TokenSniffer Sell Simulation', out: '[SIMULATION]: Buy Tax: 0% | Sell Tax: 100% (Sell order reverts with TRANSFER_FAILED).' },
                { name: '📜 Solidity Bytecode Inspector', out: '[CODE]: _transfer() includes require(from == owner), blocking all public sell orders.' }
            ],
            options: [
                { text: 'It is a Honeypot scam – the smart contract allows buying but programmatically blocks regular users from selling.', correct: true },
                { text: 'Every holder simply decided to hold for 10 years.', correct: false },
                { text: 'Increasing slippage to 49% will bypass the owner restriction.', correct: false },
                { text: 'It is a harmless chart rendering bug.', correct: false }
            ],
            explanation: 'Honeypot contracts let anyone buy tokens into the pool, but restrict the sell transfer function exclusively to the scammer address.'
        },
        {
            id: 5, type: 'quiz', reward: 150,
            category: '⚡ Quant & Arbitrage Lab',
            title: 'Scenario #5: CEX vs DEX Price Arbitrage',
            story: 'ETH trades at 3,400 USDT on Binance (CEX) and 3,468 USDT (+2.0% higher) on a DEX pool. Total swap and gas fees are 0.30%. How does an arbitrage engine capture profit?',
            options: [
                { text: 'Buys ETH cheaper on the CEX (3,400 USDT), sells higher on the DEX (3,468 USDT), locking in ~1.7% net profit while equalizing market prices.', correct: true },
                { text: 'Buys ETH at 3,468 USDT on DEX and sells at 3,400 USDT on CEX.', correct: false },
                { text: 'Opens a 50x unhedged position and waits a week.', correct: false },
                { text: 'Arbitrage only works when prices are identical across all venues.', correct: false }
            ],
            explanation: 'Arbitrageurs simultaneously buy on the lower-priced venue and sell on the higher-priced venue, restoring price equilibrium.'
        },
        {
            id: 6, type: 'osint', reward: 160,
            category: '🇪🇺 EU Regulation & Standards',
            title: 'Scenario #6: European Union Crypto Regulation',
            story: 'What is the 4-letter acronym of the European Union regulation for Markets in Crypto-Assets that mandates client risk appropriateness checks?',
            placeholder: 'Type 4 letters...',
            acceptedAnswers: ['mica'],
            explanation: 'MiCA (Markets in Crypto-Assets) establishes unified EU transparency, governance, and client risk awareness standards.'
        },
        {
            id: 7, type: 'sim', reward: 170, minTools: 2,
            category: '🛡️ Crisis & Black Swan Management',
            title: 'Scenario #7: Flash Crash (-25%) – Two Traders Compared',
            story: 'A sudden -25% Flash Crash hits the market. Both traders had 1,000 USDT and used 5x leverage. Compare their outcomes!',
            tools: [
                { name: '👤 Trader A (No Stop-Loss)', out: '[TRADER A]: -25% drop at 5x = -125% loss. Full LIQUIDATION, remaining equity: 0 USDT.' },
                { name: '🛡️ Trader B (Co-Pilot -2% Stop-Loss)', out: '[TRADER B]: Automatic Stop-Loss triggered at -2% price move. 900 USDT capital preserved!' }
            ],
            options: [
                { text: 'A pre-set Stop-Loss and 2% portfolio risk rule protect capital during Black Swan crashes.', correct: true },
                { text: 'Stop-Loss is unnecessary because prices always rebound immediately.', correct: false },
                { text: 'Closing the browser tab prevents exchange liquidation.', correct: false },
                { text: 'Both traders lose 100% because both used 5x leverage.', correct: false }
            ],
            explanation: 'Liquidations execute on the exchange matching engine regardless of whether your browser is open; only a Stop-Loss caps downside risk.'
        },
        {
            id: 8, type: 'seq', reward: 190,
            category: '🧩 Operational Discipline',
            title: 'Scenario #8: Institutional Web3 & Exchange Execution Sequence',
            story: 'Order the safe trading workflow from initial verification to post-trade hygiene:',
            steps: [
                '1. Verify smart contract address, LP lock status, and Honeypot simulation.',
                '2. Calculate position size with MetaVision Risk Co-Pilot (capping risk at 2%).',
                '3. Set a mandatory Stop-Loss order before executing the trade or DEX swap.',
                '4. Review and revoke unnecessary Web3 token approvals via Revoke.cash.'
            ],
            explanation: 'Pre-trade contract auditing, strict position sizing, Stop-Loss execution, and approval hygiene form the complete security cycle.'
        },
        {
            id: 9, type: 'sim', reward: 170, minTools: 2,
            category: '💧 DEX Liquidity & Slippage',
            title: 'Scenario #9: High Slippage in a Shallow Liquidity Pool',
            story: 'A trader attempts to swap 25,000 USDT in a single transaction inside a DEX pool that only holds 50,000 USDT total liquidity. Run 2 diagnostics!',
            tools: [
                { name: '📐 AMM Price Impact Calculator', out: '[AMM IMPACT]: Under x*y=k, adding 50% of pool depth spikes execution price by +33%!' },
                { name: '🤖 MEV Sandwich Radar', out: '[MEV RADAR]: High slippage tolerance detected – MEV bot front-ran the order.' }
            ],
            options: [
                { text: 'Low pool depth caused severe Price Impact (Slippage) – large orders must be split or routed via DEX aggregators.', correct: true },
                { text: 'The blockchain charged a 20% internet bandwidth fee.', correct: false },
                { text: 'Shallow pools always give better execution for whale orders.', correct: false },
                { text: 'The x*y=k formula guarantees zero slippage for any trade size.', correct: false }
            ],
            explanation: 'In an AMM pool, price impact scales non-linearly with order size relative to total pool reserves.'
        },
        {
            id: 10, type: 'quiz', reward: 220,
            category: '🎓 Final EU MiCA & Prop Firm Certification',
            title: 'Scenario #10: 4 Acad. Hours Course Synthesis',
            story: 'Which statement accurately summarizes safe trading discipline and EU MiCA risk principles?',
            options: [
                { text: 'Crypto-assets are not covered by state deposit insurance; leverage requires strict Stop-Loss (1–2% risk); and DEX swaps require LP & Slippage checks.', correct: true },
                { text: 'Higher leverage (50x) without Stop-Loss reduces liquidation risk.', correct: false },
                { text: 'Honeypot tokens are the safest assets because their charts only go up.', correct: false },
                { text: 'EU MiCA guarantees risk-free profits for all retail traders.', correct: false }
            ],
            explanation: 'Congratulations! You have mastered CEX/DEX mechanics, leverage math, smart contract security, and EU MiCA risk principles!'
        }
    ]
};

// ----------------------------------------------------------------------------
// AKADEMIJOS GIDO IR ŠPARGALKĖS TURINYS (4 AK. VAL. / ES MiCA)
// ----------------------------------------------------------------------------
window.renderHandbookContent = function() {
    const box = document.getElementById('handbookContentBox');
    if (!box) return;

    box.innerHTML = `
        <div style="background:rgba(56,189,248,0.1); border-left:4px solid var(--accent-blue); padding:12px 14px; border-radius:0 10px 10px 0; margin-bottom:16px; font-size:0.88rem;">
            <strong>🎯 Kurso Apimtis ir Tikslas (4 akademinės valandos / 180 min.):</strong><br>
            Ši programa parengta pagal <strong>ES MiCA (Markets in Crypto-Assets)</strong> klientų rizikos suvokimo ir tinkamumo patikros kryptį:
            <strong>1 ak. val.</strong> – Teorijos ir žodyno studijos; <strong>1 ak. val.</strong> – Quant ir krizių laboratorija (10 situacijų); <strong>2 ak. val.</strong> – Praktinis „Prop Firm“ ir Web3 DEX simuliatorius su skaitmeniniu vedliu <em>MetaVision Risk Co-Pilot</em>.
        </div>

        <h3 style="color:var(--accent-orange); margin-bottom:8px; font-size:1rem;">1. CEX vs DEX ir AMM (x * y = k) Špargalkė</h3>
        <table class="positions-table" style="margin-bottom:16px;">
            <thead>
                <tr><th>Terminas / Formulė</th><th>Techninė Reikšmė ir Atsakymas Atestacijai</th></tr>
            </thead>
            <tbody>
                <tr><td><code>x * y = k</code></td><td><strong>AMM (Automated Market Maker)</strong> konstantinės sandaugos formulė, kurią naudoja Web3 DEX baseinai (x ir y – dviejų žetonų kiekiai baseine, k – konstanta).</td></tr>
                <tr><td><strong>Slippage (Kainos praslydimas)</strong></td><td>Skirtumas tarp tikėtinos ir realios įvykdymo kainos. Jei sandoris sudaro didelę DEX baseino dalį, pagal <code>x*y=k</code> kaina drastiškai šoka į viršų.</td></tr>
                <tr><td><strong>CEX vs DEX Arbitražas</strong></td><td>Turtas nuperkamas biržoje, kurioje kaina mažesnė (pvz., CEX), ir parduodamas ten, kur didesnė (pvz., DEX), atėmus tinklo ir komisinius mokesčius.</td></tr>
            </tbody>
        </table>

        <h3 style="color:var(--accent-orange); margin-bottom:8px; font-size:1rem;">2. Sverto (Leverage), Likvidacijos ir Co-Pilot Matematika</h3>
        <table class="positions-table" style="margin-bottom:16px;">
            <thead>
                <tr><th>Rodiklis</th><th>Kaip skaičiuojama ir kaip apsisaugoti</th></tr>
            </thead>
            <tbody>
                <tr><td><strong>Likvidacijos slenkstis</strong></td><td><code>100% / Svertas</code>. Su <strong>20x svertu</strong> pakanka vos <strong>~4.8–5%</strong> kainos kritimo (LONG atveju), kad sudegtų 100% jūsų maržos.</td></tr>
                <tr><td><strong>Stop-Loss (SL)</strong></td><td>Automatinis nuostolio fiksavimo pavedimas. Net per <em>Flash Crash (-25%)</em> suveikęs -2% Stop-Loss išsaugo >90% jūsų kapitalo.</td></tr>
                <tr><td><strong>2% Portfelio Taisyklė</strong></td><td>Profesionalus <em>Prop Firm</em> standartas: vieno sandorio maksimalus nuostolis (iki Stop-Loss) neturi viršyti <strong>1–2%</strong> viso portfelio.</td></tr>
            </tbody>
        </table>

        <h3 style="color:var(--accent-orange); margin-bottom:8px; font-size:1rem;">3. On-Chain Saugumas (Rugpull vs Honeypot) ir ES MiCA</h3>
        <table class="positions-table" style="margin-bottom:10px;">
            <thead>
                <tr><th>Rizikos Tipas</th><th>Kaip atpažinti per terminalo įrankius</th></tr>
            </thead>
            <tbody>
                <tr><td><strong>Rugpull (Likvidumo vagystė)</strong></td><td>Likvidumo baseinas neužrakintas (<em>LP Unlocked</em>), o kūrėjas turi aktyvią <code>mint()</code> funkciją arba valdo >90% LP žetonų.</td></tr>
                <tr><td><strong>Honeypot (Medaus spąstai)</strong></td><td>Žetonas turi 100% žalių žvakidžių, nes išmanusis kontraktas leidžia pirkti (<em>Buy Tax 0%</em>), bet blokuoja pardavimą (<em>Sell Tax 100% / TRANSFER_FAILED</em>).</td></tr>
                <tr><td><strong>ES MiCA (4 raidės: <code>MiCA</code>)</strong></td><td>Europos Sąjungos kriptoturto rinkų reglamentas. Įspėja, kad kriptoturtas <strong>nėra apdraustas valstybiniu indėlių draudimu</strong>.</td></tr>
            </tbody>
        </table>
    `;
};

// ----------------------------------------------------------------------------
// 1 PAKOPOS (QUANT LAB) UŽDUOČIŲ VARIKLIS
// ----------------------------------------------------------------------------
let usedMissionTools = 0;
let seqCurrentSteps = [];

function shuffleItems(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

window.loadQuantMission = function() {
    const lang = window.currentLang || 'lt';
    const missions = window.QUANT_MISSIONS[lang];
    const ui = window.UI_TEXTS[lang];

    if (window.trader.currentMissionIdx >= missions.length) {
        renderQuantCompletionCard(missions.length);
        return;
    }

    const m = missions[window.trader.currentMissionIdx];
    usedMissionTools = 0;
    seqCurrentSteps = [];

    document.getElementById('missionFeedbackBox').style.display = 'none';
    document.getElementById('nextMissionBtn').style.display = 'none';
    document.getElementById('nextMissionBtn').innerText = ui.nextBtn;

    document.getElementById('missionProgressBadge').innerText = `${lang === 'lt' ? 'Situacija' : 'Scenario'} ${window.trader.currentMissionIdx + 1} / ${missions.length}`;
    document.getElementById('missionCategoryBadge').innerText = m.category;
    document.getElementById('missionTitle').innerText = m.title;
    document.getElementById('missionStory').innerText = m.story;

    const area = document.getElementById('missionInteractionArea');
    area.innerHTML = '';

    if (m.type === 'sim') {
        const bench = document.createElement('div');
        bench.className = 'bench-area';

        const lockInfo = document.createElement('div');
        lockInfo.style.fontSize = '0.85rem';
        lockInfo.style.color = 'var(--accent-blue)';
        lockInfo.style.marginBottom = '10px';
        lockInfo.innerText = ui.lockNotice;
        bench.appendChild(lockInfo);

        const tGrid = document.createElement('div');
        tGrid.className = 'tools-grid';

        const term = document.createElement('div');
        term.className = 'terminal-screen';
        term.innerText = '> METAVISION ON-CHAIN TERMINAL READY...';

        m.tools.forEach(t => {
            const btn = document.createElement('button');
            btn.className = 'tool-btn';
            btn.innerText = t.name;
            btn.onclick = () => {
                if (window.soundEnabled && typeof playTone === 'function') playTone(920, 'sine', 0.08);
                if (!btn.classList.contains('used')) {
                    btn.classList.add('used');
                    usedMissionTools++;
                }
                term.innerText += '\n' + t.out;
                if (usedMissionTools >= m.minTools) {
                    lockInfo.innerText = ui.unlockNotice;
                    lockInfo.style.color = 'var(--accent-green)';
                    document.querySelectorAll('.ans-btn').forEach(b => b.disabled = false);
                }
            };
            tGrid.appendChild(btn);
        });

        bench.appendChild(tGrid);
        bench.appendChild(term);
        area.appendChild(bench);
        renderOptionsGrid(m, area, true);
    } else if (m.type === 'quiz') {
        renderOptionsGrid(m, area, false);
    } else if (m.type === 'osint') {
        const wrap = document.createElement('div');
        wrap.style.display = 'flex';
        wrap.style.gap = '10px';
        wrap.style.marginTop = '12px';
        wrap.style.flexWrap = 'wrap';

        const inp = document.createElement('input');
        inp.type = 'text';
        inp.className = 'form-input';
        inp.style.flex = '1';
        inp.style.minWidth = '220px';
        inp.style.borderColor = 'var(--accent-blue)';
        inp.placeholder = m.placeholder || '';

        const btn = document.createElement('button');
        btn.className = 'btn btn-primary';
        btn.innerText = lang === 'lt' ? 'Patvirtinti ➡️' : 'Submit ➡️';
        btn.onclick = () => {
            const val = inp.value.trim().toLowerCase();
            if (!val) return;
            const isOk = m.acceptedAnswers.some(a => a.toLowerCase() === val);
            inp.disabled = true;
            btn.disabled = true;
            evaluateQuantAnswer(isOk, inp.value.trim(), m);
        };

        wrap.appendChild(inp);
        wrap.appendChild(btn);
        area.appendChild(wrap);
    } else if (m.type === 'seq') {
        const shuffled = shuffleItems(m.steps);
        const poolDiv = document.createElement('div');
        poolDiv.style.display = 'flex';
        poolDiv.style.flexDirection = 'column';
        poolDiv.style.gap = '8px';

        const selLabel = document.createElement('div');
        selLabel.style.fontSize = '0.85rem';
        selLabel.style.color = 'var(--accent-blue)';
        selLabel.style.margin = '12px 0 8px 0';
        selLabel.innerText = ui.seqTitle;

        const selDiv = document.createElement('div');
        selDiv.style.display = 'flex';
        selDiv.style.flexDirection = 'column';
        selDiv.style.gap = '8px';

        shuffled.forEach(stepStr => {
            const item = document.createElement('div');
            item.className = 'ans-btn';
            item.style.padding = '10px 14px';
            item.innerText = stepStr.replace(/^\d+\.\s*/, '');
            item.onclick = () => {
                if (item.parentElement === poolDiv) {
                    selDiv.appendChild(item);
                    seqCurrentSteps.push(stepStr);
                }
                if (seqCurrentSteps.length === m.steps.length) {
                    const isOk = seqCurrentSteps.every((v, idx) => v === m.steps[idx]);
                    evaluateQuantAnswer(isOk, isOk ? 'SEQ_OK' : 'SEQ_ERR', m);
                }
            };
            poolDiv.appendChild(item);
        });

        area.appendChild(poolDiv);
        area.appendChild(selLabel);
        area.appendChild(selDiv);
    }
};

function renderOptionsGrid(m, container, lockedInitially) {
    const grid = document.createElement('div');
    grid.className = 'answers-grid';
    shuffleItems(m.options).forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'ans-btn';
        btn.innerText = opt.text;
        btn.disabled = lockedInitially;
        btn.onclick = () => evaluateQuantAnswer(opt.correct, opt.text, m);
        grid.appendChild(btn);
    });
    container.appendChild(grid);
}

function evaluateQuantAnswer(isCorrect, chosenText, m) {
    document.querySelectorAll('.ans-btn').forEach(b => b.disabled = true);
    window.trader.answeredCount++;

    const fb = document.getElementById('missionFeedbackBox');
    fb.style.display = 'block';

    if (isCorrect) {
        if (window.soundEnabled && typeof playTone === 'function') {
            playTone(587, 'triangle', 0.12);
            setTimeout(() => playTone(880, 'triangle', 0.22), 110);
        }
        window.trader.correctCount++;
        window.trader.balance += m.reward;
        window.trader.equity += m.reward;

        fb.style.background = 'rgba(74, 222, 128, 0.14)';
        fb.style.border = '1px solid var(--accent-green)';
        fb.innerHTML = `<strong style="color:var(--accent-green);">✅ TEISINGAI! (+${m.reward} USDT į prekybos balansą)</strong>
                        <div style="margin-top:6px; font-size:0.9rem;">${m.explanation}</div>`;
    } else {
        if (window.soundEnabled && typeof playTone === 'function') playTone(180, 'sawtooth', 0.25);
        const penalty = 50;
        window.trader.balance = Math.max(100, window.trader.balance - penalty);
        window.trader.equity = Math.max(100, window.trader.equity - penalty);

        fb.style.background = 'rgba(248, 113, 113, 0.14)';
        fb.style.border = '1px solid var(--accent-red)';
        fb.innerHTML = `<strong style="color:var(--accent-red);">❌ KLAIDA! (-${penalty} USDT rizikos bauda)</strong>
                        <div style="margin-top:6px; font-size:0.9rem;">${m.explanation}</div>`;
    }

    window.trader.accuracy = Math.round((window.trader.correctCount / window.trader.answeredCount) * 100);
    window.trader.history['m' + m.id] = { ok: isCorrect, choice: chosenText };

    if (window.updateHudDisplay) window.updateHudDisplay();
    if (window.syncTraderToFirebase) window.syncTraderToFirebase(window.trader);

    document.getElementById('nextMissionBtn').style.display = 'inline-flex';
}

window.nextQuantMission = function() {
    window.trader.currentMissionIdx++;
    window.loadQuantMission();
};

function renderQuantCompletionCard(totalMissions) {
    const passed = window.trader.accuracy >= 60;
    const area = document.getElementById('missionInteractionArea');
    document.getElementById('missionTitle').innerText = passed
        ? '🏆 Quant ir Krizių Laboratorija Įveikta!'
        : '⚠️ Laboratorija baigta (Reikia ≥60% tikslumo)';
    document.getElementById('missionStory').innerText = passed
        ? `Surinkote ${window.trader.accuracy}% (${window.trader.correctCount}/${totalMissions}) tikslumą! Jūsų 4 ak. val. ES MiCA sertifikatas ir Web3 DEX šliuzas (3 pakopa) jau atrakinti.`
        : `Surinkote ${window.trader.accuracy}%. Galite pakartoti laboratoriją arba pereiti į prekybos simuliatorių.`;

    area.innerHTML = `
        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;">
            <button class="btn btn-primary" onclick="switchStage('stage3')">🎓 Atsiimti ES MiCA Sertifikatą ir atidaryti DEX (3 Pakopa)</button>
            <button class="btn btn-green" onclick="switchStage('stage2')">📈 Prekiauti Prop Firm Biržoje (2 Pakopa)</button>
            <button class="btn" onclick="restartQuantLab()">🔄 Kartoti 10 situacijų</button>
        </div>
    `;
    document.getElementById('nextMissionBtn').style.display = 'none';
}

window.restartQuantLab = function() {
    window.trader.currentMissionIdx = 0;
    window.trader.correctCount = 0;
    window.trader.answeredCount = 0;
    window.trader.accuracy = 0;
    window.loadQuantMission();
    if (window.updateHudDisplay) window.updateHudDisplay();
};

// ----------------------------------------------------------------------------
// KALBOS PERJUNGIMAS (LT / EN)
// ----------------------------------------------------------------------------
window.switchLanguage = function() {
    window.currentLang = (window.currentLang === 'lt') ? 'en' : 'lt';
    const ui = window.UI_TEXTS[window.currentLang];

    document.getElementById('subBrandText').innerText = ui.subBrand;
    document.getElementById('guideBtn').innerText = ui.guideBtn;
    document.getElementById('verifyTopBtn').innerText = ui.verifyBtn;
    document.getElementById('tab1Title').innerText = ui.tab1Title;
    document.getElementById('tab1Sub').innerText = ui.tab1Sub;
    document.getElementById('tab2Title').innerText = ui.tab2Title;
    document.getElementById('tab2Sub').innerText = ui.tab2Sub;
    document.getElementById('tab3Title').innerText = ui.tab3Title;
    document.getElementById('tab3Sub').innerText = ui.tab3Sub;

    window.loadQuantMission();
};

// Inicializuojame Gidą ir 1-ąją situaciją iš karto užsikrovus data.js
window.renderHandbookContent();
if (document.getElementById('mainWorkspace') && document.getElementById('mainWorkspace').style.display !== 'none') {
    window.loadQuantMission();
}

// Jei atidaryta tiesiai iš kompiuterio (file://) ir naršyklė sustabdė type="module", įkeliame admin.js tiesiogiai
setTimeout(() => {
    if (!window.adminModuleReady) {
        const s = document.createElement('script');
        s.src = 'admin.js';
        document.body.appendChild(s);
    }
}, 400);