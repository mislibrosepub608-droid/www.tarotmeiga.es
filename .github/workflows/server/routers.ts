import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import {
  createReserva, getAllReservas, updateReservaEstado,
  createChatConversacion,
  getAllClientes, createCliente, updateClienteSaldo, updateClienteNotas,
  getAllBonos, createBono, seedBonosDefault,
  getAllRecargas, createRecarga, updateRecargaEstado,
  getAllSolicitudesTrabajo, createSolicitudTrabajo, updateSolicitudEstado,
  getAllResenas, createResena, updateResenaVisible, deleteResena,
} from "./db";
import { TAROTISTAS } from "../shared/tarotistas";
import { notifyOwner } from "./_core/notification";
import Stripe from "stripe";
import { BONOS_STRIPE } from "./stripeProducts";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Tarotistas
  tarotistas: router({
    list: publicProcedure.query(() => {
      return TAROTISTAS.map(t => ({
        id: t.id,
        nombre: t.nombre,
        especialidad: t.especialidad,
        descripcionCorta: t.descripcionCorta,
        avatar: t.avatar,
        imagen: t.imagen,
        color: t.color,
        tags: t.tags,
        disponible: t.disponible,
      }));
    }),
    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(({ input }) => {
        const tarotista = TAROTISTAS.find(t => t.id === input.id);
        if (!tarotista) throw new TRPCError({ code: "NOT_FOUND", message: "Tarotista no encontrada" });
        return tarotista;
      }),
  }),

  // Chat IA con tarotista
  chat: router({
    preguntar: publicProcedure
      .input(z.object({
        tarotistId: z.string(),
        pregunta: z.string().min(5).max(500),
        sessionId: z.string(),
      }))
      .mutation(async ({ input }) => {
        const tarotista = TAROTISTAS.find(t => t.id === input.tarotistId);
        if (!tarotista) throw new TRPCError({ code: "NOT_FOUND", message: "Tarotista no encontrada" });

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: tarotista.systemPrompt + "\n\nEres una tarotista mística de la plataforma Tarot Meiga - Sabiduría Ancestral. Cuando respondas, imagina que estás tirando las cartas del tarot para el consultante. Menciona alguna carta específica del tarot en tu respuesta. Sé auténtico a tu personalidad única.",
            },
            { role: "user", content: input.pregunta },
          ],
        });

        const rawContent = response.choices?.[0]?.message?.content;
        const respuesta = typeof rawContent === "string" ? rawContent : "Las cartas no hablan en este momento. Inténtalo de nuevo.";

        await createChatConversacion({
          sessionId: input.sessionId,
          tarotistId: input.tarotistId,
          pregunta: input.pregunta,
          respuesta,
        });

        return { respuesta };
      }),

    // Chatbot de atención al cliente
    atencion: publicProcedure
      .input(z.object({
        mensaje: z.string().min(1).max(500),
        historial: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).optional(),
      }))
      .mutation(async ({ input }) => {
        const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
          {
            role: "system",
            content: `Eres el asistente virtual de Tarot Meiga - Sabiduría Ancestral. Tu nombre es Luna y eres amable, cálida y mística.
Ayudas a los clientes con información sobre:
- Los servicios de tarot disponibles (tarotistas IA con 1 pregunta gratis, y consultas con Reina la tarotista humana)
- Los bonos y precios: Consulta Express (15€/1 consulta), Bono Básico (39€/3 consultas), Bono Estándar (59€/6 consultas), Bono Premium (99€/10 consultas), Pack 30 min (25€), Pack 60 min (45€)
- Cómo reservar una consulta con Reina (formulario en la web o llamando al +34 625 815 306)
- Métodos de contacto: WhatsApp, audio, email o llamada
- Email de contacto: tarotmeiga.es@gmail.com
- Teléfono: +34 625 815 306
- Para reservar bonos, los clientes deben ir a la sección "Bonos" y rellenar el formulario de recarga
- Para trabajar con nosotros, hay un formulario en la sección "Trabaja con Nosotros"
Responde siempre en español, de forma breve y cálida. Si no sabes algo, sugiere contactar directamente por WhatsApp o teléfono.`,
          },
        ];

        if (input.historial) {
          for (const msg of input.historial) {
            messages.push({ role: msg.role, content: msg.content });
          }
        }
        messages.push({ role: "user", content: input.mensaje });

        const response = await invokeLLM({ messages });
        const rawContent = response.choices?.[0]?.message?.content;
        const respuesta = typeof rawContent === "string" ? rawContent : "Disculpa, no puedo responder ahora. Contáctanos al +34 625 815 306.";

        return { respuesta };
      }),
  }),

  // Reservas para Reina
  reservas: router({
    crear: publicProcedure
      .input(z.object({
        nombre: z.string().min(2).max(255),
        email: z.string().email().optional(),
        telefono: z.string().optional(),
        tipoConsulta: z.enum(["amor", "trabajo", "salud", "general"]),
        metodoContacto: z.enum(["whatsapp", "audio", "email", "llamada"]),
        mensaje: z.string().max(1000).optional(),
      }))
      .mutation(async ({ input }) => {
        await createReserva({
          nombre: input.nombre,
          email: input.email,
          telefono: input.telefono,
          tipoConsulta: input.tipoConsulta,
          metodoContacto: input.metodoContacto,
          mensaje: input.mensaje,
        });
        await notifyOwner({
          title: `Nueva reserva de ${input.nombre}`,
          content: `Tipo: ${input.tipoConsulta} | Contacto: ${input.metodoContacto} | Email: ${input.email ?? "no indicado"} | Tel: ${input.telefono ?? "no indicado"} | Mensaje: ${input.mensaje ?? "sin mensaje"}`,
        });
        return { success: true };
      }),

    listar: publicProcedure.query(async () => getAllReservas()),

    actualizarEstado: publicProcedure
      .input(z.object({ id: z.number(), estado: z.enum(["pendiente", "confirmada", "completada", "cancelada"]) }))
      .mutation(async ({ input }) => {
        await updateReservaEstado(input.id, input.estado);
        return { success: true };
      }),
  }),

  // Clientes
  clientes: router({
    listar: publicProcedure.query(async () => getAllClientes()),

    crear: publicProcedure
      .input(z.object({
        nombre: z.string().min(2).max(255),
        email: z.string().email(),
        telefono: z.string().optional(),
        notas: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await createCliente({
          nombre: input.nombre,
          email: input.email,
          telefono: input.telefono,
          notas: input.notas,
        });
        return { success: true };
      }),

    actualizarSaldo: publicProcedure
      .input(z.object({ id: z.number(), saldo: z.string() }))
      .mutation(async ({ input }) => {
        await updateClienteSaldo(input.id, input.saldo);
        return { success: true };
      }),

    actualizarNotas: publicProcedure
      .input(z.object({ id: z.number(), notas: z.string() }))
      .mutation(async ({ input }) => {
        await updateClienteNotas(input.id, input.notas);
        return { success: true };
      }),
  }),

  // Bonos
  bonos: router({
    listar: publicProcedure.query(async () => {
      await seedBonosDefault();
      return getAllBonos();
    }),

    crear: publicProcedure
      .input(z.object({
        nombre: z.string().min(2).max(255),
        descripcion: z.string().optional(),
        precio: z.string(),
        creditos: z.number().int().positive(),
        tipo: z.enum(["minutos", "consultas"]),
      }))
      .mutation(async ({ input }) => {
        await createBono({
          nombre: input.nombre,
          descripcion: input.descripcion,
          precio: input.precio,
          creditos: input.creditos,
          tipo: input.tipo,
        });
        return { success: true };
      }),
  }),

  // Recargas
  recargas: router({
    listar: publicProcedure.query(async () => getAllRecargas()),

    solicitar: publicProcedure
      .input(z.object({
        clienteNombre: z.string().min(2).max(255),
        clienteEmail: z.string().email(),
        clienteTelefono: z.string().optional(),
        bonoId: z.number().int().positive(),
        bonoNombre: z.string(),
        importe: z.string(),
        creditos: z.number().int().positive(),
        metodo: z.enum(["transferencia", "bizum", "paypal", "efectivo"]),
        notas: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await createRecarga({
          clienteNombre: input.clienteNombre,
          clienteEmail: input.clienteEmail,
          clienteTelefono: input.clienteTelefono,
          bonoId: input.bonoId,
          bonoNombre: input.bonoNombre,
          importe: input.importe,
          creditos: input.creditos,
          metodo: input.metodo,
          notas: input.notas,
        });
        await notifyOwner({
          title: `Nueva solicitud de recarga de ${input.clienteNombre}`,
          content: `Bono: ${input.bonoNombre} | Importe: ${input.importe}€ | Método: ${input.metodo} | Email: ${input.clienteEmail} | Tel: ${input.clienteTelefono ?? "no indicado"}`,
        });
        return { success: true };
      }),

    actualizarEstado: publicProcedure
      .input(z.object({ id: z.number(), estado: z.enum(["pendiente", "confirmada", "rechazada"]) }))
      .mutation(async ({ input }) => {
        await updateRecargaEstado(input.id, input.estado);
        return { success: true };
      }),
  }),

  // Stripe Pagos
  pagos: router({
    crearCheckout: publicProcedure
      .input(z.object({
        bonoId: z.string(),
        clienteNombre: z.string().optional(),
        clienteEmail: z.string().email().optional(),
        origin: z.string(),
      }))
      .mutation(async ({ input }) => {
        const bono = BONOS_STRIPE.find(b => b.id === input.bonoId);
        if (!bono) throw new TRPCError({ code: "NOT_FOUND", message: "Bono no encontrado" });

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [{
            price_data: {
              currency: "eur",
              product_data: {
                name: `Tarot Meiga - ${bono.nombre}`,
                description: bono.descripcion,
                images: ["https://files.manuscdn.com/user_upload_by_module/session_file/310519663356619570/dsLtSRVAHZMAsXew.png"],
              },
              unit_amount: bono.precio,
            },
            quantity: 1,
          }],
          mode: "payment",
          allow_promotion_codes: true,
          customer_email: input.clienteEmail,
          client_reference_id: input.clienteEmail || "guest",
          metadata: {
            bono_id: bono.id,
            bono_nombre: bono.nombre,
            creditos: bono.creditos.toString(),
            customer_name: input.clienteNombre || "",
            customer_email: input.clienteEmail || "",
          },
          success_url: `${input.origin}/bonos?pago=exitoso`,
          cancel_url: `${input.origin}/bonos?pago=cancelado`,
        });

        return { url: session.url };
      }),
  }),

  // Reseñas y testimonios
  resenas: router({
    listar: publicProcedure
      .input(z.object({ soloVisibles: z.boolean().optional() }))
      .query(async ({ input }) => getAllResenas(input.soloVisibles ?? true)),

    listarAdmin: publicProcedure.query(async () => getAllResenas(false)),

    crear: publicProcedure
      .input(z.object({
        nombre: z.string().min(2).max(255),
        email: z.string().email().optional(),
        texto: z.string().min(10).max(1000),
        puntuacion: z.number().int().min(1).max(5),
        tarotistaNombre: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await createResena({
          nombre: input.nombre,
          email: input.email,
          texto: input.texto,
          puntuacion: input.puntuacion,
          tarotistaNombre: input.tarotistaNombre,
          visible: "no", // pendiente de aprobación
        });
        await notifyOwner({
          title: `Nueva reseña de ${input.nombre}`,
          content: `Puntuación: ${input.puntuacion}/5\nTexto: ${input.texto}\nEmail: ${input.email ?? "no indicado"}`,
        });
        return { success: true };
      }),

    aprobar: publicProcedure
      .input(z.object({ id: z.number(), visible: z.enum(["si", "no"]) }))
      .mutation(async ({ input }) => {
        await updateResenaVisible(input.id, input.visible);
        return { success: true };
      }),

    eliminar: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteResena(input.id);
        return { success: true };
      }),
  }),

  // Solicitudes de trabajo
  trabajo: router({
    listar: publicProcedure.query(async () => getAllSolicitudesTrabajo()),

    solicitar: publicProcedure
      .input(z.object({
        nombre: z.string().min(2).max(255),
        email: z.string().email(),
        telefono: z.string().optional(),
        especialidad: z.string().min(2).max(255),
        experiencia: z.string().min(10).max(2000),
        presentacion: z.string().min(10).max(2000),
        redesSociales: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await createSolicitudTrabajo({
          nombre: input.nombre,
          email: input.email,
          telefono: input.telefono,
          especialidad: input.especialidad,
          experiencia: input.experiencia,
          presentacion: input.presentacion,
          redesSociales: input.redesSociales,
        });
        await notifyOwner({
          title: `Nueva solicitud de trabajo de ${input.nombre}`,
          content: `Especialidad: ${input.especialidad} | Email: ${input.email} | Tel: ${input.telefono ?? "no indicado"}`,
        });
        return { success: true };
      }),

    actualizarEstado: publicProcedure
      .input(z.object({ id: z.number(), estado: z.enum(["pendiente", "revisada", "aceptada", "rechazada"]) }))
      .mutation(async ({ input }) => {
        await updateSolicitudEstado(input.id, input.estado);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
