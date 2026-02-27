import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { MessageCircle, X, Send, Phone } from "lucide-react";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

const WA_NUMBER = "34625815306";
const WA_MSG = encodeURIComponent("Hola, me gustaría obtener más información sobre los servicios de Tarot Meiga.");

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center", padding: "0.6rem 0.9rem", background: "oklch(0.18 0.04 280)", borderRadius: "1rem 1rem 1rem 0.25rem", width: "fit-content" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "oklch(0.72 0.15 65)", animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
      ))}
    </div>
  );
}

export default function FloatingWidgets() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "assistant", content: "¡Hola! Soy Luna, tu asistente de Tarot Meiga ✨ ¿En qué puedo ayudarte hoy? Puedo informarte sobre nuestros servicios, bonos, cómo reservar con Reina y mucho más." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const atencionMutation = trpc.chat.atencion.useMutation({
    onSuccess: (data) => {
      setMessages(prev => [...prev, { role: "assistant", content: data.respuesta }]);
      setIsTyping(false);
    },
    onError: () => {
      setMessages(prev => [...prev, { role: "assistant", content: "Disculpa, no puedo responder ahora mismo. Contáctanos directamente al +34 625 815 306." }]);
      setIsTyping(false);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = input.trim();
    if (!msg || isTyping) return;

    const newMessages: ChatMsg[] = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    atencionMutation.mutate({
      mensaje: msg,
      historial: newMessages.slice(-6).map(m => ({ role: m.role, content: m.content })),
    });
  };

  return (
    <>
      {/* Estilos de animación */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse-wa {
          0%, 100% { box-shadow: 0 0 0 0 oklch(0.65 0.25 145 / 0.5); }
          50% { box-shadow: 0 0 0 10px oklch(0.65 0.25 145 / 0); }
        }
      `}</style>

      {/* Botón flotante WhatsApp */}
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Contactar por WhatsApp"
        style={{
          position: "fixed",
          bottom: chatOpen ? "26rem" : "1.5rem",
          right: "1.5rem",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #25D366, #128C7E)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px oklch(0 0 0 / 0.4)",
          zIndex: 9998,
          textDecoration: "none",
          transition: "bottom 0.3s ease, transform 0.2s ease",
          animation: "pulse-wa 2s infinite",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        {/* WhatsApp SVG icon */}
        <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Botón flotante Chatbot */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        title="Asistente virtual Luna"
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "5rem",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: chatOpen
            ? "oklch(0.25 0.06 280)"
            : "linear-gradient(135deg, oklch(0.65 0.18 55), oklch(0.72 0.15 65))",
          border: chatOpen ? "1px solid oklch(0.72 0.15 65 / 0.5)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px oklch(0 0 0 / 0.4)",
          cursor: "pointer",
          zIndex: 9998,
          transition: "all 0.3s ease",
          color: chatOpen ? "oklch(0.72 0.15 65)" : "oklch(0.10 0.02 280)",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        {chatOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Ventana del chatbot */}
      {chatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "5.5rem",
            right: "1.5rem",
            width: "min(360px, calc(100vw - 2rem))",
            height: "460px",
            background: "oklch(0.12 0.03 280)",
            border: "1px solid oklch(0.72 0.15 65 / 0.3)",
            borderRadius: "1.25rem",
            boxShadow: "0 16px 48px oklch(0 0 0 / 0.6)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9997,
            animation: "fadeInUp 0.3s ease",
          }}
        >
          {/* Header del chat */}
          <div style={{
            background: "linear-gradient(135deg, oklch(0.65 0.18 55 / 0.3), oklch(0.72 0.15 65 / 0.2))",
            borderBottom: "1px solid oklch(0.72 0.15 65 / 0.2)",
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: "linear-gradient(135deg, oklch(0.65 0.18 55), oklch(0.72 0.15 65))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.2rem", flexShrink: 0,
            }}>🌙</div>
            <div>
              <p style={{ fontFamily: "'Cinzel', serif", color: "oklch(0.85 0.12 65)", fontWeight: "700", fontSize: "0.9rem", lineHeight: 1.2 }}>Luna</p>
              <p style={{ color: "oklch(0.65 0.18 145)", fontSize: "0.72rem", fontFamily: "Georgia, serif" }}>● En línea · Asistente Tarot Meiga</p>
            </div>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Hablar con Reina por WhatsApp"
              style={{ marginLeft: "auto", color: "#25D366", display: "flex", alignItems: "center", gap: "0.3rem", textDecoration: "none", fontSize: "0.72rem", fontFamily: "'Cinzel', serif" }}
            >
              <Phone size={14} /> Reina
            </a>
          </div>

          {/* Mensajes */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "80%",
                  padding: "0.6rem 0.9rem",
                  borderRadius: msg.role === "user" ? "1rem 1rem 0.25rem 1rem" : "1rem 1rem 1rem 0.25rem",
                  background: msg.role === "user"
                    ? "linear-gradient(135deg, oklch(0.65 0.18 55 / 0.8), oklch(0.72 0.15 65 / 0.8))"
                    : "oklch(0.18 0.04 280)",
                  color: msg.role === "user" ? "oklch(0.10 0.02 280)" : "oklch(0.85 0.04 60)",
                  fontFamily: "Georgia, serif",
                  fontSize: "0.82rem",
                  lineHeight: 1.6,
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <TypingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{
            borderTop: "1px solid oklch(0.25 0.06 280)",
            padding: "0.75rem",
            display: "flex",
            gap: "0.5rem",
            background: "oklch(0.14 0.03 280)",
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              disabled={isTyping}
              style={{
                flex: 1,
                background: "oklch(0.18 0.04 280)",
                border: "1px solid oklch(0.30 0.06 280)",
                color: "oklch(0.92 0.04 60)",
                padding: "0.6rem 0.9rem",
                borderRadius: "0.75rem",
                fontFamily: "Georgia, serif",
                fontSize: "0.82rem",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              style={{
                background: input.trim() && !isTyping
                  ? "linear-gradient(135deg, oklch(0.65 0.18 55), oklch(0.72 0.15 65))"
                  : "oklch(0.20 0.04 280)",
                border: "none",
                color: input.trim() && !isTyping ? "oklch(0.10 0.02 280)" : "oklch(0.40 0.04 280)",
                width: "38px",
                height: "38px",
                borderRadius: "0.75rem",
                cursor: input.trim() && !isTyping ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.2s",
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
