/**
 * Türkiye Pazarı Araç Marka ve Model Listesi
 * Son Güncelleme: 2026
 * Türkiye'de satılmış/satılan tüm markalar ve modeller
 */

export const vehicleBrands = [
  "Alfa Romeo",
  "Audi",
  "BMW",
  "BYD",
  "Chery",
  "Chevrolet",
  "Chrysler",
  "Citroën",
  "Cupra",
  "Dacia",
  "Dodge",
  "DS Automobiles",
  "Ferrari",
  "Fiat",
  "Ford",
  "Geely",
  "GWM",
  "Honda",
  "Hummer",
  "Hyundai",
  "Infiniti",
  "Isuzu",
  "JAECOO",
  "Jaguar",
  "Jeep",
  "Kia",
  "Lancia",
  "Land Rover",
  "Lexus",
  "Maserati",
  "Mazda",
  "Mercedes-Benz",
  "MG",
  "Mini",
  "Mitsubishi",
  "Nissan",
  "Omoda",
  "Opel",
  "Ora",
  "Peugeot",
  "Porsche",
  "Renault",
  "Seat",
  "Skoda",
  "Smart",
  "Ssangyong",
  "Subaru",
  "Suzuki",
  "Tesla",
  "Togg",
  "Toyota",
  "Volkswagen",
  "Volvo",
];

export const vehicleModels: Record<string, string[]> = {
  "Alfa Romeo": [
    "145", "146", "147", "155", "156", "159", "166",
    "Brera", "Giulia", "Giulietta", "GT", "GTV", "MiTo",
    "Spider", "Stelvio", "Tonale", "Junior"
  ],
  
  "Audi": [
    "80", "90", "100", "A1", "A2", "A3", "A4", "A4 Allroad", "A5", "A6", "A6 Allroad", "A7", "A8",
    "Q2", "Q3", "Q3 Sportback", "Q4 e-tron", "Q4 Sportback e-tron", "Q5", "Q5 Sportback", 
    "Q7", "Q8", "Q8 e-tron", "Q8 Sportback e-tron",
    "RS3", "RS4", "RS5", "RS6", "RS7", "RSQ8",
    "S3", "S4", "S5", "S6", "S7", "S8", "SQ5", "SQ7", "SQ8",
    "TT", "TT RS", "TTS",
    "e-tron", "e-tron GT", "e-tron Sportback", "RS e-tron GT"
  ],
  
  "BMW": [
    "1 Serisi", "2 Serisi", "2 Serisi Active Tourer", "2 Serisi Gran Coupe", "2 Serisi Gran Tourer",
    "3 Serisi", "3 Serisi Gran Turismo", "3 Serisi Touring",
    "4 Serisi", "4 Serisi Gran Coupe",
    "5 Serisi", "5 Serisi Gran Turismo", "5 Serisi Touring",
    "6 Serisi", "6 Serisi Gran Coupe", "6 Serisi Gran Turismo",
    "7 Serisi", "8 Serisi", "8 Serisi Gran Coupe",
    "X1", "X2", "X3", "X3 M", "X4", "X4 M", "X5", "X5 M", "X6", "X6 M", "X7", "XM",
    "Z3", "Z4",
    "i3", "i4", "i5", "i7", "i8", "iX", "iX1", "iX3",
    "M2", "M3", "M4", "M5", "M8"
  ],
  
  "BYD": [
    "Atto 3", "Dolphin", "e6", "F3", "Han", "Seal", "Seal U", "Song Plus", "Tang"
  ],
  
  "Chery": [
    "Arrizo 5", "Arrizo 6", "Eastar", "QQ", "Tiggo", "Tiggo 2", "Tiggo 3", "Tiggo 4", 
    "Tiggo 5", "Tiggo 7", "Tiggo 7 Pro", "Tiggo 8", "Tiggo 8 Pro", "Tiggo 8 Pro Max"
  ],
  
  "Chevrolet": [
    "Aveo", "Aveo Sedan", "Camaro", "Captiva", "Corvette", "Cruze", "Cruze Station Wagon",
    "Epica", "Kalos", "Lacetti", "Matiz", "Nubira", "Orlando", "Spark", "Suburban", "Tahoe",
    "Trailblazer", "Trax", "Volt", "Silverado"
  ],
  
  "Chrysler": [
    "300C", "Grand Voyager", "PT Cruiser", "Sebring", "Voyager"
  ],
  
  "Citroën": [
    "Berlingo", "Berlingo Multispace", "C1", "C2", "C3", "C3 Aircross", "C3 Picasso", 
    "C4", "C4 Cactus", "C4 Picasso", "C4 X", "C5", "C5 Aircross", "C5 X", "C6",
    "C8", "C-Crosser", "C-Elysée", "DS3", "DS4", "DS5", "Jumpy", "Nemo", "Saxo",
    "Xantia", "Xsara", "Xsara Picasso", "ë-Berlingo", "ë-C4", "ë-C4 X", "ë-Jumpy"
  ],
  
  "Cupra": [
    "Ateca", "Born", "Formentor", "Leon", "Tavascan"
  ],
  
  "Dacia": [
    "Dokker", "Duster", "Jogger", "Lodgy", "Logan", "Logan MCV", "Sandero", "Sandero Stepway", "Spring"
  ],
  
  "Dodge": [
    "Avenger", "Caliber", "Challenger", "Charger", "Durango", "Journey", "Nitro", "RAM 1500", "Viper"
  ],
  
  "DS Automobiles": [
    "DS 3", "DS 3 Crossback", "DS 4", "DS 5", "DS 7", "DS 7 Crossback", "DS 9"
  ],
  
  "Ferrari": [
    "296 GTB", "296 GTS", "458", "488", "812", "California", "F8", "Portofino", "Roma", "SF90"
  ],
  
  "Fiat": [
    "124 Spider", "126", "127", "128", "131", "500", "500C", "500e", "500L", "500X",
    "600", "600e", "Albea", "Brava", "Bravo", "Cinquecento", "Doblo", "Ducato",
    "Egea", "Egea Cross", "Fiorino", "Grande Punto", "Idea", "Linea", "Marea",
    "Palio", "Panda", "Punto", "Punto Evo", "Qubo", "Scudo", "Sedici", "Seicento",
    "Siena", "Stilo", "Strada", "Tempra", "Tipo", "Ulysse", "Uno"
  ],
  
  "Ford": [
    "B-MAX", "Bronco", "Bronco Sport", "C-MAX", "Courier", "EcoSport", "Edge", "Escape",
    "Escort", "Explorer", "F-150", "Fiesta", "Flex", "Focus", "Focus C-MAX",
    "Fusion", "Galaxy", "Grand C-MAX", "Ka", "Kuga", "Mondeo", "Mustang", "Mustang Mach-E",
    "Puma", "Ranger", "S-MAX", "Taunus", "Taurus", "Tourneo Connect", "Tourneo Courier",
    "Tourneo Custom", "Transit", "Transit Connect", "Transit Courier", "Transit Custom"
  ],
  
  "Geely": [
    "Azkarra", "Coolray", "Emgrand", "Emgrand X7", "Geometry C", "Okavango", "Tugella"
  ],
  
  "GWM": [
    "Ora 03", "Poer", "Tank 300", "Tank 400", "Tank 500", "Wingle", "Wingle 5", "Wingle 7"
  ],
  
  "Honda": [
    "Accord", "City", "Civic", "Civic Tourer", "Civic Type R", "CR-V", "CR-Z", "e",
    "e:Ny1", "FR-V", "HR-V", "Insight", "Integra", "Jazz", "Legend", "NSX", "Odyssey",
    "Pilot", "Prelude", "S2000", "Stream"
  ],
  
  "Hummer": [
    "H2", "H3"
  ],
  
  "Hyundai": [
    "Accent", "Accent Blue", "Accent Era", "Atos", "Atos Prime", "Bayon", "Coupe",
    "Elantra", "Getz", "Genesis", "Genesis Coupe", "Grand Santa Fe", "Grandeur",
    "i10", "i20", "i20 Active", "i30", "i30 Fastback", "i30 N", "i30 Wagon", "i40",
    "Ioniq", "Ioniq 5", "Ioniq 5 N", "Ioniq 6", "ix20", "ix35", "ix55",
    "Kona", "Kona Electric", "Kona N", "Matrix", "Nexo", "Palisade", "Santa Fe",
    "Sonata", "Starex", "Staria", "Terracan", "Trajet", "Tucson", "Veloster", "Venue"
  ],
  
  "Infiniti": [
    "EX", "FX", "G", "M", "Q30", "Q50", "Q60", "Q70", "QX30", "QX50", "QX56", "QX60", "QX70", "QX80"
  ],
  
  "Isuzu": [
    "D-Max", "MU-X", "Trooper"
  ],
  
  "JAECOO": [
    "J7", "J8"
  ],
  
  "Jaguar": [
    "E-Pace", "F-Pace", "F-Type", "I-Pace", "S-Type", "X-Type", "XE", "XF", "XJ", "XK"
  ],
  
  "Jeep": [
    "Avenger", "Cherokee", "Commander", "Compass", "Grand Cherokee", "Grand Cherokee L",
    "Patriot", "Renegade", "Wagoneer", "Wrangler", "Wrangler Unlimited"
  ],
  
  "Kia": [
    "Carens", "Carnival", "Ceed", "Ceed Sportswagon", "Cerato", "EV6", "EV6 GT", "EV9",
    "Magentis", "Niro", "Niro EV", "Optima", "Picanto", "ProCeed", "Rio", "Sorento",
    "Soul", "Soul EV", "Sportage", "Stinger", "Stonic", "Venga", "XCeed"
  ],
  
  "Lancia": [
    "Delta", "Musa", "Thema", "Voyager", "Ypsilon"
  ],
  
  "Land Rover": [
    "Defender", "Defender 90", "Defender 110", "Defender 130", "Discovery", "Discovery 3",
    "Discovery 4", "Discovery 5", "Discovery Sport", "Freelander", "Freelander 2",
    "Range Rover", "Range Rover Evoque", "Range Rover Sport", "Range Rover Velar"
  ],
  
  "Lexus": [
    "CT", "ES", "GS", "IS", "LC", "LS", "LX", "NX", "RC", "RX", "RZ", "UX"
  ],
  
  "Maserati": [
    "Ghibli", "GranCabrio", "GranTurismo", "Grecale", "Levante", "MC20", "Quattroporte"
  ],
  
  "Mazda": [
    "2", "3", "3 MPS", "5", "6", "6 MPS", "121", "323", "626", "CX-3", "CX-30", "CX-5",
    "CX-50", "CX-60", "CX-7", "CX-8", "CX-80", "CX-9", "MX-3", "MX-5", "MX-30", "Premacy",
    "RX-7", "RX-8", "Tribute"
  ],
  
  "Mercedes-Benz": [
    "190", "A-Class", "AMG GT", "AMG GT 4-Door Coupe", "B-Class", "C-Class", "C-Class Coupe",
    "CL-Class", "CLA", "CLA Shooting Brake", "CLC-Class", "CLK-Class", "CLS", "CLS Shooting Brake",
    "E-Class", "E-Class All-Terrain", "E-Class Coupe", "EQA", "EQB", "EQC", "EQE", "EQE SUV",
    "EQS", "EQS SUV", "EQV", "G-Class", "GL-Class", "GLA", "GLB", "GLC", "GLC Coupe", "GLE",
    "GLE Coupe", "GLK-Class", "GLS", "M-Class", "Maybach S-Class", "R-Class", "S-Class",
    "S-Class Coupe", "SL-Class", "SLC", "SLK-Class", "V-Class", "Vaneo", "Viano", "Vito", "X-Class"
  ],
  
  "MG": [
    "3", "4", "5", "6", "HS", "Marvel R", "MG4", "MG5", "ZR", "ZS", "ZS EV", "ZT"
  ],
  
  "Mini": [
    "Clubman", "Countryman", "Cooper", "Cooper Cabrio", "Cooper Electric", "Cooper S", "One", "Paceman"
  ],
  
  "Mitsubishi": [
    "ASX", "Attrage", "Carisma", "Colt", "Eclipse", "Eclipse Cross", "Galant", "Grandis",
    "L200", "Lancer", "Lancer Evolution", "Outlander", "Outlander PHEV", "Pajero", "Pajero Sport",
    "Space Star"
  ],
  
  "Nissan": [
    "350Z", "370Z", "Almera", "Ariya", "Cube", "Juke", "Leaf", "Maxima", "Micra", "Murano",
    "Navara", "Note", "NV200", "NV300", "NV400", "Pathfinder", "Patrol", "Primastar", "Primera",
    "Pulsar", "Qashqai", "Qashqai+2", "Quest", "Sunny", "Terrano", "Tiida", "X-Trail", "X-Terra"
  ],
  
  "Omoda": [
    "C5", "E5"
  ],
  
  "Opel": [
    "Adam", "Agila", "Ampera", "Ampera-e", "Antara", "Astra", "Astra GTC", "Astra OPC",
    "Combo", "Combo Life", "Corsa", "Corsa-e", "Crossland", "Crossland X", "Frontera",
    "Grandland", "Grandland X", "Insignia", "Insignia Country Tourer", "Karl", "Meriva",
    "Mokka", "Mokka-e", "Mokka X", "Tigra", "Vectra", "Vivaro", "Zafira", "Zafira Life",
    "Zafira Tourer"
  ],
  
  "Ora": [
    "03", "07", "Good Cat"
  ],
  
  "Peugeot": [
    "106", "107", "108", "206", "206 CC", "207", "207 CC", "208", "2008", "208 GTi",
    "301", "306", "307", "307 CC", "308", "308 CC", "308 GTi", "308 SW", "3008",
    "405", "406", "407", "408", "4007", "4008", "508", "508 RXH", "508 SW", "5008",
    "607", "807", "Bipper", "Boxer", "Expert", "iOn", "Partner", "Partner Tepee",
    "RCZ", "Rifter", "Traveller", "e-208", "e-2008", "e-308", "e-Rifter", "e-Traveller"
  ],
  
  "Porsche": [
    "718 Boxster", "718 Cayman", "911", "911 Carrera", "911 GT3", "911 Turbo", "924", "928",
    "944", "968", "Boxster", "Cayenne", "Cayenne Coupe", "Cayman", "Macan", "Panamera", "Taycan"
  ],
  
  "Renault": [
    "Arkana", "Austral", "Captur", "Clio", "Clio Sport", "Clio Symbol", "Espace", "Express",
    "Fluence", "Grand Espace", "Grand Modus", "Grand Scenic", "Kadjar", "Kangoo", "Koleos",
    "Laguna", "Latitude", "Master", "Megane", "Megane CC", "Megane Coupe", "Megane E-Tech",
    "Megane RS", "Megane Scenic", "Modus", "Safrane", "Scenic", "Symbol", "Talisman",
    "Taliant", "Trafic", "Twingo", "Vel Satis", "Wind", "Zoe"
  ],
  
  "Seat": [
    "Alhambra", "Altea", "Altea XL", "Arona", "Arosa", "Ateca", "Cordoba", "Exeo", "Ibiza",
    "Leon", "Leon Cupra", "Leon ST", "Mii", "Tarraco", "Toledo"
  ],
  
  "Skoda": [
    "Citigo", "Enyaq Coupe iV", "Enyaq iV", "Fabia", "Felicia", "Kamiq", "Karoq", "Kodiaq",
    "Octavia", "Octavia Combi", "Octavia RS", "Octavia Scout", "Rapid", "Rapid Spaceback",
    "Roomster", "Scala", "Superb", "Superb Combi", "Yeti"
  ],
  
  "Smart": [
    "#1", "#3", "Forfour", "Fortwo", "Fortwo Cabrio", "Roadster"
  ],
  
  "Ssangyong": [
    "Actyon", "Korando", "Kyron", "Musso", "Rexton", "Rodius", "Tivoli", "Tivoli XLV", "XLV"
  ],
  
  "Subaru": [
    "BRZ", "Forester", "Impreza", "Legacy", "Levorg", "Outback", "Solterra", "Tribeca", "WRX",
    "WRX STI", "XV"
  ],
  
  "Suzuki": [
    "Alto", "Baleno", "Celerio", "Grand Vitara", "Ignis", "Jimny", "Kizashi", "Liana",
    "S-Cross", "SX4", "SX4 S-Cross", "Swift", "Swift Sport", "Vitara", "Wagon R+"
  ],
  
  "Tesla": [
    "Cybertruck", "Model 3", "Model S", "Model X", "Model Y", "Roadster"
  ],
  
  "Togg": [
    "T10S", "T10X"
  ],
  
  "Toyota": [
    "4Runner", "Auris", "Avensis", "Avensis Verso", "Aygo", "Aygo X", "bZ4X", "C-HR",
    "Camry", "Carina", "Celica", "Corolla", "Corolla Cross", "Corolla Sedan", "Corolla Verso",
    "FJ Cruiser", "GT86", "Hiace", "Highlander", "Hilux", "iQ", "Land Cruiser",
    "Land Cruiser Prado", "MR2", "Previa", "Prius", "Prius Plug-in", "Proace", "Proace City",
    "Proace Verso", "RAV4", "Sequoia", "Supra", "Tacoma", "Tundra", "Urban Cruiser", "Verso",
    "Verso-S", "Yaris", "Yaris Cross"
  ],
  
  "Volkswagen": [
    "Amarok", "Arteon", "Arteon Shooting Brake", "Beetle", "Bora", "Caddy", "Caddy Maxi",
    "California", "Caravelle", "CC", "Crafter", "Eos", "Fox", "Golf", "Golf GTD", "Golf GTI",
    "Golf Plus", "Golf R", "Golf Sportsvan", "Golf Variant", "ID.3", "ID.4", "ID.5", "ID.7",
    "ID. Buzz", "Jetta", "Lupo", "Multivan", "New Beetle", "Passat", "Passat Alltrack",
    "Passat CC", "Passat Variant", "Phaeton", "Polo", "Scirocco", "Sharan", "T-Cross",
    "T-Roc", "T-Roc Cabrio", "Taigo", "Tiguan", "Tiguan Allspace", "Touareg", "Touran", "Transporter", "Up!"
  ],
  
  "Volvo": [
    "240", "340", "440", "460", "850", "940", "960", "C30", "C40 Recharge", "C70", "EX30",
    "EX90", "S40", "S60", "S70", "S80", "S90", "V40", "V40 Cross Country", "V50", "V60",
    "V60 Cross Country", "V70", "V90", "V90 Cross Country", "XC40", "XC40 Recharge", "XC60",
    "XC70", "XC90"
  ],
};
