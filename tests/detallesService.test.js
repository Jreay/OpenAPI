const DetallesService = require("../src/services/detallesService");
const redisClient = require("../src/models/redisClient");

jest.mock("../src/models/redisClient");

describe("Pruebas para DetallesService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe retornar el detalle de un movimiento de ahorro", async () => {
    redisClient.hgetall.mockResolvedValue({
      id: "mov-123",
      fecha: "2023-05-15T10:30:00Z",
      descripcion: "Depósito inicial",
      monto: "1000",
      tipo: "CREDITO",
      referencia: "DEP-001",
      establecimiento: "Banco Principal",
      saldoPosterior: "1000"
    });

    const result = await DetallesService.getDetalleAhorro("AHO-123456", "mov-123");

    expect(result.id).toBe("mov-123");
    expect(result.fecha).toBe("2023-05-15T10:30:00Z");
    expect(result.descripcion).toBe("Depósito inicial");
    expect(result.monto).toBe(1000);
    expect(result.tipo).toBe("CREDITO");
    expect(result.referencia).toBe("DEP-001");
    expect(result.establecimiento).toBe("Banco Principal");
    expect(result.saldoPosterior).toBe(1000);
    expect(redisClient.hgetall).toHaveBeenCalledWith("movimiento:mov-123");
  });

  it("debe retornar el detalle de un movimiento de cuenta corriente", async () => {
    redisClient.hgetall.mockResolvedValue({
      id: "mov-456",
      fecha: "2023-05-16T10:30:00Z",
      descripcion: "Pago de nómina",
      monto: "2500",
      tipo: "CREDITO",
      referencia: "NOM-002",
      establecimiento: "Empresa XYZ",
      saldoPosterior: "3000"
    });
    const result = await DetallesService.getDetalleCorriente("COR-654321", "mov-456");
    expect(result.id).toBe("mov-456");
    expect(result.fecha).toBe("2023-05-16T10:30:00Z");
    expect(result.descripcion).toBe("Pago de nómina");
    expect(result.monto).toBe(2500);
    expect(result.tipo).toBe("CREDITO");
    expect(result.referencia).toBe("NOM-002");
    expect(result.establecimiento).toBe("Empresa XYZ");
    expect(result.saldoPosterior).toBe(3000);
    expect(redisClient.hgetall).toHaveBeenCalledWith("movimiento:mov-456");
  });

  it("debe retornar el detalle de un movimiento de tarjeta", async () => {
    redisClient.hgetall.mockResolvedValue({
      id: "mov-789",
      fecha: "2023-05-17T10:30:00Z",
      descripcion: "Compra en tienda",
      monto: "75.50",
      tipo: "DEBITO",
      referencia: "COMP-003",
      establecimiento: "Tienda ABC",
      saldoPosterior: "500"
    });
    const result = await DetallesService.getDetalleTarjeta("TARJ-1234567890", "mov-789");
    expect(result.id).toBe("mov-789");
    expect(result.fecha).toBe("2023-05-17T10:30:00Z");
    expect(result.descripcion).toBe("Compra en tienda");
    expect(result.monto).toBe(75.50);
    expect(result.tipo).toBe("DEBITO");
    expect(result.referencia).toBe("COMP-003");
    expect(result.establecimiento).toBe("Tienda ABC");
    expect(result.saldoPosterior).toBe(500);
    expect(redisClient.hgetall).toHaveBeenCalledWith("movimiento:mov-789");
  });

  it("debe lanzar un error si el ID del movimiento no es válido", async () => {
    await expect(DetallesService.getDetalleAhorro("AHO-123456", "id_invalido")).rejects.toEqual({
      code: 400,
      message: "ID de movimiento no válido"
    });
  });

  it("debe lanzar un error si el movimiento no se encuentra", async () => {
    redisClient.hgetall.mockResolvedValue(null);
    await expect(DetallesService.getDetalleAhorro("AHO-123456", "mov-999")).rejects.toEqual({
      code: 404,
      message: "Movimiento no encontrado"
    });
  });

  it("debe lanzar un error si los datos numéricos son inválidos (monto)", async () => {
    redisClient.hgetall.mockResolvedValue({
      id: "mov-123",
      tipoCuenta: "ahorro",
      cuenta: "AHO-123456",
      monto: "abc",
      saldoPosterior: "100"
    });
    await expect(DetallesService.getDetalleAhorro("AHO-123456", "mov-123")).rejects.toEqual({
      code: 500,
      message: "Error en los datos almacenados"
    });
  });

  it("debe lanzar un error si los datos numéricos son inválidos (saldo)", async () => {
    redisClient.hgetall.mockResolvedValue({
      id: "mov-123",
      tipoCuenta: "ahorro",
      cuenta: "AHO-123456",
      monto: "100",
      saldoPosterior: "xyz"
    });
    await expect(DetallesService.getDetalleAhorro("AHO-123456", "mov-123")).rejects.toEqual({
      code: 500,
      message: "Error en los datos almacenados"
    });
  });

  it("debe lanzar un error si el monto es undefined, null o vacío", async () => {
    const testCases = [undefined, null, ""];
    for (const monto of testCases) {
      redisClient.hgetall.mockResolvedValue({
        id: "mov-123",
        tipoCuenta: "ahorro",
        cuenta: "AHO-123456",
        monto,
        saldoPosterior: "100"
      });
      await expect(DetallesService.getDetalleAhorro("AHO-123456", "mov-123")).rejects.toEqual({
        code: 500,
        message: "Error en los datos almacenados"
      });
    }
  });

  it("debe lanzar un error genérico para un error no mapeado", async () => {
    redisClient.hgetall.mockRejectedValue(new Error("OTRO_ERROR_DESCONOCIDO"));

    await expect(DetallesService.getDetalleAhorro("AHO-123456", "mov-123")).rejects.toEqual({
      code: 500,
      message: "Error al obtener detalle del movimiento"
    });
  });
});