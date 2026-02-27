import { useState } from "react";
import { Link } from "wouter";
import { Menu, X, Phone, Mail } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        background: "linear-gradient(180deg, oklch(0.08 0.03 280) 0%, oklch(0.10 0.02 280 / 0.95) 100%)",
        borderBottom: "1px solid oklch(0.35 0.08 285)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Barra de contacto superior */}
      <div
        style={{
          background: "linear-gradient(90deg, oklch(0.18 0.06 285), oklch(0.22 0.08 290), oklch(0.18 0.06 285))",
          borderBottom: "1px solid oklch(0.72 0.15 65 / 0.3)",
          padding: "0.35rem 0",
        }}
      >
        <div className="container" style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
          <a
            href="tel:+34625815306"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "oklch(0.85 0.12 65)",
              textDecoration: "none",
              fontSize: "0.8rem",
              fontFamily: "'Cinzel', serif",
              letterSpacing: "0.03em",
            }}
          >
            <Phone size={13} />
            +34 625 815 306
          </a>
          <a
            href="mailto:tarotmeiga.es@gmail.com"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "oklch(0.85 0.12 65)",
              textDecoration: "none",
              fontSize: "0.8rem",
              fontFamily: "'Cinzel', serif",
              letterSpacing: "0.03em",
            }}
          >
            <Mail size={13} />
            tarotmeiga.es@gmail.com
          </a>
        </div>
      </div>

      {/* Navegación principal */}
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
          <img
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663356619570/dsLtSRVAHZMAsXew.png"
            alt="Tarot Meiga"
            style={{ height: "52px", width: "52px", objectFit: "contain" }}
          />
          <div>
            <div
              className="gradient-gold"
              style={{
                fontSize: "1.3rem",
                fontWeight: "700",
                fontFamily: "'Cinzel', serif",
                letterSpacing: "0.1em",
                lineHeight: 1.1,
              }}
            >
              TAROT MEIGA
            </div>
            <div
              style={{
                fontSize: "0.6rem",
                color: "oklch(0.65 0.06 60)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontFamily: "'Cinzel', serif",
              }}
            >
              Sabiduría Ancestral
            </div>
          </div>
        </Link>

        {/* Nav desktop */}
        <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }} className="hidden md:flex">
          {[
            { href: "/", label: "Inicio" },
            { href: "/#tarotistas", label: "Tarotistas IA" },
            { href: "/#reina", label: "Reina" },
            { href: "/bonos", label: "Bonos" },
            { href: "/resenas", label: "Reseñas" },
            { href: "/trabaja", label: "Trabaja" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                color: "oklch(0.85 0.08 60)",
                textDecoration: "none",
                fontSize: "0.85rem",
                fontFamily: "'Cinzel', serif",
                letterSpacing: "0.05em",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "oklch(0.72 0.15 65)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "oklch(0.85 0.08 60)")}
            >
              {label}
            </Link>
          ))}
          <Link href="/reservar" className="btn-gold" style={{ padding: "0.5rem 1.25rem", fontSize: "0.75rem" }}>
            Consultar
          </Link>
        </nav>

        {/* Hamburger móvil */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "none",
            border: "1px solid oklch(0.35 0.08 285)",
            borderRadius: "0.5rem",
            padding: "0.5rem",
            color: "oklch(0.85 0.12 65)",
            cursor: "pointer",
          }}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div
          style={{
            background: "oklch(0.12 0.03 280)",
            borderTop: "1px solid oklch(0.28 0.06 285)",
            padding: "1rem",
          }}
          className="md:hidden"
        >
          {[
            { href: "/", label: "Inicio" },
            { href: "/#tarotistas", label: "Tarotistas IA" },
            { href: "/#reina", label: "Reina" },
            { href: "/bonos", label: "Bonos & Precios" },
            { href: "/resenas", label: "Reseñas" },
            { href: "/reservar", label: "Reservar con Reina" },
            { href: "/trabaja", label: "Trabaja con Nosotros" },
            { href: "/admin", label: "Panel Admin" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "0.75rem 0",
                color: "oklch(0.85 0.08 60)",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontFamily: "'Cinzel', serif",
                borderBottom: "1px solid oklch(0.22 0.06 285)",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
