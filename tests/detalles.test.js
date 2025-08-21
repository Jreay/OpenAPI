const request = require("supertest");
const app = require("../src/app");
const DetallesService = require("../src/services/detallesService");

jest.mock("../src/models/redisClient", () => ({
  exists: jest.fn(),
  lrange: jest.fn(),
  hgetall: jest.fn(),
}));

jest.mock("../src/services/detallesService");

describe("Pruebas con mock para DetallesController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /api/movimientos/ahorro/detalle debe retornar detalle mockeado", async () => {
    const campoCuenta = "x_numero_cuenta";
    const numeroCuenta = "AHO-123456";
    const campoMovimiento = "x_movimiento_id";
    const numeroMovimiento = "mov-123";
    const path = "/api/movimientos/ahorro/detalle";
    const mockDetalle = {
      id: "mov-123",
      fecha: "2023-05-15T10:30:00Z",
      descripcion: "Depósito inicial",
      monto: 1000,
      tipo: "CREDITO",
      referencia: "DEP-001",
      establecimiento: "Banco Principal",
      saldoPosterior: 1000
    };

    DetallesService.getDetalleAhorro.mockResolvedValue(mockDetalle);

    const response = await request(app)
      .get(path)
      .set(campoCuenta, numeroCuenta)
      .set(campoMovimiento, numeroMovimiento);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockDetalle);
    expect(DetallesService.getDetalleAhorro).toHaveBeenCalledWith(numeroCuenta, numeroMovimiento);
  });

  it("GET /api/movimientos/corriente/detalle debe retornar detalle mockeado", async () => {
    const campoCuenta = "x_numero_cuenta";
    const numeroCuenta = "COR-654321";
    const campoMovimiento = "x_movimiento_id";
    const numeroMovimiento = "mov-456";
    const path = "/api/movimientos/corriente/detalle";
    const mockDetalle = {
      id: "mov-456",
      fecha: "2023-05-16T14:45:00Z",
      descripcion: "Pago de servicios",
      monto: 150.5,
      tipo: "DEBITO",
      referencia: "PAGO-002",
      establecimiento: "Compañía de Agua",
      saldoPosterior: 849.5
    };

    DetallesService.getDetalleCorriente.mockResolvedValue(mockDetalle);

    const response = await request(app)
      .get(path)
      .set(campoCuenta, numeroCuenta)
      .set(campoMovimiento, numeroMovimiento);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockDetalle);
    expect(DetallesService.getDetalleCorriente).toHaveBeenCalledWith(numeroCuenta, numeroMovimiento);
  });

  it("GET /api/movimientos/tarjetas/detalle debe retornar detalle mockeado", async () => {
    const campoTarjeta = "x_numero_tarjeta";
    const numeroTarjeta = "TARJ-4567890123";
    const campoMovimiento = "x_movimiento_id";
    const numeroMovimiento = "mov-789";
    const path = "/api/movimientos/tarjetas/detalle";
    const mockDetalle = {
      id: "mov-789",
      fecha: "2023-05-17T09:15:00Z",
      descripcion: "Compra en supermercado",
      monto: 45.99,
      tipo: "DEBITO",
      referencia: "COMP-003",
      establecimiento: "Supermercado XYZ",
      saldoPosterior: 954.01
    };

    DetallesService.getDetalleTarjeta.mockResolvedValue(mockDetalle);

    const response = await request(app)
      .get(path)
      .set(campoTarjeta, numeroTarjeta)
      .set(campoMovimiento, numeroMovimiento);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockDetalle);
    expect(DetallesService.getDetalleTarjeta).toHaveBeenCalledWith(numeroTarjeta, numeroMovimiento);
  });

  it("GET /api/movimientos/ahorro/detalle debe manejar errores del servicio", async () => {
    const campoCuenta = "x_numero_cuenta";
    const numeroCuenta = "AHO-123456";
    const campoMovimiento = "x_movimiento_id";
    const numeroMovimiento = "mov-111";
    const path = "/api/movimientos/ahorro/detalle";
    const errorMessage = "Error al obtener el detalle";
    DetallesService.getDetalleAhorro.mockRejectedValue(new Error(errorMessage));

    const response = await request(app)
      .get(path)
      .set(campoCuenta, numeroCuenta)
      .set(campoMovimiento, numeroMovimiento);

    expect(response.statusCode).toBe(500);
    expect(response.body.mensaje).toBe(errorMessage); 
  });

  it("GET /api/movimientos/corriente/detalle debe manejar errores del servicio", async () => {
    const campoCuenta = "x_numero_cuenta";
    const numeroCuenta = "COR-654321";
    const campoMovimiento = "x_movimiento_id";
    const numeroMovimiento = "mov-111";
    const path = "/api/movimientos/corriente/detalle";
    const errorMessage = "Error al obtener el detalle";
    DetallesService.getDetalleCorriente.mockRejectedValue(new Error(errorMessage));

    const response = await request(app)
      .get(path)
      .set(campoCuenta, numeroCuenta)
      .set(campoMovimiento, numeroMovimiento);

    expect(response.statusCode).toBe(500);
    expect(response.body.mensaje).toBe(errorMessage); 
  });

  it("GET /api/movimientos/tarjetas/detalle debe manejar errores del servicio", async () => {
    const campoTarjeta = "x_numero_tarjeta";
    const numeroTarjeta = "TARJ-4567890123";
    const campoMovimiento = "x_movimiento_id";
    const numeroMovimiento = "mov-111";
    const path = "/api/movimientos/tarjetas/detalle";
    const errorMessage = "Error al obtener el detalle";
    DetallesService.getDetalleTarjeta.mockRejectedValue(new Error(errorMessage));

    const response = await request(app)
      .get(path)
      .set(campoTarjeta, numeroTarjeta)
      .set(campoMovimiento, numeroMovimiento);

    expect(response.statusCode).toBe(500);
    expect(response.body.mensaje).toBe(errorMessage); 
  });

});