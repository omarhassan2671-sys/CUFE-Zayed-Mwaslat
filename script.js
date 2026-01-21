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

// Zones list with all spelling variations
const zones = {
    "basatein": ["basatein", "basateen", "basaetien", "basaatein", "dar el salam", "dar elsalam", "dar el salem", "el salam city", "salam city"],
    "tahrir": ["sayeda zaineb", "sayeda zainab", "downtown", "manial", "el manial", "al manial", "el-mania", "el maniya", "maniya", "misr kadima", "misr el qadima", "kasr el aini", "garden plaza"],
    "maadi": ["maadi", "ma'adi", "maadiy", "zahraa maadi", "zahraa el maadi"],
    "new cairo": ["new cairo", "cairo new", "cairo new city"],
    "nasr": ["nasr city", "nasr", "nasr city"],
    "badr": ["badr", "obour", "obour city", "salam", "madinaty", "shorouq", "shorooq", "sheraton", "sheraton city"],
    "helwan": ["helwan"],
    "mohandeseen": ["mohandeseen", "mohandesien", "mohandesin", "mohandisin", "mohandseen"],
    "shoubra": ["shoubra", "shubra"],
    "imbaba": ["imbaba", "kawmeia", "waraq", "waraq"],
    "giza": ["giza", "giza square", "cairo uni", "cairo university", "al jiza"],
    "mokattam": ["mokattam", "mokatam"],
    "october": ["october", "6th of october", "6 october", "oct"],
    "moneib": ["moneib", "moneeb"],
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
    "giza": "giza",
    "helwan": "helwan",
    "nasr": "nasr",
    "maadi": "maadi",
    "sheraton": "badr",
    "dar el salam": "basatein",
    "dar elsalam": "basatein",
    "el salam city": "basatein",
    "salam city": "basatein"
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
    if (zones["giza"].includes(zone)) return "momken trkab bus M21 hynzelak 3and el gam3a or mmkn terkab M20 w tnzl 3and hyper aw law enta orayeb mn meidan el giza erkab mn henak hyper 3alatol";
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
            return {
                city_district: data.address.city_district || "",
                suburb: data.address.suburb || "",
                neighbourhood: data.address.neighbourhood || "",
                village: data.address.village || "",
                town: data.address.town || "",
                city: data.address.city || "",
                county: data.address.county || "",
                state: data.address.state || ""
            };
        });
}

// fuzzy match zone
function fuzzyZoneMatch(zoneData) {
    const allNames = [
        zoneData.neighbourhood,
        zoneData.suburb,
        zoneData.city_district,
        zoneData.city,
        zoneData.county,
        zoneData.state
    ].filter(Boolean);

    // try each name in order
    for (const name of allNames) {
        const result = matchName(name);
        if (result !== "unknown") return result;
    }

    // fallback to closest fuzzy
    const combined = allNames.join(" ");
    return matchName(combined);
}

function matchName(name) {
    name = name.toLowerCase();

    // exact match
    for (const z in zones) {
        for (const n of zones[z]) {
            if (n === name) return z;
        }
    }

    // fuzzy match
    let best = { zone: null, distance: Infinity };

    for (const z in zones) {
        for (const n of zones[z]) {
            const dist = levenshtein(name, n);
            if (dist < best.distance) {
                best = { zone: z, distance: dist };
            }
        }
    }

    if (best.distance <= 3) return best.zone;

    // fallback rules
    for (const key in fallback) {
        if (name.includes(key)) return fallback[key];
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
    const zoneData = await detectZone(lat, lng);

    const matchedZone = fuzzyZoneMatch(zoneData);
    const text = getRouteText(matchedZone);

    document.getElementById("result").innerText =
        `Detected: ${zoneData.neighbourhood || zoneData.suburb || zoneData.city_district || zoneData.city}\nMatched zone: ${matchedZone}\nRoute:\n${text}`;
}
