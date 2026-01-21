let marker;

// Map setup
const map = L.map('map').setView([30.0444, 31.2357], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Add marker on click
map.on('click', function (e) {
    if (marker) map.removeLayer(marker);
    marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
});


// Levenshtein distance for fuzzy matching
function levenshtein(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

// Zones list
const zones = {
    "basatein": ["basatein", "basateen"],
    "tahrir": ["sayeda zaineb", "downtown", "manial", "misr kadima", "kasr el aini", "garden plaza"],
    "maadi": ["maadi", "zahraa maadi"],
    "new cairo": ["new cairo"],
    "nasr": ["nasr city"],
    "badr": ["badr", "obour", "salam", "madinaty", "shorouq"],
    "helwan": ["helwan"],
    "mohandeseen": ["mohandeseen", "mohandesien", "mohandesin"],
    "shoubra": ["shoubra"],
    "imbaba": ["imbaba", "kawmeia", "waraq"],
    "giza": ["giza", "giza square", "cairo uni", "cairo university"],
    "mokattam": ["mokattam"],
    "october": ["october"],
    "moneib": ["moneib"],
    "bahr": ["bahr el a3zam", "bahr el azzam", "bahr el aazam"]
};

// fallback rules
const fallback = {
    "agouza": "mohandeseen",
    "dokki": "mohandeseen",
    "zamalek": "mohandeseen",
    "6th of october": "october",
    "obour": "badr",
    "madinaty": "badr",
    "new cairo": "new cairo",
    "cairo": "tahrir",
    "giza": "giza"
};

function getRouteText(zone) {
    zone = zone.toLowerCase();

    if (zones["basatein"].includes(zone)) return "erkab metro hadayek el maadi aw maadi w mn henak enzl sadat w erkab mn mawkaf abd el men3m reyad le hyper 1";
    if (zones["tahrir"].includes(zone)) return "erkab le el tahrir w mn henak erkab le hyper one";
    if (zones["maadi"].includes(zone)) return "momken trkab metro w tnzl sadat w trkb mn mawkaf henak aw trkb 3arbeyat tahrir mn Arab maadi w erkab hyper mn henak";
    if (zones["new cairo"].includes(zone)) return "erkab ay haga twadeik tahrir(bus mwaslt masr) aw erkb le ramseis w mn henak erkab le hyper";
    if (zones["nasr"].includes(zone)) return "erkab le ramses aw tahrir w mn henak erkab hyper";
    if (zones["badr"].includes(zone)) return "erkab maw2af el salam w mn henak erkab hyper";
    if (zones["helwan"].includes(zone)) return "erkab metro lhad mhata sadat w mn henak erkab mn mawkaf abd el men3m reiad le hyper";
    if (zones["mohandeseen"].includes(zone)) return "law enta orayeb mn meidan lebnan erkab mn henak le hyper law enta orayeb mn metro tawfikia mmken trkab mn henak 3alatol le hyper";
    if (zones["shoubra"].includes(zone)) return "erkab metro le sadat w mn henak roo7 le mawkaf abd el men3m reyad w erkab le hyper";
    if (zones["imbaba"].includes(zone)) return "mmkn terkab metro le mahta tawfikia w tmshi lehad medan lebnan (10 minute walk) w mn henak erkab le hyper";
    if (zones["giza"].includes(zone)) return "momken trkab bus M21 hynzelak 3and el gam3a or mmkn terkab M20 w tnzl 3and hyper";
    if (zones["mokattam"].includes(zone)) return "erkab tahrir w mn henak erkab le hyper";
    if (zones["october"].includes(zone)) return "erkab bus M10 w enzl 3and hyper";
    if (zones["moneib"].includes(zone)) return "erkb le hyper 3alatol";
    if (zones["bahr"].includes(zone)) return "erkb le hyper 3alatol";

    return "unknown";
}

// reverse geocode using OSM
function detectZone(lat, lng) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

    return fetch(url)
        .then(res => res.json())
        .then(data => {
            const zone = data.address.city_district || data.address.suburb || data.address.neighbourhood || data.address.village || data.address.town || data.address.city;
            return zone || "unknown";
        });
}

// fuzzy match zone
function fuzzyZoneMatch(zoneName) {
    zoneName = zoneName.toLowerCase();

    // exact match
    for (const z in zones) {
        for (const name of zones[z]) {
            if (name === zoneName) return z;
        }
    }

    // fuzzy match using Levenshtein
    let best = { zone: null, distance: Infinity };

    for (const z in zones) {
        for (const name of zones[z]) {
            const dist = levenshtein(zoneName, name);
            if (dist < best.distance) {
                best = { zone: z, distance: dist };
            }
        }
    }

    if (best.distance <= 2) return best.zone;

    // fallback rules
    for (const key in fallback) {
        if (zoneName.includes(key)) return fallback[key];
    }

    return "unknown";
}

// generate output
async function generateRoute() {
    if (!marker) {
        alert("Please select your location on the map.");
        return;
    }

    const { lat, lng } = marker.getLatLng();
    const rawZone = await detectZone(lat, lng);

    const matchedZone = fuzzyZoneMatch(rawZone);
    const text = getRouteText(matchedZone);

    document.getElementById("result").innerText =
        `Region detected: ${rawZone}\nMatched zone: ${matchedZone}\nRoute:\n${text}`;
}
