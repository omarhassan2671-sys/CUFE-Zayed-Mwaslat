let marker;

// Create map
const map = L.map('map').setView([30.0444, 31.2357], 11);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Add marker on click
map.on('click', function (e) {
    if (marker) map.removeLayer(marker);

    marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
});


// Convert zone name to correct route text
function getRouteText(zone) {
    zone = zone.toLowerCase();

    const basatein = ["basatein", "basateen"];
    const tahrir = ["sayeda zaineb", "downtown", "manial", "misr kadima", "kasr el aini", "garden plaza"];
    const maadi = ["maadi", "zahraa maadi"];
    const newCairo = ["new cairo"];
    const nasr = ["nasr city"];
    const badr = ["badr", "obour", "salam", "madinaty", "shorouq"];
    const helwan = ["helwan"];
    const mohandesien = ["mohandeseen", "mohandesien"];
    const shoubra = ["shoubra"];
    const imbaba = ["imbaba", "kawmeia", "waraq"];
    const giza = ["giza", "giza square", "cairo uni", "cairo university"];
    const mokattam = ["mokattam"];
    const october = ["october"];
    const moneib = ["moneib"];
    const bahr = ["bahr el a3zam", "bahr el azzam", "bahr el aazam"];

    if (basatein.includes(zone)) return "erkab metro hadayek el maadi aw maadi w mn henak enzl sadat w erkab mn mawkaf abd el men3m reyad le hyper 1";
    if (tahrir.includes(zone)) return "erkab le el tahrir w mn henak erkab le hyper one";
    if (maadi.includes(zone)) return "momken trkab metro w tnzl sadat w trkb mn mawkaf henak aw trkb 3arbeyat tahrir mn Arab maadi w erkab hyper mn henak";
    if (newCairo.includes(zone)) return "erkab ay haga twadeik tahrir(bus mwaslt masr) aw erkb le ramseis w mn henak erkab le hyper";
    if (nasr.includes(zone)) return "erkab le ramses aw tahrir w mn henak erkab hyper";
    if (badr.includes(zone)) return "erkab maw2af el salam w mn henak erkab hyper";
    if (helwan.includes(zone)) return "erkab metro lhad mhata sadat w mn henak erkab mn mawkaf abd el men3m reiad le hyper";
    if (mohandesien.includes(zone)) return "law enta orayeb mn meidan lebnan erkab mn henak le hyper law enta orayeb mn metro tawfikia mmken trkab mn henak 3alatol le hyper";
    if (shoubra.includes(zone)) return "erkab metro le sadat w mn henak roo7 le mawkaf abd el men3m reyad w erkab le hyper";
    if (imbaba.includes(zone)) return "mmkn terkab metro le mahta tawfikia w tmshi lehad medan lebnan (10 minute walk) w mn henak erkab le hyper";
    if (giza.includes(zone)) return "momken trkab bus M21 hynzelak 3and el gam3a or mmkn terkab M20 w tnzl 3and hyper";
    if (mokattam.includes(zone)) return "erkab tahrir w mn henak erkab le hyper";
    if (october.includes(zone)) return "erkab bus M10 w enzl 3and hyper";
    if (moneib.includes(zone)) return "erkb le hyper 3alatol";
    if (bahr.includes(zone)) return "erkb le hyper 3alatol";

    return "Region not found. Please select another point on the map.";
}


// Reverse geocode to detect the zone
function detectZone(lat, lng) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

    return fetch(url)
        .then(res => res.json())
        .then(data => {
            const zone = data.address.city_district || data.address.suburb || data.address.neighbourhood || data.address.village || data.address.town;
            return zone || "unknown";
        });
}


// Generate route
async function generateRoute() {
    if (!marker) {
        alert("Please select your location on the map.");
        return;
    }

    const { lat, lng } = marker.getLatLng();
    const zone = await detectZone(lat, lng);
    const text = getRouteText(zone);

    document.getElementById("result").innerText = `Region: ${zone}\n\nRoute:\n${text}`;
}
