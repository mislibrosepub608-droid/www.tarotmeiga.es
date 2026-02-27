import { eq, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  reservas, InsertReserva,
  chatConversaciones, InsertChatConversacion,
  clientes, InsertCliente, Cliente,
  bonos, InsertBono,
  recargas, InsertRecarga,
  solicitudesTrabajo, InsertSolicitudTrabajo,
  resenas, InsertResena,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ---- Reservas ----
export async function createReserva(data: InsertReserva) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(reservas).values(data);
}

export async function getAllReservas() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reservas).orderBy(desc(reservas.createdAt));
}

export async function updateReservaEstado(id: number, estado: "pendiente" | "confirmada" | "completada" | "cancelada") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(reservas).set({ estado }).where(eq(reservas.id, id));
}

// ---- Chat conversaciones ----
export async function createChatConversacion(data: InsertChatConversacion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(chatConversaciones).values(data);
}

// ---- Clientes ----
export async function getAllClientes() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clientes).orderBy(desc(clientes.createdAt));
}

export async function createCliente(data: InsertCliente) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(clientes).values(data);
}

export async function updateClienteSaldo(id: number, saldo: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(clientes).set({ saldo }).where(eq(clientes.id, id));
}

export async function updateClienteNotas(id: number, notas: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(clientes).set({ notas }).where(eq(clientes.id, id));
}

// ---- Bonos ----
export async function getAllBonos() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bonos).orderBy(asc(bonos.precio));
}

export async function createBono(data: InsertBono) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(bonos).values(data);
}

export async function seedBonosDefault() {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(bonos).limit(1);
  if (existing.length > 0) return; // ya hay bonos
  const defaultBonos: InsertBono[] = [
    { nombre: "Consulta Express", descripcion: "1 consulta rápida de 15 minutos", precio: "15.00", creditos: 1, tipo: "consultas" },
    { nombre: "Bono Básico", descripcion: "3 consultas completas de 30 minutos", precio: "39.00", creditos: 3, tipo: "consultas" },
    { nombre: "Bono Estándar", descripcion: "5 consultas completas + 1 gratis", precio: "59.00", creditos: 6, tipo: "consultas" },
    { nombre: "Bono Premium", descripcion: "10 consultas + seguimiento mensual", precio: "99.00", creditos: 10, tipo: "consultas" },
    { nombre: "Pack 30 Minutos", descripcion: "30 minutos de consulta libre", precio: "25.00", creditos: 30, tipo: "minutos" },
    { nombre: "Pack 60 Minutos", descripcion: "60 minutos de consulta libre", precio: "45.00", creditos: 60, tipo: "minutos" },
  ];
  for (const b of defaultBonos) {
    await db.insert(bonos).values(b);
  }
}

// ---- Recargas ----
export async function getAllRecargas() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(recargas).orderBy(desc(recargas.createdAt));
}

export async function createRecarga(data: InsertRecarga) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(recargas).values(data);
}

export async function updateRecargaEstado(id: number, estado: "pendiente" | "confirmada" | "rechazada") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(recargas).set({ estado }).where(eq(recargas.id, id));
}

// ---- Solicitudes de trabajo ----
export async function getAllSolicitudesTrabajo() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(solicitudesTrabajo).orderBy(desc(solicitudesTrabajo.createdAt));
}

export async function createSolicitudTrabajo(data: InsertSolicitudTrabajo) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(solicitudesTrabajo).values(data);
}

export async function updateSolicitudEstado(id: number, estado: "pendiente" | "revisada" | "aceptada" | "rechazada") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(solicitudesTrabajo).set({ estado }).where(eq(solicitudesTrabajo.id, id));
}

// ---- Reseñas ----
export async function getAllResenas(soloVisibles = false) {
  const db = await getDb();
  if (!db) return [];
  if (soloVisibles) {
    return db.select().from(resenas).where(eq(resenas.visible, "si")).orderBy(desc(resenas.createdAt));
  }
  return db.select().from(resenas).orderBy(desc(resenas.createdAt));
}
export async function createResena(data: InsertResena) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(resenas).values(data);
}
export async function updateResenaVisible(id: number, visible: "si" | "no") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(resenas).set({ visible }).where(eq(resenas.id, id));
}
export async function deleteResena(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(resenas).where(eq(resenas.id, id));
}
