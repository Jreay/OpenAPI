const redisClient = require("../models/redisClient");

class MovimientosService {
  static async _getMovimientos(tipoCuenta, identificador) {
    try {
      const key = `movimientos:${tipoCuenta}:${identificador}`;
      
      // Verificar existencia de la lista
      const exists = await redisClient.exists(key);
      if (!exists) {
        throw new Error("MOVIMIENTO_NO_ENCONTRADO");
      }

      // Obtener IDs de movimientos con paginación implícita
      const movimientosIds = await redisClient.lrange(key, 0, -1);
      
      // Obtener los datos
      const results = await Promise.all(
        movimientosIds.map(id => redisClient.hgetall(`movimiento:${id}`))
      );

      // Procesar los resultados
      return results
        .map(movimiento => {
          if (!movimiento?.id) return null;

          return {
            id: movimiento.id,
            fecha: movimiento.fecha,
            descripcion: movimiento.descripcion,
            monto: parseFloat(movimiento.monto),
            tipo: movimiento.tipo,
            referencia: movimiento.referencia?.substring(0, 8) + "..."
          };
        })
        .filter(Boolean);

    } catch (error) {
      console.error(`[MovimientosService] Error en ${tipoCuenta}:`, error);
      throw this._handleError(error);
    }
  }

  static async getMovimientosAhorro(numeroCuenta) {
    if (!numeroCuenta?.match(/^AHO-\d{6}$/)) {
      throw new Error("NUMERO_CUENTA_INVALIDO");
    }
    return this._getMovimientos("ahorro", numeroCuenta);
  }

  static async getMovimientosCorriente(numeroCuenta) {
    if (!numeroCuenta?.match(/^COR-\d{6}$/)) {
      throw new Error("NUMERO_CUENTA_INVALIDO");
    }
    return this._getMovimientos("corriente", numeroCuenta);
  }

  static async getMovimientosTarjeta(numeroTarjeta) {
    if (!numeroTarjeta?.match(/^TARJ-\d{10}$/)) {
      throw new Error("NUMERO_TARJETA_INVALIDO");
    }
    return this._getMovimientos("tarjeta", numeroTarjeta);
  }

  static _handleError(error) {
    const errorMap = {
      MOVIMIENTO_NO_ENCONTRADO: {
        codigo: 404,
        mensaje: "Movimiento no encontrado"
      },
      NUMERO_CUENTA_INVALIDO: {
        codigo: 400,
        mensaje: "Número de cuenta no válido"
      },
      NUMERO_TARJETA_INVALIDO: {
        codigo: 400,
        mensaje: "Número de tarjeta no válido"
      }
    };

    return errorMap[error.message] || { 
      codigo: 500, 
      mensaje: "Error interno del servidor" 
    };
  }
}

module.exports = MovimientosService;