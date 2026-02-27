import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module
vi.mock("./db", () => ({
  createReserva: vi.fn().mockResolvedValue(undefined),
  getAllReservas: vi.fn().mockResolvedValue([]),
  updateReservaEstado: vi.fn().mockResolvedValue(undefined),
  createChatConversacion: vi.fn().mockResolvedValue(undefined),
  getAllClientes: vi.fn().mockResolvedValue([]),
  createCliente: vi.fn().mockResolvedValue(undefined),
  updateClienteSaldo: vi.fn().mockResolvedValue(undefined),
  updateClienteNotas: vi.fn().mockResolvedValue(undefined),
  getAllBonos: vi.fn().mockResolvedValue([
    { id: 1, nombre: "Consulta Express", descripcion: "1 consulta", precio: "15.00", creditos: 1, tipo: "consultas", activo: true, createdAt: new Date() }
  ]),
  createBono: vi.fn().mockResolvedValue(undefined),
  seedBonosDefault: vi.fn().mockResolvedValue(undefined),
  getAllRecargas: vi.fn().mockResolvedValue([]),
  createRecarga: vi.fn().mockResolvedValue(undefined),
  updateRecargaEstado: vi.fn().mockResolvedValue(undefined),
  getAllSolicitudesTrabajo: vi.fn().mockResolvedValue([]),
  createSolicitudTrabajo: vi.fn().mockResolvedValue(undefined),
  updateSolicitudEstado: vi.fn().mockResolvedValue(undefined),
}));

// Mock LLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{ message: { content: "Las cartas revelan un camino de luz y esperanza para ti..." } }]
  }),
}));

// Mock notification
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("tarotistas", () => {
  it("lista todas las tarotistas", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.tarotistas.list();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("id");
    expect(result[0]).toHaveProperty("nombre");
    expect(result[0]).toHaveProperty("especialidad");
  });

  it("obtiene una tarotista por id", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const list = await caller.tarotistas.list();
    const first = list[0];
    const result = await caller.tarotistas.getById({ id: first.id });
    expect(result.id).toBe(first.id);
    expect(result.nombre).toBe(first.nombre);
  });

  it("lanza error si la tarotista no existe", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.tarotistas.getById({ id: "tarotista-inexistente-xyz" })).rejects.toThrow();
  });
});

describe("reservas", () => {
  it("crea una reserva correctamente", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.reservas.crear({
      nombre: "María García",
      email: "maria@test.com",
      telefono: "+34 600 000 000",
      tipoConsulta: "amor",
      metodoContacto: "whatsapp",
      mensaje: "Quiero saber sobre mi relación",
    });
    expect(result).toEqual({ success: true });
  });

  it("lista reservas", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.reservas.listar();
    expect(Array.isArray(result)).toBe(true);
  });

  it("actualiza estado de reserva", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.reservas.actualizarEstado({ id: 1, estado: "confirmada" });
    expect(result).toEqual({ success: true });
  });
});

describe("bonos", () => {
  it("lista bonos disponibles", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.bonos.listar();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("recargas", () => {
  it("solicita una recarga correctamente", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.recargas.solicitar({
      clienteNombre: "Ana López",
      clienteEmail: "ana@test.com",
      clienteTelefono: "+34 611 222 333",
      bonoId: 1,
      bonoNombre: "Bono Básico",
      importe: "39.00",
      creditos: 3,
      metodo: "bizum",
      notas: "Pago realizado",
    });
    expect(result).toEqual({ success: true });
  });

  it("lista recargas", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.recargas.listar();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("trabajo", () => {
  it("envía solicitud de trabajo correctamente", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.trabajo.solicitar({
      nombre: "Carmen Ruiz",
      email: "carmen@test.com",
      telefono: "+34 622 333 444",
      especialidad: "Tarot Marsella",
      experiencia: "10 años de experiencia en lectura de tarot y videncia",
      presentacion: "Soy tarotista con don natural y formación en esoterismo",
      redesSociales: "@carmen_tarot",
    });
    expect(result).toEqual({ success: true });
  });

  it("lista solicitudes de trabajo", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.trabajo.listar();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("chat.atencion", () => {
  it("responde al chatbot de atención al cliente", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.chat.atencion({
      mensaje: "¿Cuáles son los precios de los bonos?",
    });
    expect(result).toHaveProperty("respuesta");
    expect(typeof result.respuesta).toBe("string");
    expect(result.respuesta.length).toBeGreaterThan(0);
  });
});
