const request = require('supertest');
const app = require('../src/app');
const DetallesService = require('../src/services/detallesService');

jest.mock('../src/services/detallesService');

describe('Pruebas con mock para DetallesController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/movimientos/ahorro/detalle debe retornar detalle mockeado', async () => {
    const mockDetalle = {
      id: 'mov-123',
      fecha: '2023-05-15T10:30:00Z',
      descripcion: 'Depósito inicial',
      monto: 1000,
      tipo: 'CREDITO',
      referencia: 'DEP-001',
      establecimiento: 'Banco Principal',
      saldoPosterior: 1000
    };

    DetallesService.getDetalleAhorro.mockResolvedValue(mockDetalle);

    const response = await request(app)
      .get('/api/movimientos/ahorro/detalle')
      .set('x-numero-cuenta', 'AHO-123456')
      .set('x-movimiento-id', 'mov-123');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockDetalle);
    expect(DetallesService.getDetalleAhorro).toHaveBeenCalledWith('AHO-123456', 'mov-123');
  });
});