const request = require("supertest");
const app = require("../src/app");
const MovimientosService = require("../src/services/movimientosService");

<<<<<<< HEAD
jest.mock("../src/models/redisClient", () => ({
=======
jest.mock('../src/models/redisClient', () => ({
>>>>>>> e0d8c87edc536faf0af05f7fcce1976aba480805
  exists: jest.fn(),
  lrange: jest.fn(),
  hgetall: jest.fn(),
}));
<<<<<<< HEAD
=======

jest.mock('../src/services/movimientosService');
>>>>>>> e0d8c87edc536faf0af05f7fcce1976aba480805

jest.mock("../src/services/movimientosService");

describe("Pruebas con mock para MovimientosController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /api/movimientos/ahorro debe retornar datos mockeados", async () => {
    const mockRespuesta = [
      {
        id: "mov-123",
        fecha: "2023-05-15T10:30:00Z",
        descripcion: "Depósito inicial",
        monto: 1000,
        tipo: "CREDITO",
        referencia: "DEP-001..."
      }
    ];

    MovimientosService.getMovimientosAhorro.mockResolvedValue(mockRespuesta);

    const response = await request(app)
<<<<<<< HEAD
      .get("/api/movimientos/ahorro")
      .set("x_numero_cuenta", "AHO-123456");
=======
      .get('/api/movimientos/ahorro')
      .set('x_numero_cuenta', 'AHO-123456');
>>>>>>> e0d8c87edc536faf0af05f7fcce1976aba480805

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockRespuesta);
    expect(MovimientosService.getMovimientosAhorro).toHaveBeenCalledWith("AHO-123456");
  });

  it("GET /api/movimientos/ahorro debe manejar errores del servicio", async () => {
    const errorMessage = "Error al obtener los movimientos";
    MovimientosService.getMovimientosAhorro.mockRejectedValue(new Error(errorMessage));

    const response = await request(app)
      .get("/api/movimientos/ahorro")
      .set("x_numero_cuenta", "AHO-123456");

    expect(response.statusCode).toBe(500);
    expect(response.body.mensaje).toBe("Error al obtener los movimientos");
  });

});
