import {loadAndRender} from "./utils.js";


export async function renderLanguages(languages) {
    const container = document.querySelector("#languages-container");

    await loadAndRender("/partials/languages.html", container, () => {
        const list = document.querySelector("#language-list");

        if (languages.length === 0) {
            list.innerHTML = `<li class="text-sm text-text-secondary">No languages found.</li>`;
            return;
        }

        list.innerHTML = languages.map((lang) => `
        <li class="py-2 border-b border-bg-primary last:border-0">
          <span class="text-sm text-text-primary">${lang}</span>
        </li>
      `).join("");
    });
}