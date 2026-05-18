/**
 * Solar Subsidy AI Navigator - Application State & UI Controller
 */

// 1. Core Application State
let appState = {
  regionId: "tokyo",
  solarProductId: "panasonic-evervolt",
  solarPanelCount: 15,
  batteryProductId: "tesla-powerwall",
  monthlyElectricBill: 15000,
  activeScreen: "screen-simulator",
  activeProductType: "solar",
  checkedDocuments: [],
  chatHistory: [],
  customRates: {
    solarRate: 20000,
    solarMax: 100000,
    batteryRate: 15000,
    batteryMax: 100000
  }
};

// 2. Chatbot Intelligent Dialog DB
const CHATBOT_KNOWLEDGE = {
  greeting: `こんにちは！ソーラー・サブシディAIナビゲーターです。☀️🌱
太陽光発電システムの販売、主要製品の比較、または日本の自治体（東京、横浜、埼玉、名古屋、大阪など）の補助金申請や手続きフローについて、専門的な質問にお答えします！

どのようなことについてお調べしますか？下のクイック質問をクリックするか、テキストを入力してください。`,
  
  default: `ご質問ありがとうございます。太陽光発電や蓄電池、補助金申請については専門知識が必要な場面が多くあります。
例えば、以下のように具体的に聞いていただけますと、より詳細にお答えできます！
・「東京都の補助金申請には何が必要？」
・「太陽光パネルの寿命やメンテナンス費用は？」
・「テスラのPowerwallの特長は？」
・「売電収入は10年後どうなる？」
また、左メニューの「シミュレーター」タブでお客様の環境に応じたリアルタイムな回収年数や補助金総額も計算できますので、ぜひお試しください。`,

  subsidies: {
    keywords: ["補助金", "助成", "申請", "いくら", "もらえる", "クールネット", "東京"],
    response: `日本の自治体における太陽光および蓄電池の補助金は、現在【国】【都道府県】【市区町村】の3階層で併用できる場合が多く、非常に手厚くなっています！

特に関東エリアでは**東京都（クール・ネット東京）**が圧倒的な予算を組んでおり、以下のような補助が受けられます。
・**太陽光パネル**: 1kWあたり最大12万円（一般的な5kW設置で約36万〜50万円以上の補助金）
・**蓄電池**: 1kWhあたり最大10万円（テスラ Powerwall等13.5kWh設置で上限60万円）

その他の主要都市（横浜、さいたま、名古屋、大阪）でも、太陽光1kWあたり1.5万〜2万円、蓄電池1kWhあたり1万〜2万円（上限5万〜10万円程度）の補助があります。
また、国からも蓄電池に対して最大20万円程度のDR・DER補助金が交付されます。

**💡 申請時の最重要注意点**:
ほとんどの自治体で**【工事着工前】の申請・受理**が絶対条件となっています。契約後、着工前に施工業者を通じて、またはご自身で申請を行ってください。必要書類は「補助金ナビ」タブにまとめております！`
  },

  lifespan: {
    keywords: ["寿命", "耐久", "劣化", "何年", "保証", "メンテナンス", "壊れる"],
    response: `太陽光発電システムや蓄電池は、非常に長寿命な資産です。一般的な寿命とメンテナンスの目安は以下の通りです。

1. **太陽光パネル (モジュール)**
   ・**寿命**: **30年以上**（稼働後30年経っても初期の約80%の発電量を維持するケースが多いです）。
   ・**保証**: 主要メーカー（パナソニック、長州産業、Qセルズ等）は**20年〜25年の出力保証**を無償で提供しています。
   ・**メンテナンス**: 4〜5年に1回、専門業者による点検（パネルの汚れや架台の緩みチェック）を推奨（1回あたり約2万〜4万円）。

2. **パワーコンディショナ (パワコン)**
   ・**寿命**: **10年〜15年**（パネルの直流電気を家庭用の交流電気に変換する精密機器のため、一度交換が必要になります）。
   ・**交換費用**: 約20万〜35万円。

3. **蓄電池**
   ・**寿命**: **10年〜15年**（サイクル寿命は約6,000〜12,000回）。
   ・**保証**: ほとんどの国内メーカーやテスラは**10〜15年の容量保証（初期容量の60%以上維持等）**を設けています。`
  },

  merit: {
    keywords: ["メリット", "デメリット", "効果", "電気代", "売電", "高い", "損", "元が取れる"],
    response: `太陽光発電および蓄電池を導入する主なメリットとデメリットは以下の通りです。

**【メリット】**
1. **電気代の大幅削減**: 発電したクリーンな電気を自家消費することで、月々の電気料金を削減できます。特に現在の電気料金高騰（平均31円/kWh超）においては削減効果が極めて高くなっています。
2. **売電収入 (FIT)**: 消費しきれなかった余剰電力は、電力会社に1kWhあたり16円（令和6年度単価）で10年間固定で売電できます。
3. **停電時の非常用電源**: 災害などによる停電時、自立運転に切り替えることでスマホの充電、冷蔵庫の稼働、蓄電池があれば夜間の照明やエアコンまでカバーでき、圧倒的な安心感が得られます。

**【デメリット・注意点】**
1. **初期費用が必要**: 補助金適用後でも、実質100万〜200万円程度の初期費用がかかります。
2. **天候による発電量の変動**: 雨や曇りの日は、発電量が晴天時の10%〜30%程度に低下します。
3. **10年後のFIT期間終了 (卒FIT)**: 10年経過後は売電単価が約7円〜9円/kWhに下がります。そのため、10年以降は「売る」よりも「蓄電池を導入して100%自宅で使う」方が経済的価値がはるかに高くなります。`
  },

  products: {
    keywords: ["製品", "メーカー", "比較", "パナソニック", "シャープ", "テスラ", "パワーウォール", "お勧め", "おすすめ", "蓄電池"],
    response: `主要なメーカーや製品にはそれぞれ明確な特長があり、ご家庭の屋根の形状やライフスタイルに合わせて選ぶことが重要です。

**1. 太陽光パネルの主要製品**
・**パナソニック (EverVolt)**: 発電効率が極めて高く、日本の夏の高温でも出力低下が少ないのが特長。信頼の長期25年保証。
・**シャープ (BLACKSOLAR ZERO)**: 電極をすべて裏面に隠したフルブラック仕様で、デザイン性が抜群。狭い屋根でも設置効率が高い。
・**長州産業 (プレミアムブルー)**: 雨漏り保証を含む独自の「施工保証」が標準で付く数少ない国内メーカー。安心の国内生産。
・**Qセルズ**: ドイツ発祥で対費用効果（コスパ）が最強クラス。曇りの日でも効率よく発電します。

**2. 蓄電池の主要製品**
・**テスラ (Powerwall)**: **13.5kWhの大容量かつ低価格**で圧倒的な人気。停電時に家全体（エアコンやIHも）を動かせる「全負荷型」。
・**オムロン**: 世界最小・最軽量クラスで壁掛け対応。日本の狭小地でもすっきり設置可能。
・**パナソニック / シャープ**: HEMS（ホームエネルギー管理システム）やAI気象予報と連動し、台風前に自動で満充電にするような賢い機能が豊富。

※「製品データベース」タブで各製品のスペック比較ができ、「シミュレーター」でそれらを組み合わせた試算が可能です！`
  },

  weather: {
    keywords: ["雨", "曇り", "天気", "夜", "発電しない", "雪", "台風"],
    response: `天候や時間帯による発電状況と、その対策については以下の通りです。

1. **曇りや雨の日の発電**
   ・太陽光パネルは「光の強さ（日射量）」に反応するため、雨の日でも完全にゼロにはならず、晴天時の**約10%〜20%**、曇りの日でも**約20%〜40%**の発電を行います。
   ・Qセルズなどの「低照度特性」に優れたパネルは、こうした悪天候時でも比較的効率よく光を吸収します。

2. **夜間の発電**
   ・夜間は太陽が出ていないため、太陽光発電は完全に**0**になります。
   ・**対策**: 昼間の余剰電力を「蓄電池」に貯めておくことで、夜間もその電気を使って生活し、グリッド（電力会社）からの購入電力量をほぼゼロに近づけることができます。

3. **積雪時の影響**
   ・パネルの上に雪が積もると発電はストップします。ただし、パネルにはガラス面のスライド性があり、また発電時のわずかな熱で比較的早く雪は滑り落ちます。多雪地域では傾斜角を大きめ（30度以上）にする施工対策を取ります。`
  }
};

// 3. UI Initialize Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Setup Lucide Icons
  lucide.createIcons();

  // Tab Navigation Binding
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const targetScreen = item.getAttribute("data-target");
      switchScreen(targetScreen);
      
      // Update sidebar visual active state
      navItems.forEach(nav => nav.classList.remove("active"));
      item.classList.add("active");
    });
  });

  // Populate Select Boxes
  populateSelectOptions();

  // Bind Simulator Inputs
  const selectRegion = document.getElementById("select-region");
  const rangeBill = document.getElementById("range-bill");
  const selectSolar = document.getElementById("select-solar");
  const rangePanels = document.getElementById("range-panels");
  const selectBattery = document.getElementById("select-battery");

  // Custom Subsidy range inputs
  const rangeCustomSolarRate = document.getElementById("range-custom-solar-rate");
  const rangeCustomSolarMax = document.getElementById("range-custom-solar-max");
  const rangeCustomBatteryRate = document.getElementById("range-custom-battery-rate");
  const rangeCustomBatteryMax = document.getElementById("range-custom-battery-max");

  selectRegion.addEventListener("change", (e) => {
    appState.regionId = e.target.value;
    
    // Toggle manual settings group
    const customGroup = document.getElementById("group-custom-subsidy");
    if (e.target.value === "custom") {
      customGroup.classList.remove("hidden");
    } else {
      customGroup.classList.add("hidden");
    }
    
    runSimulation();
    updateSubsidyScreen(); // Also sync subsidy view
  });

  rangeBill.addEventListener("input", (e) => {
    const val = parseInt(e.target.value);
    document.getElementById("bubble-bill").innerText = `${val.toLocaleString()}円`;
    appState.monthlyElectricBill = val;
    runSimulation();
  });

  selectSolar.addEventListener("change", (e) => {
    appState.solarProductId = e.target.value;
    togglePanelCountVisibility();
    runSimulation();
  });

  rangePanels.addEventListener("input", (e) => {
    const count = parseInt(e.target.value);
    document.getElementById("bubble-panels").innerText = `${count}枚`;
    appState.solarPanelCount = count;
    
    // Update total kW label
    const solarProd = SOLAR_PRODUCTS.find(p => p.id === appState.solarProductId);
    if (solarProd) {
      const totalKw = (count * solarProd.output).toFixed(2);
      document.getElementById("label-solar-capacity").innerText = `合計容量: ${totalKw} kW`;
    }
    
    runSimulation();
  });

  selectBattery.addEventListener("change", (e) => {
    appState.batteryProductId = e.target.value;
    runSimulation();
  });

  // Bind Custom subsidy parameters input ranges
  rangeCustomSolarRate.addEventListener("input", (e) => {
    const val = parseInt(e.target.value);
    document.getElementById("bubble-custom-solar-rate").innerText = `${val.toLocaleString()}円`;
    appState.customRates.solarRate = val;
    runSimulation();
  });

  rangeCustomSolarMax.addEventListener("input", (e) => {
    const val = parseInt(e.target.value);
    document.getElementById("bubble-custom-solar-max").innerText = `${val.toLocaleString()}円`;
    appState.customRates.solarMax = val;
    runSimulation();
  });

  rangeCustomBatteryRate.addEventListener("input", (e) => {
    const val = parseInt(e.target.value);
    document.getElementById("bubble-custom-battery-rate").innerText = `${val.toLocaleString()}円`;
    appState.customRates.batteryRate = val;
    runSimulation();
  });

  rangeCustomBatteryMax.addEventListener("input", (e) => {
    const val = parseInt(e.target.value);
    document.getElementById("bubble-custom-battery-max").innerText = `${val.toLocaleString()}円`;
    appState.customRates.batteryMax = val;
    runSimulation();
  });

  // Bind Sub-Tabs on Product Catalog screen
  document.getElementById("btn-sub-solar").addEventListener("click", () => {
    appState.activeProductType = "solar";
    document.getElementById("btn-sub-solar").classList.add("active");
    document.getElementById("btn-sub-battery").classList.remove("active");
    renderProductCatalog();
  });

  document.getElementById("btn-sub-battery").addEventListener("click", () => {
    appState.activeProductType = "battery";
    document.getElementById("btn-sub-solar").classList.remove("active");
    document.getElementById("btn-sub-battery").classList.add("active");
    renderProductCatalog();
  });

  // Bind Chatbot send button and text input
  const chatInput = document.getElementById("chat-input-text");
  const btnChatSend = document.getElementById("btn-chat-send");
  
  btnChatSend.addEventListener("click", handleUserMessageSubmit);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleUserMessageSubmit();
  });

  // Run initial calculations & UI setup
  initApp();
});

// 4. Initialize State & Data population
function initApp() {
  // Sync inputs with default state
  document.getElementById("select-region").value = appState.regionId;
  document.getElementById("range-bill").value = appState.monthlyElectricBill;
  document.getElementById("bubble-bill").innerText = `${appState.monthlyElectricBill.toLocaleString()}円`;
  
  document.getElementById("select-solar").value = appState.solarProductId;
  document.getElementById("select-battery").value = appState.batteryProductId;
  document.getElementById("range-panels").value = appState.solarPanelCount;
  document.getElementById("bubble-panels").innerText = `${appState.solarPanelCount}枚`;

  // Sync custom settings inputs
  document.getElementById("range-custom-solar-rate").value = appState.customRates.solarRate;
  document.getElementById("bubble-custom-solar-rate").innerText = `${appState.customRates.solarRate.toLocaleString()}円`;
  document.getElementById("range-custom-solar-max").value = appState.customRates.solarMax;
  document.getElementById("bubble-custom-solar-max").innerText = `${appState.customRates.solarMax.toLocaleString()}円`;
  document.getElementById("range-custom-battery-rate").value = appState.customRates.batteryRate;
  document.getElementById("bubble-custom-battery-rate").innerText = `${appState.customRates.batteryRate.toLocaleString()}円`;
  document.getElementById("range-custom-battery-max").value = appState.customRates.batteryMax;
  document.getElementById("bubble-custom-battery-max").innerText = `${appState.customRates.batteryMax.toLocaleString()}円`;

  // Dynamic label sync
  const solarProd = SOLAR_PRODUCTS.find(p => p.id === appState.solarProductId);
  if (solarProd) {
    const totalKw = (appState.solarPanelCount * solarProd.output).toFixed(2);
    document.getElementById("label-solar-capacity").innerText = `合計容量: ${totalKw} kW`;
  }

  // Pre-load Chat Greeting
  addChatMessage("bot", CHATBOT_KNOWLEDGE.greeting);
  renderChatSuggestions();

  // Run Calculations
  runSimulation();
  renderProductCatalog();
  updateSubsidyScreen();
}

// Populate product lists inside select elements
function populateSelectOptions() {
  const selectSolar = document.getElementById("select-solar");
  const selectBattery = document.getElementById("select-battery");

  // Solar options
  let solarHtml = `<option value="none">設置しない (パネルなし)</option>`;
  SOLAR_PRODUCTS.forEach(p => {
    solarHtml += `<option value="${p.id}">${p.manufacturer} : ${p.name} (${p.output * 1000}W)</option>`;
  });
  selectSolar.innerHTML = solarHtml;

  // Battery options
  let batteryHtml = `<option value="none">設置しない (蓄電池なし)</option>`;
  BATTERY_PRODUCTS.forEach(p => {
    batteryHtml += `<option value="${p.id}">${p.manufacturer} : ${p.name} (${p.capacity}kWh)</option>`;
  });
  selectBattery.innerHTML = batteryHtml;
}

// Toggle panels count slider visibility if "none" is chosen
function togglePanelCountVisibility() {
  const isNone = appState.solarProductId === "none";
  const group = document.getElementById("group-panel-count");
  if (isNone) {
    group.classList.add("hidden");
  } else {
    group.classList.remove("hidden");
  }
}

// Screen/View Routing manager
function switchScreen(screenId) {
  appState.activeScreen = screenId;
  
  // Hide all screens
  const screens = document.querySelectorAll(".screen-content");
  screens.forEach(s => s.classList.add("hidden"));
  
  // Show target screen
  const target = document.getElementById(screenId);
  if (target) target.classList.remove("hidden");

  // Dynamic header updates for premium immersion
  const title = document.getElementById("main-title");
  const subtitle = document.getElementById("main-subtitle");
  const badge = document.getElementById("top-badge");

  if (screenId === "screen-simulator") {
    title.innerText = "スマート導入シミュレーター";
    subtitle.innerText = "郵便番号や電気代、製品スペックに基づいて最適なシステムと補助金をシミュレートします。";
    badge.innerHTML = `<i data-lucide="zap"></i><span>リアルタイム算出中</span>`;
  } else if (screenId === "screen-products") {
    title.innerText = "主要メーカー製品データベース";
    subtitle.innerText = "日本の太陽光発電システム・蓄電池市場で最も選ばれている主要モデルの比較スペックです。";
    badge.innerHTML = `<i data-lucide="database"></i><span>全製品データ更新済</span>`;
  } else if (screenId === "screen-subsidy") {
    title.innerText = "補助金申請ナビゲーター";
    subtitle.innerText = "選択された地域の補助金タイムラインと必要な提出書類チェックリストを自動生成します。";
    badge.innerHTML = `<i data-lucide="file-check"></i><span>各自治体令和6年度スキーム対応</span>`;
  } else if (screenId === "screen-chat") {
    title.innerText = "AIソーラー・チャットボット";
    subtitle.innerText = "太陽光発電システムの販売、仕組み、雨の日の影響、自治体申請書類について何でもご質問ください。";
    badge.innerHTML = `<i data-lucide="sparkles"></i><span>AIコンサルタント常駐中</span>`;
  }
  
  lucide.createIcons();
}

// 5. Main Simulation Calculation Executor
function runSimulation() {
  // Call calculations engine
  const results = calculateSimulation({
    regionId: appState.regionId,
    solarProductId: appState.solarProductId,
    solarPanelCount: appState.solarPanelCount,
    batteryProductId: appState.batteryProductId,
    monthlyElectricBill: appState.monthlyElectricBill,
    customRates: appState.customRates
  });

  // Render Numerical outputs
  document.getElementById("val-net-cost").innerText = `${results.netInitialCost.toLocaleString()}円`;
  document.getElementById("val-total-cost").innerText = `初期導入費用: ${results.totalInitialCost.toLocaleString()}円`;
  
  document.getElementById("val-subsidy").innerText = `${results.subsidies.total.toLocaleString()}円`;
  document.getElementById("val-subsidy-details").innerText = `国: ${results.subsidies.nationalBattery.toLocaleString()}円 + 自治体: ${(results.subsidies.localSolar + results.subsidies.localBattery).toLocaleString()}円`;

  document.getElementById("val-annual-savings").innerText = `${results.savings.total.toLocaleString()}円 / 年`;
  
  let savingsTxt = "";
  if (results.hasSolar && results.hasBattery) {
    savingsTxt = `自家消費: +${results.savings.selfConsumption.toLocaleString()}円 | 売電: +${results.savings.selling.toLocaleString()}円`;
  } else if (results.hasSolar) {
    savingsTxt = `自家消費: +${results.savings.selfConsumption.toLocaleString()}円 | 売電: +${results.savings.selling.toLocaleString()}円`;
  } else if (results.hasBattery) {
    savingsTxt = `深夜電力差額節約: +${results.savings.arbitrage.toLocaleString()}円`;
  } else {
    savingsTxt = `導入製品が選択されていません`;
  }
  document.getElementById("val-savings-details").innerText = savingsTxt;

  // Payback ROI Text
  if (results.paybackYears === null) {
    document.getElementById("val-payback").innerText = "--- 年";
    document.getElementById("val-payback-text").innerText = "システム未選択";
  } else {
    document.getElementById("val-payback").innerText = `${results.paybackYears}年`;
    document.getElementById("val-payback-text").innerText = `補助金適用後の回収年数 (実質ベース)`;
  }

  // Ecological impact values
  document.getElementById("val-co2").innerText = results.co2ReductionKg.toLocaleString();
  document.getElementById("val-trees").innerText = results.cedarTrees.toLocaleString();

  // Render Premium custom dynamic SVG charts
  drawCostChart(results);
  drawRatioChart(results);
}

// 6. Draw Custom SVG Cost Breakdown Chart
function drawCostChart(res) {
  const container = document.getElementById("chart-cost-container");
  if (!container) return;

  const total = res.totalInitialCost;
  const subsidy = res.subsidies.total;
  const net = res.netInitialCost;

  if (total === 0) {
    container.innerHTML = `<span style="color:var(--text-muted); font-size:0.85rem;">システムを構成すると内訳グラフが表示されます</span>`;
    return;
  }

  // Normalize heights based on 140px maximum
  const maxVal = total;
  const hTotal = 140;
  const hSubsidy = (subsidy / maxVal) * 140;
  const hNet = (net / maxVal) * 140;

  const svgHtml = `
    <svg class="custom-chart" width="280" height="180" viewBox="0 0 280 180">
      <!-- Grid lines -->
      <line x1="20" y1="150" x2="260" y2="150" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
      <line x1="20" y1="80" x2="260" y2="80" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="4,4" />
      <line x1="20" y1="10" x2="260" y2="10" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="4,4" />
      
      <!-- Bar 1: Initial Cost -->
      <rect class="chart-bar" x="50" y="${150 - hTotal}" width="40" height="${hTotal}" fill="url(#grad-grey)" rx="4" />
      
      <!-- Bar 2: Subsidies -->
      <rect class="chart-bar" x="120" y="${150 - hSubsidy}" width="40" height="${hSubsidy}" fill="url(#grad-green)" rx="4" />
      
      <!-- Bar 3: Net cost -->
      <rect class="chart-bar" x="190" y="${150 - hNet}" width="40" height="${hNet}" fill="url(#grad-blue)" rx="4" />
      
      <!-- Value Labels -->
      <text x="70" y="${140 - hTotal}" fill="#9ca3af" font-size="9" text-anchor="middle" font-weight="600">${Math.round(total/10000)}万</text>
      <text x="140" y="${140 - hSubsidy}" fill="var(--color-emerald)" font-size="9" text-anchor="middle" font-weight="600">${Math.round(subsidy/10000)}万</text>
      <text x="210" y="${140 - hNet}" fill="var(--color-cyan)" font-size="9" text-anchor="middle" font-weight="600">${Math.round(net/10000)}万</text>
      
      <!-- X-axis Labels -->
      <text x="70" y="168" fill="#9ca3af" font-size="9.5" text-anchor="middle" font-family="sans-serif">初期総費用</text>
      <text x="140" y="168" fill="var(--color-emerald)" font-size="9.5" text-anchor="middle" font-family="sans-serif">補助金総額</text>
      <text x="210" y="168" fill="var(--color-cyan)" font-size="9.5" text-anchor="middle" font-family="sans-serif">実質負担</text>

      <!-- Gradients Definitions -->
      <defs>
        <linearGradient id="grad-grey" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#4b5563" />
          <stop offset="100%" stop-color="#1f2937" />
        </linearGradient>
        <linearGradient id="grad-green" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="var(--color-emerald)" />
          <stop offset="100%" stop-color="#047857" />
        </linearGradient>
        <linearGradient id="grad-blue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="var(--color-cyan)" />
          <stop offset="100%" stop-color="#0e7490" />
        </linearGradient>
      </defs>
    </svg>
  `;

  container.innerHTML = svgHtml;
}

// 7. Draw Custom SVG Self Consumption Ratio Ring
function drawRatioChart(res) {
  const container = document.getElementById("chart-ratio-container");
  if (!container) return;

  if (!res.hasSolar) {
    container.innerHTML = `<span style="color:var(--text-muted); font-size:0.85rem;">太陽光パネルを設置すると自家消費率が表示されます</span>`;
    return;
  }

  const rate = res.selfConsumptionRate; // e.g. 65 or 30
  
  // Circle geometry properties for radius = 55
  // Circumference = 2 * PI * r = 345.57
  const r = 55;
  const circ = 2 * Math.PI * r;
  const strokeOffset = circ - (rate / 100) * circ;

  const svgHtml = `
    <svg class="custom-chart" width="200" height="180" viewBox="0 0 200 180">
      <!-- Background ring -->
      <circle cx="100" cy="90" r="${r}" fill="none" stroke="rgba(245, 158, 11, 0.2)" stroke-width="12" />
      
      <!-- Animated Foreground Ring -->
      <circle class="chart-ring" cx="100" cy="90" r="${r}" fill="none" 
              stroke="var(--color-cyan)" stroke-width="12"
              stroke-dasharray="${circ}" stroke-dashoffset="${strokeOffset}"
              transform="rotate(-90 100 90)" stroke-linecap="round" />
      
      <!-- Inner text -->
      <text class="chart-center-text" x="100" y="85" fill="#fff" font-size="22" font-weight="800">${rate}%</text>
      <text class="chart-center-text" x="100" y="105" fill="var(--color-cyan)" font-size="9.5" font-weight="700">自家消費</text>
      <text class="chart-center-text" x="100" y="118" fill="var(--color-amber)" font-size="8.5" font-weight="600">余剰売電: ${100 - rate}%</text>
    </svg>
  `;

  container.innerHTML = svgHtml;
}

// 8. Render Products Database Screen (Screen 2)
function renderProductCatalog() {
  const container = document.getElementById("catalog-products-container");
  if (!container) return;

  const type = appState.activeProductType;
  const list = type === "solar" ? SOLAR_PRODUCTS : BATTERY_PRODUCTS;

  let html = "";
  list.forEach(p => {
    const isSolar = p.type === "solar";
    const spec1Label = isSolar ? "公称最大出力" : "蓄電容量";
    const spec1Val = isSolar ? `${p.output * 1000} W (枚)` : `${p.capacity} kWh`;
    
    const spec2Label = isSolar ? "モジュール変換効率" : "定格出力";
    const spec2Val = isSolar ? `${p.efficiency} %` : `${p.output} kW`;

    const priceLabel = "メーカー概算価格";
    const priceVal = isSolar ? `${p.estPricePerUnit.toLocaleString()}円 / 枚` : `${p.estPrice.toLocaleString()}円 (工事込)`;

    let featuresHtml = "";
    p.features.forEach(f => {
      featuresHtml += `<li>${f}</li>`;
    });

    html += `
      <div class="card-glass product-card">
        <div class="product-header">
          <span class="product-manufacturer">${p.manufacturer}</span>
          <h3 class="product-name">${p.name}</h3>
          <div style="display:flex; gap:0.4rem; align-items:center; margin-top: 0.25rem;">
            <span class="product-type-badge ${p.type}">
              ${isSolar ? '太陽光発電パネル' : '家庭用蓄電池'}
            </span>
            ${p.isCustom ? '<span class="product-type-badge" style="background: linear-gradient(135deg, var(--color-amber), #d97706); border:none; color:#fff; font-weight:700;">カスタム登録</span>' : ''}
          </div>
        </div>
        
        <div class="product-specs">
          <div class="spec-item">
            <span class="label">${spec1Label}</span>
            <span class="val">${spec1Val}</span>
          </div>
          <div class="spec-item">
            <span class="label">${spec2Label}</span>
            <span class="val">${spec2Val}</span>
          </div>
          <div class="spec-item">
            <span class="label">メーカー保証期間</span>
            <span class="val">${p.warranty}年保証</span>
          </div>
          <div class="spec-item">
            <span class="label">${priceLabel}</span>
            <span class="val" style="color:var(--color-cyan); font-weight:700;">${priceVal}</span>
          </div>
        </div>
        
        <ul class="product-features">
          ${featuresHtml}
        </ul>
        
        <p class="product-description">${p.description}</p>
        
        <button class="btn-select-product" onclick="selectProductFromCatalog('${p.id}', '${p.type}')">
          <i data-lucide="check-circle-2"></i>
          <span>この製品をシミュレータに適用</span>
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
  lucide.createIcons();
}

// Selection handler from catalog screen
function selectProductFromCatalog(prodId, type) {
  if (type === "solar") {
    appState.solarProductId = prodId;
    document.getElementById("select-solar").value = prodId;
    togglePanelCountVisibility();
  } else if (type === "battery") {
    appState.batteryProductId = prodId;
    document.getElementById("select-battery").value = prodId;
  }
  
  // Calculate and head back to simulator screen
  runSimulation();
  switchScreen("screen-simulator");
  
  // Update sidebar active classes
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(nav => {
    if (nav.getAttribute("data-target") === "screen-simulator") {
      nav.classList.add("active");
    } else {
      nav.classList.remove("active");
    }
  });
}

// 9. Render Subsidy Navigator Screen (Screen 3)
function updateSubsidyScreen() {
  const region = SUBSIDY_DATABASE[appState.regionId];
  if (!region) return;

  // Update headers
  document.getElementById("subsidy-timeline-title").innerText = `${region.name}の申請タイムライン`;
  document.getElementById("subsidy-checklist-sub").innerText = `選択中の自治体: ${region.name}`;
  
  // Load steps
  const stepsContainer = document.getElementById("subsidy-steps-container");
  let stepsHtml = "";
  region.steps.forEach((step, idx) => {
    stepsHtml += `
      <div class="timeline-step">
        <div class="step-number">${idx + 1}</div>
        <div class="step-details">
          <h4>${step.title}</h4>
          <p>${step.desc}</p>
        </div>
      </div>
    `;
  });
  stepsContainer.innerHTML = stepsHtml;

  // Load checklist items
  const checklistContainer = document.getElementById("subsidy-checklist-container");
  let checklistHtml = "";
  
  // Clear checked checklist array for new region
  appState.checkedDocuments = [];

  region.checklist.forEach((doc, idx) => {
    checklistHtml += `
      <div class="checklist-item" onclick="toggleChecklistItem(${idx}, '${doc}')" id="checklist-item-${idx}">
        <div class="checklist-checkbox">
          <i data-lucide="check" style="width:14px; height:14px;"></i>
        </div>
        <span class="checklist-label">${doc}</span>
      </div>
    `;
  });
  checklistContainer.innerHTML = checklistHtml;
  
  // Reset progress bar
  updateChecklistProgressBar();

  // Dynamic specific municipal advice block
  let advice = "";
  if (appState.regionId === "tokyo") {
    advice = "東京都の補助金（クール・ネット東京）は、1kWあたり12万円という非常に高額なスキームですが、先着順での予算管理となっております。また、パネルのみ・蓄電池のみの場合で条件が細かく変化します。施工事業者側が都に事業登録されていることが条件となりますので、事前見積時の登録確認を怠らないようにしてください。";
  } else if (appState.regionId === "yokohama") {
    advice = "横浜市は市税の納税証明書（滞納がないこと）が必須となっており、工事後30日以内、または当該年度の3月下旬のいずれか早い期限までに実績報告を提出する必要があります。市の予算上限に達した時点で受付終了となりますので、お早めの事前調整を推奨いたします。";
  } else {
    advice = `本自治体 (${region.name}) の申請手続きは、年度ごとの予算枠設定となっており、先着順での受付が基本です。申請書への捺印、住民票、納税証明書などの準備を効率よく行うことでスムーズに受理されます。詳細は指定施工事業者と連携の上、交付申請をお進めください。`;
  }
  document.getElementById("subsidy-tips-text").innerText = advice;

  lucide.createIcons();
}

function toggleChecklistItem(index, docName) {
  const item = document.getElementById(`checklist-item-${index}`);
  const hasIt = appState.checkedDocuments.includes(docName);

  if (hasIt) {
    appState.checkedDocuments = appState.checkedDocuments.filter(d => d !== docName);
    item.classList.remove("checked");
  } else {
    appState.checkedDocuments.push(docName);
    item.classList.add("checked");
  }

  updateChecklistProgressBar();
}

function updateChecklistProgressBar() {
  const region = SUBSIDY_DATABASE[appState.regionId];
  if (!region) return;

  const total = region.checklist.length;
  const checked = appState.checkedDocuments.length;
  const ratio = total > 0 ? (checked / total) * 100 : 0;

  document.getElementById("checklist-progress").style.width = `${ratio}%`;
}

// 10. AI Chatbot Screen Mechanics (Screen 4)
function renderChatSuggestions() {
  const container = document.getElementById("chat-suggestions-container");
  if (!container) return;

  const quickQuestions = [
    "東京都の補助金額は？",
    "太陽光パネルの寿命は？",
    "雨の日は発電する？",
    "主要製品の選び方は？",
    "売電と自家消費どっちが得？"
  ];

  let html = "";
  quickQuestions.forEach(q => {
    html += `<button class="suggestion-chip" onclick="submitQuickQuestion('${q}')">${q}</button>`;
  });
  container.innerHTML = html;
}

function submitQuickQuestion(text) {
  handleChatMessageSend(text);
}

function handleUserMessageSubmit() {
  const input = document.getElementById("chat-input-text");
  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  handleChatMessageSend(text);
}

function handleChatMessageSend(userText) {
  // 1. Add User Message
  addChatMessage("user", userText);

  const cleanText = userText.toLowerCase();
  
  // Check if query is a simulated nationwide search (prefectures from database)
  let matchedPrefKey = null;
  for (const prefKey in NATIONWIDE_PREFECTURE_DATABASE) {
    const pref = NATIONWIDE_PREFECTURE_DATABASE[prefKey];
    const cleanPrefName = pref.name.replace("県", "").replace("府", "").replace("都", "");
    if (cleanText.includes(pref.name) || cleanText.includes(cleanPrefName)) {
      matchedPrefKey = prefKey;
      break;
    }
  }

  if (matchedPrefKey) {
    // Run simulated Search RAG Flow
    showWebSearchIndicator(NATIONWIDE_PREFECTURE_DATABASE[matchedPrefKey].name);
    
    setTimeout(() => {
      removeTypingIndicator();
      const searchResult = generateSimulatedSearchResponse(matchedPrefKey);
      addChatMessage("bot", searchResult);
    }, 2200);
    return;
  }

  // 2. Trigger intelligent simulated response with human-like delay
  showTypingIndicator();

  setTimeout(() => {
    removeTypingIndicator();
    const botResponse = generateBotAnswer(userText);
    addChatMessage("bot", botResponse);
  }, 1000 + Math.random() * 800); // 1.0 to 1.8 seconds delay
}

// Nationwide simulated web search loader
function showWebSearchIndicator(prefectureName) {
  const container = document.getElementById("chat-messages-container");
  if (!container) return;

  const indicator = document.createElement("div");
  indicator.className = "chat-bubble bot";
  indicator.id = "chat-typing-indicator";
  indicator.innerHTML = `
    <div class="chat-bubble-header">
      <i data-lucide="search" style="width:14px; height:14px; color: var(--color-cyan);"></i>
      <span>Sola AI リアルタイムWeb検索中...</span>
    </div>
    <div style="padding: 6px 0; color: var(--text-secondary); font-size:0.85rem; display:flex; align-items:center; gap:8px;">
      <div class="spinner-mini"></div>
      <span>「${prefectureName}の住宅用太陽光・蓄電池補助金 令和6年度最新情報」を自治体公式HPおよび各種省エネポータルから検索中...</span>
    </div>
    <style>
      .spinner-mini {
        width: 14px;
        height: 14px;
        border: 2px solid rgba(255,255,255,0.1);
        border-top: 2px solid var(--color-cyan);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  container.appendChild(indicator);
  container.scrollTop = container.scrollHeight;
  lucide.createIcons();
}

// Nationwide simulated web search reply generator
function generateSimulatedSearchResponse(prefKey) {
  const data = NATIONWIDE_PREFECTURE_DATABASE[prefKey];
  return `🔍 **【AIリアルタイムWeb検索完了】**
インターネットから**${data.name}**の令和6年度の一般住宅向け再エネ補助金動向をクローリング・解析しました！

📝 **検索サマリー**:
・**太陽光発電補助金**: ${data.solar}
・**蓄電池補助金**: ${data.battery}
・**地域特有の注意点**: ${data.note}

国の蓄電池補助金（最大20万円）と各市町村の上乗せ補助金を組み合わせることで、さらに実質負担額を抑えることが可能です。

<div style="margin-top: 1.25rem; border-top: 1px dashed rgba(255,255,255,0.15); padding-top: 1.25rem;">
  <button class="btn-select-product" onclick="applySearchedSubsidyToSimulator('${prefKey}')" style="width:100%; display:flex; justify-content:center; align-items:center; gap:0.5rem; background:linear-gradient(135deg, var(--color-cyan), #0891b2); box-shadow: 0 4px 12px rgba(6, 182, 212, 0.35); border: none; border-radius: 8px; padding: 0.75rem 1rem; color: #fff; font-weight: 700; cursor: pointer; transition: all 0.25s ease;">
    <i data-lucide="zap" style="width:16px; height:16px;"></i>
    <span>この補助金設定をシミュレーターに適用</span>
  </button>
</div>`;
}

function generateBotAnswer(userQuery) {
  const cleanQuery = userQuery.toLowerCase();

  // Custom Product Registration Request keyword matching
  if (cleanQuery.includes("製品追加") || cleanQuery.includes("製品登録") || cleanQuery.includes("新製品") || cleanQuery.includes("製品拡充") || cleanQuery.includes("追加したい")) {
    return `📝 **【カスタム製品登録コンソール】**
メーカーの公式HPやパンフレットに載っている、データベース未掲載の最新製品をここに直接登録し、シミュレーターに動的に追加・拡張できます！

以下の項目に入力し、一番下の登録ボタンをクリックしてください。

<div class="card-glass" style="margin-top: 1rem; padding: 1.25rem; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; text-align: left; background: rgba(15, 23, 42, 0.45); font-family: sans-serif;">
  <div style="margin-bottom: 0.85rem;">
    <label style="display:block; font-size:0.75rem; color:var(--text-secondary); margin-bottom: 0.25rem; font-weight:600;">製品タイプ</label>
    <select id="reg-prod-type" style="width:100%; background: #1e293b; border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 0.45rem; color:#fff; font-size: 0.85rem;" onchange="updateFormLabelForChatProduct()">
      <option value="solar">太陽光発電パネル (kW)</option>
      <option value="battery">家庭用蓄電池 (kWh)</option>
    </select>
  </div>
  
  <div style="margin-bottom: 0.85rem; display: flex; gap: 0.5rem;">
    <div style="flex: 1;">
      <label style="display:block; font-size:0.75rem; color:var(--text-secondary); margin-bottom: 0.25rem; font-weight:600;">メーカー名</label>
      <input type="text" id="reg-prod-manufacturer" placeholder="例: カナディアンソーラー" style="width:100%; background: #1e293b; border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 0.45rem; color:#fff; font-size: 0.85rem;" />
    </div>
    <div style="flex: 1;">
      <label style="display:block; font-size:0.75rem; color:var(--text-secondary); margin-bottom: 0.25rem; font-weight:600;">製品名</label>
      <input type="text" id="reg-prod-name" placeholder="例: CS7N-650MS" style="width:100%; background: #1e293b; border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 0.45rem; color:#fff; font-size: 0.85rem;" />
    </div>
  </div>

  <div style="margin-bottom: 0.85rem; display: flex; gap: 0.5rem;">
    <div style="flex: 1;">
      <label id="reg-label-spec" style="display:block; font-size:0.75rem; color:var(--text-secondary); margin-bottom: 0.25rem; font-weight:600;">公称最大出力 (kW)</label>
      <input type="number" step="0.01" id="reg-prod-spec" placeholder="例: 0.40" style="width:100%; background: #1e293b; border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 0.45rem; color:#fff; font-size: 0.85rem;" />
    </div>
    <div style="flex: 1;">
      <label id="reg-label-price" style="display:block; font-size:0.75rem; color:var(--text-secondary); margin-bottom: 0.25rem; font-weight:600;">概算本体価格 (円)</label>
      <input type="number" id="reg-prod-price" placeholder="例: 130000" style="width:100%; background: #1e293b; border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 0.45rem; color:#fff; font-size: 0.85rem;" />
    </div>
  </div>

  <div style="margin-bottom: 1.25rem;">
    <label style="display:block; font-size:0.75rem; color:var(--text-secondary); margin-bottom: 0.25rem; font-weight:600;">製品の特徴 (1行)</label>
    <input type="text" id="reg-prod-feature" placeholder="例: 業界最高水準の両面発電テクノロジー搭載" style="width:100%; background: #1e293b; border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 0.45rem; color:#fff; font-size: 0.85rem;" />
  </div>

  <button class="btn-select-product" onclick="registerProductFromChat()" style="width:100%; display:flex; justify-content:center; align-items:center; gap:0.5rem; background:linear-gradient(135deg, var(--color-emerald), #047857); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35); border: none; border-radius: 8px; padding: 0.75rem 1rem; color: #fff; font-weight: 700; cursor: pointer; transition: all 0.25s ease;">
    <i data-lucide="plus-circle" style="width:16px; height:16px;"></i>
    <span>この製品をデータベースに追加登録する</span>
  </button>
</div>`;
  }

  // Search through dialogue database using keywords
  for (const category in CHATBOT_KNOWLEDGE) {
    if (category === "greeting" || category === "default") continue;
    
    const entry = CHATBOT_KNOWLEDGE[category];
    const match = entry.keywords.some(keyword => cleanQuery.includes(keyword));
    if (match) {
      return entry.response;
    }
  }

  // Handle specific product references
  if (cleanQuery.includes("tesla") || cleanQuery.includes("powerwall") || cleanQuery.includes("パワーウォール")) {
    return `テスラの「Powerwall (パワーウォール)」は、業界に衝撃を与えた蓄電池です。
🔋 **主な仕様**:
・容量: 13.5kWh (一般的な家庭の1〜2日分の使用量を1台でカバー可能)
・出力: 5.0kW (200VのエアコンやIHクッキングヒーターも同時に動かせます)
・価格: 約160万円前後の高コスパ。

東京都の場合、蓄電池単体に最大60万円、国から約20万円の補助金が出るため、実質負担をほぼ半額近くに抑えることが可能です。スタイリッシュな外観とスマートなアプリ連携も極めて魅力的です！`;
  }

  if (cleanQuery.includes("パナソニック") || cleanQuery.includes("panasonic")) {
    return `パナソニックの太陽光パネル「EverVolt (エバーボルト) 370W」は、日本のトップブランドならではの高い信頼性を誇ります。
特徴として、パネルの温度が上がる夏場でも効率が落ちにくいヘテロ接合技術（HIT）を採用しており、25年の長期機器・出力無償保証が付きます。初期費用は高めですが、生涯発電量が高いため、長期的な回収効率は抜群です！`;
  }

  return CHATBOT_KNOWLEDGE.default;
}

function addChatMessage(sender, text) {
  const container = document.getElementById("chat-messages-container");
  if (!container) return;

  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${sender}`;

  const header = document.createElement("div");
  header.className = "chat-bubble-header";
  
  if (sender === "bot") {
    header.innerHTML = `<i data-lucide="sparkles" style="width:14px; height:14px;"></i><span>Sola AI コンサルタント</span>`;
  } else {
    header.innerHTML = `<span>あなた (ユーザー)</span>`;
  }

  const content = document.createElement("div");
  content.className = "chat-bubble-content";
  
  // Simple markdown-to-html paragraph formatter
  const formattedText = text
    .split("\n\n")
    .map(para => {
      // Bold formatter
      let pHtml = para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Bullet list formatter
      if (pHtml.startsWith("・") || pHtml.startsWith("-")) {
        const items = pHtml.split(/\n[・-]\s*/);
        // clean first item
        items[0] = items[0].replace(/^[・-]\s*/, "");
        return `<ul>${items.map(it => `<li>${it}</li>`).join("")}</ul>`;
      }
      // Simple line break replace
      return `<p>${pHtml.replace(/\n/g, "<br>")}</p>`;
    })
    .join("");

  content.innerHTML = formattedText;

  bubble.appendChild(header);
  bubble.appendChild(content);
  container.appendChild(bubble);

  // Auto Scroll
  container.scrollTop = container.scrollHeight;
  lucide.createIcons();
}

function showTypingIndicator() {
  const container = document.getElementById("chat-messages-container");
  if (!container) return;

  const indicator = document.createElement("div");
  indicator.className = "chat-bubble bot";
  indicator.id = "chat-typing-indicator";
  indicator.innerHTML = `
    <div class="chat-bubble-header">
      <i data-lucide="sparkles" style="width:14px; height:14px;"></i><span>Sola AI 入力中...</span>
    </div>
    <div style="display:flex; gap:4px; padding: 4px 0;">
      <span style="width:6px; height:6px; background:#fff; border-radius:50%; animation: bounce 1.4s infinite ease-in-out both;"></span>
      <span style="width:6px; height:6px; background:#fff; border-radius:50%; animation: bounce 1.4s infinite ease-in-out both; animation-delay: 0.2s;"></span>
      <span style="width:6px; height:6px; background:#fff; border-radius:50%; animation: bounce 1.4s infinite ease-in-out both; animation-delay: 0.4s;"></span>
    </div>
    <style>
      @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1.0); }
      }
    </style>
  `;
  container.appendChild(indicator);
  container.scrollTop = container.scrollHeight;
  lucide.createIcons();
}

function removeTypingIndicator() {
  const indicator = document.getElementById("chat-typing-indicator");
  if (indicator) indicator.remove();
}

// Action to apply searched subsidy from chatbot directly to Simulator custom settings
function applySearchedSubsidyToSimulator(prefKey) {
  const data = NATIONWIDE_PREFECTURE_DATABASE[prefKey];
  if (!data) return;

  // 1. Update appState
  appState.regionId = "custom";
  appState.customRates.solarRate = data.solarRate;
  appState.customRates.solarMax = data.solarMax;
  appState.customRates.batteryRate = data.batteryRate;
  appState.customRates.batteryMax = data.batteryMax;

  // 2. Update simulator DOM inputs
  document.getElementById("select-region").value = "custom";
  
  // Expand custom settings group
  document.getElementById("group-custom-subsidy").classList.remove("hidden");

  // Sync and display new custom ranges
  document.getElementById("range-custom-solar-rate").value = data.solarRate;
  document.getElementById("bubble-custom-solar-rate").innerText = `${data.solarRate.toLocaleString()}円`;
  
  document.getElementById("range-custom-solar-max").value = data.solarMax;
  document.getElementById("bubble-custom-solar-max").innerText = `${data.solarMax.toLocaleString()}円`;
  
  document.getElementById("range-custom-battery-rate").value = data.batteryRate;
  document.getElementById("bubble-custom-battery-rate").innerText = `${data.batteryRate.toLocaleString()}円`;
  
  document.getElementById("range-custom-battery-max").value = data.batteryMax;
  document.getElementById("bubble-custom-battery-max").innerText = `${data.batteryMax.toLocaleString()}円`;

  // 3. Re-run simulation and dynamically render custom timeline and checklist
  runSimulation();
  updateSubsidyScreen();

  // 4. Smoothly switch screen to the simulator panel
  switchScreen("screen-simulator");

  // 5. Update active classes on the navigation sidebar
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(nav => {
    if (nav.getAttribute("data-target") === "screen-simulator") {
      nav.classList.add("active");
    } else {
      nav.classList.remove("active");
    }
  });

  // Create message bubble in the chat to tell user it succeeded
  addChatMessage("bot", `✨ **【シミュレーター連携完了】**
**${data.name}**の補助金データ（太陽光1kWあたり**${data.solarRate.toLocaleString()}円**、蓄電池1kWhあたり**${data.batteryRate.toLocaleString()}円**）をシミュレーターに自動入力し、画面をダッシュボードに切り替えました！

実質負担額や回収年数（ROI）が自動で更新されていますので、シミュレーター画面をご確認ください！`);
}

// Dynamic form labels on chatbot product registration cards
function updateFormLabelForChatProduct() {
  const typeSelect = document.getElementById("reg-prod-type");
  const specLabel = document.getElementById("reg-label-spec");
  const specInput = document.getElementById("reg-prod-spec");
  const priceLabel = document.getElementById("reg-label-price");
  const priceInput = document.getElementById("reg-prod-price");
  
  if (typeSelect && specLabel && specInput && priceLabel && priceInput) {
    if (typeSelect.value === "solar") {
      specLabel.innerText = "公称最大出力 (kW)";
      specInput.placeholder = "例: 0.40";
      priceLabel.innerText = "概算本体価格 (円/枚)";
      priceInput.placeholder = "例: 130000";
    } else {
      specLabel.innerText = "蓄電容量 (kWh)";
      specInput.placeholder = "例: 12.0";
      priceLabel.innerText = "概算本体価格 (工事費込)";
      priceInput.placeholder = "例: 1500000";
    }
  }
}

// Global action to dynamically push custom product into the database
function registerProductFromChat() {
  const type = document.getElementById("reg-prod-type").value;
  const manufacturer = document.getElementById("reg-prod-manufacturer").value.trim();
  const name = document.getElementById("reg-prod-name").value.trim();
  const specVal = parseFloat(document.getElementById("reg-prod-spec").value);
  const priceVal = parseInt(document.getElementById("reg-prod-price").value);
  const feature = document.getElementById("reg-prod-feature").value.trim() || "カスタム登録デバイス";

  if (!manufacturer || !name || isNaN(specVal) || isNaN(priceVal)) {
    alert("すべての必須項目（メーカー、製品名、公称値、概算価格）を正しく入力してください。");
    return;
  }

  const customId = `custom-product-${type}-${Date.now()}`;
  const isSolar = type === "solar";

  const newProductObj = {
    id: customId,
    manufacturer: manufacturer,
    name: name,
    type: type,
    output: isSolar ? specVal : 3.0, // base kW for batteries
    capacity: isSolar ? 0 : specVal,  // capacity kWh
    efficiency: isSolar ? 20.5 : 0,  // standard efficiency
    warranty: 15,
    estPricePerUnit: isSolar ? priceVal : 0,
    estPrice: isSolar ? 0 : priceVal,
    features: [
      feature,
      "AIチャットよりユーザーが追加した最新カスタム機器",
      "シミュレーターの高度計算ロジックに完全対応"
    ],
    description: `AIチャットコンソールから直接追加された、最新世代の${manufacturer}製カスタム${isSolar ? '太陽光モジュール' : '家庭用リチウムイオン蓄電池'}です。`,
    isCustom: true // custom flag for styling
  };

  // Push to dynamic list
  if (isSolar) {
    SOLAR_PRODUCTS.push(newProductObj);
  } else {
    BATTERY_PRODUCTS.push(newProductObj);
  }

  // 1. Refresh both select boxes in Simulator screen
  populateSelectOptions();

  // 2. Select this product in simulator
  if (isSolar) {
    appState.solarProductId = customId;
    document.getElementById("select-solar").value = customId;
    togglePanelCountVisibility();
  } else {
    appState.batteryProductId = customId;
    document.getElementById("select-battery").value = customId;
  }

  // 3. Re-render product catalog view to show the new card immediately
  renderProductCatalog();

  // 4. Update and run simulation calculations
  runSimulation();

  // Render a friendly chatbot success card in chat
  addChatMessage("bot", `🎉 **【カスタム製品のデータベース登録完了】**
**${manufacturer}**の新製品 **「${name}」** をデータベースに無事登録し、シミュレーターに自動適用しました！

📊 **登録情報**:
・メーカー: ${manufacturer}
・製品名: ${name}
・${isSolar ? '公称最大出力' : '蓄電容量'}: ${specVal} ${isSolar ? 'kW/枚' : 'kWh'}
・本体概算価格: ${priceVal.toLocaleString()} 円

「主要メーカー製品データベース」タブにも自動的に追加されており、オレンジ色の **「カスタム登録」** バッジが付いたカードとして登録されています。
シミュレーター画面でもすでにこの製品を選択した状態で実質回収年数が計算されていますので、左メニューの「シミュレーター」にてお確かめください！☀️🔋`);
}

// Action to apply searched subsidy from chatbot directly to Simulator custom settings
function applySearchedSubsidyToSimulator(prefKey) {
  const data = NATIONWIDE_PREFECTURE_DATABASE[prefKey];
  if (!data) return;

  // 1. Update appState
  appState.regionId = "custom";
  appState.customRates.solarRate = data.solarRate;
  appState.customRates.solarMax = data.solarMax;
  appState.customRates.batteryRate = data.batteryRate;
  appState.customRates.batteryMax = data.batteryMax;

  // 2. Update simulator DOM inputs
  document.getElementById("select-region").value = "custom";
  
  // Expand custom settings group
  document.getElementById("group-custom-subsidy").classList.remove("hidden");

  // Sync and display new custom ranges
  document.getElementById("range-custom-solar-rate").value = data.solarRate;
  document.getElementById("bubble-custom-solar-rate").innerText = `${data.solarRate.toLocaleString()}円`;
  
  document.getElementById("range-custom-solar-max").value = data.solarMax;
  document.getElementById("bubble-custom-solar-max").innerText = `${data.solarMax.toLocaleString()}円`;
  
  document.getElementById("range-custom-battery-rate").value = data.batteryRate;
  document.getElementById("bubble-custom-battery-rate").innerText = `${data.batteryRate.toLocaleString()}円`;
  
  document.getElementById("range-custom-battery-max").value = data.batteryMax;
  document.getElementById("bubble-custom-battery-max").innerText = `${data.batteryMax.toLocaleString()}円`;

  // 3. Re-run simulation and dynamically render custom timeline and checklist
  runSimulation();
  updateSubsidyScreen();

  // 4. Smoothly switch screen to the simulator panel
  switchScreen("screen-simulator");

  // 5. Update active classes on the navigation sidebar
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(nav => {
    if (nav.getAttribute("data-target") === "screen-simulator") {
      nav.classList.add("active");
    } else {
      nav.classList.remove("active");
    }
  });

  // Create message bubble in the chat to tell user it succeeded
  addChatMessage("bot", `✨ **【シミュレーター連携完了】**
**${data.name}**の補助金データ（太陽光1kWあたり**${data.solarRate.toLocaleString()}円**、蓄電池1kWhあたり**${data.batteryRate.toLocaleString()}円**）をシミュレーターに自動入力し、画面をダッシュボードに切り替えました！

実質負担額や回収年数（ROI）が自動で更新されていますので、シミュレーター画面をご確認ください！`);
}
