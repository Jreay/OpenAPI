const redisClient = require('../models/redisClient');

class DetallesService {
  static async _getDetalleMovimiento(movimientoId, tipoEsperado, numeroEsperado) {
    try {
      if (!movimientoId?.match(/^mov-\w+$/)) {
        throw new Error('ID_MOVIMIENTO_INVALIDO');
      }

      const movimiento = await redisClient.hgetall(`movimiento:${movimientoId}`);
      console.log('[Debug] movimiento recuperado:', movimiento);
      
      // Validación básica del movimiento
      if (!movimiento?.id) {
        throw new Error('MOVIMIENTO_NO_ENCONTRADO');
      }

      // Validar tipo de cuenta y pertenencia
      if (movimiento.tipoCuenta !== tipoEsperado) {
        throw new Error('TIPO_CUENTA_NO_COINCIDE');
      }

      if (movimiento.cuenta !== numeroEsperado) {
        throw new Error('CUENTA_NO_COINCIDE');
      }

      // Convertir y validar campos numéricos
      const monto = this._parseCurrency(movimiento.monto, 'Monto inválido');
      console.log('[Debug] monto parseado:', monto);

      const saldo = this._parseCurrency(movimiento.saldoPosterior, 'Saldo inválido');
      console.log('[Debug] saldo parseado:', saldo);

      return {
        id: movimiento.id,
        fecha: movimiento.fecha || new Date().toISOString(),
        descripcion: movimiento.descripcion || 'Sin descripción',
        monto,
        tipo: movimiento.tipo,
        referencia: movimiento.referencia,
        establecimiento: movimiento.establecimiento,
        saldoPosterior: saldo,
        // Campos adicionales si existen
        ...(movimiento.comentario && { comentario: movimiento.comentario })
      };
    } catch (error) {
      console.error(`[DetallesService] Error: ${error.message}`);
      throw this._mapError(error);
    }
  }

  static async getDetalleAhorro(numeroCuenta, movimientoId) {
    return this._getDetalleMovimiento(movimientoId, 'ahorro', numeroCuenta);
  }

  static async getDetalleCorriente(numeroCuenta, movimientoId) {
    return this._getDetalleMovimiento(movimientoId, 'corriente', numeroCuenta);
  }

  static async getDetalleTarjeta(numeroTarjeta, movimientoId) {
    return this._getDetalleMovimiento(movimientoId, 'tarjeta', numeroTarjeta);
  }

  static _parseCurrency(value, errorMsg) {
    console.log('[Debug] valor recibido para parseo:', value);
    if (value === undefined || value === null || value === '') {
      throw new Error('VALOR_NUMERICO_INVALIDO');
    }

    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
      throw new Error('VALOR_NUMERICO_INVALIDO');
    }
    return parsed;
  }


  static _mapError(error) {
    const errorMap = {
      'ID_MOVIMIENTO_INVALIDO': {
        code: 400,
        message: 'ID de movimiento no válido'
      },
      'MOVIMIENTO_NO_ENCONTRADO': {
        code: 404,
        message: 'Movimiento no encontrado'
      },
      'TIPO_CUENTA_NO_COINCIDE': {
        code: 400,
        message: 'El movimiento no corresponde al tipo de cuenta'
      },
      'CUENTA_NO_COINCIDE': {
        code: 403,
        message: 'El movimiento no pertenece a esta cuenta'
      },
      'VALOR_NUMERICO_INVALIDO': {
        code: 500,
        message: 'Error en los datos almacenados'
      }
    };

    return errorMap[error.message] || { 
      code: 500, 
      message: 'Error al obtener detalle del movimiento' 
    };
  }
}

module.exports = DetallesService;