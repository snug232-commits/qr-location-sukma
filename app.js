const services = {
  earthquake: { name: "GeoNet Earthquake", description: "Earthquake information for Aotearoa", url: "https://www.geonet.org.nz/earthquake" },
  volcano: { name: "GeoNet Volcano", description: "Volcanic activity and alert information", url: "https://www.geonet.org.nz/volcano" },
  safeSwim: { name: "SafeSwim", description: "Water quality and swimming safety", url: "https://safeswim.org.nz/" }
};

const regions = [
  {
    id: "auckland-region", name: "Auckland Region", description: "Volcanic landscapes, harbours and city beaches.", towns: [
      { id: "auckland-central", name: "Auckland Central", metServiceUrl: "https://www.metservice.com/towns-cities/regions/auckland/locations/auckland", mountains: [{ id: "mount-eden", name: "Mount Eden" }], beaches: [{ id: "mission-bay-beach", name: "Mission Bay Beach", safeSwimUrl: "https://safeswim.org.nz/locations/mission-bay-beach" }] },
      { id: "north-shore", name: "North Shore", metServiceUrl: "https://www.metservice.com/towns-cities/regions/auckland/locations/north-shore", mountains: [{ id: "mount-victoria-takarunga", name: "Mount Victoria / Takarunga" }], beaches: [{ id: "cheltenham-beach", name: "Cheltenham Beach" }] }
    ]
  },
  {
    id: "wellington-region", name: "Wellington Region", description: "Harbour views, ridgelines and coastal city life.", towns: [
      { id: "wellington", name: "Wellington", metServiceUrl: "https://www.metservice.com/towns-cities/regions/wellington/locations/wellington", mountains: [{ id: "mount-victoria-wellington", name: "Mount Victoria" }], beaches: [{ id: "oriental-bay", name: "Oriental Bay" }] }
    ]
  },
  {
    id: "canterbury-region", name: "Canterbury Region", description: "Open plains, hills and the Christchurch coastline.", towns: [
      { id: "christchurch", name: "Christchurch", metServiceUrl: "https://www.metservice.com/towns-cities/regions/christchurch/locations/christchurch", mountains: [{ id: "port-hills", name: "Port Hills" }], beaches: [{ id: "sumner-beach", name: "Sumner Beach" }] }
    ]
  },
  {
    id: "southern-lakes-region", name: "Southern Lakes Region", description: "Alpine towns, lake shores and mountain country.", towns: [
      { id: "queenstown", name: "Queenstown", metServiceUrl: "https://www.metservice.com/towns-cities/regions/southern-lakes/locations/queenstown", mountains: [{ id: "ben-lomond", name: "Ben Lomond" }], beaches: [{ id: "queenstown-bay", name: "Queenstown Bay" }] },
      { id: "wanaka", name: "Wanaka", metServiceUrl: "https://www.metservice.com/towns-cities/regions/southern-lakes/locations/wanaka", mountains: [{ id: "mount-iron", name: "Mount Iron" }], beaches: [{ id: "lake-wanaka-waterfront", name: "Lake Wānaka Waterfront" }] }
    ]
  },
  {
    id: "otago-region", name: "Otago Region", description: "Dramatic hills, harbour edges and surf beaches.", towns: [
      { id: "dunedin", name: "Dunedin", metServiceUrl: "https://www.metservice.com/towns-cities/regions/dunedin/locations/dunedin", mountains: [{ id: "mount-cargill", name: "Mount Cargill" }], beaches: [{ id: "st-clair-beach", name: "St Clair Beach" }] }
    ]
  }
];

const regionIcons = {
  "auckland-region": "assets/region-auckland.svg",
  "wellington-region": "assets/region-wellington.svg",
  "canterbury-region": "assets/region-canterbury.svg",
  "southern-lakes-region": "assets/region-southern-lakes.svg",
  "otago-region": "assets/region-otago.svg"
};

const app = document.querySelector("#app");
const findRegion = (id) => regions.find((region) => region.id === id);
function findTown(id) {
  for (const region of regions) {
    const town = region.towns.find((item) => item.id === id);
    if (town) return { region, town };
  }
  return null;
}
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character])); }
function linkFor(hash, label) { return `<button class="crumb" data-hash="${hash}">${escapeHtml(label)}</button>`; }
function breadcrumbs(items) { return `<nav class="breadcrumbs" aria-label="Breadcrumb">${items.map((item, index) => `${index ? '<span class="crumb-separator" aria-hidden="true">/</span>' : ""}${item.hash ? linkFor(item.hash, item.label) : `<span aria-current="page">${escapeHtml(item.label)}</span>`}`).join("")}</nav>`; }
function regionCounts(region) { return region.towns.reduce((counts, town) => ({ towns: counts.towns + 1, mountains: counts.mountains + town.mountains.length, beaches: counts.beaches + town.beaches.length }), { towns: 0, mountains: 0, beaches: 0 }); }
function card({ icon, iconClass = "", title, description, meta = "", hash, className = "" }) {
  return `<button class="card ${className}" data-hash="${hash}"><span class="card-icon ${iconClass}" aria-hidden="true">${icon}</span><h3>${escapeHtml(title)}</h3>${description ? `<p>${escapeHtml(description)}</p>` : ""}${meta ? `<span class="card-meta">${meta}</span>` : ""}</button>`;
}

function renderHome() {
  app.innerHTML = `<section class="hero"><p class="eyebrow">New Zealand location guide</p><h1> Explore Aotearoa with confidence</h1><p>Find your destinations and connect directly to trusted weather, earthquake, volcano and water-safety information</p></section><div class="section-heading"><div><h2>Choose a region</h2><p>Start with a part of New Zealand.</p></div></div><section class="card-grid" aria-label="New Zealand regions">${regions.map((region) => { const counts = regionCounts(region); return card({ icon: `<img src="${regionIcons[region.id]}" alt="">`, title: region.name, description: region.description, meta: `<span class="pill">${counts.towns} ${counts.towns === 1 ? "town" : "towns"}</span><span class="pill">${counts.mountains} mountains</span><span class="pill">${counts.beaches} beaches</span>`, hash: `#/region/${region.id}` }); }).join("")}</section>`;
}
function renderRegion(region) {
  app.innerHTML = `${breadcrumbs([{ label: "Home", hash: "#/" }, { label: region.name }])}<section class="page-heading"><h1 class="page-title">${escapeHtml(region.name)}</h1><p class="page-intro">${escapeHtml(region.description)} Choose a town or city to continue.</p></section><div class="section-heading"><div><h2>City and town locations</h2><p>${region.towns.length} available ${region.towns.length === 1 ? "location" : "locations"}</p></div></div><section class="card-grid" aria-label="Towns and cities">${region.towns.map((town) => card({ icon: "⌂", title: town.name, description: "Explore mountains and beaches in this area.", meta: `<span class="pill">${town.mountains.length} mountains</span><span class="pill">${town.beaches.length} beaches</span>`, hash: `#/town/${town.id}` })).join("")}</section>`;
}
function renderTown(region, town) {
  const categories = [{ key: "mountains", icon: '<img src="assets/mountain-icon.svg" alt="">', iconClass: "mountain-icon", title: "Mountains", description: "Ranges, volcanic cones and alpine destinations.", items: town.mountains, className: "mountains" }, { key: "beaches", icon: '<img src="assets/sea-icon.svg" alt="">', iconClass: "sea-icon", title: "Beaches", description: "Coastal and lake locations with water-safety information.", items: town.beaches, className: "beaches" }];
  app.innerHTML = `${breadcrumbs([{ label: "Home", hash: "#/" }, { label: region.name, hash: `#/region/${region.id}` }, { label: town.name }])}<section class="page-heading"><h1 class="page-title">${escapeHtml(town.name)}</h1><p class="page-intro">What type of location are you looking for?</p></section><section class="card-grid category-grid" aria-label="Location categories">${categories.map((category) => card({ icon: category.icon, iconClass: category.iconClass, title: category.title, description: category.description, meta: `<span class="category-action">${category.items.length} ${category.items.length === 1 ? "location" : "locations"} · Explore ${category.title.toLowerCase()} →</span>`, hash: `#/category/${town.id}/${category.key}`, className: `category-card ${category.className}` })).join("")}</section>`;
}
function renderCategory(region, town, categoryKey) {
  const categoryName = categoryKey === "mountains" ? "Mountains" : "Beaches";
  const items = town[categoryKey] || [];
  app.innerHTML = `${breadcrumbs([{ label: "Home", hash: "#/" }, { label: region.name, hash: `#/region/${region.id}` }, { label: town.name, hash: `#/town/${town.id}` }, { label: categoryName }])}<section class="page-heading"><h1 class="page-title">${escapeHtml(town.name)} ${categoryName}</h1><p class="page-intro">Choose a location to see its relevant information services.</p></section>${items.length ? `<section class="card-grid" aria-label="${categoryName} locations">${items.map((item) => card({ icon: categoryKey === "mountains" ? '<img src="assets/mountain-icon.svg" alt="">' : '<img src="assets/sea-icon.svg" alt="">', iconClass: categoryKey === "mountains" ? "mountain-icon" : "sea-icon", title: item.name, description: categoryKey === "mountains" ? "Mountain and landscape information" : "Water and beach safety information", hash: `#/location/${town.id}/${categoryKey}/${item.id}`, className: "location-card" })).join("")}</section>` : `<div class="empty-state">There are no ${categoryName.toLowerCase()} locations listed here yet.</div>`}`;
}
function renderLocation(region, town, categoryKey, locationId) {
  const categoryName = categoryKey === "mountains" ? "Mountains" : "Beaches";
  const location = (town[categoryKey] || []).find((item) => item.id === locationId);
  if (!location) return renderNotFound();
  const locationServices = [{ name: "MetService", description: `Weather forecast for ${town.name}`, url: town.metServiceUrl }, services.earthquake];
  if (categoryKey === "mountains") locationServices.push(services.volcano);
  if (categoryKey === "beaches") locationServices.push({ ...services.safeSwim, url: location.safeSwimUrl || services.safeSwim.url });
  app.innerHTML = `${breadcrumbs([{ label: "Home", hash: "#/" }, { label: region.name, hash: `#/region/${region.id}` }, { label: town.name, hash: `#/town/${town.id}` }, { label: categoryName, hash: `#/category/${town.id}/${categoryKey}` }, { label: location.name }])}<section class="location-panel"><div class="location-summary"><p class="eyebrow">${escapeHtml(categoryName)} location</p><h2>${escapeHtml(location.name)}</h2><p>${escapeHtml(town.name)}, ${escapeHtml(region.name)}</p><p>Use the official services below for current conditions and safety information.</p></div><div class="service-panel"><h3>Information services</h3><div class="service-list">${locationServices.map((service) => `<a class="service-link" href="${service.url}" target="_blank" rel="noopener noreferrer"><span><strong>${escapeHtml(service.name)}</strong><small>${escapeHtml(service.description)}</small></span><span class="service-arrow" aria-hidden="true">↗</span></a>`).join("")}</div></div></section>`;
}
function renderNotFound() { app.innerHTML = `${breadcrumbs([{ label: "Home", hash: "#/" }, { label: "Not found" }])}<div class="empty-state"><h2>Location not found</h2><p>Return home and choose a location from the directory.</p></div>`; }
function parseHash() { const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean); if (!parts.length) return { view: "home" }; if (parts[0] === "region" && parts[1]) return { view: "region", regionId: parts[1] }; if (parts[0] === "town" && parts[1]) return { view: "town", townId: parts[1] }; if (parts[0] === "category" && parts[1] && parts[2]) return { view: "category", townId: parts[1], categoryKey: parts[2] }; if (parts[0] === "location" && parts[1] && parts[2] && parts[3]) return { view: "location", townId: parts[1], categoryKey: parts[2], locationId: parts[3] }; return { view: "not-found" }; }
function render() { const route = parseHash(); if (route.view === "home") return renderHome(); if (route.view === "region") { const region = findRegion(route.regionId); return region ? renderRegion(region) : renderNotFound(); } if (["town", "category", "location"].includes(route.view)) { const result = findTown(route.townId); if (!result) return renderNotFound(); if (route.view === "town") return renderTown(result.region, result.town); if (route.view === "category") return renderCategory(result.region, result.town, route.categoryKey); return renderLocation(result.region, result.town, route.categoryKey, route.locationId); } renderNotFound(); }
app.addEventListener("click", (event) => { const target = event.target.closest("[data-hash]"); if (target) location.hash = target.dataset.hash; });
window.addEventListener("hashchange", render);
render();
