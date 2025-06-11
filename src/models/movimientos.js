const redisClient = require('./redisClient');

class MovimientosModel {
  // Obtener movimientos por tipo de cuenta
  static async getMovimientos(tipoCuenta, numeroCuenta) {
    try {
      const key = `movimientos:${tipoCuenta}:${numeroCuenta}`;
      const movimientosIds = await redisClient.lRange(key, 0, -1);
      
      const movimientos = [];
      for (const id of movimientosIds) {
        const movimiento = await redisClient.hGetAll(`movimiento:${id}`);
        if (movimiento && movimiento.id) {
          // Filtrar solo campos de resumen
          movimientos.push({
            id: movimiento.id,
            fecha: movimiento.fecha,
            descripcion: movimiento.descripcion,
            monto: parseFloat(movimiento.monto),
            tipo: movimiento.tipo
          });
        }
      }
      
      return movimientos;
    } catch (error) {
      console.error('Error en getMovimientos:', error);
      throw error;
    }
  }

  // Obtener detalle de un movimiento
  static async getDetalleMovimiento(id) {
    try {
      const movimiento = await redisClient.hGetAll(`movimiento:${id}`);
      if (!movimiento || !movimiento.id) {
        throw new Error('Movimiento no encontrado');
      }
      
      // Convertir campos numéricos
      return {
        ...movimiento,
        monto: parseFloat(movimiento.monto),
        saldoPosterior: parseFloat(movimiento.saldoPosterior)
      };
    } catch (error) {
      console.error('Error en getDetalleMovimiento:', error);
      throw error;
    }
  }

  // Métodos específicos para cada tipo de cuenta
  static async getMovimientosAhorro(numeroCuenta) {
    return this.getMovimientos('ahorro', numeroCuenta);
  }

  static async getMovimientosCorriente(numeroCuenta) {
    return this.getMovimientos('corriente', numeroCuenta);
  }

  static async getMovimientosTarjeta(numeroTarjeta) {
    return this.getMovimientos('tarjeta', numeroTarjeta);
  }

}

module.exports = MovimientosModel;