//calories-burned
/**
 * Calcula las calorías quemadas basándose en datos ENVIADOS en unidades inglesas.
 * Internamente convierte a unidades internacionales antes de aplicar el cálculo MET.
 *
 * @param {object} datos - Datos en unidades inglesas.
 * @param {number} datos.peso - Peso en libras (lb).
 * @param {number} datos.duracionCaminata - Duración en minutos.
 * @param {number} datos.cantidadPasos - Número total de pasos.
 * @param {number} datos.metroPaso - Longitud del paso en pies (ft).
 * @returns {object} JSON con calorías quemadas y detalles.
 */
export function calcularCalorias(datos) {
    let { peso, duracionCaminata, cantidadPasos, metroPaso } = datos;
    console.log ("4.1 API Calories burned ");
    // -----------------------------
    // 1. VALIDACIÓN DE ENTRADA
    // -----------------------------
    if (
        peso <= 0 ||
        duracionCaminata <= 0 ||
        cantidadPasos <= 0 ||
        metroPaso <= 0
    ) {
        return { error: "Todos los valores deben ser mayores que cero." };
    }

    // -----------------------------
    // 2. CONVERSIONES A UNIDADES INTERNACIONALES
    // -----------------------------
    const pesoKg = peso / 2.20462;               // lb → kg
    const duracionHoras = duracionCaminata / 60; // min → h
    const pasoMetros = metroPaso / 3.28084;      // ft → m

    // Distancia total recorrida en km
    const distanciaKm = (cantidadPasos * pasoMetros) / 1000;

    // Velocidad en km/h
    const velocidad = distanciaKm / duracionHoras;

    // -----------------------------
    // 3. DETERMINAR MET SEGÚN VELOCIDAD
    // -----------------------------
    let met;

    if (velocidad <= 2) met = 2.0;
    else if (velocidad <= 3.2) met = 2.8;
    else if (velocidad <= 4.0) met = 3.0;
    else if (velocidad <= 4.8) met = 3.5;
    else if (velocidad <= 5.6) met = 4.3;
    else if (velocidad <= 6.4) met = 5.0;
    else if (velocidad <= 8) met = 7.0;
    else if (velocidad <= 9.7) met = 8.3;
    else if (velocidad <= 12) met = 9.8;
    else if (velocidad <= 16) met = 11.8;
    else met = 14.5;

    // -----------------------------
    // 4. CÁLCULO DE CALORÍAS
    // -----------------------------
    const calorias = pesoKg * duracionHoras * met;
    console.log ("4.2 API Calories burned: " , calorias);
    return {
        caloriasQuemadas: Number(calorias.toFixed(2)),
        detalles: {
            pesoKg,
            duracionHoras,
            cantidadPasos,
            pasoMetros,
            distanciaKm,
            velocidadKmH: velocidad,
            met
        }
    };
}