// ─── styles.js — Mundo Bebé: tokens visuales y CSS global ────────────────────
// Paleta extraída del logo: rosa, teal, lila, amarillo suave, blanco

export const C = {
  // ── Paleta principal (logo) ────────────────────────────────────────────────
  rosa:          "#F47DB3",   // rosa chicle del logo (letras "M")
  rosaOscuro:    "#D45890",   // rosa más profundo, hover/acento
  rosaClaro:     "#FDE8F2",   // fondo suave rosado
  teal:          "#5BC8C0",   // verde-azul del banner inferior del logo
  tealOscuro:    "#3AADA5",   // teal hover
  lila:          "#B48FD4",   // lila/violeta de las letras "B"
  amarillo:      "#F9D84A",   // amarillo letras "o" / estrellas
  amarilloClaro: "#FEF6D0",   // fondo amarillo muy suave
  blanco:        "#FFFFFF",
  fondoPanel:    "#FDF5FB",   // blanco con tinte rosado muy suave
  // ── Textos ─────────────────────────────────────────────────────────────────
  texto:         "#4A3550",   // lila muy oscuro, en lugar de marrón
  textoSuave:    "#9A80A8",   // lila medio apagado
  borde:         "#EDD8F0",   // borde lila clarísimo
  // ── Verde WhatsApp (se mantiene) ───────────────────────────────────────────
  green500:      "#22c55e",
  green600:      "#16a34a",
  white:         "#ffffff",
};

export const GLOBAL_CSS = `
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
    box-shadow:0 1px 6px rgba(74,53,80,.07);
    overflow:hidden;
    display:flex;
    flex-direction:column;
    transition:transform .25s,box-shadow .25s;
    animation:fadeUp .45s ease both;
  }
  .pana-card:hover {
    transform:translateY(-4px);
    border-color:${C.rosa};
    box-shadow:0 10px 32px rgba(244,125,179,.18);
  }

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
  .chip:hover { background:${C.amarilloClaro}; color:${C.texto}; }
  .chip.on    { background:${C.rosa}; color:${C.white}; border-color:${C.rosa}; transform:scale(1.08); }

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
  .nav-link:hover { color:${C.rosa}; background:${C.rosaClaro}; }

  .valor-card {
    background:${C.white}; border:1.5px solid ${C.borde}; border-radius:18px;
    padding:22px; display:flex; gap:16px;
    box-shadow:0 1px 4px rgba(0,0,0,.04);
    transition:transform .2s,box-shadow .2s;
  }
  .valor-card:hover {
    transform:translateY(-2px);
    border-color:${C.teal};
    box-shadow:0 6px 20px rgba(91,200,192,.15);
  }

  .input-search {
    width:100%; padding:12px 14px 12px 42px;
    border-radius:14px; border:1.5px solid ${C.borde};
    background:#fff; font-size:14px; color:${C.texto}; outline:none;
    transition:border-color .2s,box-shadow .2s;
  }
  .input-search:focus { border-color:${C.rosa}; box-shadow:0 0 0 3px rgba(244,125,179,.15); }

  .sel-cat {
    padding:12px 38px 12px 14px;
    border-radius:14px; border:1.5px solid ${C.borde};
    background:#fff; font-size:14px; font-weight:600; color:${C.texto};
    outline:none; appearance:none; -webkit-appearance:none; cursor:pointer;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23F47DB3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
    background-repeat:no-repeat; background-position:right 10px center; background-size:16px;
    transition:border-color .2s,box-shadow .2s;
  }
  .sel-cat:focus { border-color:${C.rosa}; box-shadow:0 0 0 3px rgba(244,125,179,.15); }

  .badge {
    display:inline-block; background:${C.rosaClaro}; color:${C.rosaOscuro};
    font-size:12px; font-weight:700; padding:5px 15px;
    border-radius:99px; letter-spacing:.3px; font-family:'Baloo 2', cursive;
    border:1px solid ${C.rosa}33;
  }

  .hero-h1 {
    font-family: 'Baloo 2', cursive;
    color: ${C.rosa};
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