// //SERVIDOR EXPRESS
// energyServer.mjs
import express from 'express';
import cors from 'cors';

// Importación de Controladores (Asegúrate de que las rutas de archivo sean correctas)
import { calcularConsumoEnergetico } from './_calculations/energy-consumption.mjs';
import { calcularProduccionSolar } from './_calculations/solar-production.mjs';
import { calcularHuellaCarbono } from './_calculations/carbon-footprint.mjs';
import { calcularCalorias } from './_calculations/calories-burned.mjs';
import { calcularGeneracionVapor } from './_calculations/steam-generator.mjs';


const app = express();
// Middleware
app.use(cors());
app.use(express.json());

// --- RUTAS DEL SISTEMA ENERGYNER ---

// Delegamos la lógica completa al import correspondiente
app.post('/api/consumo-energetico', calcularConsumoEnergetico);
app.post('/api/produccion-solar', calcularProduccionSolar);
// Para Huella de Carbono y Vapor
app.post('/api/huella-carbono', (req, res) => {
    const resultado = calcularHuellaCarbono(req.body);
    if (resultado.error) return res.status(400).json(resultado);
    res.json(resultado);
});

app.post('/api/calories-burned', (req, res) => {
    const { peso, duracionCaminata, cantidadPasos, metroPaso } = req.body;
    const resultado = calcularCalorias({ peso, duracionCaminata, cantidadPasos, metroPaso });
    if (resultado.error) return res.status(400).json(resultado);
    res.json(resultado);
});

app.post('/api/steam-generator', (req, res) => {
    const { flujo_vapor, entalpia, eficiencia } = req.body;
    const resultado = calcularGeneracionVapor({ flujo_vapor, entalpia, eficiencia });
    if (resultado.error) return res.status(400).json(resultado);
    res.json(resultado);
});
// --- LANZAMIENTO ---
// En Vercel, 'app.listen' no se debe ejecutar. Vercel usa el 'export default'.
// En Local (Wamp), necesitamos que el servidor levante en el puerto 3002.
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3002;
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`\n============== ENERGYNER API GATEWAY (LOCAL) ==============`);
        console.log(`✅ Servidor escuchando en: http://0.0.0.0:${PORT}`);
        console.log(`📂 Módulos: Consumo, Solar, Carbono, Calorias, Vapor`);
        console.log(`===========================================================\n`);
    });
}
// CRÍTICO PARA VERCEL: Exportar la instancia de la app
export default app;
   

