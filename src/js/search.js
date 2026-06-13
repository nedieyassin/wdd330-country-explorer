import {getAllCountries} from "./utils.js";
import {getRecentSearches, saveRecentSearch} from "./storage.js";

let allCountries = [];

export async function initSearch() {
    renderRecentSearches();
    allCountries = await getAllCountries();

    const input = document.querySelector("#search-input");
    const searchBtn = document.querySelector("#search-btn");

    input.addEventListener("input", onInput);
    input.addEventListener("keydown", onKeydown);
    searchBtn.addEventListener("click", onSearchClick);

    document.addEventListener("click", (e) => {
        if (!e.target.closest("#search-section")) {
            hideSuggestions();
        }
    });
}

function onInput() {
    const query = document.querySelector("#search-input").value.trim();

    if (query.length < 2) {
        hideSuggestions();
        return;
    }

    const matches = allCountries.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 8);

    if (matches.length === 0) {
        hideSuggestions();
        return;
    }

    renderSuggestions(matches);
}

function onKeydown(e) {
    const items = document.querySelectorAll("#suggestions li");
    const active = document.querySelector("#suggestions li.bg-bg-secondary");
    let index = Array.from(items).indexOf(active);

    if (e.key === "ArrowDown") {
        e.preventDefault();
        index = index < items.length - 1 ? index + 1 : 0;
        setActiveItem(items, index);
    }

    if (e.key === "ArrowUp") {
        e.preventDefault();
        index = index > 0 ? index - 1 : items.length - 1;
        setActiveItem(items, index);
    }

    if (e.key === "Enter") {
        if (active) {
            active.click();
        } else {
            onSearchClick();
        }
    }

    if (e.key === "Escape") {
        hideSuggestions();
    }
}

function setActiveItem(items, index) {
    items.forEach((item) => item.classList.remove("bg-bg-secondary"));
    items[index].classList.add("bg-bg-secondary");
}

function onSearchClick() {
    const query = document.querySelector("#search-input").value.trim();
    if (!query) return;

    const match = allCountries.find((c) => c.name.toLowerCase() === query.toLowerCase());

    if (match) {
        goToCountry(match.name, match.cca2, match.flag);
    }
}

function renderSuggestions(matches) {
    const list = document.querySelector("#suggestions");

    list.innerHTML = matches
        .map((c) => `
      <li
        class="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-bg-secondary rounded-sm"
        data-name="${c.name}"
        data-cca2="${c.cca2}"
        data-flag="${c.flag}"
      >
        <img src="${c.flag}" alt="${c.name} flag" class="w-6 h-4 object-cover" />
        <span class="text-sm text-text-primary">${c.name}</span>
      </li>
    `)
        .join("");

    list.querySelectorAll("li").forEach((li) => {
        li.addEventListener("click", () => {
            goToCountry(li.dataset.name, li.dataset.cca2, li.dataset.flag);
        });
    });

    list.classList.remove("hidden");
}

function hideSuggestions() {
    const list = document.querySelector("#suggestions");
    list.classList.add("hidden");
    list.innerHTML = "";
}

export function renderRecentSearches() {
    const recent = getRecentSearches();
    const section = document.querySelector("#recent-section");
    const list = document.querySelector("#recent-list");

    if (recent.length === 0) {
        section.classList.add("hidden");
        return;
    }

    list.innerHTML = recent
        .map((item) => `
      <button
        class="flex items-center gap-2 px-3 py-1 text-sm bg-bg-secondary text-text-primary rounded"
        data-name="${item.name}"
        data-cca2="${item.cca2}"
        data-flag="${item.flag || ''}"
      >
        ${item.flag ? `<img src="${item.flag}" alt="${item.name} flag" class="w-5 h-3 object-cover" />` : ""}
        ${item.name}
      </button>
    `)
        .join("");

    list.querySelectorAll("button").forEach((btn) => {
        btn.addEventListener("click", () => {
            goToCountry(btn.dataset.name, btn.dataset.cca2, btn.dataset.flag);
        });
    });

    section.classList.remove("hidden");
}

function goToCountry(name, cca2, flag) {
    saveRecentSearch(name, cca2, flag);
    window.location.href = `/country.html?name=${encodeURIComponent(name)}`;
}