/** nav.mjs
 * * Función maestra para peticiones a la API Energyner Gateway
 * Centraliza la lógica de fetch, manejo de errores y headers.
 */
async function apiPost(endpoint, data) {
    // Detectamos si estamos en local o en producción para ajustar la URL
    // En Vercel, al usar rutas relativas '/api/...' el navegador usa el dominio actual automáticamente.
    const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3002/api' 
        : '/api';

    try {
        const response = await fetch(`${baseUrl}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Error en el servidor');
        }
        return result;
    } catch (error) {
        console.error(`Error en API [${endpoint}]:`, error);
        return null;
    }
}

// --- 1. API CONSUMO ENERGÉTICO ---
document.getElementById('consumo-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        potencia: document.getElementById('potencia').value,
        horas: document.getElementById('horas').value
    };
    const data = await apiPost('consumo-energetico', payload);
    if (data) {
        document.getElementById('resultadoConsumo').innerText = 
            `Energy Consumption: ${data.consumo_energetico} kWh`;
    }
});

// --- 2. API PRODUCCIÓN SOLAR ---
document.getElementById('produccion-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        area: document.getElementById('area').value,
        irradiacion: document.getElementById('irradiacion').value,
        eficiencia: document.getElementById('eficiencia').value
    };
    const data = await apiPost('produccion-solar', payload);
    if (data) {
        document.getElementById('resultadoSolar').innerText = 
            `Solar Production: ${data.produccion_solar} kWh`;
    }
});

// --- 3. API HUELLA DE CARBONO ---
document.getElementById('calcular').addEventListener('click', async (e) => {
    e.preventDefault();
    const payload = {
        state: document.getElementById("state").value,
        elect: parseFloat(document.getElementById("elect").value) || 0,
        gas: parseFloat(document.getElementById("gas").value) || 0,
        water: parseFloat(document.getElementById("water").value) || 0,
        lpg: parseFloat(document.getElementById("lpg").value) || 0,
        gn: parseFloat(document.getElementById("gn").value) || 0,
        fly: parseFloat(document.getElementById("fly").value) || 0,
        cogs: parseFloat(document.getElementById("cogs").value) || 0,
        person: parseInt(document.getElementById("person").value) || 1
    };

    const result = await apiPost('huella-carbono', payload);
    if (result) {
        document.getElementById("resultado").value = result.total;
        document.getElementById("estado").value = result.estado;
        document.getElementById("percapita").value = result.per_capita;
        document.getElementById("per_capita_estado").value = result.per_capita_estado;
        document.getElementById("promedioUSA").value = result.promedioUSA;
        document.getElementById("promedioMundial").value = result.promedioMundial;
        document.getElementById("porcentajeEstado").value = result.porcentEstado + "%";
        document.getElementById("porcentajeUSA").value = result.porcentUSA + "%";
        document.getElementById("porcentajeMundial").value = result.porcentM + "%";
    }
});

// --- 4. Calories Burned (Nueva) ---
// Asegúrate de que este script se cargue después del formulario en el HTML

document.getElementById('caloriasForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Leer valores del formulario (EN UNIDADES INGLESAS)
    const peso = parseFloat(document.getElementById('peso').value);                 // lb
    const duracionCaminata = parseFloat(document.getElementById('duracionCaminata').value); // min
    const cantidadPasos = parseFloat(document.getElementById('cantidadPasos').value);
    const metroPaso = parseFloat(document.getElementById('metroPaso').value);      // ft

    const resultadoDiv = document.getElementById('resultado-calories');

    // 2. Validación básica en frontend
    if (
        isNaN(peso) || peso <= 0 ||
        isNaN(duracionCaminata) || duracionCaminata <= 0 ||
        isNaN(cantidadPasos) || cantidadPasos <= 0 ||
        isNaN(metroPaso) || metroPaso <= 0
    ) {
        resultadoDiv.innerHTML = `
            <div style="color: red; font-weight: bold; margin-top: 10px;">
                Please enter valid values greater than zero in all fields.
            </div>
        `;
        return;
    }

    // 3. Armar payload EXACTAMENTE como lo espera el backend
    const payload = {
        peso,              // lb
        duracionCaminata,  // min
        cantidadPasos,
        metroPaso          // ft
    };

    try {
        // 4. Llamar a la API del backend
        const data = await apiPost('calories-burned', payload);

        // 5. Manejo de respuesta
        if (!data) {
            resultadoDiv.innerHTML = `
                <div style="color: red; font-weight: bold; margin-top: 10px;">
                    No response from server. Please try again.
                </div>
            `;
            return;
        }

        if (data.error) {
            resultadoDiv.innerHTML = `
                <div style="color: red; font-weight: bold; margin-top: 10px;">
                    ${data.error}
                </div>
            `;
            return;
        }

        // 6. Mostrar resultado principal
        resultadoDiv.innerHTML = `
            <div style="color: green; font-weight: bold; margin-top: 2px;">
                Calories Burned:<br> ${data.caloriasQuemadas} kcal
            </div>
        `;

        // (Opcional) Si quieres mostrar detalles, puedes extender aquí:
        // if (data.detalles) { ... }

    } catch (err) {
        console.error('Error calling calories-burned API:', err);
        resultadoDiv.innerHTML = `
            <div style="color: red; font-weight: bold; margin-top: 10px;">
                An error occurred while processing the request.
            </div>
        `;
    }
});


// --- 5. API STEAM GENERATION (New) ---
document.getElementById('form-generacion-vapor').addEventListener('submit', async (e) => {
    e.preventDefault();
    // Extraemos los valores primero para poder usarlos en los logs y el payload
    const flujo_vapor = parseFloat(document.getElementById('flujo_vapor').value);
    const entalpia = parseFloat(document.getElementById('entalpia').value);
    const eficiencia = parseFloat(document.getElementById('eficiencia_calorias').value);
    
    const payload = { flujo_vapor, entalpia, eficiencia };

    console.log("flujo_vapor:", flujo_vapor);
    console.log("entalpia:", entalpia);
    console.log("eficiencia:", eficiencia);

    const data = await apiPost('steam-generator', payload);
    if (data) {
        document.getElementById('resultado-vapor').innerHTML = `
            <div style="color: green; font-weight: bold; margin-top: 10px;">
                Thermal Energy:<br> ${data.energia_termica} ${data.unidad}
            </div>
        `;
    }
});