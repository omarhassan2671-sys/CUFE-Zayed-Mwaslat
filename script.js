function generateRoute() {
    const region = document.getElementById("regionInput").value.trim().toLowerCase();

    let output = "المنطقة غير موجودة في القائمة.";

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

    if (basatein.includes(region)) {
        output = "erkab metro hadayek el maadi aw maadi w mn henak enzl sadat w erkab mn mawkaf abd el men3m reyad le hyper 1";
    } else if (tahrir.includes(region)) {
        output = "erkab le el tahrir w mn henak erkab le hyper one";
    } else if (maadi.includes(region)) {
        output = "momken trkab metro w tnzl sadat w trkb mn mawkaf henak aw trkb 3arbeyat tahrir mn Arab maadi w erkab hyper mn henak";
    } else if (newCairo.includes(region)) {
        output = "erkab ay haga twadeik tahrir(bus mwaslt masr) aw erkb le ramseis w mn henak erkab le hyper";
    } else if (nasr.includes(region)) {
        output = "erkab le ramses aw tahrir w mn henak erkab hyper";
    } else if (badr.includes(region)) {
        output = "erkab maw2af el salam w mn henak erkab hyper";
    } else if (helwan.includes(region)) {
        output = "erkab metro lhad mhata sadat w mn henak erkab mn mawkaf abd el men3m reiad le hyper";
    } else if (mohandesien.includes(region)) {
        output = "law enta orayeb mn meidan lebnan erkab mn henak le hyper law enta orayeb mn metro tawfikia mmken trkab mn henak 3alatol le hyper";
    } else if (shoubra.includes(region)) {
        output = "erkab metro le sadat w mn henak roo7 le mawkaf abd el men3m reyad w erkab le hyper";
    } else if (imbaba.includes(region)) {
        output = "mmkn terkab metro le mahta tawfikia w tmshi lehad medan lebnan (10 minute walk) w mn henak erkab le hyper";
    } else if (giza.includes(region)) {
        output = "momken trkab bus M21 hynzelak 3and el gam3a or mmkn terkab M20 w tnzl 3and hyper";
    } else if (mokattam.includes(region)) {
        output = "erkab tahrir w mn henak erkab le hyper";
    } else if (october.includes(region)) {
        output = "erkab bus M10 w enzl 3and hyper";
    } else if (moneib.includes(region)) {
        output = "erkb le hyper 3alatol";
    } else if (bahr.includes(region)) {
        output = "erkb le hyper 3alatol";
    }

    document.getElementById("result").innerText = output;
}
