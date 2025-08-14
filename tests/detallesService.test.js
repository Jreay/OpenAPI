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
    expect(result.monto).toBe(1000); // Verifica el parseo a número
    expect(result.saldoPosterior).toBe(1000); // Verifica el parseo a número
    expect(redisClient.hgetall).toHaveBeenCalledWith('movimiento:mov-123');
  });

  // --- Casos de error ---
  it('debe lanzar un error si el ID del movimiento no es válido', async () => {
    await expect(DetallesService.getDetalleAhorro('AHO-123456', 'id_invalido')).rejects.toThrow('ID de movimiento no válido');
  });

  it('debe lanzar un error si el movimiento no se encuentra', async () => {
    // Simula que Redis no encuentra el movimiento
    redisClient.hgetall.mockResolvedValue(null);
    await expect(DetallesService.getDetalleAhorro('AHO-123456', 'mov-999')).rejects.toThrow('Movimiento no encontrado');
  });

  it('debe lanzar un error si el tipo de cuenta no coincide', async () => {
    redisClient.hgetall.mockResolvedValue({
      id: 'mov-123',
      tipoCuenta: 'corriente',
      cuenta: 'AHO-123456'
    });
    await expect(DetallesService.getDetalleAhorro('AHO-123456', 'mov-123')).rejects.toThrow('El movimiento no corresponde al tipo de cuenta');
  });

  it('debe lanzar un error si el movimiento no pertenece a la cuenta', async () => {
    redisClient.hgetall.mockResolvedValue({
      id: 'mov-123',
      tipoCuenta: 'ahorro',
      cuenta: 'AHO-999999'
    });
    await expect(DetallesService.getDetalleAhorro('AHO-123456', 'mov-123')).rejects.toThrow('El movimiento no pertenece a esta cuenta');
  });

  it('debe lanzar un error si los datos numéricos son inválidos', async () => {
    redisClient.hgetall.mockResolvedValue({
      id: 'mov-123',
      tipoCuenta: 'ahorro',
      cuenta: 'AHO-123456',
      monto: 'abc', // Valor no numérico
      saldoPosterior: '100'
    });
    await expect(DetallesService.getDetalleAhorro('AHO-123456', 'mov-123')).rejects.toThrow('Error en los datos almacenados');
  });
});