import { useState, useEffect } from "react";
import axios from "axios";

// ─── Constantes ───────────────────────────────────────────────────────────────
const API_URL = "http://localhost:8080/productos/catalogo";
const WA_NUMBER = "5493572436695";

// ─── Constantes Basadas en tu PanelLayout (MISMOS NOMBRES QUE USAMOS ABAJO) ───
const C = {
  amarillo: "#FFF0A0",
  amarilloBorde: "#F5D000",
  naranja: "#E8835A",
  naranjaOscuro: "#C9603A",
  blanco: "#FFFDF5",
  fondoPanel: "#FAF6EE",
  texto: "#5A4A3A",
  textoSuave: "#9A8A7A",
  borde: "#EDE8DF",
  green500: "#22c55e", // Mantenemos verde para WA
  green600: "#16a34a",
  white: "#ffffff",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const waLink = (nombre, variante) => {
  const txt =
    `Hola! Me interesa el producto ${nombre}${variante ? " " + variante : ""}`.trim();
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(txt)}`;
};

const fmt = (v) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(v);

// ─── Estilos globales inyectados una sola vez ─────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&family=Nunito:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Nunito', sans-serif; background:${C.fondoPanel}; color:${C.texto}; }
  img  { display:block; max-width:100%; }
  a    { text-decoration:none; }
  button { cursor:pointer; font-family:inherit; }
  select { font-family:inherit; }

  @keyframes spin    { to { transform:rotate(360deg); } }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse   { 0%,100%{opacity:.35} 50%{opacity:.8} }
  @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }

  .pana-card {
    background:${C.blanco};
    border-radius:20px;
    border:1.5px solid ${C.borde};
    box-shadow:0 1px 6px rgba(90,74,58,.08);
    overflow:hidden;
    display:flex;
    flex-direction:column;
    transition:transform .25s,box-shadow .25s;
    animation:fadeUp .45s ease both;
  }
  .pana-card:hover { transform:translateY(-4px); border-color:${C.amarilloBorde}; box-shadow:0 10px 32px rgba(245,208,0,.18); }

  .chip {
    border:1.5px solid ${C.borde};
    background:#fff;
    color:${C.textoSuave};
    border-radius:99px;
    padding:4px 13px;
    font-size:12px;
    font-weight:600;
    cursor:pointer;
    transition:background .15s,color .15s,transform .12s;
  }
  .chip:hover { background:${C.amarillo}; color:${C.texto}; }
  .chip.on    { background:${C.naranja}; color:${C.white}; border-color:${C.naranja}; transform:scale(1.08); }

  .btn-wa {
    display:flex; align-items:center; justify-content:center; gap:8px;
    background:${C.green500}; color:${C.white};
    font-weight:700; font-size:14px;
    padding:11px 16px; border-radius:14px; border:none;
    text-decoration:none; cursor:pointer;
    transition:background .15s,transform .1s;
    box-shadow:0 2px 10px rgba(34,197,94,.25);
  }
  .btn-wa:hover  { background:${C.green600}; }
  .btn-wa:active { transform:scale(.97); }

  .nav-link {
    padding:8px 16px; border-radius:12px;
    font-size:14px; font-weight:600;
    color:${C.textoSuave}; background:transparent; border:none; cursor:pointer;
    transition:color .15s,background .15s;
  }
  .nav-link:hover { color:${C.naranja}; background:${C.amarillo}; }

  .valor-card {
    background:${C.white}; border:1.5px solid ${C.borde}; border-radius:18px;
    padding:22px; display:flex; gap:16px;
    box-shadow:0 1px 4px rgba(0,0,0,.04);
    transition:transform .2s,box-shadow .2s;
  }
  .valor-card:hover { transform:translateY(-2px); border-color:${C.amarilloBorde}; box-shadow:0 6px 20px rgba(245,208,0,.12); }

  .input-search {
    width:100%; padding:12px 14px 12px 42px;
    border-radius:14px; border:1.5px solid ${C.borde};
    background:#fff; font-size:14px; color:${C.texto}; outline:none;
    transition:border-color .2s,box-shadow .2s;
  }
  .input-search:focus { border-color:${C.naranja}; box-shadow:0 0 0 3px rgba(232,131,90,.15); }

  .sel-cat {
    padding:12px 38px 12px 14px;
    border-radius:14px; border:1.5px solid ${C.borde};
    background:#fff; font-size:14px; font-weight:600; color:${C.texto};
    outline:none; appearance:none; -webkit-appearance:none; cursor:pointer;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23E8835A'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
    background-repeat:no-repeat; background-position:right 10px center; background-size:16px;
    transition:border-color .2s,box-shadow .2s;
  }
  .sel-cat:focus { border-color:${C.naranja}; box-shadow:0 0 0 3px rgba(232,131,90,.15); }

  .badge {
    display:inline-block; background:${C.amarillo}; color:${C.naranjaOscuro};
    font-size:12px; font-weight:700; padding:5px 15px;
    border-radius:99px; letter-spacing:.3px; font-family:'Baloo 2', cursive;
  }
  
  .hero-h1 {
    font-family: 'Baloo 2', cursive;
    color: ${C.naranja};
    font-weight: 800;
  }

  /* ── Responsive ── */
  @media(max-width:640px){
    .hero-h1   { font-size:2.3rem !important; }
    .cols-2    { grid-template-columns:1fr !important; }
    .filtros   { flex-direction:column !important; }
    .nav-desk  { display:none !important; }
    .ham       { display:flex !important; }
    .prod-grid { grid-template-columns:1fr !important; }
  }
  @media(min-width:641px) and (max-width:1023px){
    .prod-grid { grid-template-columns:repeat(2,1fr) !important; }
  }
  @media(min-width:1024px){
    .prod-grid { grid-template-columns:repeat(3,1fr) !important; }
    .ham       { display:none !important; }
  }
  @media(min-width:1280px){
    .prod-grid { grid-template-columns:repeat(4,1fr) !important; }
  }
`;

function GlobalStyle() {
  useEffect(() => {
    const ID = "pana-styles";
    if (!document.getElementById(ID)) {
      const s = document.createElement("style");
      s.id = ID;
      s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
    }
  }, []);
  return null;
}

// ─── Íconos SVG inline ────────────────────────────────────────────────────────
const IcoWA = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);
const IcoSearch = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke={C.textoSuave}
    strokeWidth="2.2"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);
const IcoHeart = ({ size = 18, color = C.white }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const goto = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const links = [
    { l: "Inicio", id: "inicio" },
    { l: "Quiénes Somos", id: "quienes-somos" },
    { l: "Catálogo", id: "catalogo" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled
          ? "rgba(255,253,245,.97)"
          : "rgba(255,253,245,.82)",
        backdropFilter: "blur(10px)",
        boxShadow: scrolled ? "0 2px 16px rgba(90,74,58,.08)" : "none",
        borderBottom: `1px solid ${scrolled ? C.borde : "transparent"}`,
        transition: "all .3s",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <button
          onClick={() => goto("inicio")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              backgroundColor: C.blanco,
              borderRadius: 14,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1.5px solid ${C.amarilloBorde}`,
              boxShadow: "0 2px 10px rgba(232,131,90,0.15)",
            }}
          >
            <img
              src="/logo.jpeg"
              alt="Mimitos Logo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div style={{ lineHeight: 1.2, textAlign: "left" }}>
            <span
              style={{
                display: "block",
                fontFamily: "'Baloo 2'",
                fontWeight: 800,
                fontSize: 20,
                color: C.texto,
              }}
            >
              Mimitos
            </span>
            <span
              style={{
                display: "block",
                fontSize: 12,
                color: C.naranja,
                fontWeight: 600,
              }}
            >
              Pañalera & Bebés
            </span>
          </div>
        </button>

        {/* Desktop links */}
        <div
          className="nav-desk"
          style={{ display: "flex", alignItems: "center", gap: 4 }}
        >
          {links.map((l) => (
            <button key={l.id} className="nav-link" onClick={() => goto(l.id)}>
              {l.l}
            </button>
          ))}
          <a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa"
            style={{
              marginLeft: 8,
              borderRadius: 12,
              padding: "9px 18px",
              fontSize: 13,
            }}
          >
            <IcoWA /> WhatsApp
          </a>
        </div>

        {/* Hamburguesa */}
        <button
          className="ham"
          onClick={() => setOpen((o) => !o)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            flexDirection: "column",
            gap: 5,
            padding: 6,
            display: "none",
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                height: 2,
                width: 24,
                background: C.texto,
                borderRadius: 2,
                transition: "transform .25s,opacity .25s",
                transform: open
                  ? i === 0
                    ? "rotate(45deg) translateY(7px)"
                    : i === 2
                      ? "rotate(-45deg) translateY(-7px)"
                      : ""
                  : "",
                opacity: open && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Menú móvil */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? 280 : 0,
          transition: "max-height .3s",
          background: C.blanco,
          borderTop: open ? `1px solid ${C.borde}` : "none",
        }}
      >
        <div
          style={{
            padding: "12px 20px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {links.map((l) => (
            <button
              key={l.id}
              className="nav-link"
              style={{ textAlign: "left" }}
              onClick={() => goto(l.id)}
            >
              {l.l}
            </button>
          ))}
          <a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa"
            style={{ marginTop: 6 }}
          >
            <IcoWA /> WhatsApp
          </a>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const goto = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="inicio"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg,${C.fondoPanel} 0%,${C.blanco} 55%,#fffdec 100%)`,
        position: "relative",
        overflow: "hidden",
        padding: "110px 20px 70px",
      }}
    >
      {/* Blobs */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 380,
          height: 380,
          background: "rgba(255,240,160,.3)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -80,
          left: -80,
          width: 360,
          height: 360,
          background: "rgba(232,131,90,.15)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      {/* Estrellas */}
      {[
        { t: "13%", l: "8%" },
        { t: "17%", l: "88%" },
        { t: "72%", l: "5%" },
        { t: "77%", l: "91%" },
      ].map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: p.t,
            left: p.l,
            fontSize: "1.3rem",
            color: C.amarilloBorde,
            animation: `pulse 3.2s ease-in-out ${i * 0.6}s infinite`,
          }}
        >
          ✦
        </span>
      ))}

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 680,
          width: "100%",
          textAlign: "center",
          animation: "fadeUp .65s ease both",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            background: "rgba(255,255,255,.85)",
            border: `1px solid ${C.borde}`,
            color: C.naranja,
            fontSize: 13,
            fontWeight: 700,
            padding: "7px 18px",
            borderRadius: 99,
            marginBottom: 32,
            boxShadow: "0 2px 12px rgba(90,74,58,.05)",
          }}
        >
          <IcoHeart size={13} color={C.naranja} /> Todo para tu bebé, con amor
        </div>

        <h1
          className="hero-h1"
          style={{
            fontSize: "3.4rem",
            fontWeight: 900,
            lineHeight: 1.15,
            marginBottom: 22,
          }}
        >
          Lo mejor para{" "}
          <span style={{ color: C.naranjaOscuro, position: "relative" }}>
            tu bebé
            <svg
              style={{
                position: "absolute",
                bottom: -6,
                left: 0,
                width: "100%",
              }}
              viewBox="0 0 200 8"
              fill="none"
            >
              <path
                d="M0 6 Q50 1 100 5 Q150 9 200 4"
                stroke={C.amarilloBorde}
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <p
          style={{
            color: C.textoSuave,
            fontSize: "1.05rem",
            lineHeight: 1.75,
            maxWidth: 470,
            margin: "0 auto 38px",
          }}
        >
          Pañales, ropa y accesorios en una sola pañalera de confianza. Precios
          accesibles, atención personalizada.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => goto("catalogo")}
            style={{
              background: C.naranja,
              color: C.white,
              fontWeight: 800,
              fontSize: 15,
              padding: "14px 32px",
              borderRadius: 16,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 18px rgba(232,131,90,.35)",
              transition: "background .15s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = C.naranjaOscuro)
            }
            onMouseOut={(e) => (e.currentTarget.style.background = C.naranja)}
          >
            Ver Catálogo
          </button>
          <a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: C.white,
              color: C.green600,
              fontWeight: 800,
              fontSize: 15,
              padding: "14px 32px",
              borderRadius: 16,
              border: `2px solid ${C.green500}`,
              boxShadow: "0 2px 10px rgba(34,197,94,.12)",
            }}
          >
            <IcoWA /> Contactanos
          </a>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 14,
            marginTop: 50,
          }}
        >
          {[
            { n: "500+", l: "Productos" },
            { n: "100%", l: "Confianza" },
            { n: "24hs", l: "Respuesta" },
          ].map((s) => (
            <div
              key={s.n}
              style={{
                background: "rgba(255,255,255,.72)",
                backdropFilter: "blur(8px)",
                border: `1px solid ${C.borde}`,
                borderRadius: 18,
                padding: "16px 10px",
              }}
            >
              <div
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 900,
                  color: C.naranja,
                }}
              >
                {s.n}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: C.textoSuave,
                  fontWeight: 600,
                  marginTop: 2,
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
// ─── Quiénes Somos ────────────────────────────────────────────────────────────
function QuienesSomos() {
  const vals = [
    {
      e: "🤍",
      t: "Calidad garantizada",
      d: "Solo trabajamos con marcas reconocidas y productos certificados para el cuidado del bebé.",
    },
    {
      e: "💬",
      t: "Atención personalizada",
      d: "Te asesoramos en cada consulta, porque cada bebé es único y vos lo sabés mejor que nadie.",
    },
    {
      e: "🚀",
      t: "Envíos rápidos",
      d: "Gestionamos tu pedido con agilidad para que llegue cuanto antes a tu hogar.",
    },
    {
      e: "💰",
      t: "Precios accesibles",
      d: "Creemos que lo mejor para los bebés no tiene que ser caro. Precios justos, siempre.",
    },
  ];

  return (
    <section
      id="quienes-somos"
      style={{
        padding: "96px 20px",
        background: `linear-gradient(180deg,${C.blanco} 0%,${C.fondoPanel} 100%)`,
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        
        {/* LOGO PRINCIPAL CENTRADO */}
        <div style={{ textAlign: "center", marginBottom: 30, animation: "fadeUp 0.8s ease both" }}>
          <div style={{ 
            width: 130, 
            height: 130, 
            margin: "0 auto", 
            borderRadius: "50%", 
            overflow: "hidden", 
            border: `5px solid white`,
            boxShadow: "0 10px 30px rgba(232,131,90,0.15)",
            background: "white"
          }}>
            <img 
              src="/logo.jpeg" 
              alt="Mimitos Pañalera" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
          </div>
        </div>

        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <span className="badge" style={{ marginBottom: 14 }}>
            Nuestra historia
          </span>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: 900,
              color: C.texto,
              marginBottom: 16,
              fontFamily: "'Baloo 2', cursive", // Cambiado a Baloo 2 para ser coherente
            }}
          >
            Quiénes <span style={{ color: C.naranja }}>Somos</span>
          </h2>
          <p
            style={{
              color: C.textoSuave,
              fontSize: "1rem",
              maxWidth: 540,
              margin: "0 auto",
              lineHeight: 1.75,
            }}
          >
            Somos una pañalera familiar con años de experiencia acompañando a
            papás y mamás en cada etapa del crecimiento de sus bebés.
          </p>
        </div>

        {/* Tarjeta principal */}
        <div
          style={{
            background: C.blanco,
            borderRadius: 24,
            padding: "36px 32px",
            border: `1px solid ${C.borde}`,
            boxShadow: "0 2px 20px rgba(90,74,58,.05)",
            display: "flex",
            flexWrap: "wrap",
            gap: 26,
            alignItems: "center",
            marginBottom: 32,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 160,
              height: 160,
              background: C.amarillo,
              borderBottomLeftRadius: "100%",
              opacity: 0.4,
            }}
          />
          
          {/* LOGO EN LUGAR DEL EMOJI BEBÉ */}
          <div
            style={{
              flexShrink: 0,
              width: 90,
              height: 90,
              background: "white",
              borderRadius: 22,
              border: `1.5px solid ${C.amarilloBorde}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              animation: "float 4s ease-in-out infinite",
              position: "relative",
              zIndex: 1,
            }}
          >
            <img 
              src="/logo.jpeg" 
              alt="Logo" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
          </div>

          <div
            style={{ flex: 1, minWidth: 200, position: "relative", zIndex: 1 }}
          >
            <h3
              style={{
                fontSize: "1.3rem",
                fontWeight: 800,
                color: C.texto,
                marginBottom: 10,
              }}
            >
              Más que una pañalera, una familia
            </h3>
            <p
              style={{
                color: C.textoSuave,
                lineHeight: 1.75,
                fontSize: "0.95rem",
              }}
            >
              Desde nuestros inicios, apostamos a construir vínculos genuinos
              con nuestros clientes. Cada consulta es una oportunidad de ayudar,
              cada compra es un acto de confianza que valoramos profundamente.
              Conocemos los productos que vendemos y los recomendamos con
              responsabilidad.
            </p>
          </div>
        </div>

        {/* Valores */}
        <div
          className="cols-2"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          {vals.map((v) => (
            <div key={v.t} className="valor-card">
              <span style={{ fontSize: "2rem", flexShrink: 0, marginTop: 2 }}>
                {v.e}
              </span>
              <div>
                <h4
                  style={{
                    fontWeight: 700,
                    fontSize: "0.97rem",
                    color: C.texto,
                    marginBottom: 5,
                  }}
                >
                  {v.t}
                </h4>
                <p
                  style={{
                    color: C.textoSuave,
                    fontSize: "0.87rem",
                    lineHeight: 1.65,
                  }}
                >
                  {v.d}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ProductCard ──────────────────────────────────────────────────────────────
function ProductCard({ producto, delay = 0 }) {
  const [variante, setVariante] = useState(null);
  const [imgError, setImgError] = useState(false);

  const variantes = producto.variantes ?? [];
  const precio = variante ? variante.precio : producto.precio_min;

  return (
    <div className="pana-card" style={{ animationDelay: `${delay}s` }}>
      {/* Imagen */}
      <div
        style={{
          position: "relative",
          aspectRatio: "1/1",
          background: C.white,
          overflow: "hidden",
          borderBottom: `1px solid ${C.borde}`,
        }}
      >
        {producto.imagen_url && !imgError ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            onError={() => setImgError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform .4s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.06)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 52,
              color: C.borde,
            }}
          >
            🍼
            <span
              style={{
                fontSize: 12,
                marginTop: 8,
                color: C.textoSuave,
                fontWeight: 600,
              }}
            >
              Sin imagen
            </span>
          </div>
        )}
        {/* Badge categoría */}
        <span
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "rgba(255,255,255,.92)",
            color: C.naranjaOscuro,
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: 99,
            boxShadow: "0 1px 6px rgba(0,0,0,.08)",
            border: `1px solid ${C.borde}`,
          }}
        >
          {producto.categoria}
        </span>
      </div>

      {/* Cuerpo */}
      <div
        style={{
          flex: 1,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 11,
        }}
      >
        <h3
          style={{
            fontWeight: 700,
            fontSize: "0.95rem",
            color: C.texto,
            lineHeight: 1.4,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          {producto.nombre}
        </h3>

        {/* Variantes */}
        {variantes.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {variantes.map((v) => (
              <button
                key={v.id_variante}
                className={`chip${variante?.id_variante === v.id_variante ? " on" : ""}`}
                onClick={() =>
                  setVariante((prev) =>
                    prev?.id_variante === v.id_variante ? null : v,
                  )
                }
              >
                {v.nombre_variante}
              </button>
            ))}
          </div>
        )}

        {/* Precio */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: 11,
            borderTop: `1px solid ${C.borde}`,
            display: "flex",
            alignItems: "baseline",
            gap: 6,
          }}
        >
          {!variante && (
            <span
              style={{ fontSize: 12, color: C.textoSuave, fontWeight: 600 }}
            >
              Desde
            </span>
          )}
          <span
            style={{
              fontSize: "1.3rem",
              fontWeight: 900,
              color: C.texto,
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            {fmt(precio)}
          </span>
        </div>

        {/* WhatsApp */}
        <a
          href={waLink(producto.nombre, variante?.nombre_variante)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-wa"
        >
          <IcoWA /> Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}

// ─── Catálogo ─────────────────────────────────────────────────────────────────
function Catalogo({ productos, loading, error }) {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");

  const categorias = [
    "Todas",
    ...Array.from(
      new Set(productos.map((p) => p.categoria).filter(Boolean)),
    ).sort(),
  ];

  const filtrados = productos.filter((p) => {
    const mC = categoria === "Todas" || p.categoria === categoria;
    const mB =
      busqueda === "" ||
      p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return mC && mB;
  });

  return (
    <section
      id="catalogo"
      style={{
        padding: "96px 20px 80px",
        background: C.white,
        borderTop: `1.5px solid ${C.borde}`,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Encabezado */}
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <span className="badge" style={{ marginBottom: 14 }}>
            Nuestros productos
          </span>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: 900,
              color: C.texto,
              marginBottom: 14,
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            Catálogo
          </h2>
          <p
            style={{
              color: C.textoSuave,
              fontSize: "0.98rem",
              maxWidth: 440,
              margin: "0 auto",
            }}
          >
            Encontrá todo lo que tu bebé necesita. Consultanos sin compromiso.
          </p>
        </div>

        {/* Barra de filtros */}
        <div
          className="filtros"
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 32,
            position: "sticky",
            top: 64,
            zIndex: 30,
            background: "rgba(255,255,255,.96)",
            backdropFilter: "blur(8px)",
            padding: "14px 2px",
            borderBottom: `1px solid ${C.borde}`,
          }}
        >
          <div style={{ position: "relative", flex: 1 }}>
            <span
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                lineHeight: 0,
              }}
            >
              <IcoSearch />
            </span>
            <input
              className="input-search"
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <select
            className="sel-cat"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            style={{ minWidth: 175 }}
          >
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Estados */}
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div
              style={{
                width: 44,
                height: 44,
                border: `4px solid ${C.borde}`,
                borderTopColor: C.naranja,
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 16px",
              }}
            />
            <p style={{ color: C.textoSuave, fontWeight: 600 }}>
              Cargando productos...
            </p>
          </div>
        )}
        {!loading && error && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>😕</div>
            <p style={{ fontWeight: 700, color: C.texto, marginBottom: 8 }}>
              No pudimos cargar los productos
            </p>
            <p style={{ color: C.textoSuave, fontSize: 14 }}>{error}</p>
          </div>
        )}
        {!loading && !error && filtrados.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>🔍</div>
            <p style={{ fontWeight: 700, color: C.texto, marginBottom: 8 }}>
              Sin resultados
            </p>
            <p style={{ color: C.textoSuave, fontSize: 14 }}>
              Probá con otra categoría o término de búsqueda.
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && filtrados.length > 0 && (
          <>
            <p
              style={{
                color: C.textoSuave,
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 18,
              }}
            >
              {filtrados.length} producto{filtrados.length !== 1 ? "s" : ""}{" "}
              encontrado{filtrados.length !== 1 ? "s" : ""}
            </p>
            <div className="prod-grid" style={{ display: "grid", gap: 20 }}>
              {filtrados.map((p, i) => (
                <ProductCard
                  key={p.id_producto}
                  producto={p}
                  delay={Math.min(i * 0.05, 0.4)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{
        padding: "44px 20px",
        background: `linear-gradient(180deg,${C.fondoPanel} 0%,${C.blanco} 100%)`,
        borderTop: `1.5px solid ${C.borde}`,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${C.borde}`,
            }}
          >
            <img
              src="/logo.jpeg"
              alt="Logo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div>
            <p
              style={{
                fontFamily: "'Baloo 2'",
                fontWeight: 800,
                color: C.texto,
                fontSize: 18,
              }}
            >
              Mimitos
            </p>
            <p style={{ fontSize: 11, color: C.textoSuave }}>
              Pañalera & Bebés
            </p>
          </div>
        </div>
        <p
          style={{
            color: C.textoSuave,
            fontSize: 13,
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          © {new Date().getFullYear()} Mimitos. Laguna Larga, Córdoba.
        </p>
        <a
          href={`https://wa.me/${WA_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: C.green600,
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          <IcoWA /> +54 9 3572 436695
        </a>
      </div>
    </footer>
  );
}
// ─── Root ─────────────────────────────────────────────────────────────────────
export default function CatalogoPublico() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        // Usamos axios sin el prefijo /api, según tu app.use('/productos', ...)
        const { data } = await axios.get(API_URL);
        setProductos(data);
      } catch (err) {
        setError(
          err.response?.data?.message ??
            "Error de conexión. Verificá que el servidor esté activo.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <GlobalStyle />
      <Navbar />
      <main>
        <Hero />
        <QuienesSomos />
        <Catalogo productos={productos} loading={loading} error={error} />
      </main>
      <Footer />
    </>
  );
}
