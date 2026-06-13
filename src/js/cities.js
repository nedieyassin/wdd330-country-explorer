import {getCitiesByCountry, loadAndRender} from "./utils.js";

export async function renderCities(countryName) {
    const container = document.querySelector("#cities-container");

    await loadAndRender("/partials/cities.html", container, async () => {
        const list = document.querySelector("#cities-list");

        try {
            const cities = await getCitiesByCountry(countryName.toLowerCase());

            if (cities.length === 0) {
                list.innerHTML = `<li class="text-sm text-text-secondary">No cities found.</li>`;
                return;
            }

            list.innerHTML = cities
                .map((city) => `
          <li class="flex items-center justify-between py-2 border-b border-bg-primary last:border-0">
            <span class="text-sm text-text-primary">${city}</span>
          </li>
        `).join("");

        } catch (error) {
            list.innerHTML = `<li class="text-sm text-text-secondary">Could not load cities.</li>`;
        }
    });
}