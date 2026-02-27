import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock de la base de datos
vi.mock("./db", () => ({
  createReserva: vi.fn().mockResolvedValue(undefined),
  getAllReservas: vi.fn().mockResolvedValue([]),
  createChatConversacion: vi.fn().mockResolvedValue(undefined),
}));

// Mock del LLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: "Las cartas revelan un camino lleno de esperanza. La carta del Sol ilumina tu consulta.",
        },
      },
    ],
  }),
}));

// Mock de notificaciones
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("tarotistas.list", () => {
  it("devuelve la lista de tarotistas", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.tarotistas.list();
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("id");
    expect(result[0]).toHaveProperty("nombre");
    expect(result[0]).toHaveProperty("especialidad");
  });

  it("devuelve al menos 40 tarotistas", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.tarotistas.list();
    expect(result.length).toBeGreaterThanOrEqual(40);
  });
});

describe("tarotistas.getById", () => {
  it("devuelve una tarotista por ID", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.tarotistas.getById({ id: "luna-oscura" });
    expect(result.id).toBe("luna-oscura");
    expect(result.nombre).toBe("Luna Oscura");
    expect(result).toHaveProperty("systemPrompt");
    expect(result).toHaveProperty("descripcionLarga");
  });

  it("lanza error si la tarotista no existe", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.tarotistas.getById({ id: "no-existe" })).rejects.toThrow();
  });
});

describe("chat.preguntar", () => {
  it("devuelve una respuesta de la IA", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.chat.preguntar({
      tarotistId: "luna-oscura",
      pregunta: "¿Qué me depara el amor este mes?",
      sessionId: "test-session-123",
    });
    expect(result).toHaveProperty("respuesta");
    expect(typeof result.respuesta).toBe("string");
    expect(result.respuesta.length).toBeGreaterThan(0);
  });

  it("lanza error si la tarotista no existe", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.chat.preguntar({
        tarotistId: "tarotista-inexistente",
        pregunta: "¿Qué me depara el futuro?",
        sessionId: "test-session-456",
      })
    ).rejects.toThrow();
  });
});

describe("reservas.crear", () => {
  it("crea una reserva correctamente", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.reservas.crear({
      nombre: "María García",
      email: "maria@test.com",
      tipoConsulta: "amor",
      metodoContacto: "whatsapp",
      telefono: "+34600000000",
      mensaje: "Quiero saber sobre mi relación",
    });
    expect(result).toEqual({ success: true });
  });

  it("crea una reserva sin campos opcionales", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.reservas.crear({
      nombre: "Juan Pérez",
      tipoConsulta: "general",
      metodoContacto: "email",
      email: "juan@test.com",
    });
    expect(result).toEqual({ success: true });
  });

  it("falla con nombre muy corto", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.reservas.crear({
        nombre: "A",
        tipoConsulta: "amor",
        metodoContacto: "email",
      })
    ).rejects.toThrow();
  });
});
