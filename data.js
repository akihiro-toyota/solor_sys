/**
 * Solar Subsidy AI Navigator - Database (Version 2.1 - Custom Inter-linkage Enabled)
 * Major Solar Panels & Batteries, and Municipal Subsidies in Japan
 */

const SOLAR_PRODUCTS = [
  {
    id: "panasonic-evervolt",
    manufacturer: "パナソニック",
    name: "EverVolt (エバーボルト) 370W",
    type: "solar",
    output: 0.37, // kW
    efficiency: 21.2, // %
    warranty: 25, // 年 (モジュール・機器保証)
    estPricePerUnit: 140000, // 円 (工事費別概算)
    features: ["業界最高水準の高温時出力性能", "25年の長期無償保証", "優れたデザイン性で和洋どちらの屋根にも調和"],
    description: "パナソニックのフラッグシップモデル。日本の高温多湿な夏でも効率よく発電し続ける独自のヘテロ接合技術（HIT）を継承。長期信頼性が極めて高いプレミアム製品です。"
  },
  {
    id: "sharp-blacksolar",
    manufacturer: "シャープ",
    name: "BLACKSOLAR ZERO 360W",
    type: "solar",
    output: 0.36, // kW
    efficiency: 20.8, // %
    warranty: 20, // 年
    estPricePerUnit: 125000, // 円
    features: ["電極を裏面に配置した美しいフルブラック仕様", "限られた屋根面積でも最大発電", "優れた耐風圧・耐積雪設計"],
    description: "受光面積を最大化するために送電線をすべて裏面に配置した「バックコンタクト技術」を採用。屋根の美観を損なわない漆黒のデザインと高い発電量を両立しています。"
  },
  {
    id: "kyocera-eneready",
    manufacturer: "京セラ",
    name: "エネレディ 300W",
    type: "solar",
    output: 0.30, // kW
    efficiency: 19.5, // %
    warranty: 20, // 年
    estPricePerUnit: 95000, // 円
    features: ["長年の設置実績に基づく確かな耐久性", "複合型モジュール構成で複雑な屋根にも対応", "優れたコストパフォーマンス"],
    description: "日本の住宅用太陽光の草分け的存在である京セラ。独自の小型・台形モジュールを組み合わせることで、寄棟屋根などの複雑な形状でもスペースを無駄なく活用できます。"
  },
  {
    id: "choshu-premiumblue",
    manufacturer: "長州産業",
    name: "プレミアムブルー 340W",
    type: "solar",
    output: 0.34, // kW
    efficiency: 20.3, // %
    warranty: 25, // 年 (雨漏り保証含む)
    estPricePerUnit: 110000, // 円
    features: ["国内自社工場による安心の「Made in Japan」", "業界唯一の施工保証（雨漏り等）が標準付帯", "波長変換技術による朝夕の発電力強化"],
    description: "山口県の自社工場で一貫生産。施工によるトラブル（雨漏り等）に対する保証がメーカー標準で付いているため、日本の住宅オーナーから絶大な信頼を得ています。"
  },
  {
    id: "qcells-qpeak",
    manufacturer: "Qセルズ",
    name: "Q.PEAK DUO-G9 355W",
    type: "solar",
    output: 0.355, // kW
    efficiency: 20.6, // %
    warranty: 25, // 年
    estPricePerUnit: 100000, // 円
    features: ["曇りの日や低照度でも高い発電パフォーマンス", "世界水準の厳しい品質テストをクリア", "非常に優れた対費用効果"],
    description: "ドイツ生まれのグローバルブランド。特許技術のQ.ANTUMテクノロジーを搭載し、曇りや朝夕、冬場などの日射量が少ない状況でも安定して高い発電能力を維持します。"
  }
];

const BATTERY_PRODUCTS = [
  {
    id: "tesla-powerwall",
    manufacturer: "テスラ",
    name: "Powerwall (パワーウォール)",
    type: "battery",
    capacity: 13.5, // kWh
    output: 5.0, // kW (定格出力)
    warranty: 10, // 年
    estPrice: 1600000, // 円 (標準設置工事費込の概算)
    features: ["圧倒的な大容量 (13.5kWh)", "停電時に家全体を丸ごとカバー (全負荷型)", "スマホアプリからのリアルタイムな電力管理"],
    description: "スタイリッシュな外観と大容量で圧倒的な人気を誇るテスラの蓄電池。停電時には0.6秒以内に自動起動し、エアコンやIHヒーターを含む家全体の電気をバックアップします。"
  },
  {
    id: "omron-multi",
    manufacturer: "オムロン",
    name: "マルチ蓄電プラットフォーム",
    type: "battery",
    capacity: 9.8, // kWh
    output: 3.0, // kW
    warranty: 15, // 年
    estPrice: 1400000, // 円
    features: ["世界最小・最軽量クラスの極小設計", "塩害地域や寒冷地にも対応する高耐久", "ライフスタイルに合わせて後から増設可能"],
    description: "日本の狭小な住宅事情に最適化されたコンパクト設計。壁掛け設置も可能で、水害対策として高所に取り付けることもできます。信頼のオムロン製制御技術を搭載。"
  },
  {
    id: "panasonic-smarthems",
    manufacturer: "パナソニック",
    name: "スマートココセロ 6.3kWh",
    type: "battery",
    capacity: 6.3, // kWh
    output: 2.0, // kW
    warranty: 15, // 年
    estPrice: 1100000, // 円
    features: ["スマートHEMS「AiSEG2」との高度な連携", "気象警報と連動した自動満充電機能", "毎日の充放電に強い長寿命セル"],
    description: "パナソニックのHEMS（ホームエネルギー管理システム）と連携し、翌日の天気予報や災害警戒情報に合わせて自動で最適な運転モードに切り替える賢い蓄電池です。"
  },
  {
    id: "sharp-cloud",
    manufacturer: "シャープ",
    name: "クラウド蓄電池 8.4kWh",
    type: "battery",
    capacity: 8.4, // kWh
    output: 2.0, // kW
    warranty: 15, // 年
    estPrice: 1250000, // 円
    features: ["COCORO ENERGYによるAI賢い自動運転", "コンパクトながら十分なバックアップ容量", "ハイブリッドパワーコンディショナ対応"],
    description: "シャープのクラウドAIが日々の電気使用パターンや天気予報を学習し、売電と自家消費の比率をインテリジェントに最大化。太陽光パネルとの相性も抜群です。"
  }
];

const SUBSIDY_DATABASE = {
  national: {
    name: "国 (経済産業省/環境省)",
    solar: {
      rate: 0,
      max: 0,
      unit: "kW",
      note: "国からの単独の太陽光向け補助金はありませんが、ZEH仕様での新築等には別途支援があります。"
    },
    battery: {
      rate: 37000,
      max: 200000,
      unit: "kWh",
      note: "家庭用蓄電池に対し、1kWhあたり約3.7万円（最大20万円）の補助金が支給される支援事業（DR対応蓄電池等）が利用可能です。"
    }
  },
  tokyo: {
    name: "東京都 (クール・ネット東京)",
    solar: {
      rate: 120000,
      max: 360000,
      unit: "kW",
      note: "東京都は全国一破格の補助金を支給しています。3kWまで1kWあたり12万円、3.6kW超は制限がありますが、非常に手厚いです。"
    },
    battery: {
      rate: 100000,
      max: 600000,
      unit: "kWh",
      note: "太陽光発電を同時に設置する場合、蓄電池に対しても1kWhあたり最大10万円（上限60万円）という極めて強力な補助が受けられます。"
    },
    checklist: [
      "補助金交付申請書 (都指定様式)",
      "機器の設置プラン図・配置図",
      "設置前の屋根および設置予定場所の写真",
      "工事見積書の写し (内訳が明記されたもの)",
      "申請者の住民票の写し (3ヶ月以内発行)",
      "都税の納税証明書"
    ],
    steps: [
      { title: "事前相談・見積もり", desc: "登録事業者から見積もりを取得し、設置プランを策定します。" },
      { title: "交付申請 (着工前)", desc: "都（クール・ネット東京）に交付申請書を提出します。必ず【工事着工前】に受理される必要があります。" },
      { title: "交付決定の受領", desc: "約3〜4週間で交付決定通知書が届きます。" },
      { title: "工事の実施・完了", desc: "交付決定後、工事を着工し、設置を完了させます。" },
      { title: "実績報告の提出", desc: "工事完了後、領収書や竣工写真等の実績報告書を提出します。" },
      { title: "補助金の振込", desc: "審査完了後、約1〜2ヶ月で指定口座に補助金が振り込まれます。" }
    ]
  },
  yokohama: {
    name: "神奈川県横浜市",
    solar: {
      rate: 20000,
      max: 80000,
      unit: "kW",
      note: "横浜市「令和6年度 住宅用太陽光発電システム設置補助」では、1kWあたり2万円（最大8万円）を補助。"
    },
    battery: {
      rate: 15000,
      max: 90000,
      unit: "kWh",
      note: "HEMS（ホームエネルギー管理システム）との連動等を条件に、蓄電池1kWhあたり1.5万円（上限9万円）が加算されます。"
    },
    checklist: [
      "横浜市温暖化対策補助金申請書 (様式第1号)",
      "工事請負契約書の写し",
      "設置場所の案内図および配置図",
      "機器のスペックがわかるカタログのコピー",
      "市税の納税証明書 (滞納がないことの証明)"
    ],
    steps: [
      { title: "事前確認", desc: "横浜市の当該年度の予算残額を確認します（先着順のため）。" },
      { title: "設置契約＆申請提出", desc: "着工予定日の14日前までに申請書類一式を市役所に提出します。" },
      { title: "施工および完了報告", desc: "工事を完了し、設置後30日以内または当該年度の3月末日までに実績報告書を提出します。" },
      { title: "補助金交付交付決定", desc: "審査後、交付額確定通知が届き、順次振込が実行されます。" }
    ]
  },
  saitama: {
    name: "埼玉県さいたま市",
    solar: {
      rate: 15000,
      max: 60000,
      unit: "kW",
      note: "スマートホーム推進事業補助金として、太陽光発電に対して最大6万円（1kWあたり1.5万円）を補助。"
    },
    battery: {
      rate: 10000,
      max: 50000,
      unit: "kWh",
      note: "太陽光発電との同時設置を条件に、蓄電池に対して一律または容量比例で最大5万円を補助します。"
    },
    checklist: [
      "さいたま市スマートホーム推進事業費補助金交付申請書",
      "工事前の現場写真 (日付が入ったもの)",
      "建物の登記事項証明書または確認済証の写し (所有権の確認)",
      "工事見積明細書"
    ],
    steps: [
      { title: "交付申請", desc: "工事着手の3週間前までに申請書を市（環境共生課）に提出します。" },
      { title: "工事着工・完了", desc: "市からの「交付決定通知書」を受け取った後に着工します。" },
      { title: "実績報告", desc: "工事完了後30日以内に、領収書の写しや設置後のカラー写真を添えて実績報告書を提出します。" }
    ]
  },
  nagoya: {
    name: "愛知県名古屋市",
    solar: {
      rate: 20000,
      max: 80000,
      unit: "kW",
      note: "名古屋市「住宅用地球温暖化対策設備導入助成制度」により、1kWあたり2万円（最大8万円）を助成。"
    },
    battery: {
      rate: 15000,
      max: 90000,
      unit: "kWh",
      note: "定置用リチウムイオン蓄電池に対して、1kWhあたり1.5万円（最大9万円）を支援。"
    },
    checklist: [
      "名古屋市住宅用対策設備導入助成申請書",
      "設置予定箇所の図面および写真",
      "助成対象経費の確認ができる見積書の写し",
      "市民税の納税証明書"
    ],
    steps: [
      { title: "助成申請書提出", desc: "着工前に申請書を提出します。郵送または窓口持参での受付です。" },
      { title: "助成決定通知", desc: "市からの助成決定通知書が届いたら工事を開始します。" },
      { title: "設置完了報告", desc: "設置工事後、すみやかに完了報告書（設置写真、領収書添付）を提出します。" }
    ]
  },
  osaka: {
    name: "大阪府大阪市",
    solar: {
      rate: 20000,
      max: 100000,
      unit: "kW",
      note: "大阪市「家庭用エネルギー管理システム等導入補助事業」において、太陽光発電に対して最大10万円を補助。"
    },
    battery: {
      rate: 20000,
      max: 100000,
      unit: "kWh",
      note: "太陽光と連携する蓄電システム（1kWhあたり2万円、上限10万円）の同時設置を強力に支援します。"
    },
    checklist: [
      "大阪市家庭用システム等導入補助金交付申請書 (様式第1号)",
      "住民票の写し (個人番号の記載がないもの)",
      "機器の設置契約書の写しおよび内訳明細書",
      "設置前建物の全景写真"
    ],
    steps: [
      { title: "事前登録または交付申請", desc: "補助金申請サイトまたは郵送で事前申請書を提出します。" },
      { title: "施工開始", desc: "交付決定を受理したのちに、施工を開始します。" },
      { title: "実績報告書の提出", desc: "事業完了日から30日以内または指定期限までに、請求書・設置写真等の完了書類を提出します。" }
    ]
  },
  custom: {
    name: "その他 (自分で補助金を入力する)",
    solar: { rate: 20000, max: 100000, unit: "kW", note: "お住まいの市区町村のパンフレットやHPの条件を入力してください。" },
    battery: { rate: 15000, max: 100000, unit: "kWh", note: "お住まいの市区町村のパンフレットやHPの条件を入力してください。" },
    checklist: [
      "自治体指定 of 補助金交付申請書",
      "工事請負契約書または見積書の写し",
      "機器の配置図・システム構成図",
      "工事前の現場写真",
      "申請者の住民票・納税証明書"
    ],
    steps: [
      { title: "事前見積もりとプラン確定", desc: "施工会社に見積もりと図面を依頼します。" },
      { title: "補助金交付申請の提出 (着工前)", desc: "お住まいの市役所等の窓口、またはオンラインで申請書と添付書類を提出します。" },
      { title: "交付決定の通知", desc: "審査後、自治体から「交付決定通知書」が届きます。これを受け取るまで工事は開始できません。" },
      { title: "設置工事・完了", desc: "決定通知に基づき速やかに工事を完了させます。" },
      { title: "実績報告書の提出", desc: "領収書のコピー、施工後の完了写真を添付して市役所に報告します。" },
      { title: "補助金の受け取り", desc: "確定審査を経て、指定口座に補助金が振り込まれます。" }
    ]
  }
};

// Nationwide Prefecture Lookup Database for AI Chatbot simulated Web Search
const NATIONWIDE_PREFECTURE_DATABASE = {
  hokkaido: { name: "北海道", solar: "1kWあたり約1.5万円 (上限6万円程度)", battery: "1kWhあたり約1.2万円 (上限6万円程度)", note: "札幌市などは独自の「スマートエネルギー住宅助成」を上乗せ支給しています。豪雪地帯対策としてパネルの架台傾斜角度や落雪考慮などの条件が加わることがあります。", solarRate: 15000, solarMax: 60000, batteryRate: 12000, batteryMax: 60000 },
  aomori: { name: "青森県", solar: "一律5万〜8万円程度 (自治体による)", battery: "1kWhあたり1.5万円 (上限7万円程度)", note: "八户市や青森市など、積雪対応の強度設計を条件としたスマート助成が個別市町村ごとに用意されています。", solarRate: 15000, solarMax: 60000, batteryRate: 15000, batteryMax: 70000 },
  iwate: { name: "岩手県", solar: "1kWあたり1.5万円 (上限6万円程度)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "盛岡市など多くの自治体で温暖化対策支援として上乗せ補助があり、国の支援と併用して負担を軽減できます。", solarRate: 15000, solarMax: 60000, batteryRate: 12000, batteryMax: 60000 },
  miyagi: { name: "宮城県", solar: "1kWあたり1.5万〜2万円 (上限8万円程度)", battery: "1kWhあたり1.5万円 (上限8万円程度)", note: "仙台市の「熱利用・創エネ省エネ等助成事業」は非常に人気で併用可能です。", solarRate: 18000, solarMax: 80000, batteryRate: 15000, batteryMax: 80000 },
  akita: { name: "秋田県", solar: "一律5万円程度 (自治体補助のみ)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "日照時間が全国的に短い秋田ですが、冬場の積雪荷重に耐える架台設計や高効率パネルの選定が大切です。", solarRate: 12000, solarMax: 50000, batteryRate: 12000, batteryMax: 60000 },
  yamagata: { name: "山形県", solar: "一律5万〜8万円程度 (自治体による)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "雪国対応の高床式架台や傾斜角の工夫により、冬場の発電損失を最小限に抑える設計が推奨されます。", solarRate: 12000, solarMax: 60000, batteryRate: 12000, batteryMax: 60000 },
  fukushima: { name: "福島県", solar: "1kWあたり約2万円 (上限8万円程度)", battery: "1kWhあたり2万円 (上限10万円程度)", note: "震災復興支援の一環として、福島県独自の非常に手厚い再エネ補助金が展開される時期があります。", solarRate: 20000, solarMax: 80000, batteryRate: 20000, batteryMax: 100000 },
  ibaraki: { name: "茨城県", solar: "1kWあたり1.5万円 (上限6万円程度)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "つくば市など先進都市でのスマートハウス推進補助金と組み合わせて利用されるケースが多いです。", solarRate: 15000, solarMax: 60000, batteryRate: 12000, batteryMax: 60000 },
  tochigi: { name: "栃木県", solar: "1kWあたり1.5万円 (上限6万円程度)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "宇都宮市などのLRT推進エリアを筆頭に、スマートシティ構想に連動した設備上乗せ補助があります。", solarRate: 15000, solarMax: 60000, batteryRate: 12000, batteryMax: 60000 },
  gunma: { name: "群馬県", solar: "1kWあたり1.5万円 (上限6万円程度)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "からっ風や強い日照が特徴の群馬は太陽光の好適地です。前橋市などで手厚い創エネ支援があります。", solarRate: 15000, solarMax: 60000, batteryRate: 12000, batteryMax: 60000 },
  saitama: { name: "埼玉県", solar: "1kWあたり1.5万円 (上限6万円程度)", battery: "1kWhあたり1.5万円 (上限7万円程度)", note: "さいたま市を筆頭に川口市や所沢市など、主要各市で独自のスマートホーム支援金が活発に運用されています。", solarRate: 15000, solarMax: 60000, batteryRate: 15000, batteryMax: 70000 },
  chiba: { name: "千葉県", solar: "1kWあたり2万円 (上限8万円程度)", battery: "1kWhあたり1.5万円 (上限9万円程度)", note: "千葉市や船橋市など、ほとんどの主要市区町村で県補助金との併用が認められています。", solarRate: 20000, solarMax: 80000, batteryRate: 15000, batteryMax: 90000 },
  tokyo: { name: "東京都", solar: "1kWあたり12万円 (上限36万円程度)", battery: "1kWhあたり最大10万円 (上限60万円)", note: "全国で圧倒的に手厚いクールネット東京の補助金が適用されます。同時設置で実質負担が劇的に圧縮されます。", solarRate: 120000, solarMax: 360000, batteryRate: 100000, batteryMax: 600000 },
  kanagawa: { name: "神奈川県", solar: "1kWあたり約1.5万〜2万円 (上限6万円)", battery: "1kWhあたり1.5万円 (上限8万円)", note: "川崎市や相模原市なども横浜市に並ぶ独自の強力なエコ補助金を支給しています。", solarRate: 18000, solarMax: 60000, batteryRate: 15000, batteryMax: 80000 },
  niigata: { name: "新潟県", solar: "1kWあたり1.2万円 (上限5万円程度)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "豪雪対策として架台の基礎や雪おろしルートの確保が重要。新潟市などで積雪対応機向けの補助金があります。", solarRate: 12000, solarMax: 50000, batteryRate: 12000, batteryMax: 60000 },
  toyama: { name: "富山県", solar: "一律5万円程度 (自治体補助のみ)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "北陸独自の高湿度と積雪を考慮し、塩害耐性や結露防止に優れた高信頼性のパワコン選定が有利です。", solarRate: 12000, solarMax: 50000, batteryRate: 12000, batteryMax: 60000 },
  ishikawa: { name: "石川県", solar: "一律5万円程度 (自治体補助のみ)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "金沢市などの「スマート住宅導入助成」があり、瓦屋根への施工実績が豊富な施工業者の選定が大切です。", solarRate: 12000, solarMax: 50000, batteryRate: 12000, batteryMax: 60000 },
  fukui: { name: "福井県", solar: "1kWあたり1.2万円 (上限5万円程度)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "福井独自の豪雪設計に耐えるよう、フレーム強度が高いモジュールと頑丈な4本留め架台が標準的です。", solarRate: 12000, solarMax: 50000, batteryRate: 12000, batteryMax: 60000 },
  yamanashi: { name: "山梨県", solar: "1kWあたり1.5万円 (上限6万円程度)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "日照時間が全国屈指の長さである山梨は、太陽光の発電効率・ROI（費用対効果）が最も期待できる優良県です。", solarRate: 15000, solarMax: 60000, batteryRate: 12000, batteryMax: 60000 },
  nagano: { name: "長野県", solar: "1kWあたり1.5万円 (上限6万円程度)", battery: "1kWhあたり1.5万円 (上限8万円程度)", note: "信州エコ住宅普及事業など、高地・寒冷地に適した蓄電池の動作環境温度に配慮された補助金条件があります。", solarRate: 15000, solarMax: 60000, batteryRate: 15000, batteryMax: 80000 },
  gifu: { name: "岐阜県", solar: "1kWあたり1.5万円 (上限6万円程度)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "岐阜市や大垣市などでスマート推進助成があり、高地や山間部での日影条件を考慮したシミュレーションが必要です。", solarRate: 15000, solarMax: 60000, batteryRate: 12000, batteryMax: 60000 },
  shizuoka: { name: "静岡県", solar: "1kWあたり1.5万円 (上限6万円)", battery: "1kWhあたり1.5万円 (上限7万円)", note: "日照時間が極めて長い静岡県は、太陽光パネルの利回りが非常に良い地域として知られています。", solarRate: 15000, solarMax: 60000, batteryRate: 15000, batteryMax: 70000 },
  aichi: { name: "愛知県", solar: "1kWあたり2万円 (上限8万円程度)", battery: "1kWhあたり1.5万円 (上限9万円程度)", note: "豊田市などの環境先進都市ではさらに手厚い独自のZEH加算等があります。", solarRate: 20000, solarMax: 80000, batteryRate: 15000, batteryMax: 90000 },
  mie: { name: "三重県", solar: "1kWあたり1.5万円 (上限6万円程度)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "津市や四日市市など、伊勢湾沿いの風害や塩害に対応した重耐塩害仕様の選定が推奨されます。", solarRate: 15000, solarMax: 60000, batteryRate: 12000, batteryMax: 60000 },
  shiga: { name: "滋賀県", solar: "1kWあたり1.5万円 (上限6万円程度)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "「滋賀県スマートハウス導入促進事業」や大津市の補助があり、琵琶湖周辺の気候に対応したスマート導入が盛んです。", solarRate: 15000, solarMax: 60000, batteryRate: 12000, batteryMax: 60000 },
  kyoto: { name: "京都府", solar: "1kWあたり2万円 (上限10万円程度)", battery: "1kWhあたり2万円 (上限10万円程度)", note: "京都市の「スマートエコハウス」推進事業など、景観条例に準拠した施工を条件に強力な支援があります。", solarRate: 20000, solarMax: 100000, batteryRate: 20000, batteryMax: 100000 },
  osaka: { name: "大阪府", solar: "1kWあたり2万円 (上限10万円程度)", battery: "1kWhあたり2万円 (上限10万円程度)", note: "大阪市や堺市など、大都市圏でHHEMSや蓄電システムの連携を条件に最大10万円の手厚い支援があります。", solarRate: 20000, solarMax: 100000, batteryRate: 20000, batteryMax: 100000 },
  hyogo: { name: "兵庫県", solar: "1kWあたり1.5万円 (上限6万円程度)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "神戸市や姫路市などで「スマートライフ導入支援」があり、日本海側と瀬戸内海側での気候特性の使い分けが重要です。", solarRate: 15000, solarMax: 60000, batteryRate: 12000, batteryMax: 60000 },
  nara: { name: "奈良県", solar: "1kWあたり1.5万円 (上限6万円程度)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "奈良市や橿原市などで歴史的景観地区以外での設置に対し、一般的なスマートハウス加算が適用されます。", solarRate: 15000, solarMax: 60000, batteryRate: 12000, batteryMax: 60000 },
  wakayama: { name: "和歌山県", solar: "1kWあたり1.5万円 (上限6万円程度)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "和歌山市や田辺市などで補助金があり、南紀エリアの非常に強い台風・風害に耐える頑丈な補強施工が必須です。", solarRate: 15000, solarMax: 60000, batteryRate: 12000, batteryMax: 60000 },
  tottori: { name: "鳥取県", solar: "一律5万円程度 (自治体補助のみ)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "鳥取市などの補助金があり、日本海側特有の積雪と冬季の曇天をカバーする高効率パネル選定がカギです。", solarRate: 12000, solarMax: 50000, batteryRate: 12000, batteryMax: 60000 },
  shimane: { name: "島根県", solar: "一律5万円程度 (自治体補助のみ)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "松江市や出雲市など、潮風を受ける沿岸部ではモジュールおよび架台の耐塩害仕様の有無が交付に影響することがあります。", solarRate: 12000, solarMax: 50000, batteryRate: 12000, batteryMax: 60000 },
  okayama: { name: "岡山県", solar: "1kWあたり1.5万円 (上限6万円程度)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "「晴れの国」岡山は温暖で雨が非常に少なく、年間の平均日照量が多いため太陽光発電には最強クラスの好立地です。", solarRate: 15000, solarMax: 60000, batteryRate: 12000, batteryMax: 60000 },
  hiroshima: { name: "広島県", solar: "1kWあたり1.5万〜2万円 (上限8万円)", battery: "1kWhあたり1.5万円 (上限7万円)", note: "広島市や福山市において、独自の省エネ設備導入補助金が毎年先着順で予算が組まれています。", solarRate: 18000, solarMax: 80000, batteryRate: 15000, batteryMax: 70000 },
  yamaguchi: { name: "山口県", solar: "1kWあたり1.5万円 (上限6万円程度)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "下関市や山口市などのスマートハウス支援があり、国内大手長州産業の創業地として施工ネットワークが特に強固です。", solarRate: 15000, solarMax: 60000, batteryRate: 12000, batteryMax: 60000 },
  tokushima: { name: "徳島県", solar: "1kWあたり1.5万円 (上限6万円程度)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "徳島市などのスマートハウス導入支援があり、温暖な瀬戸内気候を活かした高い年間売電利回りが魅力です。", solarRate: 15000, solarMax: 60000, batteryRate: 12000, batteryMax: 60000 },
  kagawa: { name: "香川県", solar: "1kWあたり1.5万円 (上限6万円程度)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "高松市などの助成金があり、台風の通過が比較的少なく日照が安定しているため安定運用に適しています。", solarRate: 15000, solarMax: 60000, batteryRate: 12000, batteryMax: 60000 },
  ehime: { name: "愛媛県", solar: "1kWあたり1.5万円 (上限6万円程度)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "松山市や新居浜市でスマート化補助があり、みかん畑と同様に非常に優れた日当たりを活かした発電が期待できます。", solarRate: 15000, solarMax: 60000, batteryRate: 12000, batteryMax: 60000 },
  kochi: { name: "高知県", solar: "1kWあたり1.8万円 (上限8万円程度)", battery: "1kWhあたり1.5万円 (上限8万円程度)", note: "高知市などで手厚いクリーンエネルギー助成があり、夏場の強烈な日差しによる発電熱ダレ防止の「高温耐性」パネルが有効です。", solarRate: 18000, solarMax: 80000, batteryRate: 15000, batteryMax: 80000 },
  fukuoka: { name: "福岡県", solar: "1kWあたり1.5万円 (上限6万円程度)", battery: "1kWhあたり1万円 (上限5万円程度)", note: "北九州市や福岡市など、各市区町村ごとの独自上乗せが盛んで、予算到達が早いため春先の申請が推奨されます。", solarRate: 15000, solarMax: 60000, batteryRate: 10000, batteryMax: 50000 },
  saga: { name: "佐賀県", solar: "1kWあたり1.5万円 (上限6万円程度)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "佐賀市などで創エネ補助金があり、平坦な佐賀平野エリアでの遮蔽物の少ない屋根環境での高発電が期待されます。", solarRate: 15000, solarMax: 60000, batteryRate: 12000, batteryMax: 60000 },
  nagasaki: { name: "長崎県", solar: "1kWあたり1.5万円 (上限6万円程度)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "長崎市や佐世保市などの補助金があり、坂の多い地形による日影の影響や、塩害仕様の必要性を事前チェックしてください。", solarRate: 15000, solarMax: 60000, batteryRate: 12000, batteryMax: 60000 },
  kumamoto: { name: "熊本県", solar: "1kWあたり1.5万円 (上限6万円程度)", battery: "1kWhあたり1.5万円 (上限8万円程度)", note: "熊本市や八代市などで手厚い省エネ補助金があり、阿蘇周辺のカルデラ気候と強烈な日差しを活かした自家消費が活発です。", solarRate: 15000, solarMax: 60000, batteryRate: 15000, batteryMax: 80000 },
  oita: { name: "大分県", solar: "1kWあたり1.5万円 (上限6万円程度)", battery: "1kWhあたり1.2万円 (上限6万円程度)", note: "大分市や別府市などでエコ補助金があり、温泉地特有の硫黄ガスによる腐食対策（高耐久モジュール）が推奨されます。", solarRate: 15000, solarMax: 60000, batteryRate: 12000, batteryMax: 60000 },
  miyazaki: { name: "宮崎県", solar: "1kWあたり1.8万円 (上限8万円程度)", battery: "1kWhあたり1.5万円 (上限8万円程度)", note: "「日向の国」宮崎は、全国屈指の長い日照時間を誇ります。太陽光の年間総発電量は全国トップレベルでROIも抜群です。", solarRate: 18000, solarMax: 80000, batteryRate: 15000, batteryMax: 80000 },
  kagoshima: { name: "鹿児島県", solar: "1kWあたり1.5万円 (上限6万円程度)", battery: "1kWhあたり1.5万円 (上限8万円程度)", note: "鹿児島市などで手厚い上乗せ補助があります。桜島の【火山灰】対策として、ガラス表面に親水・防汚加工が施されたモジュール選定や定期的な清掃考慮が強く推奨されます。", solarRate: 15000, solarMax: 60000, batteryRate: 15000, batteryMax: 80000 },
  okinawa: { name: "沖縄県", solar: "1kWあたり約1.5万円 (上限6万円程度)", battery: "1kWhあたり1.5万円 (上限8万円程度)", note: "塩害対策（重耐塩害仕様のパネル・パワーコンディショナ）が補助交付の必須条件となる場合があります。", solarRate: 15000, solarMax: 60000, batteryRate: 15000, batteryMax: 80000 }
};
