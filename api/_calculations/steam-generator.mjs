// src/calculations/steam-generator.mjs
export function calcularGeneracionVapor({ flujo_vapor, entalpia, eficiencia = 0.85 }) {
    console.log("5.1 - API Calculating Steam Generation");
    if (!flujo_vapor || !entalpia) {
        return { error: "Steam flow and enthalpy are required.." };
    }
 // Datos que entran m = flujo (lb/h), h = entalpía (btu/lb), η = eficiencia
 flujo_vapor= flujo_vapor*0.45359237; //Convirtiendo lb a kg (1 kg/2.205 lb)
 entalpia=entalpia*2.326;//Convirtiendo Btu/lb a kJ/kg (2.32 kj/kg)
    // Fórmula básica: Q = m * h * η
    // m = flujo (kg/h), h = entalpía (kJ/kg), η = eficiencia
    const energia_termica = Math.round(flujo_vapor * entalpia * eficiencia);
    console.log("5.2 - API Thermal Energy:", energia_termica);
    return {
        unidad: "btu/h",
        energia_termica,
        detalles: {
            flujo: flujo_vapor,
            entalpia: entalpia,
            eficiencia_aplicada: eficiencia
        }
    };
}