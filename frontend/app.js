/* ── Meeting Data ─────────────────────────────────── */
const CAUCUS_DATES = [
  "2026-01-13","2026-01-27","2026-02-10","2026-02-24",
  "2026-03-10","2026-03-24","2026-04-07","2026-04-21",
  "2026-05-05","2026-05-19","2026-06-09","2026-06-23",
  "2026-07-14","2026-08-11","2026-09-01","2026-09-22",
  "2026-10-06","2026-10-20","2026-11-04","2026-11-16",
  "2026-12-08","2026-12-21",
];

const REGULAR_DATES = [
  "2026-01-15","2026-01-29","2026-02-12","2026-02-26",
  "2026-03-12","2026-03-26","2026-04-09","2026-04-23",
  "2026-05-07","2026-05-21","2026-06-11","2026-06-25",
  "2026-07-16","2026-08-13","2026-09-03","2026-09-24",
  "2026-10-08","2026-10-22","2026-11-05","2026-11-16",
  "2026-12-10","2026-12-21",
];

/* ── ARF Items (extracted from PDFs) ─────────────── */
const ARF_ITEMS = [
  // ── 2025 ARFs ──
  { year:2025, num:1,  date:"2025-01-23", desc:"Fowler Maintenance", by:"JM" },
  { year:2025, num:2,  date:"2025-02-04", desc:"Pharmaceutical", by:"JM" },
  { year:2025, num:3,  date:"2025-02-05", desc:"Iglobe Automation LLC.", by:"JM" },
  { year:2025, num:4,  date:"2025-02-05", desc:"NCCHC", by:"JM" },
  { year:2025, num:5,  date:"2025-02-26", desc:"PPE Supplies (various dept)", by:"JM" },
  { year:2025, num:6,  date:"2025-03-03", desc:"North Hudson Community", by:"JM" },
  { year:2025, num:7,  date:"2025-03-03", desc:"RFQ Contract Monitor", by:"JM" },
  { year:2025, num:8,  date:"2025-03-07", desc:"Fiscal Year Re-entry Agreement for signature", by:"JM" },
  { year:2025, num:9,  date:"2025-03-18", desc:"VCS Hosting and Web Portal", by:"JM" },
  { year:2025, num:10, date:"2025-03-26", desc:"Iglobe Automation LLC.", by:"JM" },
  { year:2025, num:11, date:"2025-04-07", desc:"Copy Paper", by:"JM" },
  { year:2025, num:12, date:"2025-04-11", desc:"IGLOBE $20,000 contract", by:"JM" },
  { year:2025, num:13, date:"2025-04-21", desc:"American Correctional Association", by:"JM" },
  { year:2025, num:14, date:"2025-05-08", desc:"Personal Care Supplies", by:"JM" },
  { year:2025, num:15, date:"2025-05-12", desc:"Award for Contract Monitor - Perselay Associates", by:"JM" },
  { year:2025, num:16, date:"2025-05-13", desc:"Telephone Language Interpretation and 911", by:"JM" },
  { year:2025, num:17, date:"2025-07-15", desc:"Purchase Canvas Shoes, Sandals, Work Boots, Mugs", by:"JM" },
  { year:2025, num:18, date:"2025-08-01", desc:"Fowler Washer and Dryer Purchase", by:"JM" },
  { year:2025, num:19, date:"2025-08-12", desc:"VCS Annual Upgrade Service Plan", by:"JM" },
  { year:2025, num:20, date:"2025-08-19", desc:"PowerDMS", by:"JM" },
  { year:2025, num:21, date:"2025-08-21", desc:"Accept Grant from NJDOC $50,000", by:"JM" },
  { year:2025, num:22, date:"2025-10-09", desc:"Amending Viapath for FM radio subscription", by:"JM" },
  { year:2025, num:23, date:"2025-10-16", desc:"Award Re-Bid No. 8006 Personal Care Supplies", by:"JM" },
  // ── 2026 ARFs ──
  { year:2026, num:1,  date:"2026-01-21", desc:"Printing - Letter Head, Envelopes, and B. Card", by:"JM" },
  { year:2026, num:2,  date:"2026-02-02", desc:"Res Amendment NHCA", by:"JM" },
  { year:2026, num:3,  date:"2026-02-11", desc:"Barber Supplies", by:"JM" },
  { year:2026, num:4,  date:"2026-02-13", desc:"Flag Poles, Accessories", by:"JM" },
  { year:2026, num:5,  date:"2026-02-13", desc:"Fowler Contract", by:"JM" },
  { year:2026, num:6,  date:"2026-02-13", desc:"Medical Surgical Supply", by:"JM" },
];

const YEAR = 2026;
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

/* ── Completion Persistence ───────────────────────── */
const STORAGE_KEY_DEADLINES = "arf-deadlines-completed";
const STORAGE_KEY_ITEMS = "arf-items-completed";

function loadCompleted(key) {
  try { return JSON.parse(localStorage.getItem(key)) || {}; } catch { return {}; }
}
function saveCompleted(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function toggleCompleted(key, id, tr, btn) {
  const data = loadCompleted(key);
  if (data[id]) { delete data[id]; } else { data[id] = true; }
  saveCompleted(key, data);
  applyRowStyle(tr, btn, !!data[id]);
}
function applyRowStyle(tr, btn, done) {
  tr.classList.toggle("row-completed", done);
  btn.textContent = done ? "✅ Done" : "Mark Done";
  btn.classList.toggle("btn-done", done);
}

/* ── Helpers ──────────────────────────────────────── */
function toKey(d) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function parseDate(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function getNextFriday(dateStr) {
  const d = parseDate(dateStr);
  const day = d.getDay();
  const diff = (5 - day + 7) % 7 || 7;
  const fri = new Date(d);
  fri.setDate(fri.getDate() + diff);
  return toKey(fri);
}

function addMonths(dateStr, months) {
  const d = parseDate(dateStr);
  d.setMonth(d.getMonth() + months);
  return toKey(d);
}

function formatNice(dateStr) {
  const d = parseDate(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
}

function formatShort(dateStr) {
  const d = parseDate(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ── Build lookup sets ────────────────────────────── */
const caucusSet = new Set(CAUCUS_DATES);
const regularSet = new Set(REGULAR_DATES);

// ARF Fridays: for each Regular meeting, compute the following Friday
const arfMap = {};
const arfSet = new Set();
REGULAR_DATES.forEach((rd) => {
  const fri = getNextFriday(rd);
  arfSet.add(fri);
  arfMap[fri] = rd;
});

// ARF Item reminders: each item is due 3 months ahead of submission date
// The "reminder date" = submission date + 3 months (when it should be submitted to a meeting)
const arfItemReminderMap = {}; // reminderKey -> [items]
const arfItemReminderSet = new Set();
ARF_ITEMS.forEach((item) => {
  const reminderKey = addMonths(item.date, 3);
  arfItemReminderSet.add(reminderKey);
  if (!arfItemReminderMap[reminderKey]) arfItemReminderMap[reminderKey] = [];
  arfItemReminderMap[reminderKey].push(item);
});

/* ── Today ────────────────────────────────────────── */
const NOW = new Date();
const TODAY_KEY = toKey(NOW);

/* ── Populate Header ──────────────────────────────── */
document.getElementById("header-date").textContent = NOW.toLocaleDateString(
  "en-US",
  { weekday: "long", year: "numeric", month: "long", day: "numeric" },
);

/* ── Status Cards ─────────────────────────────────── */
function nextDateFrom(list) {
  for (const d of list) {
    if (d >= TODAY_KEY) return d;
  }
  return null;
}

const arfFridays = [...arfSet].sort();

const nextCaucus = nextDateFrom(CAUCUS_DATES);
const nextRegular = nextDateFrom(REGULAR_DATES);
const nextArf = nextDateFrom(arfFridays);

// Find next ARF item reminder
const sortedReminders = [...arfItemReminderSet].sort();
const nextReminder = nextDateFrom(sortedReminders);

document.getElementById("next-caucus").textContent = nextCaucus
  ? formatShort(nextCaucus) : "—";
document.getElementById("next-regular").textContent = nextRegular
  ? formatShort(nextRegular) : "—";
document.getElementById("next-arf").textContent = nextArf
  ? formatShort(nextArf) : "—";

// Next renewal reminder card
if (nextReminder) {
  const items = arfItemReminderMap[nextReminder];
  document.getElementById("next-renewal").textContent = formatShort(nextReminder);
  document.getElementById("next-renewal-sub").textContent =
    `${items.length} item(s): ${items.map(i => i.desc).join(", ")}`;
} else {
  document.getElementById("next-renewal").textContent = "—";
}

// sub-info
if (nextCaucus)
  document.getElementById("next-caucus-sub").textContent = formatNice(nextCaucus);
if (nextRegular)
  document.getElementById("next-regular-sub").textContent = formatNice(nextRegular);
if (nextArf) {
  const forMeeting = arfMap[nextArf];
  document.getElementById("next-arf-sub").textContent =
    `Send ARF for meeting on ${formatShort(forMeeting)}`;
}

// Remaining counts
const remainingCaucus = CAUCUS_DATES.filter((d) => d >= TODAY_KEY).length;
const remainingRegular = REGULAR_DATES.filter((d) => d >= TODAY_KEY).length;
const remainingArf = arfFridays.filter((d) => d >= TODAY_KEY).length;
const remainingRenewals = sortedReminders.filter((d) => d >= TODAY_KEY).length;
document.getElementById("remaining").textContent =
  `${remainingCaucus + remainingRegular}`;
document.getElementById("remaining-sub").textContent =
  `${remainingCaucus} caucus · ${remainingRegular} regular · ${remainingArf} ARF Fridays · ${remainingRenewals} renewals left`;

/* ── Render Calendar ──────────────────────────────── */
const calendarWrapper = document.getElementById("calendar");

for (let m = 0; m < 12; m++) {
  const card = document.createElement("div");
  card.className = "month-card";

  const title = document.createElement("div");
  title.className = "month-name";
  title.textContent = MONTH_NAMES[m];
  card.appendChild(title);

  const wdRow = document.createElement("div");
  wdRow.className = "weekday-row";
  WEEKDAYS.forEach((w) => {
    const cell = document.createElement("div");
    cell.textContent = w;
    wdRow.appendChild(cell);
  });
  card.appendChild(wdRow);

  const daysGrid = document.createElement("div");
  daysGrid.className = "days-grid";

  const firstDay = new Date(YEAR, m, 1).getDay();
  const daysInMonth = new Date(YEAR, m + 1, 0).getDate();

  for (let e = 0; e < firstDay; e++) {
    const empty = document.createElement("div");
    empty.className = "day-cell empty";
    daysGrid.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${YEAR}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const cell = document.createElement("div");
    cell.className = "day-cell";
    cell.textContent = d;

    if (key === TODAY_KEY) cell.classList.add("today");

    const isCaucus = caucusSet.has(key);
    const isRegular = regularSet.has(key);
    const isArf = arfSet.has(key);
    const isRenewal = arfItemReminderSet.has(key);

    if (isCaucus || isRegular || isArf || isRenewal) {
      const indicator = document.createElement("div");
      indicator.className = "indicator";
      const tooltipLines = [];

      if (isCaucus) {
        const dot = document.createElement("span");
        dot.className = "ind-caucus";
        indicator.appendChild(dot);
        tooltipLines.push("Caucus Meeting");
      }
      if (isRegular) {
        const dot = document.createElement("span");
        dot.className = "ind-regular";
        indicator.appendChild(dot);
        tooltipLines.push("Regular Meeting");
      }
      if (isArf) {
        const dot = document.createElement("span");
        dot.className = "ind-arf";
        indicator.appendChild(dot);
        const forMtg = arfMap[key];
        tooltipLines.push(`ARF Due (for ${formatShort(forMtg)} meeting)`);
      }
      if (isRenewal) {
        const dot = document.createElement("span");
        dot.className = "ind-renewal";
        indicator.appendChild(dot);
        const items = arfItemReminderMap[key];
        items.forEach(it => {
          tooltipLines.push(`🔔 Renewal: ${it.desc} (ARF #${it.num}, ${it.year})`);
        });
      }

      cell.appendChild(indicator);

      const tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      tooltip.innerHTML = tooltipLines.join("<br>");
      cell.appendChild(tooltip);
    }

    daysGrid.appendChild(cell);
  }

  card.appendChild(daysGrid);
  calendarWrapper.appendChild(card);
}

/* ── Deadlines Table ──────────────────────────────── */
const tbody = document.getElementById("deadlines-body");

REGULAR_DATES.forEach((rd, i) => {
  const arfFri = getNextFriday(rd);
  const nextMeeting = REGULAR_DATES[i + 1] || null;
  const tr = document.createElement("tr");

  let badge = "";
  if (arfFri < TODAY_KEY) {
    badge = '<span class="badge badge-past">Done</span>';
  } else if (arfFri === TODAY_KEY) {
    badge = '<span class="badge badge-now">Today!</span>';
  } else {
    const arfDate = parseDate(arfFri);
    const diff = (arfDate - NOW) / (1000 * 60 * 60 * 24);
    if (diff <= 7) {
      badge = '<span class="badge badge-soon">This Week</span>';
    } else {
      badge = '<span class="badge badge-upcoming">Upcoming</span>';
    }
  }

  const dlId = `dl-${rd}`;
  tr.innerHTML = `
    <td style="color:var(--text-primary);font-weight:600">${formatNice(rd)}</td>
    <td style="color:var(--arf);font-weight:600">${formatNice(arfFri)}</td>
    <td>${nextMeeting ? formatNice(nextMeeting) : "—"}</td>
    <td>${badge}</td>
    <td><button class="btn-complete" data-id="${dlId}">Mark Done</button></td>
  `;
  tbody.appendChild(tr);
  const dlBtn = tr.querySelector(".btn-complete");
  const dlDone = loadCompleted(STORAGE_KEY_DEADLINES);
  applyRowStyle(tr, dlBtn, !!dlDone[dlId]);
  dlBtn.addEventListener("click", () => toggleCompleted(STORAGE_KEY_DEADLINES, dlId, tr, dlBtn));
});

/* ── ARF Items Tracker Table ─────────────────────── */
const arfItemsBody = document.getElementById("arf-items-body");

// Sort all items: upcoming renewals first, then past
const itemsWithReminder = ARF_ITEMS.map(item => ({
  ...item,
  reminderDate: addMonths(item.date, 3),
})).sort((a, b) => {
  // upcoming first, then by reminder date ascending
  const aUpcoming = a.reminderDate >= TODAY_KEY ? 0 : 1;
  const bUpcoming = b.reminderDate >= TODAY_KEY ? 0 : 1;
  if (aUpcoming !== bUpcoming) return aUpcoming - bUpcoming;
  return a.reminderDate.localeCompare(b.reminderDate);
});

itemsWithReminder.forEach((item) => {
  const tr = document.createElement("tr");

  let badge = "";
  if (item.reminderDate < TODAY_KEY) {
    badge = '<span class="badge badge-past">Past Due</span>';
  } else if (item.reminderDate === TODAY_KEY) {
    badge = '<span class="badge badge-now">Today!</span>';
  } else {
    const remDate = parseDate(item.reminderDate);
    const diff = (remDate - NOW) / (1000 * 60 * 60 * 24);
    if (diff <= 7) {
      badge = '<span class="badge badge-soon">This Week</span>';
    } else if (diff <= 30) {
      badge = '<span class="badge badge-soon">This Month</span>';
    } else {
      badge = '<span class="badge badge-upcoming">Upcoming</span>';
    }
  }

  const itemId = `arf-${item.year}-${item.num}`;
  tr.innerHTML = `
    <td style="color:var(--text-primary);font-weight:600">${item.year}-${String(item.num).padStart(3,"0")}</td>
    <td>${item.desc}</td>
    <td>${formatNice(item.date)}</td>
    <td style="color:var(--renewal);font-weight:600">${formatNice(item.reminderDate)}</td>
    <td>${badge}</td>
    <td><button class="btn-complete" data-id="${itemId}">Mark Done</button></td>
  `;
  arfItemsBody.appendChild(tr);
  const itemBtn = tr.querySelector(".btn-complete");
  const itemDone = loadCompleted(STORAGE_KEY_ITEMS);
  applyRowStyle(tr, itemBtn, !!itemDone[itemId]);
  itemBtn.addEventListener("click", () => toggleCompleted(STORAGE_KEY_ITEMS, itemId, tr, itemBtn));
});

/* ── Print Report Function ───────────────────────── */
function printReport() {
  const today = NOW.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  // Build month calendar HTML
  function buildMonthHTML(monthIndex) {
    const mName = MONTH_NAMES[monthIndex];
    const first = new Date(YEAR, monthIndex, 1).getDay();
    const days = new Date(YEAR, monthIndex + 1, 0).getDate();
    let html = `<div style="border:1px solid #ccc;border-radius:6px;padding:8px;break-inside:avoid">`;
    html += `<div style="text-align:center;font-weight:700;font-size:11px;margin-bottom:4px;color:#4338ca">${mName}</div>`;
    html += `<table style="width:100%;border-collapse:collapse;table-layout:fixed"><thead><tr>`;
    WEEKDAYS.forEach(w => {
      html += `<th style="font-size:7px;color:#888;text-align:center;padding:1px;font-weight:600">${w}</th>`;
    });
    html += `</tr></thead><tbody><tr>`;

    // Empty leading cells
    for (let e = 0; e < first; e++) html += `<td></td>`;

    let col = first;
    for (let d = 1; d <= days; d++) {
      if (col > 0 && col % 7 === 0) html += `</tr><tr>`;
      const key = `${YEAR}-${String(monthIndex + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      const ic = caucusSet.has(key);
      const ir = regularSet.has(key);
      const ia = arfSet.has(key);
      const iw = arfItemReminderSet.has(key);
      const isToday = key === TODAY_KEY;

      let bg = "transparent";
      let border = "none";
      let color = "#333";

      if (isToday) { border = "2px solid #e11d48"; color = "#e11d48"; }

      // Dot indicators
      let dots = "";
      if (ic) dots += `<span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:#3b82f6;margin:0 1px"></span>`;
      if (ir) dots += `<span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:#10b981;margin:0 1px"></span>`;
      if (ia) dots += `<span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:#f59e0b;margin:0 1px"></span>`;
      if (iw) dots += `<span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:#a855f7;margin:0 1px"></span>`;

      html += `<td style="text-align:center;padding:2px 0;font-size:9px;color:${color};border:${border};border-radius:3px;vertical-align:top">`;
      html += `${d}`;
      if (dots) html += `<div style="text-align:center;line-height:1">${dots}</div>`;
      html += `</td>`;
      col++;
    }
    // Fill rest of row
    while (col % 7 !== 0) { html += `<td></td>`; col++; }
    html += `</tr></tbody></table></div>`;
    return html;
  }

  // Build deadlines table rows
  let deadlinesRows = "";
  const dlCompleted = loadCompleted(STORAGE_KEY_DEADLINES);
  REGULAR_DATES.forEach((rd, i) => {
    const arfFri = getNextFriday(rd);
    const next = REGULAR_DATES[i + 1] || "—";
    const done = dlCompleted[`dl-${rd}`];
    const style = done ? "text-decoration:line-through;color:#999" : "";
    let status = "";
    if (done) { status = "✅ Done"; }
    else if (arfFri < TODAY_KEY) { status = "Past"; }
    else if (arfFri === TODAY_KEY) { status = "⚠️ Today!"; }
    else { status = "Upcoming"; }

    deadlinesRows += `<tr style="${style}">
      <td style="padding:4px 8px;border-bottom:1px solid #eee;font-size:10px">${formatNice(rd)}</td>
      <td style="padding:4px 8px;border-bottom:1px solid #eee;font-size:10px;color:#b45309;font-weight:600">${formatNice(arfFri)}</td>
      <td style="padding:4px 8px;border-bottom:1px solid #eee;font-size:10px">${next !== "—" ? formatNice(next) : "—"}</td>
      <td style="padding:4px 8px;border-bottom:1px solid #eee;font-size:10px">${status}</td>
    </tr>`;
  });

  // Build ARF items table rows
  let arfRows = "";
  const itemCompleted = loadCompleted(STORAGE_KEY_ITEMS);
  itemsWithReminder.forEach(item => {
    const done = itemCompleted[`arf-${item.year}-${item.num}`];
    const style = done ? "text-decoration:line-through;color:#999" : "";
    let status = "";
    if (done) { status = "✅ Done"; }
    else if (item.reminderDate < TODAY_KEY) { status = "Past Due"; }
    else if (item.reminderDate === TODAY_KEY) { status = "⚠️ Today!"; }
    else { status = "Upcoming"; }

    arfRows += `<tr style="${style}">
      <td style="padding:4px 8px;border-bottom:1px solid #eee;font-size:10px;font-weight:600">${item.year}-${String(item.num).padStart(3,"0")}</td>
      <td style="padding:4px 8px;border-bottom:1px solid #eee;font-size:10px">${item.desc}</td>
      <td style="padding:4px 8px;border-bottom:1px solid #eee;font-size:10px">${formatNice(item.date)}</td>
      <td style="padding:4px 8px;border-bottom:1px solid #eee;font-size:10px;color:#7c3aed;font-weight:600">${formatNice(item.reminderDate)}</td>
      <td style="padding:4px 8px;border-bottom:1px solid #eee;font-size:10px">${status}</td>
    </tr>`;
  });

  // Build calendar grid
  let calendarHTML = `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:20px">`;
  for (let m = 0; m < 12; m++) calendarHTML += buildMonthHTML(m);
  calendarHTML += `</div>`;

  const fullHTML = `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>Commissioner Meeting Report — 2026</title>
<style>
  @page { size: landscape; margin: 0.4in; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, Helvetica, sans-serif; color: #222; line-height: 1.4; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head><body>

<!-- Header -->
<div style="border-bottom:2px solid #333;padding-bottom:6px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:flex-end">
  <div>
    <h1 style="font-size:18px;margin:0">📋 Commissioner Meeting Report — 2026</h1>
    <p style="font-size:10px;color:#666;margin-top:2px">Generated: ${today}</p>
  </div>
  <div style="text-align:right;font-size:9px;color:#555">
    <div>Next Caucus: <strong>${nextCaucus ? formatShort(nextCaucus) : "—"}</strong></div>
    <div>Next Regular: <strong>${nextRegular ? formatShort(nextRegular) : "—"}</strong></div>
    <div>Next ARF Friday: <strong>${nextArf ? formatShort(nextArf) : "—"}</strong></div>
    <div>Remaining: <strong>${remainingCaucus + remainingRegular} meetings</strong></div>
  </div>
</div>

<!-- Legend -->
<div style="display:flex;gap:16px;margin-bottom:10px;font-size:9px;color:#555">
  <div><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#3b82f6;vertical-align:middle"></span> Caucus</div>
  <div><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#10b981;vertical-align:middle"></span> Regular</div>
  <div><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#f59e0b;vertical-align:middle"></span> ARF Friday</div>
  <div><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#a855f7;vertical-align:middle"></span> Renewal Reminder</div>
  <div><span style="display:inline-block;width:8px;height:8px;border-radius:50%;border:2px solid #e11d48;vertical-align:middle"></span> Today</div>
</div>

<!-- Calendar -->
${calendarHTML}

<!-- ARF Submission Schedule -->
<h2 style="font-size:13px;margin:16px 0 6px;border-bottom:1px solid #999;padding-bottom:3px">📨 ARF Submission Schedule</h2>
<table style="width:100%;border-collapse:collapse;margin-bottom:16px">
  <thead>
    <tr style="background:#f1f5f9">
      <th style="padding:5px 8px;text-align:left;font-size:9px;border-bottom:2px solid #333;text-transform:uppercase;color:#555">Regular Meeting</th>
      <th style="padding:5px 8px;text-align:left;font-size:9px;border-bottom:2px solid #333;text-transform:uppercase;color:#555">ARF Due Friday</th>
      <th style="padding:5px 8px;text-align:left;font-size:9px;border-bottom:2px solid #333;text-transform:uppercase;color:#555">For Next Meeting</th>
      <th style="padding:5px 8px;text-align:left;font-size:9px;border-bottom:2px solid #333;text-transform:uppercase;color:#555">Status</th>
    </tr>
  </thead>
  <tbody>${deadlinesRows}</tbody>
</table>

<!-- ARF Items Tracker -->
<h2 style="font-size:13px;margin:16px 0 6px;border-bottom:1px solid #999;padding-bottom:3px">🔔 ARF Items Tracker (3-Month Renewal Reminders)</h2>
<table style="width:100%;border-collapse:collapse">
  <thead>
    <tr style="background:#f1f5f9">
      <th style="padding:5px 8px;text-align:left;font-size:9px;border-bottom:2px solid #333;text-transform:uppercase;color:#555">ARF #</th>
      <th style="padding:5px 8px;text-align:left;font-size:9px;border-bottom:2px solid #333;text-transform:uppercase;color:#555">Description</th>
      <th style="padding:5px 8px;text-align:left;font-size:9px;border-bottom:2px solid #333;text-transform:uppercase;color:#555">Original Date</th>
      <th style="padding:5px 8px;text-align:left;font-size:9px;border-bottom:2px solid #333;text-transform:uppercase;color:#555">Renewal (3 Mo)</th>
      <th style="padding:5px 8px;text-align:left;font-size:9px;border-bottom:2px solid #333;text-transform:uppercase;color:#555">Status</th>
    </tr>
  </thead>
  <tbody>${arfRows}</tbody>
</table>

</body></html>`;

  // Remove any existing print iframe
  const old = document.getElementById("print-frame");
  if (old) old.remove();

  const iframe = document.createElement("iframe");
  iframe.id = "print-frame";
  iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:none";
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(fullHTML);
  iframeDoc.close();

  // Wait for content to render then print
  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  }, 500);
}
