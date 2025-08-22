const MovimientosService = require("../src/services/movimientosService");
const redisClient = require("../src/models/redisClient");

jest.mock("../src/models/redisClient");

describe("Pruebas para MovimientosService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe retornar una lista de movimientos para una cuenta ahorro", async () => {
    redisClient.exists.mockResolvedValue(1);
    redisClient.lrange.mockResolvedValue(["mov-123"]);

    redisClient.hgetall
      .mockResolvedValueOnce({
        id: "mov-123",
        fecha: "2023-05-15T10:30:00Z",
        descripcion: "Depósito inicial",
        monto: "1000",
        tipo: "CREDITO",
        referencia: "DEP-001...."
      });

    const result = await MovimientosService.getMovimientosAhorro("AHO-123456");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("mov-123");
    expect(result[0].fecha).toBe("2023-05-15T10:30:00Z");
    expect(result[0].descripcion).toBe("Depósito inicial");
    expect(result[0].monto).toBe(1000);
    expect(result[0].tipo).toBe("CREDITO");
    expect(result[0].referencia).toBe("DEP-001....");
    expect(redisClient.exists).toHaveBeenCalledWith("movimientos:ahorro:AHO-123456");
  });

  it("debe retornar una lista de movimientos para una cuenta corriente", async () => {
    redisClient.exists.mockResolvedValue(1);
    redisClient.lrange.mockResolvedValue(["mov-456"]);

    redisClient.hgetall
      .mockResolvedValueOnce({
        id: "mov-456",
        fecha: "2023-05-16T14:45:00Z",
        descripcion: "Pago de servicios",
        monto: "150.5",
        tipo: "DEBITO",
        referencia: "PAGO-002..."
      });

    const result = await MovimientosService.getMovimientosCorriente("COR-654321");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("mov-456");
    expect(result[0].fecha).toBe("2023-05-16T14:45:00Z");
    expect(result[0].descripcion).toBe("Pago de servicios");
    expect(result[0].monto).toBe(150.5);
    expect(result[0].tipo).toBe("DEBITO");
    expect(result[0].referencia).toBe("PAGO-002...");
    expect(redisClient.exists).toHaveBeenCalledWith("movimientos:corriente:COR-654321");
  });

  it("debe retornar una lista de movimientos para una tarjeta", async () => {
    redisClient.exists.mockResolvedValue(1);
    redisClient.lrange.mockResolvedValue(["mov-789"]);

    redisClient.hgetall
      .mockResolvedValueOnce({
        id: "mov-789",
        fecha: "2023-05-17T09:15:00Z",
        descripcion: "Compra en supermercado",
        monto: "45.99",
        tipo: "DEBITO",
        referencia: "COMP-003..."
      });

    const result = await MovimientosService.getMovimientosTarjeta("TARJ-4567890123");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("mov-789");
    expect(result[0].fecha).toBe("2023-05-17T09:15:00Z");
    expect(result[0].descripcion).toBe("Compra en supermercado");
    expect(result[0].monto).toBe(45.99);
    expect(result[0].tipo).toBe("DEBITO");
    expect(result[0].referencia).toBe("COMP-003...");
    expect(redisClient.exists).toHaveBeenCalledWith("movimientos:tarjeta:TARJ-4567890123");
  });

  // --- Casos de error ---
  it("debe lanzar un error si el número de cuenta de ahorro es inválido", async () => {
    // Corregido: La aserción ahora espera el mensaje de error interno
    await expect(MovimientosService.getMovimientosAhorro("AHO-abc")).rejects.toThrow("NUMERO_CUENTA_INVALIDO");
  });

  it("debe lanzar un error si el recurso no es encontrado en Redis", async () => {
    // Simula que la clave no existe
    redisClient.exists.mockResolvedValue(0);

    // Corregido: La aserción ahora espera el objeto de error retornado por _handleError
    await expect(MovimientosService.getMovimientosAhorro("AHO-123456")).rejects.toEqual(
      expect.objectContaining({
        codigo: 404,
        mensaje: "Movimiento no encontrado",
      })
    );
  });
});