const STORAGE_KEY = "ihms-classroom-now-v1";
const HK = "Asia/Hong_Kong";
const LEVEL_LABEL = { good: "很舒服", ok: "還可以", bad: "要留意", none: "未有讀數" };
const TONE_TITLE = {
  none: "等待讀數",
  good: "課室現在很舒服",
  ok: "課室大致舒服",
  bad: "有讀數要留意",
};

const METRICS = [
  {
    key: "temperature",
    name: "溫度",
    short: "熱不熱",
    unit: "°C",
    decimals: 1,
    color: "#ef6b4a",
    tint: "#fff1ec",
    field: 1,
    eps: 0.3,
    icon: "temp",
    widget: "spark",
    valid: (v) => v > -5 && v < 55,
    bands: [
      { level: "good", text: "20–25.5°C", test: (v) => v >= 20 && v < 25.5 },
      { level: "ok", text: "18–20°C 或 25.5–28°C", test: (v) => (v >= 18 && v < 20) || (v >= 25.5 && v <= 28) },
      { level: "bad", text: "低於 18°C 或高於 28°C", test: () => true },
    ],
    advice: {
      good: "溫度很舒服，適合上課。",
      ok: "溫度有一點偏冷或偏熱，可以告訴老師。",
      bad: "溫度不太舒服，請告訴老師調節冷氣。",
    },
    about: "告訴我們課室熱不熱。大約 20 至 25.5 度，上課最舒服。",
    action: "不舒服就告訴老師調節冷氣，不要自己亂按很多掣。",
  },
  {
    key: "humidity",
    name: "濕度",
    short: "乾不乾",
    unit: "%",
    decimals: 0,
    color: "#3d8bfd",
    tint: "#eaf3ff",
    field: 2,
    eps: 2,
    icon: "hum",
    widget: "arc",
    valid: (v) => v > 0 && v <= 100,
    bands: [
      { level: "good", text: "40–70%", test: (v) => v >= 40 && v < 70 },
      { level: "ok", text: "30–40% 或 70–80%", test: (v) => (v >= 30 && v < 40) || (v >= 70 && v <= 80) },
      { level: "bad", text: "低於 30% 或高於 80%", test: () => true },
    ],
    advice: {
      good: "濕度很舒服，不會太乾，也不會太潮。",
      ok: "空氣有一點乾或有一點潮，可以告訴老師。",
      bad: "濕度不太舒服，請告訴老師。",
    },
    about: "告訴我們空氣乾不乾、潮不潮。太乾會不舒服，太潮也會悶。",
    action: "太潮或太乾都可以告訴老師。",
  },
  {
    key: "pm25",
    name: "PM2.5",
    short: "微細灰塵",
    unit: "µg/m³",
    decimals: 1,
    color: "#1f9d62",
    tint: "#e8f8ef",
    field: 3,
    eps: 2,
    icon: "pm",
    widget: "slider",
    valid: (v) => v >= 0 && v <= 1000,
    bands: [
      { level: "good", text: "15 或以下", test: (v) => v <= 15 },
      { level: "ok", text: "16–35", test: (v) => v <= 35 },
      { level: "bad", text: "高於 35", test: () => true },
    ],
    advice: {
      good: "微細懸浮粒子不多，空氣算清新。",
      ok: "空氣中的微塵有一點多，可以告訴老師。",
      bad: "微塵比較多，請告訴老師看看要不要關窗。",
    },
    about: "空氣中很細的灰塵，眼睛看不到。數值愈低，空氣愈清新。",
    action: "數值高時告訴老師。向著馬路的窗，不一定要長開。",
  },
  {
    key: "co2",
    name: "二氧化碳",
    short: "空氣新不新鮮",
    unit: "ppm",
    decimals: 0,
    color: "#1aa37a",
    tint: "#e7f8f1",
    field: 4,
    eps: 15,
    icon: "co2",
    widget: "line",
    valid: (v) => v >= 350 && v <= 5000,
    bands: [
      { level: "good", text: "低於 800 ppm", test: (v) => v < 800 },
      { level: "ok", text: "800–1000 ppm", test: (v) => v <= 1000 },
      { level: "bad", text: "高於 1000 ppm", test: () => true },
    ],
    advice: {
      good: "二氧化碳很舒服，空氣仍然新鮮。",
      ok: "二氧化碳有一點高，空氣沒有那麼新鮮。可以告訴老師開一扇窗。",
      bad: "二氧化碳比較高，課室有點悶。請告訴老師開窗或開門。",
    },
    about: "人多，或門窗關太久，這個數字會升高，空氣就會變悶。",
    action: "數字升高就開一點窗，讓新鮮空氣進來。",
  },
  {
    key: "tvoc",
    name: "TVOC",
    short: "氣味氣體",
    unit: "ppb",
    decimals: 0,
    color: "#e09a12",
    tint: "#fff6e4",
    field: 5,
    eps: 15,
    icon: "tvoc",
    widget: "bars",
    valid: (v) => v >= 0 && v <= 20000,
    bands: [
      { level: "good", text: "低於 200 ppb", test: (v) => v < 200 },
      { level: "ok", text: "200–400 ppb", test: (v) => v <= 400 },
      { level: "bad", text: "高於 400 ppb", test: () => true },
    ],
    advice: {
      good: "氣味氣體不多，空氣很清爽。",
      ok: "空氣中的氣味有一點多，可以告訴老師。",
      bad: "氣味氣體比較多，請告訴老師開窗。",
    },
    about: "記號筆、清潔劑或新家具，都可能放出這些氣體。",
    action: "氣味重時開窗，並把記號筆蓋好。",
  },
  {
    key: "noise",
    name: "噪音",
    short: "安不安靜",
    unit: "dB",
    decimals: 0,
    color: "#e25b8a",
    tint: "#ffeff4",
    field: 6,
    eps: 3,
    icon: "noise",
    widget: "ring",
    valid: (v) => v > 0 && v <= 140,
    bands: [
      { level: "good", text: "60 dB 或以下", test: (v) => v <= 60 },
      { level: "ok", text: "61–75 dB", test: (v) => v <= 75 },
      { level: "bad", text: "高於 75 dB", test: () => true },
    ],
    advice: {
      good: "課室算安靜，大家聽得清楚。",
      ok: "課室有點熱鬧，我們可以把聲音放輕。",
      bad: "課室太吵了，請安靜一點，並告訴老師。",
    },
    about: "告訴我們課室安不安靜。上課時大約 60 分貝以下比較舒服。",
    action: "太吵時，我們把聲音放輕一點。",
  },
];

const ICONS = {
  temp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10 14.5a4 4 0 1 0 4 0V6a2 2 0 1 0-4 0z"/><path d="M12 11V7"/></svg>',
  hum: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/></svg>',
  pm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="8" cy="9" r="1.4" fill="currentColor"/><circle cx="14" cy="8" r="1" fill="currentColor"/><circle cx="16" cy="14" r="1.5" fill="currentColor"/><circle cx="10" cy="15" r="1.1" fill="currentColor"/><path d="M5 19h14"/></svg>',
  co2: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M7 16a4 4 0 1 1 .5-8 5 5 0 0 1 9.5 1.5A3.5 3.5 0 1 1 17 16z"/></svg>',
  tvoc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6"/><path d="M10 3v6.2a5 5 0 1 0 4 0V3"/></svg>',
  noise: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 10h3l4-3v10l-4-3H4z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M18.5 7a7 7 0 0 1 0 10"/></svg>',
};

const DEFAULT_SETTINGS = {
  channelId: "3565648",
  readKey: "6ZI8UKCGFSWY3V0G",
  schoolName: "聖心",
  className: "5A",
  useDemo: false,
  manualMap: false,
  fields: Object.fromEntries(METRICS.map((metric) => [metric.key, metric.field])),
};

const state = {
  settings: structuredClone(DEFAULT_SETTINGS),
  source: "demo",
  error: "",
  series: {},
  latestTime: null,
  fetchedAt: null,
  channelName: "",
};

const charts = new WeakMap();
let refreshing = false;
let lastRefreshAttempt = 0;
let toastTimer = 0;

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === "class") node.className = value;
    else node.setAttribute(key, value);
  }
  for (const child of [].concat(children)) {
    if (child == null) continue;
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return node;
}

function text(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = value == null ? "" : String(value);
}

function classLabel() {
  return (state.settings.className || "5A").replace(/班$/, "");
}

function applyIdentity() {
  const school = state.settings.schoolName || "聖心";
  const label = classLabel();
  document.querySelectorAll("[data-bind='school']").forEach((node) => { node.textContent = school; });
  document.querySelectorAll("[data-bind='class']").forEach((node) => { node.textContent = label; });
  document.title = `${school}環境站 · ${label}班`;
}

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved || typeof saved !== "object") return structuredClone(DEFAULT_SETTINGS);
    return {
      ...structuredClone(DEFAULT_SETTINGS),
      ...saved,
      fields: { ...DEFAULT_SETTINGS.fields, ...(saved.fields || {}) },
    };
  } catch {
    return structuredClone(DEFAULT_SETTINGS);
  }
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.settings));
}

function hkParts(date) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: HK,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const map = {};
  for (const part of fmt.formatToParts(date)) {
    if (part.type !== "literal") map[part.type] = part.value;
  }
  if (map.hour === "24") map.hour = "00";
  return map;
}

function atHK(year, month, day, hour, minute) {
  const pad = (n) => String(n).padStart(2, "0");
  return new Date(`${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00+08:00`);
}

function clockParts(date) {
  const map = {};
  for (const part of new Intl.DateTimeFormat("zh-HK", {
    timeZone: HK,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).formatToParts(date)) {
    if (part.type !== "literal") map[part.type] = part.value;
  }
  return {
    hour: map.hour || "--",
    minute: map.minute || "--",
    second: map.second || "--",
    period: map.dayPeriod || "",
    date: new Intl.DateTimeFormat("zh-HK", { timeZone: HK, month: "long", day: "numeric" }).format(date),
    weekday: new Intl.DateTimeFormat("zh-HK", { timeZone: HK, weekday: "long" }).format(date),
  };
}

function formatAxis(ts) {
  const parts = hkParts(new Date(ts));
  return `${Number(parts.month)}月${Number(parts.day)}日 ${parts.hour}:${parts.minute}`;
}

function ago(ts, now = Date.now()) {
  const seconds = Math.max(0, Math.round((now - ts) / 1000));
  if (seconds < 20) return "剛剛";
  if (seconds < 60) return `${seconds} 秒前`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} 分鐘前`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} 小時前`;
  return `${Math.round(hours / 24)} 日前`;
}

function roundTo(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function levelOf(metric, value) {
  if (value == null || Number.isNaN(value)) return "none";
  for (const band of metric.bands) {
    if (band.test(value)) return band.level;
  }
  return "bad";
}

function formatNumber(metric, value) {
  if (value == null || Number.isNaN(value)) return "—";
  return Number(value).toFixed(metric.decimals);
}

function valueText(metric, value) {
  const number = formatNumber(metric, value);
  if (number === "—") return number;
  if (metric.unit === "°C" || metric.unit === "%") return `${number}${metric.unit}`;
  return `${number} ${metric.unit}`;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function demoValue(key, hour, rand, day) {
  const wobble = rand() - 0.5;
  if (key === "temperature") return 25 + Math.sin((hour - 9) / 2) * 0.35 + wobble * 0.15 + ((day % 3) - 1) * 0.08;
  if (key === "humidity") return 53 + Math.sin(hour / 2) * 2.5 + wobble * 1.5;
  if (key === "pm25") return 6 + rand() * 5 + (hour > 10.6 && hour < 11.3 ? 9 : 0);
  if (key === "co2") return 760 + Math.min(Math.max(hour - 8, 0), 4) * 40 + wobble * 18;
  if (key === "tvoc") return 120 + (hour - 8) * 6 + rand() * 16;
  if (key === "noise") return 42 + rand() * 10 + (hour >= 12.4 && hour <= 13.05 ? 20 : 0);
  return 0;
}

function emptySeries() {
  return Object.fromEntries(METRICS.map((metric) => [metric.key, []]));
}

function buildDemo(now = new Date()) {
  const parts = hkParts(now);
  const startToday = atHK(Number(parts.year), Number(parts.month), Number(parts.day), 8, 0);
  const series = emptySeries();
  for (let t = startToday.getTime() - 2 * 86400000; t <= now.getTime(); t += 12 * 60000) {
    const date = new Date(t);
    const stamp = hkParts(date);
    const hour = Number(stamp.hour) + Number(stamp.minute) / 60;
    if (hour < 8 || hour > 16) continue;
    const rand = mulberry32(Math.floor(t / 60000));
    const day = Number(stamp.day);
    for (const metric of METRICS) {
      series[metric.key].push({
        t,
        v: roundTo(demoValue(metric.key, hour, rand, day), metric.decimals),
      });
    }
  }
  return series;
}

function latestStamp(series) {
  let max = null;
  for (const points of Object.values(series)) {
    for (const point of points) {
      if (max == null || point.t > max) max = point.t;
    }
  }
  return max;
}

function autoMap(meta) {
  const rules = [
    ["pm25", /pm\s*2|pm2\.5|懸浮/i],
    ["tvoc", /tvoc|\bvoc\b/i],
    ["co2", /co2|carbon dioxide|二氧化碳/i],
    ["noise", /noise|sound|噪音|聲/i],
    ["humidity", /hum|濕度/i],
    ["temperature", /temp|溫度/i],
  ];
  const used = new Set();
  const fields = {};
  for (const [key, pattern] of rules) {
    for (let n = 1; n <= 8; n += 1) {
      if (used.has(n)) continue;
      if (pattern.test(meta[`field${n}`] || "")) {
        fields[key] = n;
        used.add(n);
        break;
      }
    }
  }
  return fields;
}

function parseFeeds(feeds, fields) {
  const series = emptySeries();
  for (const row of feeds) {
    const t = new Date(row.created_at).getTime();
    if (!Number.isFinite(t)) continue;
    for (const metric of METRICS) {
      const raw = row[`field${fields[metric.key]}`];
      if (raw == null || raw === "") continue;
      const value = Number(raw);
      if (!Number.isFinite(value)) continue;
      series[metric.key].push({ t, v: value });
    }
  }
  for (const points of Object.values(series)) points.sort((a, b) => a.t - b.t);
  return series;
}

async function fetchJson(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  try {
    const res = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    return { res, data };
  } catch (error) {
    if (error.name === "AbortError") throw new Error("連線超時，請檢查網絡。");
    throw new Error("連不上 ThingSpeak。請用網頁伺服器開啟這個頁面，不要直接雙擊檔案。");
  } finally {
    clearTimeout(timer);
  }
}

function channelUrl(id, key, feeds) {
  const params = new URLSearchParams();
  if (feeds) params.set("results", "120");
  if (key) params.set("api_key", key);
  params.set("_", String(Date.now()));
  const query = params.toString();
  const path = feeds ? "feeds.json" : ".json";
  return `https://api.thingspeak.com/channels/${id}/${path}${query ? `?${query}` : ""}`.replace("/.json", ".json");
}

async function fetchThingSpeak(id, key) {
  if (!/^\d+$/.test(id)) throw new Error("頻道編號只可以是數字。");
  const feedPack = await fetchJson(channelUrl(id, key, true));
  if (feedPack.res.status === 404) throw new Error("找不到這個頻道，請檢查編號。");
  if ([400, 401, 403].includes(feedPack.res.status) || feedPack.data === -1 || feedPack.data?.error) {
    throw new Error("讀不到數據。私人頻道要填 Read API Key。");
  }
  if (!feedPack.res.ok) throw new Error("ThingSpeak 暫時沒有回應，請稍後再試。");
  const feeds = Array.isArray(feedPack.data.feeds) ? feedPack.data.feeds : [];
  return { meta: feedPack.data.channel || {}, feeds };
}

function summarize(metric, points) {
  const valid = points.filter((point) => metric.valid(point.v));
  const latest = valid.at(-1);
  return { value: latest ? latest.v : null, valid };
}

function evaluate(now = Date.now()) {
  return METRICS.map((metric) => {
    const points = state.series[metric.key] || [];
    const summary = summarize(metric, points);
    return { metric, points, ...summary, level: summary.value == null ? "none" : levelOf(metric, summary.value) };
  });
}

function overall(rows) {
  const rated = rows.filter((row) => row.level !== "none");
  const good = rated.filter((row) => row.level === "good").length;
  const ok = rated.filter((row) => row.level === "ok").length;
  const bad = rated.filter((row) => row.level === "bad").length;
  let tone = "none";
  if (bad) tone = "bad";
  else if (ok) tone = "ok";
  else if (good) tone = "good";
  return { total: rated.length, good, ok, bad, tone };
}

function buildTips(rows, tone) {
  if (tone === "none") return ["還未收到讀數。請檢查 micro:bit 雲板有沒有開機，並已把數據送到 ThingSpeak。"];
  const flagged = rows.filter((row) => row.level === "ok" || row.level === "bad");
  if (!flagged.length) {
    return [
      "課室現在很舒服，適合上課。",
      "如果二氧化碳慢慢升高，可以告訴老師開一點窗。",
      "大家輕聲說話，噪音就會保持得更好。",
    ];
  }
  const tips = flagged.map((row) => row.metric.advice[row.level]);
  if (tips.length < 3) tips.push("其他讀數都在舒服範圍。");
  return tips.slice(0, 3);
}

function icon(name) {
  const span = document.createElement("span");
  span.className = "bubble";
  span.innerHTML = ICONS[name];
  return span;
}

function buildShells() {
  const metrics = document.getElementById("metric-grid");
  for (const metric of METRICS) {
    const card = el("article", { class: "card metric", id: `metric-${metric.key}` });
    card.style.setProperty("--accent", metric.color);
    card.style.setProperty("--tint", metric.tint);
    const top = el("div", { class: "metric-top" });
    top.append(icon(metric.icon));
    top.append(el("div", { class: "metric-name" }, metric.name));
    card.append(top);
    card.append(el("div", { class: "metric-value", id: `value-${metric.key}` }, "—"));
    const plot = el("div", { class: "plot plot-sm", "data-chart": metric.key });
    card.append(plot);
    card.append(el("div", { class: "metric-status", id: `pill-${metric.key}` }, "—"));
    metrics.append(card);
    watchPlot(plot);
  }
}

const plotObserver = new ResizeObserver((entries) => {
  for (const entry of entries) drawChart(entry.target);
});

function watchPlot(plot) {
  plotObserver.observe(plot);
}

function svgNode(parent, name, attrs) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", name);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  parent.append(node);
  return node;
}

function drawWidget(plot, spec) {
  const { points, metric } = spec;
  plot.querySelector(".empty")?.remove();
  if (!points.length) {
    plot.querySelector("svg")?.remove();
    if (!plot.querySelector(".empty")) plot.append(el("p", { class: "empty" }, "未有讀數"));
    return;
  }
  let svg = plot.querySelector("svg");
  if (!svg) {
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    plot.append(svg);
  }
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.replaceChildren();
  const value = points[points.length - 1].v;
  const track = "#efeae4";
  if (metric.widget === "arc") {
    svg.setAttribute("viewBox", "0 0 140 78");
    const cx = 70;
    const cy = 66;
    const radius = 42;
    const steps = 48;
    const pts = [];
    for (let i = 0; i <= steps; i += 1) {
      const angle = Math.PI - (i / steps) * Math.PI;
      pts.push([cx + radius * Math.cos(angle), cy - radius * Math.sin(angle)]);
    }
    let length = 0;
    const d = pts.map((point, index) => {
      if (index) length += Math.hypot(point[0] - pts[index - 1][0], point[1] - pts[index - 1][1]);
      return `${index ? "L" : "M"}${point[0].toFixed(1)} ${point[1].toFixed(1)}`;
    }).join(" ");
    const pct = Math.min(1, Math.max(0, value / 100));
    svgNode(svg, "path", { d, fill: "none", stroke: track, "stroke-width": 11, "stroke-linecap": "round", "stroke-linejoin": "round" });
    svgNode(svg, "path", {
      d,
      fill: "none",
      stroke: metric.color,
      "stroke-width": 11,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-dasharray": `${(length * pct).toFixed(2)} ${length.toFixed(2)}`,
    });
    return;
  }
  if (metric.widget === "slider") {
    svg.setAttribute("viewBox", "0 0 140 48");
    const pct = Math.min(1, Math.max(0, value / 35));
    const x = 18 + pct * 104;
    svgNode(svg, "line", { x1: 16, x2: 124, y1: 24, y2: 24, stroke: track, "stroke-width": 4, "stroke-linecap": "round" });
    svgNode(svg, "circle", { cx: x, cy: 24, r: 9, fill: "#e5f6ec" });
    svgNode(svg, "circle", { cx: x, cy: 24, r: 5.5, fill: metric.color });
    return;
  }
  if (metric.widget === "bars") {
    svg.setAttribute("viewBox", "0 0 140 64");
    const recent = points.slice(-10);
    const min = Math.min(...recent.map((point) => point.v));
    const max = Math.max(...recent.map((point) => point.v));
    const span = Math.max(1, max - min);
    const gap = 5;
    const width = 8;
    const total = recent.length * width + (recent.length - 1) * gap;
    let x = (140 - total) / 2;
    recent.forEach((point) => {
      const height = max === min ? 28 : 14 + ((point.v - min) / span) * 34;
      svgNode(svg, "rect", {
        x: x.toFixed(1),
        y: (56 - height).toFixed(1),
        width,
        height: height.toFixed(1),
        rx: 3,
        fill: metric.color,
      });
      x += width + gap;
    });
    return;
  }
  if (metric.widget === "ring") {
    svg.setAttribute("viewBox", "0 0 88 88");
    const radius = 28;
    const length = 2 * Math.PI * radius;
    const pct = Math.min(1, Math.max(0, value / 100));
    svgNode(svg, "circle", { cx: 44, cy: 44, r: radius, fill: "none", stroke: "#f6e8ee", "stroke-width": 10 });
    svgNode(svg, "circle", {
      cx: 44,
      cy: 44,
      r: radius,
      fill: "none",
      stroke: metric.color,
      "stroke-width": 10,
      "stroke-linecap": "round",
      "stroke-dasharray": `${(length * pct).toFixed(2)} ${(length * (1 - pct)).toFixed(2)}`,
      transform: "rotate(128 44 44)",
    });
  }
}

function drawChart(plot, attempt = 0) {
  const spec = charts.get(plot);
  if (!spec) return;
  if (spec.compact && spec.metric.widget && spec.metric.widget !== "spark" && spec.metric.widget !== "line") {
    drawWidget(plot, spec);
    return;
  }
  const width = plot.clientWidth;
  if (width < 20) {
    if (attempt < 8) requestAnimationFrame(() => drawChart(plot, attempt + 1));
    return;
  }
  const { points, metric, compact } = spec;
  let svg = plot.querySelector("svg");
  let tip = plot.querySelector(".chart-tip");
  plot.querySelector(".empty")?.remove();
  if (!points.length) {
    svg?.remove();
    if (tip) tip.hidden = true;
    if (!plot.querySelector(".empty")) plot.append(el("p", { class: "empty" }, "未有讀數"));
    plot._layout = null;
    return;
  }
  if (!svg) {
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    plot.append(svg);
  }
  if (!compact && !tip) {
    tip = el("div", { class: "chart-tip", hidden: "hidden" });
    plot.append(tip);
  }
  const height = compact ? 48 : 200;
  const pad = compact ? { l: 2, r: 2, t: 6, b: 6 } : { l: 46, r: 10, t: 12, b: 26 };
  const innerW = Math.max(1, width - pad.l - pad.r);
  const innerH = Math.max(1, height - pad.t - pad.b);
  const dataMin = Math.min(...points.map((point) => point.v));
  const dataMax = Math.max(...points.map((point) => point.v));
  let min = dataMin;
  let max = dataMax;
  if (min === max) { min -= 1; max += 1; }
  const slack = (max - min) * 0.18;
  min -= slack;
  max += slack;
  const t0 = points[0].t;
  const t1 = points[points.length - 1].t;
  const spanT = Math.max(1, t1 - t0);
  const xOf = (t) => pad.l + ((t - t0) / spanT) * innerW;
  const yOf = (v) => pad.t + (1 - (v - min) / (max - min)) * innerH;
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", compact ? "xMidYMid meet" : "none");
  svg.replaceChildren();
  const add = (name, attrs) => {
    const node = document.createElementNS("http://www.w3.org/2000/svg", name);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    svg.append(node);
    return node;
  };
  if (!compact) {
    [dataMax, (dataMax + dataMin) / 2, dataMin].forEach((tick) => {
      const y = yOf(tick);
      add("line", { x1: pad.l, x2: width - pad.r, y1: y, y2: y, stroke: "#e6eaf2", "stroke-width": 1 });
      add("text", {
        x: pad.l - 6,
        y: y + 4,
        "text-anchor": "end",
        fill: "#8b93a7",
        "font-size": 11,
      }).textContent = formatNumber(metric, tick);
    });
    const labels = width < 280 ? [t0, t1] : [t0, t0 + spanT / 2, t1];
    labels.forEach((t, index) => {
      const anchor = index === 0 ? "start" : index === labels.length - 1 ? "end" : "middle";
      const x = index === 0 ? pad.l : index === labels.length - 1 ? width - pad.r : xOf(t);
      add("text", {
        x,
        y: height - 6,
        "text-anchor": anchor,
        fill: "#8b93a7",
        "font-size": 11,
      }).textContent = formatAxis(t);
    });
  }
  if (compact && metric.widget === "line") {
    const guide = yOf((dataMin + dataMax) / 2);
    add("line", {
      x1: pad.l,
      x2: width - pad.r,
      y1: guide,
      y2: guide,
      stroke: "#d5e0e8",
      "stroke-width": 1.2,
      "stroke-dasharray": "2.5 3.5",
    });
  }
  const gap = 45 * 60 * 1000;
  let segment = [];
  const flush = () => {
    if (!segment.length) return;
    const line = segment.map((point, index) => `${index ? "L" : "M"}${xOf(point.t).toFixed(1)},${yOf(point.v).toFixed(1)}`).join(" ");
    const bottom = (pad.t + innerH).toFixed(1);
    if (!(compact && metric.widget === "line")) {
      add("path", {
        d: `${line} L${xOf(segment[segment.length - 1].t).toFixed(1)},${bottom} L${xOf(segment[0].t).toFixed(1)},${bottom} Z`,
        fill: metric.color,
        opacity: "0.16",
      });
    }
    if (segment.length === 1) {
      add("circle", { cx: xOf(segment[0].t), cy: yOf(segment[0].v), r: compact ? 2.5 : 3.5, fill: metric.color });
    } else {
      add("path", {
        d: line,
        fill: "none",
        stroke: metric.color,
        "stroke-width": compact ? 2 : 2.5,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      });
    }
    segment = [];
  };
  for (const point of points) {
    const prev = segment[segment.length - 1];
    if (prev && point.t - prev.t > gap) flush();
    segment.push(point);
  }
  flush();
  if (points.length) {
    const last = points[points.length - 1];
    add("circle", {
      cx: xOf(last.t),
      cy: yOf(last.v),
      r: compact ? 3 : 4,
      fill: compact ? metric.color : "#fff",
      stroke: metric.color,
      "stroke-width": compact ? 0 : 2,
    });
  }
  plot._layout = { points, xOf, yOf, width, height, metric, compact };
  if (!plot.dataset.bound) {
    plot.dataset.bound = "1";
    plot.addEventListener("mousemove", onChartMove);
    plot.addEventListener("mouseleave", () => {
      const node = plot.querySelector(".chart-tip");
      if (node) node.hidden = true;
    });
  }
}

function countGaps(points) {
  let gaps = 0;
  for (let i = 1; i < points.length; i += 1) {
    if (points[i].t - points[i - 1].t > 45 * 60 * 1000) gaps += 1;
  }
  return gaps;
}

function onChartMove(event) {
  const layout = event.currentTarget._layout;
  const tip = event.currentTarget.querySelector(".chart-tip");
  if (!layout || layout.compact || !tip || !layout.points.length) return;
  const rect = event.currentTarget.getBoundingClientRect();
  const px = ((event.clientX - rect.left) / rect.width) * layout.width;
  let best = null;
  let bestDist = Infinity;
  for (const point of layout.points) {
    const dist = Math.abs(layout.xOf(point.t) - px);
    if (dist < bestDist) {
      bestDist = dist;
      best = point;
    }
  }
  if (!best || bestDist > 28) {
    tip.hidden = true;
    return;
  }
  tip.hidden = false;
  tip.textContent = `${formatAxis(best.t)} · ${valueText(layout.metric, best.v)}`;
  tip.style.left = `${(layout.xOf(best.t) / layout.width) * rect.width}px`;
  tip.style.top = `${Math.max(32, (layout.yOf(best.v) / layout.height) * rect.height)}px`;
}

function setChart(plot, points, metric, compact) {
  const valid = points.filter((point) => metric.valid(point.v));
  charts.set(plot, { points: valid, metric, compact });
  drawChart(plot);
}

function renderRing(summary) {
  const ring = document.getElementById("ring");
  const color = summary.tone === "bad" ? "#e15b64" : summary.tone === "none" ? "#c5ccd8" : "#1aaa72";
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  const pct = summary.total ? summary.good / summary.total : 0;
  const dash = (circ * pct).toFixed(2);
  const gap = (circ - circ * pct).toFixed(2);
  const label = summary.total ? `${summary.good}/${summary.total}` : "—";
  ring.replaceChildren();
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 96 96");
  svg.setAttribute("width", "96");
  svg.setAttribute("height", "96");
  const track = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  track.setAttribute("cx", "48");
  track.setAttribute("cy", "48");
  track.setAttribute("r", String(radius));
  track.setAttribute("fill", "none");
  track.setAttribute("stroke", "#e7ebf3");
  track.setAttribute("stroke-width", "8");
  const arc = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  arc.setAttribute("cx", "48");
  arc.setAttribute("cy", "48");
  arc.setAttribute("r", String(radius));
  arc.setAttribute("fill", "none");
  arc.setAttribute("stroke", color);
  arc.setAttribute("stroke-width", "8");
  arc.setAttribute("stroke-linecap", "round");
  arc.setAttribute("stroke-dasharray", `${dash} ${gap}`);
  arc.setAttribute("transform", "rotate(-90 48 48)");
  const labelNode = document.createElementNS("http://www.w3.org/2000/svg", "text");
  labelNode.setAttribute("x", "48");
  labelNode.setAttribute("y", "53");
  labelNode.setAttribute("text-anchor", "middle");
  labelNode.setAttribute("font-size", "16");
  labelNode.setAttribute("font-weight", "700");
  labelNode.setAttribute("fill", "#1c2434");
  labelNode.textContent = label;
  svg.append(track, arc, labelNode);
  ring.append(svg);
}

function chartFoot(metric, points) {
  if (!points.length) return "未有可用讀數";
  const min = Math.min(...points.map((point) => point.v));
  const max = Math.max(...points.map((point) => point.v));
  let note = `最低 ${valueText(metric, min)} · 最高 ${valueText(metric, max)}`;
  if (countGaps(points) > 0) note += " · 斷開表示中間沒有讀數";
  return note;
}

function render() {
  const now = Date.now();
  const rows = evaluate(now);
  const summary = overall(rows);
  const label = classLabel();

  const banner = document.getElementById("banner");
  const showBanner = state.source !== "live" || Boolean(state.error);
  banner.hidden = !showBanner;
  banner.classList.toggle("is-error", Boolean(state.error));
  if (showBanner) {
    const demoCopy = `現在是 ${label} 班的示範畫面，方便先看版面。連接 ThingSpeak 後，溫度、濕度、PM2.5、二氧化碳、TVOC 和噪音會改為 micro:bit 雲板的真實讀數。`;
    text("#banner-text", state.error ? `${state.error}${state.source === "demo" ? " 暫時仍顯示示範數據。" : ""}` : demoCopy);
    text("#banner-action", state.error ? "檢查設定" : "連接 ThingSpeak");
  }

  const online = rows.filter((row) => row.value != null).length;
  const livePill = document.getElementById("live-pill");
  livePill.classList.remove("is-live", "is-demo", "is-loading");
  if (state.source === "live") {
    livePill.classList.add("is-live");
    text("#live-pill-text", online === METRICS.length ? "micro:bit 連線中 · 6 個感測器正常" : `micro:bit 連線中 · ${online} 個感測器有讀數`);
    text("#open-settings", "老師設定");
  } else if (state.source === "loading") {
    livePill.classList.add("is-loading");
    text("#live-pill-text", "正在讀取");
    text("#open-settings", "老師設定");
  } else {
    livePill.classList.add("is-demo");
    text("#live-pill-text", "示範數據");
    text("#open-settings", "老師設定");
  }

  const scene = situation(rows, summary);
  const roomTitle = document.getElementById("room-title");
  roomTitle.textContent = scene.title;
  roomTitle.className = `lead is-${summary.tone}`;
  text("#room-detail", scene.detail);
  text("#dock-text", scene.dock);

  for (const row of rows) {
    const pill = document.getElementById(`pill-${row.metric.key}`);
    pill.textContent = LEVEL_LABEL[row.level];
    pill.className = `metric-status ${row.level}`;
    const value = document.getElementById(`value-${row.metric.key}`);
    value.textContent = "";
    value.append(formatNumber(row.metric, row.value));
    if (row.value != null) value.append(el("span", { class: "metric-unit" }, row.metric.unit === "°C" || row.metric.unit === "%" ? row.metric.unit : ` ${row.metric.unit}`));
    value.title = "ThingSpeak 最新一筆讀數";
    setChart(document.querySelector(`#metric-${row.metric.key} .plot`), row.points, row.metric, true);
  }

  renderRing(summary);
  text("#score-title", watchPhrase(rows, summary));
  text("#score-detail", highlightLine(rows));
  const tipList = document.getElementById("tips");
  tipList.replaceChildren();
  scene.tips.forEach((tip, index) => {
    tipList.append(el("li", {}, [el("span", {}, index + 1), el("div", {}, tip)]));
  });

  const link = document.getElementById("channel-link");
  if (state.source === "live" && state.settings.channelId) {
    text("#channel-note", state.channelName ? `已連接頻道「${state.channelName}」。` : `已連接頻道 ${state.settings.channelId}。`);
    link.hidden = false;
    link.href = `https://thingspeak.com/channels/${state.settings.channelId}`;
  } else if (state.source === "loading") {
    text("#channel-note", "正在連接 ThingSpeak…");
    link.hidden = true;
  } else {
    text("#channel-note", "未連接。預設對應 Field 1 溫度、2 濕度、3 PM2.5、4 二氧化碳、5 TVOC、6 噪音。");
    link.hidden = true;
  }
  tickClock();
}

function sensorLine() {
  if (state.source === "loading") return "正在讀取";
  if (state.source === "demo") return "尚未連接感測器";
  if (!state.latestTime) return "最後量度 —";
  const parts = hkParts(new Date(state.latestTime));
  const when = `${parts.hour}:${parts.minute}`;
  if (Date.now() - state.latestTime > 30 * 60 * 1000) return `最後量度 ${when}（可能休息了）`;
  return `最後量度 ${when}`;
}

function zhCount(n) {
  return ["零", "一", "兩", "三", "四", "五", "六", "七", "八"][n] || String(n);
}

function situation(rows, summary) {
  if (!summary.total) {
    return {
      title: "等待讀數",
      detail: "還未收到讀數。雲板開機後，數字會出現在下面。",
      dock: "等待雲板送來讀數。",
      tips: ["還未收到讀數。請檢查 micro:bit 雲板有沒有開機，並已把數據送到 ThingSpeak。"],
    };
  }
  const notes = {
    temperature: {
      high: {
        ok: ["課室有點熱", "溫度高了一點，注意不要太焗", "告訴老師把冷氣調低一點，其他都很好。", "溫度高了一點，注意不要太焗，可以告訴老師看看冷氣。"],
        bad: ["課室比較熱", "溫度比較高，小心不要焗著", "請告訴老師把冷氣調低一點。", "課室比較熱，請告訴老師調節冷氣，不要自己亂按很多掣。"],
      },
      low: {
        ok: ["課室有點涼", "溫度低了一點", "告訴老師把冷氣調暖一點，其他都很好。", "溫度低了一點，可以告訴老師把冷氣調暖。"],
        bad: ["課室比較冷", "溫度比較低", "請告訴老師把冷氣調暖一點。", "課室比較冷，請告訴老師把冷氣調暖，不要自己亂按很多掣。"],
      },
    },
    humidity: {
      high: {
        ok: ["空氣有點潮", "濕度高了一點", "可以告訴老師，其他都很好。", "空氣有點潮，可以告訴老師。"],
        bad: ["空氣比較潮", "濕度比較高", "請告訴老師看看濕度。", "空氣比較潮，請告訴老師。"],
      },
      low: {
        ok: ["空氣有點乾", "濕度低了一點", "可以告訴老師，其他都很好。", "空氣有點乾，可以告訴老師。"],
        bad: ["空氣比較乾", "濕度比較低", "請告訴老師看看濕度。", "空氣比較乾，請告訴老師。"],
      },
    },
    pm25: {
      high: {
        ok: ["微塵有點多", "PM2.5 高了一點", "可以告訴老師，向馬路的窗不一定要長開。", "微塵有點多，可以告訴老師。向著馬路的窗，不一定要長開。"],
        bad: ["微塵比較多", "PM2.5 比較高", "請告訴老師看看要不要關窗。", "微塵比較多，請告訴老師看看要不要關窗。"],
      },
    },
    co2: {
      high: {
        ok: ["課室要透透氣", "二氧化碳高了一點，可以通一下風", "開一點窗通風，其他都很好。", "二氧化碳高了一點，開一點窗，讓新鮮空氣進來。"],
        bad: ["課室有點悶", "二氧化碳比較高，需要通風", "請告訴老師開窗或開門。", "二氧化碳比較高，課室有點悶。請告訴老師開窗或開門。"],
      },
    },
    tvoc: {
      high: {
        ok: ["氣味有點多", "TVOC 高了一點", "開一點窗，並把記號筆蓋好。", "氣味氣體有點多，開窗，並把記號筆蓋好。"],
        bad: ["氣味比較重", "TVOC 比較高", "請告訴老師開窗。", "氣味氣體比較多，請告訴老師開窗，並把記號筆蓋好。"],
      },
    },
    noise: {
      high: {
        ok: ["課室大致舒服", "只有聲音大了一點", "把聲量放輕一點，其他都很好。", "課室有點熱鬧，我們可以把聲音放輕。"],
        bad: ["課室有點吵", "聲音比較大", "請把聲音放輕，並告訴老師。", "課室太吵了，請安靜一點，並告訴老師。"],
      },
    },
  };
  const flagged = rows.filter((row) => row.level === "ok" || row.level === "bad").map((row) => {
    let way = "high";
    if (row.metric.key === "temperature") way = row.value >= 25.5 ? "high" : "low";
    if (row.metric.key === "humidity") way = row.value >= 70 ? "high" : "low";
    const pack = notes[row.metric.key][way][row.level];
    return { row, way, title: pack[0], detail: pack[1], dock: pack[2], tip: pack[3] };
  });
  if (!flagged.length) {
    return {
      title: "課室現在很舒服",
      detail: `${zhCount(summary.total)}項讀數，全部在舒服範圍。`,
      dock: "繼續保持，課室很舒服。",
      tips: ["課室現在很舒服，適合上課。", "如果二氧化碳慢慢升高，可以告訴老師開一點窗。", "大家輕聲說話，聲音就會保持得更好。"],
    };
  }
  const order = ["co2", "temperature", "pm25", "tvoc", "humidity", "noise"];
  flagged.sort((a, b) => (a.row.level === "bad" ? 0 : 1) - (b.row.level === "bad" ? 0 : 1) || order.indexOf(a.row.metric.key) - order.indexOf(b.row.metric.key));
  let title = flagged[0].title;
  if (flagged.length > 1) {
    const hot = flagged.find((item) => item.row.metric.key === "temperature" && item.way === "high");
    const air = flagged.find((item) => item.row.metric.key === "co2");
    if (flagged.length === 2 && hot && air) title = hot.row.level === "bad" || air.row.level === "bad" ? "又熱又悶" : "有點熱，也要通風";
    else title = flagged.some((item) => item.row.level === "bad") ? "有讀數要留意" : "課室大致舒服";
  }
  const count = `${zhCount(summary.total)}項讀數`;
  const goodPart = summary.good ? `${zhCount(summary.good)}項在舒服範圍` : "暫時沒有完全在舒服範圍的讀數";
  const tips = flagged.map((item) => item.tip);
  if (summary.good) tips.push("其他讀數都在舒服範圍。");
  return {
    title,
    detail: `${count}，${goodPart}；${flagged.map((item) => item.detail).join("，")}。`,
    dock: flagged.length === 1 ? flagged[0].dock : `${flagged[0].tip.replace(/。$/, "")}，其餘也看看。`,
    tips: tips.slice(0, 4),
  };
}

function roomSentence(rows, summary) {
  if (!summary.total) return "還未收到讀數。雲板開機後，數字會出現在下面。";
  const count = `${zhCount(summary.total)}項讀數`;
  const flagged = rows.filter((row) => row.level === "ok" || row.level === "bad");
  if (!flagged.length) return `${count}，全部在舒服範圍。`;
  if (flagged.length === 1 && flagged[0].metric.key === "noise" && flagged[0].level === "ok") {
    return `${count}，${zhCount(summary.good)}項在舒服範圍；只有聲音大了一點。`;
  }
  const bits = flagged.map((row) => {
    if (row.level === "bad") return `${row.metric.name}要留意`;
    if (row.metric.key === "noise") return "聲音大了一點";
    return `${row.metric.name}還可以`;
  });
  const lead = summary.good ? `${zhCount(summary.good)}項在舒服範圍` : "暫時沒有完全在舒服範圍的讀數";
  return `${count}，${lead}；${flagged.length === 1 ? "只有" : ""}${bits.join("，")}。`;
}

function watchPhrase(rows, summary) {
  if (!summary.total) return "等待讀數";
  const bad = rows.filter((row) => row.level === "bad");
  const ok = rows.filter((row) => row.level === "ok");
  if (bad.length === 1 && !ok.length) return `一項要留意：${bad[0].metric.name}`;
  if (!bad.length && ok.length === 1) return `一項還可以：${ok[0].metric.name}`;
  if (!bad.length && !ok.length) return `${zhCount(summary.good)}項都很舒服`;
  return `${zhCount(bad.length + ok.length)}項要看看`;
}

function highlightLine(rows) {
  const co2 = rows.find((row) => row.metric.key === "co2");
  if (!co2 || co2.value == null) return "二氧化碳未有讀數";
  const value = `${formatNumber(co2.metric, co2.value)} ppm`;
  if (co2.level === "good") return `空氣清新 · ${value}`;
  if (co2.level === "ok") return `空氣還可以 · ${value}`;
  return `空氣要開窗 · ${value}`;
}

function dockSentence(rows, summary) {
  if (!summary.total) return "等待雲板送來讀數。";
  const flagged = rows.filter((row) => row.level === "ok" || row.level === "bad");
  if (!flagged.length) return "繼續保持，課室很舒服。";
  const noise = flagged.find((row) => row.metric.key === "noise");
  const others = flagged.filter((row) => row !== noise);
  if (noise && !others.length) return "把聲量放輕一點，其他都很好。";
  if (noise) return `把聲量放輕一點，${others.map((row) => row.metric.name).join("、")}也看看。`;
  const first = flagged[0];
  if (flagged.length === 1 && first.metric.key === "co2") return "開一點窗，其他都很好。";
  if (flagged.length === 1 && first.metric.key === "temperature") return "告訴老師看看冷氣，其他都很好。";
  if (flagged.length === 1) return first.metric.advice[first.level];
  return `${flagged.map((row) => row.metric.name).join("、")}要看看，其他都很好。`;
}

function tickClock() {
  const clock = clockParts(new Date());
  const parts = hkParts(new Date());
  text("#clock-hm", `${parts.hour}:${parts.minute}`);
  text("#clock-period", clock.period);
  text("#clock-date", `${clock.date} ${clock.weekday}`);
  text("#sensor-line", sensorLine());
  if (state.source === "live" || state.source === "loading") refresh();
  if (state.source === "loading") text("#update-pill-text", "讀取中");
  else if (state.source === "demo") text("#update-pill-text", "尚未連接");
  else text("#update-pill-text", state.fetchedAt ? `已更新 ${ago(state.fetchedAt)}` : "—");
}

function toast(message) {
  const node = document.getElementById("toast");
  node.textContent = message;
  node.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove("show"), 2800);
}

function fillForm() {
  const settings = state.settings;
  document.getElementById("channel-id").value = settings.channelId;
  document.getElementById("read-key").value = settings.readKey;
  document.getElementById("school-name").value = settings.schoolName;
  document.getElementById("class-name").value = settings.className;
  document.getElementById("use-demo").checked = settings.useDemo;
  document.getElementById("manual-map").checked = settings.manualMap;
  for (const metric of METRICS) {
    document.getElementById(`field-${metric.key}`).value = settings.fields[metric.key];
  }
}

function readForm() {
  const fields = {};
  for (const metric of METRICS) {
    let n = Number(document.getElementById(`field-${metric.key}`).value);
    if (!Number.isInteger(n) || n < 1 || n > 8) n = metric.field;
    fields[metric.key] = n;
  }
  const channelId = document.getElementById("channel-id").value.replace(/\D/g, "");
  const useDemo = document.getElementById("use-demo").checked || !channelId;
  return {
    channelId,
    readKey: document.getElementById("read-key").value.trim(),
    schoolName: document.getElementById("school-name").value.trim() || "聖心",
    className: document.getElementById("class-name").value.trim() || "5A",
    useDemo,
    manualMap: document.getElementById("manual-map").checked,
    fields,
  };
}

function openSettings() {
  fillForm();
  document.getElementById("form-message").textContent = "";
  document.getElementById("test-result").textContent = "";
  document.getElementById("settings").showModal();
}

async function refresh(force = false) {
  if (state.settings.useDemo || !state.settings.channelId) return;
  if (refreshing) return;
  if (!force && Date.now() - lastRefreshAttempt < 8000) return;
  lastRefreshAttempt = Date.now();
  refreshing = true;
  try {
    const { meta, feeds } = await fetchThingSpeak(state.settings.channelId, state.settings.readKey);
    let fields = { ...state.settings.fields };
    if (!state.settings.manualMap) {
      const merged = { ...fields, ...autoMap(meta) };
      if (JSON.stringify(merged) !== JSON.stringify(state.settings.fields)) {
        state.settings.fields = merged;
        saveSettings();
      }
      fields = merged;
    }
    state.series = parseFeeds(feeds, fields);
    state.channelName = meta.name || "";
    state.latestTime = latestStamp(state.series);
    state.fetchedAt = Date.now();
    state.error = "";
    state.source = "live";
    render();
  } catch (error) {
    state.error = error.message || "讀取失敗。";
    if (state.source !== "live") {
      state.source = "demo";
      state.series = buildDemo();
      state.latestTime = latestStamp(state.series);
    }
    render();
  } finally {
    refreshing = false;
  }
}

function showDemo() {
  state.source = "demo";
  state.error = "";
  state.channelName = "";
  state.series = buildDemo();
  state.latestTime = latestStamp(state.series);
  render();
}

function bindUi() {
  document.querySelectorAll("[data-open-settings]").forEach((button) => {
    button.addEventListener("click", openSettings);
  });
  document.getElementById("close-settings").addEventListener("click", () => {
    document.getElementById("settings").close();
  });
  document.getElementById("settings").addEventListener("click", (event) => {
    if (event.target.id === "settings") event.currentTarget.close();
  });
  document.getElementById("channel-id").addEventListener("input", (event) => {
    if (event.target.value.trim()) document.getElementById("use-demo").checked = false;
  });
  document.getElementById("channel-id").addEventListener("blur", (event) => {
    const match = event.target.value.match(/channels\/(\d+)/);
    event.target.value = match ? match[1] : event.target.value.replace(/\D/g, "");
  });
  document.getElementById("clear-settings").addEventListener("click", () => {
    document.getElementById("channel-id").value = "";
    document.getElementById("read-key").value = "";
    document.getElementById("use-demo").checked = true;
    document.getElementById("manual-map").checked = false;
    for (const metric of METRICS) document.getElementById(`field-${metric.key}`).value = String(metric.field);
    document.getElementById("form-message").textContent = "已清除。按儲存後會回到示範數據。";
    document.getElementById("test-result").textContent = "";
  });
  document.getElementById("test-connection").addEventListener("click", async () => {
    const next = readForm();
    const message = document.getElementById("form-message");
    const result = document.getElementById("test-result");
    message.textContent = "";
    if (!next.channelId) {
      message.textContent = "請先輸入頻道編號。";
      return;
    }
    result.textContent = "測試中…";
    try {
      const { meta, feeds } = await fetchThingSpeak(next.channelId, next.readKey);
      const detected = autoMap(meta);
      if (!next.manualMap) {
        for (const [key, n] of Object.entries(detected)) {
          const input = document.getElementById(`field-${key}`);
          if (input) input.value = String(n);
        }
      }
      const fields = next.manualMap ? next.fields : { ...next.fields, ...detected };
      const series = parseFeeds(feeds, fields);
      const lines = [`頻道名稱：${meta.name || "（沒有名稱）"}`];
      for (const metric of METRICS) {
        const n = fields[metric.key];
        const label = meta[`field${n}`] || "未命名";
        const last = series[metric.key].at(-1);
        lines.push(`${metric.name} → Field ${n}（${label}）最新 ${last ? last.v : "沒有"}`);
      }
      lines.push(`最近收到 ${feeds.length} 筆紀錄。`);
      result.textContent = lines.join("\n");
    } catch (error) {
      result.textContent = "";
      message.textContent = error.message;
    }
  });
  document.getElementById("settings-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const next = readForm();
    const message = document.getElementById("form-message");
    if (!next.useDemo && !next.channelId) {
      message.textContent = "請輸入頻道編號，或勾選使用示範數據。";
      return;
    }
    state.settings = next;
    saveSettings();
    applyIdentity();
    document.getElementById("settings").close();
    toast("已儲存設定");
    if (next.useDemo) showDemo();
    else {
      state.source = "loading";
      state.error = "";
      state.series = emptySeries();
      render();
      await refresh(true);
    }
  });
  document.getElementById("refresh-now").addEventListener("click", () => {
    if (state.settings.useDemo || !state.settings.channelId) {
      toast("示範數據不用更新。連接 ThingSpeak 後就可以讀取真實讀數。");
      return;
    }
    refresh(true);
  });
  document.querySelectorAll("[data-target]").forEach((button) => {
    button.addEventListener("click", () => {
      document.getElementById(button.dataset.target)?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.querySelectorAll("[data-target]").forEach((item) => item.classList.toggle("active", item === button));
    });
  });
  const spy = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    document.querySelectorAll("[data-target]").forEach((button) => {
      button.classList.toggle("active", button.dataset.target === visible.target.id);
    });
  }, { threshold: 0.35 });
  ["overview", "metrics"].forEach((id) => spy.observe(document.getElementById(id)));
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") refresh(true);
  });
}

function boot() {
  state.settings = loadSettings();
  const queryChannel = new URLSearchParams(location.search).get("channel") || "";
  const channel = queryChannel.replace(/\D/g, "");
  if (channel) {
    state.settings.channelId = channel;
    state.settings.useDemo = false;
    saveSettings();
  }
  applyIdentity();
  bindUi();
  buildShells();
  if (!state.settings.useDemo && state.settings.channelId) {
    state.source = "loading";
    state.series = emptySeries();
    render();
    refresh();
  } else {
    showDemo();
  }
  setInterval(tickClock, 1000);
}

boot();
