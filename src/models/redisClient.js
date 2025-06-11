const { Redis } = require('ioredis');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const redisClient = new Redis(process.env.REDIS_URL || "rediss://default:AZ22AAIjcDFlOGZmYjJhZGQ4ZGE0ODZiOGM2MTZlODVlZTcxOTNlNHAxMA@mature-crane-40374.upstash.io:6379", {
  tls: {
    rejectUnauthorized: false
  },
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

// Manejo de eventos
redisClient.on("connect", () => {
  console.log("Conectado a Redis (ioredis)");
});

redisClient.on("error", (err) => {
  console.error("Error en Redis Client:", err);
});

// Prueba de conexión inicial
(async () => {
  try {
    await redisClient.set("connection_test", "ok");
    const test = await redisClient.get("connection_test");
    console.log("Prueba de conexión exitosa:", test);
    await seedInitialData();
  } catch (err) {
    console.error("Error en prueba de conexión:", err);
  }
})();

// Cargar datos
async function seedInitialData() {

  const exists = await redisClient.exists('movimiento:mov-123');
  if (exists) {
    console.log('Los datos de ejemplo ya están cargados');
    return;
  }

  console.log('Cargando datos de ejemplo en Redis...');

  // Insertar uno por uno (más seguro y compatible)
  await redisClient.hset('movimiento:mov-123', [
    'id', 'mov-123',
    'tipoCuenta', 'ahorro',
    'cuenta', 'AHO-123456',
    'fecha', '2023-05-15T10:30:00Z',
    'descripcion', 'Depósito inicial',
    'monto', '1000.00',
    'tipo', 'CREDITO',
    'referencia', 'DEP-001',
    'establecimiento', 'Banco Principal',
    'saldoPosterior', '1000.00'
  ]);

  await redisClient.hset('movimiento:mov-124', [
    'id', 'mov-124',
    'tipoCuenta', 'ahorro',
    'cuenta', 'AHO-123456',
    'fecha', '2023-05-16T11:20:00Z',
    'descripcion', 'Retiro en cajero',
    'monto', '200.00',
    'tipo', 'DEBITO',
    'referencia', 'RET-002',
    'establecimiento', 'Cajero Principal',
    'saldoPosterior', '800.00'
  ]);

  await redisClient.lpush('movimientos:ahorro:AHO-123456', 'mov-124', 'mov-123');

  // Repite para cuenta corriente y tarjeta
  await redisClient.hset('movimiento:mov-456', [
    'id', 'mov-456',
    'tipoCuenta', 'corriente',
    'cuenta', 'COR-654321',
    'fecha', '2023-05-16T14:45:00Z',
    'descripcion', 'Pago de servicios',
    'monto', '150.50',
    'tipo', 'DEBITO',
    'referencia', 'PAGO-002',
    'establecimiento', 'Compañía de Agua',
    'saldoPosterior', '849.50'
  ]);

  await redisClient.hset('movimiento:mov-457', [
    'id', 'mov-457',
    'tipoCuenta', 'corriente',
    'cuenta', 'COR-654321',
    'fecha', '2023-05-17T09:30:00Z',
    'descripcion', 'Transferencia recibida',
    'monto', '500.00',
    'tipo', 'CREDITO',
    'referencia', 'TRF-003',
    'establecimiento', 'Cliente XYZ',
    'saldoPosterior', '1349.50'
  ]);

  await redisClient.lpush('movimientos:corriente:COR-654321', 'mov-457', 'mov-456');

  await redisClient.hset('movimiento:mov-789', [
    'id', 'mov-789',
    'tipoCuenta', 'tarjeta',
    'cuenta', 'TARJ-4567890123',
    'fecha', '2023-05-17T09:15:00Z',
    'descripcion', 'Compra en supermercado',
    'monto', '45.99',
    'tipo', 'DEBITO',
    'referencia', 'COMP-003',
    'establecimiento', 'Supermercado XYZ',
    'saldoPosterior', '954.01'
  ]);

  await redisClient.hset('movimiento:mov-790', [
    'id', 'mov-790',
    'tipoCuenta', 'tarjeta',
    'cuenta', 'TARJ-4567890123',
    'fecha', '2023-05-18T12:45:00Z',
    'descripcion', 'Pago de tarjeta',
    'monto', '300.00',
    'tipo', 'CREDITO',
    'referencia', 'PAGO-004',
    'establecimiento', 'Pago en línea',
    'saldoPosterior', '1254.01'
  ]);

  await redisClient.lpush('movimientos:tarjeta:TARJ-4567890123', 'mov-790', 'mov-789');

  console.log('Datos de ejemplo cargados exitosamente');
}

module.exports = redisClient;
