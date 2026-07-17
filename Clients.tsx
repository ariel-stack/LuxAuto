import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar archivo de datos
const initializeData = () => {
  const initialData = {
    vehicles: [],
    clients: [],
    sales: [],
    reservations: []
  };
  
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
};

// Leer datos
const readData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo datos:', error);
    return { vehicles: [], clients: [], sales: [], reservations: [] };
  }
};

// Escribir datos
const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error escribiendo datos:', error);
  }
};

// Rutas - Vehículos
app.get('/api/vehicles', (req, res) => {
  const data = readData();
  res.json(data.vehicles);
});

app.post('/api/vehicles', (req, res) => {
  const data = readData();
  data.vehicles.push(req.body);
  writeData(data);
  res.json(req.body);
});

app.put('/api/vehicles/:id', (req, res) => {
  const data = readData();
  const index = data.vehicles.findIndex(v => v.id === req.params.id);
  if (index !== -1) {
    data.vehicles[index] = { ...data.vehicles[index], ...req.body };
    writeData(data);
    res.json(data.vehicles[index]);
  } else {
    res.status(404).json({ error: 'Vehículo no encontrado' });
  }
});

app.delete('/api/vehicles/:id', (req, res) => {
  const data = readData();
  data.vehicles = data.vehicles.filter(v => v.id !== req.params.id);
  writeData(data);
  res.json({ success: true });
});

// Rutas - Clientes
app.get('/api/clients', (req, res) => {
  const data = readData();
  res.json(data.clients);
});

app.post('/api/clients', (req, res) => {
  const data = readData();
  data.clients.push(req.body);
  writeData(data);
  res.json(req.body);
});

app.put('/api/clients/:id', (req, res) => {
  const data = readData();
  const index = data.clients.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    data.clients[index] = { ...data.clients[index], ...req.body };
    writeData(data);
    res.json(data.clients[index]);
  } else {
    res.status(404).json({ error: 'Cliente no encontrado' });
  }
});

app.delete('/api/clients/:id', (req, res) => {
  const data = readData();
  data.clients = data.clients.filter(c => c.id !== req.params.id);
  writeData(data);
  res.json({ success: true });
});

// Rutas - Ventas
app.get('/api/sales', (req, res) => {
  const data = readData();
  res.json(data.sales);
});

app.post('/api/sales', (req, res) => {
  const data = readData();
  data.sales.push(req.body);
  writeData(data);
  res.json(req.body);
});

app.put('/api/sales/:id', (req, res) => {
  const data = readData();
  const index = data.sales.findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    data.sales[index] = { ...data.sales[index], ...req.body };
    writeData(data);
    res.json(data.sales[index]);
  } else {
    res.status(404).json({ error: 'Venta no encontrada' });
  }
});

app.delete('/api/sales/:id', (req, res) => {
  const data = readData();
  data.sales = data.sales.filter(s => s.id !== req.params.id);
  writeData(data);
  res.json({ success: true });
});

// Rutas - Reservaciones
app.get('/api/reservations', (req, res) => {
  const data = readData();
  res.json(data.reservations);
});

app.post('/api/reservations', (req, res) => {
  const data = readData();
  data.reservations.push(req.body);
  writeData(data);
  res.json(req.body);
});

app.put('/api/reservations/:id', (req, res) => {
  const data = readData();
  const index = data.reservations.findIndex(r => r.id === req.params.id);
  if (index !== -1) {
    data.reservations[index] = { ...data.reservations[index], ...req.body };
    writeData(data);
    res.json(data.reservations[index]);
  } else {
    res.status(404).json({ error: 'Reservación no encontrada' });
  }
});

app.delete('/api/reservations/:id', (req, res) => {
  const data = readData();
  data.reservations = data.reservations.filter(r => r.id !== req.params.id);
  writeData(data);
  res.json({ success: true });
});

// Inicializar y escuchar
initializeData();
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚗 Servidor LuxAuto escuchando en http://localhost:${PORT}`);
  console.log(`📡 Accesible desde otras máquinas en la red local`);
});
