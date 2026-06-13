import {getAllCountries, loadHeader} from "./utils.js";
import {initSearch} from "./search.js";


function groupByRegion(countries) {
    return countries.reduce((acc, country) => {
        const region = country.region || "Other";
        if (!acc[region]) acc[region] = [];
        acc[region].push(country);
        return acc;
    }, {});
}


function renderCountriesList(countries) {
    const container = document.querySelector("#countries-container");
    const grouped = groupByRegion(countries);
    const sortedRegions = Object.keys(grouped).sort();

    container.innerHTML = sortedRegions.map((region) => {
        const regionCountries = grouped[region].sort((a, b) => a.name.localeCompare(b.name));

        const cards = regionCountries.map((c) => `
            <a
                href="/country.html?name=${encodeURIComponent(c.name)}"
                class="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
                <img
                    src="${c.flag}"
                    alt="${c.name} flag"
                    class="w-10 h-7 object-cover border border-gray-100 flex-shrink-0"
                />
                <div class="min-w-0">
                    <p class="text-sm font-semibold text-gray-800 truncate">${c.name}</p>
                   <p class="text-xs text-gray-400">${c.capital || "N/A"}</p>
                </div>
            </a>
        `).join("");

        return `
            <div class="mb-10">
                <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">${region}</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    ${cards}
                </div>
            </div>
        `;
    }).join("");
}


async function initHomePage() {
    await loadHeader();
    await initSearch();

    const container = document.querySelector("#countries-container");
    container.innerHTML = `<p class="text-sm text-gray-400">Loading countries...</p>`;

    try {
        const countries = await getAllCountries();
        renderCountriesList(countries);
    } catch (e) {
        container.innerHTML = `<p class="text-sm text-red-400">Failed to load countries.</p>`;
    }
}

initHomePage();