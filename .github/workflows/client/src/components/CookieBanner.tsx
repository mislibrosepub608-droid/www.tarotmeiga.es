import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Cookie, X, Check } from "lucide-react";

const COOKIE_KEY = "tarot_meiga_cookies_accepted";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(COOKIE_KEY);
    if (!accepted) {
      // Pequeño delay para no mostrar inmediatamente
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(COOKIE_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 2rem)",
        maxWidth: "700px",
        background: "oklch(0.14 0.04 280)",
        border: "1px solid oklch(0.72 0.15 65 / 0.4)",
        borderRadius: "1rem",
        padding: "1.25rem 1.5rem",
        boxShadow: "0 8px 32px oklch(0 0 0 / 0.6)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        flexWrap: "wrap",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Línea dorada superior */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, oklch(0.72 0.15 65), transparent)", borderRadius: "1rem 1rem 0 0" }} />

      <Cookie size={24} style={{ color: "oklch(0.72 0.15 65)", flexShrink: 0 }} />

      <div style={{ flex: 1, minWidth: "200px" }}>
        <p style={{ fontFamily: "'Cinzel', serif", color: "oklch(0.85 0.12 65)", fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.25rem" }}>
          Usamos Cookies 🍪
        </p>
        <p style={{ color: "oklch(0.65 0.05 60)", fontFamily: "Georgia, serif", fontSize: "0.78rem", lineHeight: 1.5 }}>
          Utilizamos cookies para mejorar tu experiencia. Consulta nuestra{" "}
          <Link href="/legal" style={{ color: "oklch(0.72 0.15 65)", textDecoration: "underline" }}>
            política de privacidad
          </Link>.
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.6rem", flexShrink: 0 }}>
        <button
          onClick={reject}
          style={{
            display: "flex", alignItems: "center", gap: "0.3rem",
            background: "transparent",
            border: "1px solid oklch(0.35 0.06 280)",
            color: "oklch(0.55 0.05 60)",
            padding: "0.5rem 1rem",
            borderRadius: "0.4rem",
            cursor: "pointer",
            fontFamily: "'Cinzel', serif",
            fontSize: "0.72rem",
          }}
        >
          <X size={12} /> Rechazar
        </button>
        <button
          onClick={accept}
          style={{
            display: "flex", alignItems: "center", gap: "0.3rem",
            background: "linear-gradient(135deg, oklch(0.65 0.18 55), oklch(0.72 0.15 65))",
            border: "none",
            color: "oklch(0.10 0.02 280)",
            padding: "0.5rem 1.2rem",
            borderRadius: "0.4rem",
            cursor: "pointer",
            fontFamily: "'Cinzel', serif",
            fontSize: "0.72rem",
            fontWeight: "700",
          }}
        >
          <Check size={12} /> Aceptar
        </button>
      </div>
    </div>
  );
}
