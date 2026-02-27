import { Link } from "wouter";
import { Phone, Mail, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(180deg, oklch(0.10 0.02 280) 0%, oklch(0.07 0.03 280) 100%)",
        borderTop: "1px solid oklch(0.28 0.06 285)",
        padding: "3rem 0 1.5rem",
        marginTop: "2rem",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2.5rem",
            marginBottom: "2.5rem",
          }}
        >
          {/* Logo y descripción */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663356619570/dsLtSRVAHZMAsXew.png"
                alt="Tarot Meiga"
                style={{ width: "45px", height: "45px", objectFit: "contain" }}
              />
              <div>
                <div className="gradient-gold" style={{ fontFamily: "'Cinzel', serif", fontWeight: "700", fontSize: "1.1rem", letterSpacing: "0.1em" }}>
                  TAROT MEIGA
                </div>
                <div style={{ fontSize: "0.6rem", color: "oklch(0.55 0.05 60)", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Cinzel', serif" }}>
                  Sabiduría Ancestral
                </div>
              </div>
            </div>
            <p style={{ color: "oklch(0.60 0.04 60)", fontSize: "0.85rem", lineHeight: 1.7, fontFamily: "Georgia, serif" }}>
              Tu portal de sabiduría ancestral. Consulta con nuestras tarotistas de IA
              o reserva una sesión personal con Reina.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h4 style={{ color: "oklch(0.72 0.15 65)", fontFamily: "'Cinzel', serif", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>
              Navegación
            </h4>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                { href: "/", label: "Inicio" },
                { href: "/#tarotistas", label: "Tarotistas IA" },
                { href: "/#reina", label: "Reina - Tarotista" },
                { href: "/reservar", label: "Reservar Consulta" },
                { href: "/bonos", label: "Bonos & Precios" },
                { href: "/resenas", label: "Reseñas & Testimonios" },
                { href: "/trabaja", label: "Trabaja con Nosotros" },
                { href: "/legal", label: "Aviso Legal & Privacidad" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  style={{
                    color: "oklch(0.65 0.04 60)",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    fontFamily: "Georgia, serif",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "oklch(0.72 0.15 65)")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "oklch(0.65 0.04 60)")}
                >
                  ✦ {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contacto */}
          <div>
            <h4 style={{ color: "oklch(0.72 0.15 65)", fontFamily: "'Cinzel', serif", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>
              Contacto
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <a
                href="tel:+34625815306"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  color: "oklch(0.65 0.04 60)",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  fontFamily: "Georgia, serif",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.72 0.15 65)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.65 0.04 60)")}
              >
                <Phone size={14} style={{ color: "oklch(0.72 0.15 65)", flexShrink: 0 }} />
                +34 625 815 306
              </a>
              <a
                href="mailto:tarotmeiga.es@gmail.com"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  color: "oklch(0.65 0.04 60)",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  fontFamily: "Georgia, serif",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.72 0.15 65)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.65 0.04 60)")}
              >
                <Mail size={14} style={{ color: "oklch(0.72 0.15 65)", flexShrink: 0 }} />
                tarotmeiga.es@gmail.com
              </a>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <Link href="/reservar" className="btn-gold" style={{ padding: "0.6rem 1.25rem", fontSize: "0.75rem" }}>
                Reservar Consulta
              </Link>
            </div>
          </div>
        </div>

        {/* Separador */}
        <hr className="divider-gold" style={{ margin: "0 0 1.5rem" }} />

        {/* Copyright */}
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "oklch(0.45 0.04 60)", fontSize: "0.78rem", fontFamily: "Georgia, serif" }}>
            © 2025 Tarot Meiga · Sabiduría Ancestral · Todos los derechos reservados ·{" "}
            <a href="/legal" style={{ color: "oklch(0.55 0.04 60)", textDecoration: "underline" }}>Aviso Legal</a>
          </p>
          <p style={{ color: "oklch(0.40 0.04 60)", fontSize: "0.72rem", fontFamily: "Georgia, serif", marginTop: "0.4rem" }}>
            Las consultas de tarot son de carácter orientativo y no sustituyen el consejo profesional.
          </p>
        </div>
      </div>
    </footer>
  );
}
