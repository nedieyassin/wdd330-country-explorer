import {formatCurrencies, formatLanguages, formatPopulation, getCountryByName, loadAndRender, loadHeader,} from "./utils.js";
import {renderCurrencies} from "./currency.js";
import {renderLanguages} from "./languages.js";
import {renderCities} from "./cities.js";

function getCountryNameFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("name");
}

async function showLoading() {
    const appState = document.querySelector("#app-state");
    await loadAndRender("/partials/loading.html", appState);
}

async function showError(message) {
    const appState = document.querySelector("#app-state");
    await loadAndRender("/partials/error.html", appState, () => {
        document.querySelector("#error-message").textContent = message;
        document.querySelector("#retry-btn").addEventListener("click", () => {
            window.location.reload();
        });
    });
}

async function renderOverview(country) {
    const container = document.querySelector("#overview-container");

    await loadAndRender("/partials/country-overview.html", container, () => {
        const flag = document.querySelector("#country-flag");
        flag.src = country.flag_svg || country.flag_png;
        flag.alt = `${country.name_common} flag`;

        document.querySelector("#country-name").textContent = country.name_common;
        document.querySelector("#country-official").textContent = country.name_official;
        document.querySelector("#country-capital").textContent = country.capital || "N/A";
        document.querySelector("#country-region").textContent = country.region || "N/A";
        document.querySelector("#country-subregion").textContent = country.subregion || "N/A";
        document.querySelector("#country-population").textContent = formatPopulation(country.population);
    });
}

async function initCountryPage() {
    const name = getCountryNameFromURL();

    if (!name) {
        window.location.href = "/";
        return;
    }

    document.title = `${name} - Country Explorer`;

    await showLoading();

    try {
        const country = await getCountryByName(name);

        document.querySelector("#app-state").innerHTML = "";
        document.querySelector("#country-section").classList.remove("hidden");

        await renderOverview(country);
        await renderCurrencies(formatCurrencies(country.currencies));
        await renderLanguages(formatLanguages(country.languages));
        await renderCities(country.name_common);

    } catch (error) {
        await showError(error.message);
    }
}

loadHeader().then(() => initCountryPage());