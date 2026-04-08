export function calcularHuellaCarbono({ state, elect = 0, gas = 0, water = 0, lpg = 0, gn = 0, fly = 0, cogs = 0, person = 1 }) {
    console.log("3.1 API Calculating Carbon Footprint");
    // Validación del estado
    if (!state || state === "Select your State") {
        return { error: "Estado inválido o no seleccionado" };
    }

    // Datos de emisiones per-cápita de los 50 estados en libras de CO2/mes
    //DATA REAL BASE (EIA 2023 – tons/year per capita)
    //1 metric ton CO2 = 2204.62 lb - lb/month = (tons/year × 2204.62) / 12
    
    const emisionesPerCapitaPorEstado = {
    "AL": 2900, "AK": 6500, "AZ": 1900, "AR": 3000, "CA": 1300,
    "CO": 2100, "CT": 1500, "DE": 2000, "FL": 1600, "GA": 1800,
    "HI": 1600, "ID": 1700, "IL": 2200, "IN": 3500, "IA": 3300,
    "KS": 3200, "KY": 3600, "LA": 5200, "ME": 1500, "MD": 1400,
    "MA": 1200, "MI": 2300, "MN": 2100, "MS": 3400, "MO": 2900,
    "MT": 3800, "NE": 3600, "NV": 1900, "NH": 1400, "NJ": 1500,
    "NM": 3300, "NY": 1200, "NC": 1700, "ND": 9500, "OH": 2600,
    "OK": 3400, "OR": 1400, "PA": 2500, "RI": 1400, "SC": 2000,
    "SD": 2600, "TN": 1900, "TX": 3500, "UT": 2700, "VT": 1300,
    "VA": 1800, "WA": 1400, "WV": 5500, "WI": 2300, "WY": 11000
};

    // Emisiones promedio perCapita nacionales y mundial (libras de CO2/mes)
    const promedioUSA = 2700.00; // Promedio nacional EE.UU.
    const promedioMundial = 863.00; // Promedio mundial

    // Coeficientes de cálculo utilizados 
    //fuentes EPA / EIA / ICAO / ATAG (2023 - 2024–2025).
    //CO2_flight_per_mile =B737: 0.38, B777: 0.45, B787: 0.33, A319: 0.36, A350: 0.34, A380: 0.50
    const coef_fly = fly < 1000 ? 0.41 : 0.17;
    // Cálculos individuales
    const e = Math.round(elect * 0.85) || 0;
    const t = Math.round(gas * 19.6) || 0;
    const c = Math.round(water * 0.054) || 0;
    const l = Math.round(lpg * 3) || 0;
    const o = Math.round(gn * 0.117) || 0;
    const f = Math.round(fly * coef_fly) || 0;
    const u = Math.round(cogs * 0.77) || 0;

    // Cálculo total
    const resultado = Math.round(e + t + c + l + o + f + u);
    const estado=state;
    const per_capita = Math.round(resultado/person);

    // Emisiones del estado seleccionado
    const per_capita_estado = emisionesPerCapitaPorEstado[state] || 0;

    // Cálculos comparativos
    const porcentEstado = Math.round((per_capita/per_capita_estado) * 100);
    const porcentUSA = Math.round((per_capita/promedioUSA) * 100);
    const porcentM = Math.round((per_capita/promedioMundial ) * 100);

    console.log("3.2 API carbon footprint:" ,  resultado );
    // Retornar los resultados
    return {
        data: {state, elect, gas , water , lpg , gn , fly , cogs, person} ,
       estado,
        total: resultado,
        per_capita,
        per_capita_estado,
        promedioUSA,
        promedioMundial,
        porcentEstado,
        porcentUSA,
        porcentM,
        libras_co2: { elect: e, gas: t, water: c, lpg: l, gn: o, fly: f, cogs: u }
    };
     
}

