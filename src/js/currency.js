import {loadAndRender} from "./utils.js";

export async function renderCurrencies(currencies) {
    const container = document.querySelector("#currency-container");

    await loadAndRender("/partials/currency.html", container, () => {
        const list = document.querySelector("#currency-list");

        if (currencies.length === 0) {
            list.innerHTML = `<li class="text-sm text-text-secondary">No currencies found.</li>`;
            return;
        }

        list.innerHTML = currencies.map((c) => `
        <li class="flex items-center justify-between py-2 border-b border-bg-primary last:border-0">
          <span class="text-sm text-text-primary">${c.name}</span>
          <div class="flex items-center gap-2">
            <span class="text-sm text-text-secondary">${c.symbol ?? ""}</span>
            <span class="font-mono text-xs text-text-secondary">${c.code}</span>
          </div>
        </li>
      `).join("");
    });
}