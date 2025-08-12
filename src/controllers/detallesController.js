const express = require('express');
const router = express.Router();
const { validateHeaders } = require('../middlewares/validators');
const DetallesService = require('../services/detallesService');

// Middleware de manejo de errores centralizado
const handleServiceError = (error, res) => {
  const statusCode = error.code || 500;
  const errorResponse = {
    codigo: statusCode.toString(),
    mensaje: error.message || 'Error interno del servidor',
    detalles: error.details || error.message,
    timestamp: new Date().toISOString()
  };

  // Log del error para desarrollo
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[Error Controller] ${error.message}`);
  }

  return res.status(statusCode).json(errorResponse);
};

/**
 * @swagger
 * tags:
 *   - name: Movimientos
 *     description: Consultas generales de movimientos
 *   - name: Movimiento_Detalle
 *     description: Consultas específicas de movimientos
 */

/**
 * @swagger
 * /api/movimientos/ahorro/detalle:
 *   get:
 *     summary: Obtener detalle de un movimiento específico de cuenta de ahorro
 *     tags: [Movimiento_Detalle]
 *     parameters:
 *       - name: x_numero_cuenta
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *         example: AHO-123456
 *       - name: x_movimiento_id
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *         example: mov-123
 *     responses:
 *       200:
 *         description: Detalle del movimiento
 *         content:
 *           application/json:
 *             example:
 *               id: "mov-123"
 *               fecha: "2023-05-15T10:30:00Z"
 *               descripcion: "Depósito inicial"
 *               monto: 1000
 *               tipo: "CREDITO"
 *               referencia: "DEP-001"
 *               establecimiento: "Banco Principal"
 *               saldoPosterior: 1000
 */

router.get('/ahorro/detalle', 
  validateHeaders(['x_numero_cuenta', 'x_movimiento_id']),
  async (req, res, next) => {
    try {
      const { 'x_numero_cuenta': numeroCuenta, 'x_movimiento_id': movimientoId } = req.headers;
      const detalle = await DetallesService.getDetalleAhorro(numeroCuenta, movimientoId);
      res.json(detalle);
    } catch (error) {
      handleServiceError(error, res);
    }
  }
);

/**
 * @swagger
 * /api/movimientos/corriente/detalle:
 *   get:
 *     summary: Obtener detalle de un movimiento específico de cuenta corriente
 *     tags: [Movimiento_Detalle]
 *     parameters:
 *       - name: x_numero_cuenta
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *         example: COR-654321
 *       - name: x_movimiento_id
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *         example: mov-456
 *     responses:
 *       200:
 *         description: Detalle del movimiento
 *         content:
 *           application/json:
 *             example:
 *               id: "mov-456"
 *               fecha: "2023-05-16T14:45:00Z"
 *               descripcion: "Pago de servicios"
 *               monto: 150.5
 *               tipo: "DEBITO"
 *               referencia: "PAGO-002"
 *               establecimiento: "Compañía de Agua"
 *               saldoPosterior: 849.5
 */
router.get('/corriente/detalle', 
  validateHeaders(['x_numero_cuenta', 'x_movimiento_id']),
  async (req, res, next) => {
    try {
      const { 'x_numero_cuenta': numeroCuenta, 'x_movimiento_id': movimientoId } = req.headers;
      const detalle = await DetallesService.getDetalleCorriente(numeroCuenta, movimientoId);
      res.json(detalle);
    } catch (error) {
      handleServiceError(error, res);
    }
  }
);

/**
 * @swagger
 * /api/movimientos/tarjetas/detalle:
 *   get:
 *     summary: Obtener detalle de un movimiento específico de tarjeta de crédito
 *     tags: [Movimiento_Detalle]
 *     parameters:
 *       - name: x_numero_tarjeta
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *         example: TARJ-4567890123
 *       - name: x_movimiento_id
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *         example: mov-789
 *     responses:
 *       200:
 *         description: Detalle del movimiento
 *         content:
 *           application/json:
 *             example:
 *               id: "mov-789"
 *               fecha: "2023-05-17T09:15:00Z"
 *               descripcion: "Compra en supermercado"
 *               monto: 45.99
 *               tipo: "DEBITO"
 *               referencia: "COMP-003"
 *               establecimiento: "Supermercado XYZ"
 *               saldoPosterior: 954.01
 */
router.get('/tarjetas/detalle', 
  validateHeaders(['x_numero_tarjeta', 'x_movimiento_id']),
  async (req, res, next) => {
    try {
      const { 'x_numero_tarjeta': numeroTarjeta, 'x_movimiento_id': movimientoId } = req.headers;
      const detalle = await DetallesService.getDetalleTarjeta(numeroTarjeta, movimientoId);
      res.json(detalle);
    } catch (error) {
      handleServiceError(error, res);
    }
  }
);

module.exports = router;