const request = require("supertest");
const app = require("../src/app");
const MovimientosService = require("../src/services/movimientosService");

jest.mock("../src/models/redisClient", () => ({
  exists: jest.fn(),
  lrange: jest.fn(),
  hgetall: jest.fn(),
}));

jest.mock("../src/services/movimientosService");

describe("Pruebas con mock para MovimientosController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /api/movimientos/ahorro debe retornar datos mockeados", async () => {
    const campoCuenta = "x_numero_cuenta";
    const numeroCuenta = "AHO-123456";
    const path = "/api/movimientos/ahorro";
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

    const response = await request(app).get(path).set(campoCuenta, numeroCuenta);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockRespuesta);
    expect(MovimientosService.getMovimientosAhorro).toHaveBeenCalledWith(numeroCuenta);

    const numeroCuentaCorriente = "COR-654321";
    const pathCorriente = "/api/movimientos/corriente";
    const mockRespuestaCorriente = [
      {
        id: "mov-456",
        fecha: "2023-05-16T14:45:00Z",
        descripcion: "Pago de servicios",
        monto: 150.5,
        tipo: "DEBITO",
        referencia: "PAGO-002..."
      }
    ];

    MovimientosService.getMovimientosAhorro.mockResolvedValue(mockRespuestaCorriente);

    const responseCorriente = await request(app).get(pathCorriente).set(campoCuenta, numeroCuentaCorriente);

    expect(responseCorriente.statusCode).toBe(200);
    expect(responseCorriente.body).toEqual(mockRespuestaCorriente);
    expect(MovimientosService.getMovimientosAhorro).toHaveBeenCalledWith(numeroCuentaCorriente);
  });

  it("GET /api/movimientos/corriente debe retornar datos mockeados", async () => {
    const campoCuenta = "x_numero_cuenta";
    const numeroCuenta = "COR-654321";
    const path = "/api/movimientos/corriente";
    const mockRespuesta = [
      {
        id: "mov-456",
        fecha: "2023-05-16T14:45:00Z",
        descripcion: "Pago de servicios",
        monto: 150.5,
        tipo: "DEBITO",
        referencia: "PAGO-002..."
      }
    ];

    MovimientosService.getMovimientosCorriente.mockResolvedValue(mockRespuesta);

    const response = await request(app).get(path).set(campoCuenta, numeroCuenta);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockRespuesta);
    expect(MovimientosService.getMovimientosAhorro).toHaveBeenCalledWith(numeroCuenta);
  });

  it("GET /api/movimientos/tarjetas debe retornar datos mockeados", async () => {
    const campoTarjeta = "x_numero_tarjeta";
    const numeroTarjeta = "TARJ-4567890123";
    const path = "/api/movimientos/tarjetas";
    const mockRespuesta = [
      {
        id: "mov-789",
        fecha: "2023-05-17T09:15:00Z",
        descripcion: "Compra en supermercado",
        monto: 45.99,
        tipo: "DEBITO",
        referencia: "COMP-003..."
      }
    ];

    MovimientosService.getMovimientosTarjeta.mockResolvedValue(mockRespuesta);

    const response = await request(app).get(path).set(campoTarjeta, numeroTarjeta);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockRespuesta);
    expect(MovimientosService.getMovimientosAhorro).toHaveBeenCalledWith(numeroTarjeta);
  });

  it("GET /api/movimientos/ahorro debe manejar errores del servicio", async () => {
    const campoCuenta = "x_numero_cuenta";
    const numeroCuenta = "AHO-123456";
    const path = "/api/movimientos/ahorro";
    const errorMessage = "Error al obtener los movimientos";
    MovimientosService.getMovimientosAhorro.mockRejectedValue(new Error(errorMessage));

    const response = await request(app).get(path).set(campoCuenta, numeroCuenta);

    expect(response.statusCode).toBe(500);
    expect(response.body.mensaje).toBe(errorMessage);
  });

  it("GET /api/movimientos/corriente debe manejar errores del servicio", async () => {
    const campoCuenta = "x_numero_cuenta";
    const numeroCuenta = "COR-654321";
    const path = "/api/movimientos/corriente";
    const errorMessage = "Error al obtener los movimientos";
    MovimientosService.getMovimientosCorriente.mockRejectedValue(new Error(errorMessage));

    const response = await request(app).get(path).set(campoCuenta, numeroCuenta);

    expect(response.statusCode).toBe(500);
    expect(response.body.mensaje).toBe(errorMessage);
  });

  it("GET /api/movimientos/tarjetas debe manejar errores del servicio", async () => {
    const campoTarjeta = "x_numero_tarjeta";
    const numeroTarjeta = "TARJ-4567890123";
    const path = "/api/movimientos/tarjetas";
    const errorMessage = "Error al obtener los movimientos";
    MovimientosService.getMovimientosTarjeta.mockRejectedValue(new Error(errorMessage));

    const responseAhorro = await request(app).get(path).set(campoTarjeta, numeroTarjeta);

    expect(responseAhorro.statusCode).toBe(500);
    expect(responseAhorro.body.mensaje).toBe(errorMessage);
  });

});
