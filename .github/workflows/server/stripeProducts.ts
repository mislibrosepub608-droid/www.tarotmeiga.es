// Definición centralizada de productos/bonos para Stripe
export interface BonoPago {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number; // en céntimos (EUR)
  creditos: number;
  tipo: "consultas" | "minutos";
  popular?: boolean;
}

export const BONOS_STRIPE: BonoPago[] = [
  {
    id: "bono-express",
    nombre: "Consulta Express",
    descripcion: "1 consulta de tarot por escrito (email o WhatsApp)",
    precio: 1500, // 15.00 EUR
    creditos: 1,
    tipo: "consultas",
  },
  {
    id: "bono-basico",
    nombre: "Bono Básico",
    descripcion: "3 consultas de tarot — ahorra 6€",
    precio: 3900, // 39.00 EUR
    creditos: 3,
    tipo: "consultas",
    popular: true,
  },
  {
    id: "bono-estandar",
    nombre: "Bono Estándar",
    descripcion: "5 consultas de tarot — ahorra 16€",
    precio: 5900, // 59.00 EUR
    creditos: 5,
    tipo: "consultas",
  },
  {
    id: "bono-premium",
    nombre: "Bono Premium",
    descripcion: "10 consultas de tarot — ahorra 51€",
    precio: 9900, // 99.00 EUR
    creditos: 10,
    tipo: "consultas",
  },
  {
    id: "sesion-30",
    nombre: "Sesión 30 Minutos",
    descripcion: "Sesión en vivo de 30 minutos por llamada o videollamada",
    precio: 2500, // 25.00 EUR
    creditos: 30,
    tipo: "minutos",
  },
  {
    id: "sesion-60",
    nombre: "Sesión 60 Minutos",
    descripcion: "Sesión en vivo de 60 minutos por llamada o videollamada",
    precio: 4500, // 45.00 EUR
    creditos: 60,
    tipo: "minutos",
  },
];
