// =====================
// ADMIN CONTROLS ZONE
// =====================
const ADMIN_SELECTED_ZONE = "MAADI";
// MAADI | DOWNTOWN | SHEIKH_ZAYED | TAGMO3

// Zone texts
const zoneText = {
    MAADI: "This area is known for its greenery and residential calm.",
    DOWNTOWN: "This area is highly urban with strong commercial activity.",
    SHEIKH_ZAYED: "This zone features modern compounds and wide roads.",
    TAGMO3: "This area is a premium residential and business district."
};

// =====================
// CAIRO + GIZA BOUNDS
// =====================
const CAIRO_GIZA_BOUNDS = {
    north: 30.20,
    south: 29.85,
    west: 30.85,
    east: 31.60
};

// Initialize map (centered on Cairo)
const map = L.map('map', {
    maxBounds: [
        [CAIRO_GIZA_BOUNDS.south, CAIRO_GIZA_BOUNDS.west],
        [CAIRO_GIZA_BOUNDS.north, CAIRO_GIZA_BOUNDS.east]
    ],
    maxBoundsViscosity: 1.0
}).setView([30.0444, 31.2357], 11);

let marker;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Click handling
map.on('click', function (e) {
    const { lat, lng } = e.latlng;

    // Check if inside Cairo/Giza
    if (
        lat > CAIRO_GIZA_BOUNDS.north ||
        lat < CAIRO_GIZA_BOUNDS.south ||
        lng < CAIRO_GIZA_BOUNDS.west ||
        lng > CAIRO_GIZA_BOUNDS.east
    ) {
        alert("Location must be inside Cairo or Giza.");
        return;
    }

    if (marker) {
        map.removeLayer(marker);
    }

    marker = L.marker([lat, lng]).addTo(map);
});

// Generate result
function generateText() {
    const district = document.getElementById("districtInput").value.trim();

    if (!district) {
        alert("Please enter your district.");
        return;
    }

    if (!marker) {
        alert("Please select a location inside Cairo or Giza.");
        return;
    }

    const resultText = `
District entered: ${district}
Admin-selected zone: ${ADMIN_SELECTED_ZONE}
Generated text: ${zoneText[ADMIN_SELECTED_ZONE]}
    `;

    document.getElementById("result").innerText = resultText;
}
