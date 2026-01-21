let marker;

// Map setup
const map = L.map('map').setView([30.0444, 31.2357], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Click to add marker
map.on('click', function (e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    if (marker) {
        map.removeLayer(marker);
    }
    marker = L.marker([lat, lng]).addTo(map);
});

// Region detection based on coordinates (approx)
function getRegion(lat, lng) {
    // Basatein
    if (lat >= 29.95 && lat <= 30.00 && lng >= 31.25 && lng <= 31.30) return "basatein";

    // Downtown / Tahrir
    if (lat >= 30.03 && lat <= 30.07 && lng >= 31.22 && lng <= 31.27) return "tahrir";

    // Maadi
    if (lat >= 29.95 && lat <= 30.00 && lng >= 31.20 && lng <= 31.28) return "maadi";

    // Nasr City
    if (lat >= 30.05 && lat <= 30.12 && lng >= 31.26 && lng <= 31.35) return "nasr";

    // Giza
    if (lat >= 29.97 && lat <= 30.02 && lng >= 31.18 && lng <= 31.24) return "giza";

    // Shoubra
    if (lat >= 30.07 && lat <= 30.10 && lng >= 31.20 && lng <= 31.27) return "shoubra";

    // Helwan
    if (lat >= 29.80 && lat <= 29.90 && lng >= 31.20 && lng <= 31.35) return "helwan";

    // Mohandeseen
    if (lat >= 30.04 && lat <= 30.07 && lng >= 31.20 && lng <= 31.24) return "mohandeseen";

    // Imbaba / Kawmeia / Waraq
    if (lat >= 30.06 && lat <= 30.11 && lng >= 31.15 && lng <= 31.20) return "imbaba";

    // Mokattam
    if (lat >= 29.98 && lat <= 30.03 && lng >= 31.28 && lng <= 31.35) return "mokattam";

    // October
    if (lat >= 29.95 && lat <= 30.00 && lng >= 31.00 && lng <= 31.10) return "october";

    // Moneib
    if (lat >= 29.95 && lat <= 29.99 && lng >= 31.05 && lng <= 31.15) return "moneib";

    // Bahr El Azzam
    if (lat >= 30.00 && lat <= 30.05 && lng >= 31.12 && lng <= 31.20) return "bahr";

    return "unknown";
}

// Text output based on region
function getRouteText(region) {
    switch (region) {
        case "basatein":
            return "erkab metro hadayek el maadi aw maadi w mn henak enzl sadat w erkab mn mawkaf abd el men3m reyad le hyper 1";
        case "tahrir":
            return "erkab le el tahrir w mn henak erkab le hyper one";
        case "maadi":
            return "momken trkab metro w tnzl sadat w trkb mn mawkaf henak aw trkb 3arbeyat tahrir mn Arab maadi w erkab hyper mn henak";
        case "nasr":
            return "erkab le ramses aw tahrir w mn henak erkab hyper";
        case "badr":
            return "erkab maw2af el salam w mn henak erkab hyper";
        case "helwan":
            return "erkab metro lhad mhata sadat w mn henak erkab mn mawkaf abd el men3m reiad le hyper";
        case "mohandeseen":
            return "law enta orayeb mn meidan lebnan erkab mn henak le hyper law enta orayeb mn metro tawfikia mmken trkab mn henak 3alatol le hyper";
        case "shoubra":
            return "erkab metro le sadat w mn henak roo7 le mawkaf abd el men3m reyad w erkab le hyper";
        case "imbaba":
            return "mmkn terkab metro le mahta tawfikia w tmshi lehad medan lebnan (10 minute walk) w mn henak erkab le hyper";
        case "giza":
            return "momken trkab bus M21 hynzelak 3and el gam3a or mmkn terkab M20 w tnzl 3and hyper";
        case "mokattam":
            return "erkab tahrir w mn henak erkab le hyper";
        case "october":
            return "erkab bus M10 w enzl 3and hyper";
        case "moneib":
            return "erkb le hyper 3alatol";
        case "bahr":
            return "erkb le hyper 3alatol";
        default:
            return "Region not found. Please select another point on the map.";
    }
}

function generateRoute() {
    if (!marker) {
        alert("Please select your location on the map.");
        return;
    }

    const { lat, lng } = marker.getLatLng();
    const region = getRegion(lat, lng);
    const text = getRouteText(region);

    document.getElementById("result").innerText = text;
}
