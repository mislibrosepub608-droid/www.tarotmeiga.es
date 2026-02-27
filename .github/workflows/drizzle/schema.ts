import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tabla de reservas para Reina
export const reservas = mysqlTable("reservas", {
  id: int("id").autoincrement().primaryKey(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  tipoConsulta: mysqlEnum("tipoConsulta", ["amor", "trabajo", "salud", "general"]).notNull(),
  metodoContacto: mysqlEnum("metodoContacto", ["whatsapp", "audio", "email", "llamada"]).notNull(),
  mensaje: text("mensaje"),
  telefono: varchar("telefono", { length: 30 }),
  estado: mysqlEnum("estado", ["pendiente", "confirmada", "completada", "cancelada"]).default("pendiente").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Reserva = typeof reservas.$inferSelect;
export type InsertReserva = typeof reservas.$inferInsert;

// Tabla de conversaciones con tarotistas IA
export const chatConversaciones = mysqlTable("chat_conversaciones", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 128 }).notNull(),
  tarotistId: varchar("tarotistId", { length: 64 }).notNull(),
  pregunta: text("pregunta").notNull(),
  respuesta: text("respuesta").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatConversacion = typeof chatConversaciones.$inferSelect;
export type InsertChatConversacion = typeof chatConversaciones.$inferInsert;

// Tabla de clientes registrados
export const clientes = mysqlTable("clientes", {
  id: int("id").autoincrement().primaryKey(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  telefono: varchar("telefono", { length: 30 }),
  saldo: decimal("saldo", { precision: 10, scale: 2 }).default("0.00").notNull(),
  notas: text("notas"),
  estado: mysqlEnum("estado", ["activo", "inactivo"]).default("activo").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Cliente = typeof clientes.$inferSelect;
export type InsertCliente = typeof clientes.$inferInsert;

// Tabla de bonos/paquetes disponibles
export const bonos = mysqlTable("bonos", {
  id: int("id").autoincrement().primaryKey(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  descripcion: text("descripcion"),
  precio: decimal("precio", { precision: 10, scale: 2 }).notNull(),
  creditos: int("creditos").notNull(), // minutos o consultas incluidas
  tipo: mysqlEnum("tipo", ["minutos", "consultas"]).default("minutos").notNull(),
  activo: mysqlEnum("activo", ["si", "no"]).default("si").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Bono = typeof bonos.$inferSelect;
export type InsertBono = typeof bonos.$inferInsert;

// Tabla de recargas/compras de bonos
export const recargas = mysqlTable("recargas", {
  id: int("id").autoincrement().primaryKey(),
  clienteId: int("clienteId"),
  clienteNombre: varchar("clienteNombre", { length: 255 }).notNull(),
  clienteEmail: varchar("clienteEmail", { length: 320 }).notNull(),
  clienteTelefono: varchar("clienteTelefono", { length: 30 }),
  bonoId: int("bonoId"),
  bonoNombre: varchar("bonoNombre", { length: 255 }).notNull(),
  importe: decimal("importe", { precision: 10, scale: 2 }).notNull(),
  creditos: int("creditos").notNull(),
  metodo: mysqlEnum("metodo", ["transferencia", "bizum", "paypal", "efectivo"]).default("bizum").notNull(),
  estado: mysqlEnum("estado", ["pendiente", "confirmada", "rechazada"]).default("pendiente").notNull(),
  notas: text("notas"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Recarga = typeof recargas.$inferSelect;
export type InsertRecarga = typeof recargas.$inferInsert;

// Tabla de solicitudes "Trabaja con Nosotros"
export const solicitudesTrabajo = mysqlTable("solicitudes_trabajo", {
  id: int("id").autoincrement().primaryKey(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  telefono: varchar("telefono", { length: 30 }),
  especialidad: varchar("especialidad", { length: 255 }).notNull(),
  experiencia: text("experiencia").notNull(),
  presentacion: text("presentacion").notNull(),
  redesSociales: varchar("redesSociales", { length: 500 }),
  estado: mysqlEnum("estado", ["pendiente", "revisada", "aceptada", "rechazada"]).default("pendiente").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SolicitudTrabajo = typeof solicitudesTrabajo.$inferSelect;
export type InsertSolicitudTrabajo = typeof solicitudesTrabajo.$inferInsert;

// Tabla de reseñas y testimonios de clientes
export const resenas = mysqlTable("resenas", {
  id: int("id").autoincrement().primaryKey(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  texto: text("texto").notNull(),
  puntuacion: int("puntuacion").default(5).notNull(), // 1-5 estrellas
  tarotistaNombre: varchar("tarotistaNombre", { length: 255 }), // opcional: tarotista consultada
  visible: mysqlEnum("visible", ["si", "no"]).default("no").notNull(), // admin aprueba antes de mostrar
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Resena = typeof resenas.$inferSelect;
export type InsertResena = typeof resenas.$inferInsert;
