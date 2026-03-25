(function () {
  const KEY = "drawerHistory";

  function getHistory() {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
    catch { return []; }
  }

  function saveHistory(entries) {
    localStorage.setItem(KEY, JSON.stringify(entries));
  }

  function fmt(n) {
    return "$" + Number(n).toFixed(2);
  }

  function formatDate(displayTime, timestamp) {
    try {
      const d = new Date(timestamp || displayTime);
      const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      return { date, time };
    } catch {
      return { date: displayTime || "—", time: "" };
    }
  }

  function showToast(msg) {
    const t = document.getElementById("toast");
    t.textContent      = msg;
    t.style.visibility = "visible";
    t.style.opacity    = "1";
    clearTimeout(t._tid);
    t._tid = setTimeout(() => { t.style.opacity = "0"; t.style.visibility = "hidden"; }, 4000);
  }

  function deleteEntry(index) {
    const entries = getHistory();
    entries.splice(index, 1);
    saveHistory(entries);
    render();
  }

  function render() {
    const entries = getHistory();
    const list    = document.getElementById("historyList");
    const empty   = document.getElementById("emptyState");

    list.innerHTML = "";

    if (entries.length === 0) {
      empty.classList.remove("hidden");
      return;
    }
    empty.classList.add("hidden");

    entries.forEach((entry, i) => {
      const { date, time } = formatDate(entry.displayTime, entry.timestamp);

      const row = document.createElement("div");
      row.className = "glass-card rounded-xl px-4 sm:px-6 py-4 grid grid-cols-12 items-center gap-2 group hover:bg-white/5 transition-all duration-200";
      row.innerHTML = `
        <div class="col-span-5 sm:col-span-4">
          <div class="font-medium text-white text-sm">${date}</div>
          <div class="text-[11px] text-white/40 mt-0.5">${time}</div>
        </div>
        <div class="col-span-3 text-right">
          <div class="font-headline font-bold text-white">${fmt(entry.total)}</div>
        </div>
        <div class="col-span-3 text-right">
          <div class="font-headline font-bold text-primary">${fmt(entry.deposit)}</div>
        </div>
        <div class="col-span-1 flex justify-end">
          <button
            data-index="${i}"
            class="delete-btn p-2 rounded-lg text-white/20 hover:text-error hover:bg-error/10 transition-all active:scale-90"
            title="Delete entry"
          >
            <span class="material-symbols-outlined text-base">delete</span>
          </button>
        </div>
      `;
      list.appendChild(row);
    });

    list.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index, 10);
        deleteEntry(idx);
        showToast("Entry deleted.");
      });
    });
  }

  document.getElementById("clearAllBtn").addEventListener("click", () => {
    const entries = getHistory();
    if (entries.length === 0) {
      showToast("Nothing to clear.");
      return;
    }
    if (confirm("Clear all " + entries.length + " history entries? This cannot be undone.")) {
      localStorage.removeItem(KEY);
      render();
      showToast("History cleared.");
    }
  });

  render();
})();
