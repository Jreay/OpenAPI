const MovimientosService = require('../src/services/movimientosService');
const redisClient = require('../src/models/redisClient');

// Simular el cliente de Redis para aislar la prueba
jest.mock('../src/models/redisClient');

describe('Pruebas para MovimientosService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Caso de éxito ---
  it('debe retornar una lista de movimientos para una cuenta de ahorro', async () => {
    // 1. Simular la existencia de la clave y los IDs de movimientos
    redisClient.exists.mockResolvedValue(1);
    redisClient.lrange.mockResolvedValue(['mov-123', 'mov-456']);

    // 2. Simular que el cliente de Redis devuelve los datos de cada movimiento
    redisClient.hgetall
      .mockResolvedValueOnce({
        id: 'mov-123',
        fecha: '2023-05-15T10:30:00Z',
        descripcion: 'Depósito inicial',
        monto: '1000',
        tipo: 'CREDITO',
        referencia: 'DEP-001'
      })
      .mockResolvedValueOnce({
        id: 'mov-456',
        fecha: '2023-05-16T14:45:00Z',
        descripcion: 'Pago de servicios',
        monto: '150.5',
        tipo: 'DEBITO',
        referencia: 'PAGO-002-COMPLETA'
      });

    // 3. Llamar a la función del servicio
    const result = await MovimientosService.getMovimientosAhorro('AHO-123456');

    // 4. Verificar el resultado
    expect(result).toHaveLength(2);
    expect(result[0].monto).toBe(1000);
    expect(result[1].monto).toBe(150.5);
    expect(result[1].referencia).toBe('PAGO-002...'); // Verifica el recorte de la referencia
    expect(redisClient.exists).toHaveBeenCalledWith('movimientos:ahorro:AHO-123456');
  });

  // --- Casos de error ---
  it('debe lanzar un error si el número de cuenta de ahorro es inválido', async () => {
    // Corregido: La aserción ahora espera el mensaje de error interno
    await expect(MovimientosService.getMovimientosAhorro('AHO-abc')).rejects.toThrow('NUMERO_CUENTA_INVALIDO');
  });

  it('debe lanzar un error si el recurso no es encontrado en Redis', async () => {
    // Simula que la clave no existe
    redisClient.exists.mockResolvedValue(0);

    // Corregido: La aserción ahora espera el objeto de error retornado por _handleError
    await expect(MovimientosService.getMovimientosAhorro('AHO-123456')).rejects.toEqual(
      expect.objectContaining({
        codigo: 404,
        mensaje: 'Movimiento no encontrado',
      })
    );
  });
});