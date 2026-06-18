const countries_api_url = "https://countries-data.fly.dev";
const cities_api_url = "https://countriesnow.space/api/v0.1";

export function formatPopulation(number) {
    if (!number) return "N/A";
    return number.toLocaleString();
}

export function formatCurrencies(currenciesJson) {
    if (!currenciesJson) return [];
    try {
        return typeof currenciesJson === "string" ? JSON.parse(currenciesJson) : currenciesJson;
    } catch {
        return [];
    }
}

export function formatLanguages(languagesJson) {
    if (!languagesJson) return [];
    try {
        return typeof languagesJson === "string" ? JSON.parse(languagesJson) : languagesJson;
    } catch {
        return [];
    }
}

export async function getAllCountries() {
    let allCountries = [];
    let page = 1;
    const perPage = 200;

    while (true) {
        const response = await fetch(`${countries_api_url}/api/collections/countries/records?fields=name_common,capital,flag_svg,flag_png,cca2,region,population,languages&perPage=${perPage}&page=${page}&sort=name_common`);
        if (!response.ok) throw new Error("Failed to load country list.");
        const data = await response.json();

        allCountries = [...allCountries, ...data.items];

        if (allCountries.length >= data.totalItems) break;
        page++;
    }

    return allCountries.map((c) => ({
        name: c.name_common, flag: c.flag_svg || c.flag_png, cca2: c.cca2, region: c.region, capital: c.capital, population: c.population, languages: c.languages
    }));
}

export async function getCountryByName(name) {
    const response = await fetch(`${countries_api_url}/api/collections/countries/records?filter=(name_common="${encodeURIComponent(name)}")&perPage=1`);
    if (!response.ok) throw new Error(`Country "${name}" not found.`);
    const data = await response.json();
    if (!data.items || data.items.length === 0) {
        throw new Error(`Country "${name}" not found.`);
    }
    return data.items[0];
}

export async function getCitiesByCountry(countryName) {
    const response = await fetch(`${cities_api_url}/countries/cities`, {
        method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({country: countryName}),
    });
    if (!response.ok) throw new Error("Failed to load cities.");
    const data = await response.json();
    if (!data.data || data.data.length === 0) return [];
    return data.data.slice(0, 10);
}

export async function loadTemplate(path) {
    const response = await fetch(path);
    return await response.text();
}

export function renderWithTemplate(template, parentElement, callback) {
    parentElement.innerHTML = template;
    if (callback) callback();
}

export async function loadAndRender(path, parentElement, callback) {
    const template = await loadTemplate(path);
    renderWithTemplate(template, parentElement, callback);
}

export async function loadHeader() {
    const header = document.querySelector("#main-header");
    await loadAndRender("/partials/header.html", header);
}