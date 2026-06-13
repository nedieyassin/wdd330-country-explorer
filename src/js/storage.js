const STORAGE_KEY = "recentSearches";
const MAX_RECENT = 5;

export function getRecentSearches() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

export function saveRecentSearch(name, cca2, flag) {
    const recent = getRecentSearches();
    const filtered = recent.filter((item) => item.cca2 !== cca2);
    filtered.unshift({name, cca2, flag});
    const trimmed = filtered.slice(0, MAX_RECENT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function clearRecentSearches() {
    localStorage.removeItem(STORAGE_KEY);
}