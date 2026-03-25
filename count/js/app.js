document.addEventListener("DOMContentLoaded", function () {

  const BILLS = [
    { id: "hundreds", value: 100 },
    { id: "fifties",  value: 50  },
    { id: "twenties", value: 20  },
    { id: "tens",     value: 10  },
    { id: "fives",    value: 5   },
    { id: "ones",     value: 1   },
  ];
  const COINS = [
    { id: "quarters", value: 0.25 },
    { id: "dimes",    value: 0.10 },
    { id: "nickels",  value: 0.05 },
    { id: "pennies",  value: 0.01 },
  ];
  const ROLLS = [
    { id: "rollPennies",  value: 0.50 },
    { id: "rollNickels",  value: 2.00 },
    { id: "rollDimes",    value: 5.00 },
    { id: "rollQuarters", value: 10.00 },
  ];

  function qty(id) { return Math.max(0, parseInt(document.getElementById(id).value, 10) || 0); }
  function fmt(n)  { return "$" + n.toFixed(2); }
  function el(id)  { return document.getElementById(id); }
  function setEl(id, val) { const e = el(id); if (e) e.textContent = val; }

  function updateTotals() {
    let billsCents = 0;
    BILLS.forEach(b => { billsCents += qty(b.id) * Math.round(b.value * 100); });

    let looseCoinsCents = 0;
    COINS.forEach(c => { looseCoinsCents += qty(c.id) * Math.round(c.value * 100); });

    let rollsCents = 0;
    ROLLS.forEach(r => { rollsCents += qty(r.id) * Math.round(r.value * 100); });

    const coinsCents     = looseCoinsCents + rollsCents;
    const totalCents     = billsCents + coinsCents;
    const startBankRaw   = parseFloat(el("startBank").value) || 0;
    const startBankCents = Math.round(startBankRaw * 100);
    const depositCents   = Math.max(totalCents - startBankCents, 0);

    if (startBankRaw > 0) localStorage.setItem("startBank", startBankRaw.toString());
    else localStorage.removeItem("startBank");

    // Hidden compat
    el("total").textContent   = fmt(totalCents / 100);
    el("deposit").textContent = fmt(depositCents / 100);

    // Section subtotals
    setEl("billsSubtotal", fmt(billsCents / 100));
    setEl("coinsSubtotal", fmt(looseCoinsCents / 100));
    setEl("rollsSubtotal", fmt(rollsCents / 100));

    // Denomination value labels
    [...BILLS, ...COINS, ...ROLLS].forEach(d => {
      const e = el("val-" + d.id);
      if (!e) return;
      const v = qty(d.id) * d.value;
      e.textContent = v > 0 ? fmt(v) : "";
    });

    // Summary stats
    setEl("grandTotalCardDisplay", fmt(totalCents / 100));
    setEl("netDepositDisplay",     fmt(depositCents / 100));
    setEl("bankRetainedDisplay",   "-" + fmt(startBankCents / 100));

    // Bottom bar
    setEl("grandTotalDisplay", fmt(totalCents / 100));

    // Status dot
    const dot  = el("drawerStatusDot");
    const text = el("drawerStatusText");
    if (totalCents === 0) {
      dot.style.background = "rgba(255,255,255,0.25)";
      text.textContent     = "Ready";
      text.style.color     = "rgba(255,255,255,0.35)";
    } else {
      dot.style.background = "#78dc77";
      text.textContent     = "Counting";
      text.style.color     = "#78dc77";
    }

    updateBreakdown(depositCents);
  }

  function updateBreakdown(depositCents) {
    BILLS.forEach(b => { setEl("remove-" + b.id, "0"); });
    COINS.forEach(c => { setEl("remove-" + c.id, "0"); });

    const badge = el("reconcileStatus");

    if (depositCents === 0) { setBadge(badge, true); return; }

    let remaining = depositCents;

    BILLS.forEach(b => {
      const valueCents = Math.round(b.value * 100);
      const needed = Math.min(Math.floor(remaining / valueCents), qty(b.id));
      if (needed > 0) { setEl("remove-" + b.id, needed); remaining -= needed * valueCents; }
    });

    COINS.forEach(c => {
      const valueCents = Math.round(c.value * 100);
      const needed = Math.min(Math.floor(remaining / valueCents), qty(c.id));
      if (needed > 0) { setEl("remove-" + c.id, needed); remaining -= needed * valueCents; }
    });

    setBadge(badge, remaining === 0);
    if (remaining > 0) showToast("Note: Not enough bills/coins to fully cover deposit.");
  }

  function setBadge(el, ok) {
    el.style.color = ok ? "rgba(68,216,241,0.7)" : "rgba(239,154,154,0.9)";
  }

  function getHistory() {
    try { return JSON.parse(localStorage.getItem("drawerHistory") || "[]"); }
    catch { return []; }
  }

  function saveToHistory(total, deposit) {
    const now   = new Date();
    const entry = { total, deposit, timestamp: now.toISOString(), displayTime: now.toLocaleString() };
    let hist = getHistory();
    hist.unshift(entry);
    if (hist.length > 10) hist = hist.slice(0, 10);
    localStorage.setItem("drawerHistory", JSON.stringify(hist));
    showToast("Entry saved to history!");
  }

  function currentTotals() {
    return {
      total:   parseFloat(el("total").textContent.replace("$",""))   || 0,
      deposit: parseFloat(el("deposit").textContent.replace("$","")) || 0,
    };
  }

  function doSave() {
    const { total, deposit } = currentTotals();
    if (total > 0) saveToHistory(total, deposit);
    else showToast("Nothing to save — enter some amounts first!");
  }

  function doReset(andSave) {
    if (andSave) {
      const { total, deposit } = currentTotals();
      if (total > 0) saveToHistory(total, deposit);
      else showToast("Nothing to save — enter some amounts first!");
    }
    [...BILLS, ...COINS, ...ROLLS].forEach(d => { el(d.id).value = ""; });
    updateTotals();
  }

  function showToast(msg) {
    const t = el("toast");
    t.textContent      = msg;
    t.style.visibility = "visible";
    t.style.opacity    = "1";
    clearTimeout(t._tid);
    t._tid = setTimeout(() => { t.style.opacity = "0"; t.style.visibility = "hidden"; }, 4500);
  }

  const NAV_ORDER = [
    "startBank",
    "ones","fives","tens","twenties","fifties","hundreds",
    "pennies","nickels","dimes","quarters",
    "rollPennies","rollNickels","rollDimes","rollQuarters",
  ];

  NAV_ORDER.forEach((id, i) => {
    const input = el(id);
    if (!input) return;
    input.addEventListener("input", updateTotals);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const next = el(NAV_ORDER[(i + 1) % NAV_ORDER.length]);
        if (next) next.focus();
      }
    });
  });

  el("newCountBtn").addEventListener("click",  () => doReset(false));
  el("saveOnlyBtn").addEventListener("click",  doSave);
  el("saveResetBtn").addEventListener("click", () => doReset(true));

  ["historyNavBtn", "historyMobileBtn"].forEach(id => {
    const btn = el(id);
    if (btn) btn.addEventListener("click", () => { window.location.href = "history"; });
  });

  el("helpBtn").addEventListener("click",   () => { el("helpModal").style.display = "flex"; });
  el("closeHelp").addEventListener("click", () => { el("helpModal").style.display = "none"; });
  el("helpModal").addEventListener("click", e => { if (e.target === el("helpModal")) el("helpModal").style.display = "none"; });

  function copyValue(elemId) {
    const text = el(elemId).textContent.replace(/[$+\-]/g, "").trim();
    navigator.clipboard.writeText(text).then(() => showToast("Copied: $" + text));
  }
  el("netDepositDisplay").addEventListener("click",      () => copyValue("netDepositDisplay"));
  el("grandTotalDisplay").addEventListener("click",      () => copyValue("grandTotalDisplay"));
  el("grandTotalCardDisplay").addEventListener("click",  () => copyValue("grandTotalCardDisplay"));

  const savedBank = localStorage.getItem("startBank");
  if (savedBank) el("startBank").value = savedBank;

  updateTotals();
});
