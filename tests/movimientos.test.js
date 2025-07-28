const request = require('supertest');
const app = require('../src/app');
const MovimientosService = require('../src/services/movimientosService');

jest.mock('../src/services/movimientosService');

describe('Pruebas con mock para MovimientosController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/movimientos/ahorro debe retornar datos mockeados', async () => {
    const mockRespuesta = [
      {
        id: 'mov-123',
        fecha: '2023-05-15T10:30:00Z',
        descripcion: 'Depósito inicial',
        monto: 1000,
        tipo: 'CREDITO',
        referencia: 'DEP-001...'
      }
    ];

    MovimientosService.getMovimientosAhorro.mockResolvedValue(mockRespuesta);

    const response = await request(app)
      .get('/api/movimientos/ahorro')
      .set('x-numero-cuenta', 'AHO-123456');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockRespuesta);
    expect(MovimientosService.getMovimientosAhorro).toHaveBeenCalledWith('AHO-123456');
  });
});
