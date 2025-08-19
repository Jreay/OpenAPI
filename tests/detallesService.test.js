const DetallesService = require('../src/services/detallesService');
const redisClient = require('../src/models/redisClient');

// Simular la dependencia del servicio, que es el cliente de Redis
jest.mock('../src/models/redisClient');

describe('Pruebas para DetallesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Caso de éxito ---
  it('debe retornar el detalle de un movimiento de ahorro', async () => {
    // 1. Configurar el mock de Redis para devolver un movimiento válido de ahorro
    redisClient.hgetall.mockResolvedValue({
      id: 'mov-123',
      fecha: '2023-05-15T10:30:00Z',
      descripcion: 'Depósito inicial',
      monto: '1000',
      tipo: 'CREDITO',
      referencia: 'DEP-001',
      establecimiento: 'Banco Principal',
      saldoPosterior: '1000',
      tipoCuenta: 'ahorro',
      cuenta: 'AHO-123456'
    });

    // 2. Llamar a la función del servicio
    const result = await DetallesService.getDetalleAhorro('AHO-123456', 'mov-123');

    // 3. Verificar que el resultado sea el esperado
    expect(result.id).toBe('mov-123');
    expect(result.monto).toBe(1000);
    expect(result.saldoPosterior).toBe(1000);
    expect(redisClient.hgetall).toHaveBeenCalledWith('movimiento:mov-123');
  });

  // --- Casos de éxito para otros tipos de cuenta ---
  it('debe retornar el detalle de un movimiento de cuenta corriente', async () => {
    redisClient.hgetall.mockResolvedValue({
      id: 'mov-456',
      fecha: '2023-05-16T10:30:00Z',
      descripcion: 'Pago de nómina',
      monto: '2500',
      tipo: 'CREDITO',
      referencia: 'NOM-002',
      establecimiento: 'Empresa XYZ',
      saldoPosterior: '3000',
      tipoCuenta: 'corriente',
      cuenta: 'COR-654321'
    });
    const result = await DetallesService.getDetalleCorriente('COR-654321', 'mov-456');
    expect(result.id).toBe('mov-456');
    expect(result.monto).toBe(2500);
  });

  it('debe retornar el detalle de un movimiento de tarjeta', async () => {
    redisClient.hgetall.mockResolvedValue({
      id: 'mov-789',
      fecha: '2023-05-17T10:30:00Z',
      descripcion: 'Compra en tienda',
      monto: '75.50',
      tipo: 'DEBITO',
      referencia: 'COMP-003',
      establecimiento: 'Tienda ABC',
      saldoPosterior: '500',
      tipoCuenta: 'tarjeta',
      cuenta: 'TARJ-1234567890'
    });
    const result = await DetallesService.getDetalleTarjeta('TARJ-1234567890', 'mov-789');
    expect(result.id).toBe('mov-789');
    expect(result.monto).toBe(75.50);
  });

  // --- Casos de error ---
  it('debe lanzar un error si el ID del movimiento no es válido', async () => {
    await expect(DetallesService.getDetalleAhorro('AHO-123456', 'id_invalido')).rejects.toEqual({
      code: 400,
      message: 'ID de movimiento no válido'
    });
  });

  it('debe lanzar un error si el movimiento no se encuentra', async () => {
    redisClient.hgetall.mockResolvedValue(null);
    await expect(DetallesService.getDetalleAhorro('AHO-123456', 'mov-999')).rejects.toEqual({
      code: 404,
      message: 'Movimiento no encontrado'
    });
  });

  it('debe lanzar un error si el tipo de cuenta no coincide', async () => {
    redisClient.hgetall.mockResolvedValue({
      id: 'mov-123',
      tipoCuenta: 'corriente',
      cuenta: 'AHO-123456'
    });
    await expect(DetallesService.getDetalleAhorro('AHO-123456', 'mov-123')).rejects.toEqual({
      code: 400,
      message: 'El movimiento no corresponde al tipo de cuenta'
    });
  });

  it('debe lanzar un error si el movimiento no pertenece a la cuenta', async () => {
    redisClient.hgetall.mockResolvedValue({
      id: 'mov-123',
      tipoCuenta: 'ahorro',
      cuenta: 'AHO-999999'
    });
    await expect(DetallesService.getDetalleAhorro('AHO-123456', 'mov-123')).rejects.toEqual({
      code: 403,
      message: 'El movimiento no pertenece a esta cuenta'
    });
  });

  it('debe lanzar un error si los datos numéricos son inválidos (monto)', async () => {
    redisClient.hgetall.mockResolvedValue({
      id: 'mov-123',
      tipoCuenta: 'ahorro',
      cuenta: 'AHO-123456',
      monto: 'abc', // Valor no numérico
      saldoPosterior: '100'
    });
    await expect(DetallesService.getDetalleAhorro('AHO-123456', 'mov-123')).rejects.toEqual({
      code: 500,
      message: 'Error en los datos almacenados'
    });
  });

  it('debe lanzar un error si los datos numéricos son inválidos (saldo)', async () => {
    redisClient.hgetall.mockResolvedValue({
      id: 'mov-123',
      tipoCuenta: 'ahorro',
      cuenta: 'AHO-123456',
      monto: '100',
      saldoPosterior: 'xyz' // Valor no numérico
    });
    await expect(DetallesService.getDetalleAhorro('AHO-123456', 'mov-123')).rejects.toEqual({
      code: 500,
      message: 'Error en los datos almacenados'
    });
  });

  it('debe lanzar un error si el monto es undefined, null o vacío', async () => {
    const testCases = [undefined, null, ''];
    for (const monto of testCases) {
      redisClient.hgetall.mockResolvedValue({
        id: 'mov-123',
        tipoCuenta: 'ahorro',
        cuenta: 'AHO-123456',
        monto,
        saldoPosterior: '100'
      });
      await expect(DetallesService.getDetalleAhorro('AHO-123456', 'mov-123')).rejects.toEqual({
        code: 500,
        message: 'Error en los datos almacenados'
      });
    }
  });

  it('debe lanzar un error genérico para un error no mapeado', async () => {
    // Simula un error que no está en el mapa de _mapError
    redisClient.hgetall.mockRejectedValue(new Error('OTRO_ERROR_DESCONOCIDO'));

    await expect(DetallesService.getDetalleAhorro('AHO-123456', 'mov-123')).rejects.toEqual({
      code: 500,
      message: 'Error al obtener detalle del movimiento'
    });
  });
});