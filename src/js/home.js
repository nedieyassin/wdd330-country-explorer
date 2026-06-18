import {formatPopulation, getAllCountries, loadHeader} from "./utils.js";
import {initSearch} from "./search.js";


async function loadContinentsData() {
    const response = await fetch("/data/continents.json");
    if (!response.ok) throw new Error("Failed to load continents data.");
    return await response.json();
}


function groupByRegion(countries) {
    return countries.reduce((acc, country) => {
        const region = country.region || "Other";
        if (!acc[region]) acc[region] = [];
        acc[region].push(country);
        return acc;
    }, {});
}


function renderCountriesList(countries, continents) {
    const container = document.querySelector("#countries-container");
    const grouped = groupByRegion(countries);
    const sortedRegions = Object.keys(grouped).sort();

    container.innerHTML = sortedRegions.map((region) => {
        const regionCountries = grouped[region].sort((a, b) => a.name.localeCompare(b.name));
        const continentData = continents.find((c) => c.region === region);

        const cards = regionCountries.map((c) => {
            const languages = Array.isArray(c.languages)
                ? c.languages.slice(0, 3).join(", ")
                : "N/A";

            return `
            <div>
                <a
                    href="/country.html?name=${encodeURIComponent(c.name)}"
                    class="country-card block relative w-full h-24 rounded-lg overflow-hidden border border-gray-200"
                >
                    <!-- Front -->
                    <div class="card-front absolute inset-0 flex items-center gap-3 p-3 bg-white">
                        <img
                            src="${c.flag}"
                            alt="${c.name} flag"
                            class="w-10 h-7 object-cover rounded border border-gray-100 flex-shrink-0"
                        />
                        <div class="min-w-0">
                            <p class="text-sm font-semibold text-gray-800 truncate">${c.name}</p>
                            <p class="text-xs text-gray-400">${c.capital || "N/A"}</p>
                        </div>
                    </div>

                    <!-- Back -->
                    <div class="card-back absolute inset-0 flex flex-col justify-center gap-1 p-3 bg-blue-600">
                        <p class="text-xs font-bold text-white truncate">${c.name}</p>
                        <p class="text-xs text-blue-100">Popuplation: ${formatPopulation(c.population)}</p>
                        <p class="text-xs text-blue-100 truncate">Languages: ${languages}</p>
                    </div>
                </a>
            </div>
        `
        }).join("");

        return `
            <div class="mb-12">
                <div class="mb-4 border-b border-gray-100 pb-3">
                    <h2 class="text-sm font-bold text-gray-700 uppercase tracking-widest mb-1">${region}</h2>
                    ${continentData ? `
                        <p class="text-sm text-gray-500">${continentData.description}</p>
                        <p class="text-xs text-blue-500 mt-1">* ${continentData.fact}</p>
                    ` : ""}
                </div>
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
        const [countries, continents] = await Promise.all([
            getAllCountries(),
            loadContinentsData(),
        ]);
        renderCountriesList(countries, continents);
    } catch (e) {
        container.innerHTML = `<p class="text-sm text-red-400">Failed to load countries.</p>`;
    }
}

initHomePage();