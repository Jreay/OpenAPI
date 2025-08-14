const express = require("express");
const router = express.Router();
const { validateHeaders } = require("../middlewares/validators");
const MovimientosService = require("../services/movimientosService");

// Middleware de manejo de errores reutilizable
const handleServiceError = (error, res) => {
  const statusCode = error.code || 500;
  const errorResponse = {
    codigo: statusCode.toString(),
    mensaje: error.message || "Error interno del servidor",
    detalles: error.details || error.message,
    timestamp: new Date().toISOString()
  };

  return res.status(statusCode).json(errorResponse);
};

/**
 * @swagger
 * /api/movimientos/ahorro:
 *   get:
 *     summary: Obtener movimientos de cuenta de ahorro
 *     tags: [Movimientos]
 *     parameters:
 *       - name: x_numero_cuenta
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *         example: AHO-123456
 *     responses:
 *       200:
 *         description: Lista de movimientos
 *         content:
 *           application/json:
 *             example:
 *               - id: "mov-123"
 *                 fecha: "2023-05-15T10:30:00Z"
 *                 descripcion: "Depósito inicial"
 *                 monto: 1000
 *                 tipo: "CREDITO"
 *                 referencia: "DEP-001..."
 */
<<<<<<< HEAD
router.get("/ahorro", 
  validateHeaders(["x_numero_cuenta"]),
  async (req, res, next) => {
    try {
      const numeroCuenta = req.headers["x_numero_cuenta"];
=======
router.get('/ahorro', 
  validateHeaders(['x_numero_cuenta']),
  async (req, res, next) => {
    try {
      const numeroCuenta = req.headers['x_numero_cuenta'];
>>>>>>> e0d8c87edc536faf0af05f7fcce1976aba480805
      const movimientos = await MovimientosService.getMovimientosAhorro(numeroCuenta);
      res.json(movimientos);
    } catch (error) {
      handleServiceError(error, res);
    }
  }
);

/**
 * @swagger
 * /api/movimientos/corriente:
 *   get:
 *     summary: Obtener movimientos de cuenta corriente
 *     tags: [Movimientos]
 *     parameters:
 *       - name: x_numero_cuenta
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *         example: COR-654321
 *     responses:
 *       200:
 *         description: Lista de movimientos
 *         content:
 *           application/json:
 *             example:
 *               - id: "mov-456"
 *                 fecha: "2023-05-16T14:45:00Z"
 *                 descripcion: "Pago de servicios"
 *                 monto: 150.5
 *                 tipo: "DEBITO"
 *                 referencia: "PAGO-002..."
 */
<<<<<<< HEAD
router.get("/corriente", 
  validateHeaders(["x_numero_cuenta"]),
  async (req, res, next) => {
    try {
      const numeroCuenta = req.headers["x_numero_cuenta"];
=======
router.get('/corriente', 
  validateHeaders(['x_numero_cuenta']),
  async (req, res, next) => {
    try {
      const numeroCuenta = req.headers['x_numero_cuenta'];
>>>>>>> e0d8c87edc536faf0af05f7fcce1976aba480805
      const movimientos = await MovimientosService.getMovimientosCorriente(numeroCuenta);
      res.json(movimientos);
    } catch (error) {
      handleServiceError(error, res);
    }
  }
);

/**
 * @swagger
 * /api/movimientos/tarjetas:
 *   get:
 *     summary: Obtener movimientos de tarjeta de crédito
 *     tags: [Movimientos]
 *     parameters:
 *       - name: x_numero_tarjeta
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *         example: TARJ-4567890123
 *     responses:
 *       200:
 *         description: Lista de movimientos
 *         content:
 *           application/json:
 *             example:
 *               - id: "mov-789"
 *                 fecha: "2023-05-17T09:15:00Z"
 *                 descripcion: "Compra en supermercado"
 *                 monto: 45.99
 *                 tipo: "DEBITO"
 *                 referencia: "COMP-003..."
 */
<<<<<<< HEAD
router.get("/tarjetas", 
  validateHeaders(["x_numero_tarjeta"]),
  async (req, res, next) => {
    try {
      const numeroTarjeta = req.headers["x_numero_tarjeta"];
=======
router.get('/tarjetas', 
  validateHeaders(['x_numero_tarjeta']),
  async (req, res, next) => {
    try {
      const numeroTarjeta = req.headers['x_numero_tarjeta'];
>>>>>>> e0d8c87edc536faf0af05f7fcce1976aba480805
      const movimientos = await MovimientosService.getMovimientosTarjeta(numeroTarjeta);
      res.json(movimientos);
    } catch (error) {
      handleServiceError(error, res);
    }
  }
);

module.exports = router;