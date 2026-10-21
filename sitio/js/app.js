/* MacBerry Pi G3 · guía interactiva · núcleo (estado, router, bloques, búsqueda). Sin dependencias. */
(function () {
  "use strict";
  const M = window.MB;
  const A = (window.MBA = { W: {} });
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* ---------------- Estado ---------------- */
  const KEY = "macberry_guia_v1";
  const store = {
    get() { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* sin almacenamiento: la guía funciona igual */ } }
  };
  const S = Object.assign({ cfg: {}, h: {}, tema: null, color: "blue", planPaso: 0, planOk: false, verTodo: false, jmp: {}, med: {}, alimQ: [], diag: null }, store.get() || {});
  S.cfg = Object.assign({}, M.DEF, S.cfg);
  A.S = S; A.M = M;
  const save = () => store.set(S);
  A.save = save;

  /* ---------------- Utilidades ---------------- */
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const norm = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  function link(t, u) {
    if (u.startsWith("#")) return `<a href="${u}">${t}</a>`;
    return `<a href="${u}" target="_blank" rel="noopener">${t}</a>`;
  }
  function fmt(s) {
    const codes = [];
    s = String(s).replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return "\u0000" + (codes.length - 1) + "\u0000"; });
    s = esc(s);
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[\s(«])\*([^*\s][^*]*?)\*(?=[\s).,;:»]|$)/g, "$1<em>$2</em>");
    s = s.replace(/\[\[([^\]]+)\]\]/g, (_, t) => `<button type="button" class="term" data-a="term" data-term="${t}">${t}</button>`);
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => link(t, u));
    return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[i])}</code>`);
  }
  const P = { menu: "M4 6h16M4 12h16M4 18h16", search: "M11 4a7 7 0 100 14 7 7 0 000-14zM16 16l4.5 4.5", check: "M5 13l4 4L19 7", chev: "M9 6l6 6-6 6", back: "M15 6l-6 6 6 6",
    dl: "M12 4v11m0 0l-4-4m4 4l4-4M5 20h14", ext: "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5", copy: "M9 9h10v11H9zM5 15V4h10",
    warn: "M12 3l10 18H2L12 3zM12 10v5M12 18v.01", info: "M12 3a9 9 0 100 18 9 9 0 000-18zM12 11v6M12 7.5v.01", bulb: "M9 18h6M10 21h4M12 3a6 6 0 00-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 00-4-10z",
    bolt: "M13 2L4 14h7l-1 8 9-12h-7l1-8z", sun: "M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
    moon: "M20 14A8 8 0 019.5 4a8 8 0 1010.5 10z", play: "M7 4l13 8-13 8V4z", pause: "M7 4h4v16H7zM13 4h4v16h-4z", x: "M6 6l12 12M18 6L6 18", home: "M4 11l8-7 8 7v9H4v-9z", file: "M6 3h8l4 4v14H6V3zM14 3v5h5", eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6z", reset: "M4 4v6h6M5 14a8 8 0 108-9 8 8 0 00-6 3" };
  const ico = n => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="${P[n] || ""}"/></svg>`;
  A.esc = esc; A.fmt = fmt; A.ico = ico; A.norm = norm; A.$ = $; A.$$ = $$;
  A.ok = si => { if (!si) return true; return Object.entries(si).every(([k, v]) => Array.isArray(v) ? v.includes(S.cfg[k]) : S.cfg[k] === v); };
  const ok = A.ok;
  const faseVis = f => S.verTodo || ok(f.si);
  const pasosVis = f => f.pasos.filter(p => S.verTodo || ok(p.si));
  const done = id => !!S.h["s:" + id];
  const pct = f => { const ps = pasosVis(f); return ps.length ? ps.filter(p => done(p.id)).length / ps.length : 0; };
  function total() { let d = 0, n = 0; M.FASES.filter(faseVis).forEach(f => pasosVis(f).forEach(p => { n++; if (done(p.id)) d++; })); return { d, n }; }
  function nextStep() {
    for (const f of M.FASES) { if (!faseVis(f)) continue; for (const p of pasosVis(f)) if (!done(p.id)) return { f, p }; }
    return null;
  }
  A.pasosVis = pasosVis;
  const seguridadOk = () => ["seg1", "seg2", "seg3", "seg4", "seg5"].every(k => S.h["c:" + k]);

  /* ---------------- Herramientas ---------------- */
  const TOOLS = [
    { id: "plan", t: "Mi plan", d: "Respuestas que adaptan la guía a tu montaje." },
    { id: "cables", t: "Cables", d: "Cada conexión, de dónde a dónde y con qué cable." },
    { id: "pines", t: "Pines", d: "Tablas verificadas de J20, J22, PAV, Pi 5…, con buscador." },
    { id: "jumpers", t: "Jumpers de soldadura", d: "Qué puentear, con dibujos de las pastillas." },
    { id: "alim", t: "Alimentación Pi 5", d: "Elige entre 6 formas de alimentar la Pi." },
    { id: "pi5", t: "Configuración Pi 5", d: "Generador de cmdline.txt y config.txt." },
    { id: "calib", t: "Calibración", d: "Teclas del ATmega con simulador." },
    { id: "multi", t: "Multímetro", d: "Mide y valida cada voltaje." },
    { id: "diagnostico", t: "Diagnóstico", d: "Elige el síntoma y revisa las causas." },
    { id: "compras", t: "Compras", d: "Lista de herramientas, módulos y componentes." },
    { id: "descargas", t: "Descargas", d: "Gerber, STL, firmware, esquemas…" },
    { id: "visores", t: "Visores 3D y mapas", d: "Cableado interactivo y modelos 3D." },
    { id: "extras", t: "Camino sin PCBs", d: "Cableado manual con Arduino o Raspberry Pi." },
    { id: "glosario", t: "Glosario", d: "Qué significa cada sigla." },
    { id: "creditos", t: "Créditos y licencias", d: "Quién hizo qué y bajo qué licencia." }
  ];
  A.TOOLS = TOOLS;

  /* ---------------- Bloques ---------------- */
  const AV = { peligro: ["bolt", "Peligro"], aviso: ["warn", "Atención"], consejo: ["bulb", "Consejo"], info: ["info", "Nota"] };
  const aviso = (n, x) => `<div class="aviso ${n}" role="note">${ico(AV[n][0])}<div><span class="t">${AV[n][1]}</span>${fmt(x)}</div></div>`;
  A.aviso = aviso;
  const ckb = (k, tx, extra) => `<label class="ck"><input type="checkbox" data-a="ck" data-k="${k}" ${S.h["c:" + k] ? "checked" : ""}><span class="bx">${ico("check")}</span><span class="tx">${fmt(tx)}${extra || ""}</span></label>`;
  A.ckb = ckb;
  const fig = (s, a, p) => `<figure><img loading="lazy" src="${s}" alt="${esc(a)}" data-a="img" data-c="${esc(p || a)}"><figcaption>${fmt(p || "")}</figcaption></figure>`;
  const tabla = (c, f) => `<div class="tw"><table><thead><tr>${c.map(x => `<th>${esc(x)}</th>`).join("")}</tr></thead><tbody>${f.map(r => `<tr>${r.map(x => `<td>${fmt(x)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  A.tabla = tabla; A.fig = fig;
  function blk(b) {
    switch (b.t) {
      case "h": return `<h3>${esc(b.x)}</h3>`;
      case "p": return `<p>${fmt(b.x)}</p>`;
      case "aviso": return aviso(b.n, b.x);
      case "lista": return `<ul class="l">${b.i.map(x => `<li>${fmt(x)}</li>`).join("")}</ul>`;
      case "num": return `<ol class="l">${b.i.map(x => `<li><div>${fmt(x)}</div></li>`).join("")}</ol>`;
      case "img": return fig(b.s, b.a, b.p);
      case "imgs": return `<div class="imgs">${b.i.map(([s, c]) => fig(s, c, c)).join("")}</div>`;
      case "cod": return `<div class="cod">${b.c ? `<div class="cap">${esc(b.c)}</div>` : ""}<pre><code>${esc(b.x)}</code></pre><button class="btn sm cp" data-a="copy" type="button">${ico("copy")}<span>Copiar</span></button></div>`;
      case "chk": return `<div class="chk"><b>${esc(b.tit)}</b>${b.i.map(([k, t]) => ckb(k, t)).join("")}</div>`;
      case "tabla": return tabla(b.c, b.f);
      case "ok": return `<div class="okbox">${ico("check")}<div><strong>Así sabes que salió bien:</strong> ${fmt(b.x)}</div></div>`;
      case "fallo": return `<div class="failbox">${ico("warn")}<div><strong>Si no sale:</strong> ${fmt(b.x)}</div></div>`;
      case "enlaces": return `<div class="links">${b.i.map(([t, h, d]) => `<a href="${h}" ${h.startsWith("#") ? "" : 'target="_blank" rel="noopener"'}>${ico(h.startsWith("#") ? "chev" : "ext")}<span><strong>${esc(t)}</strong>${d ? `<small>${esc(d)}</small>` : ""}</span></a>`).join("")}</div>`;
      case "w": return A.W[b.w] ? A.W[b.w](b) : `<p class="muted">Widget «${esc(b.w)}» no disponible.</p>`;
      default: return "";
    }
  }
  A.blk = blk;

  /* ---------------- Páginas ---------------- */
  function planChips() {
    const c = S.cfg;
    const out = [c.ruta === "master" ? "PCB master" : "Placas individuales", "Alimentación " + c.alim, c.uart ? "UART en la Pi" : "Sin UART", c.jack ? "Adaptador con jack" : "Extractor de audio", c.mic ? "Con micrófono" : "Sin micrófono"];
    if (c.ambar) out.push("LED ámbar"); if (c.fan !== "no") out.push("Ventilador " + c.fan + " V"); out.push(c.bezel === "imprimir" ? "Bisel impreso" : "Sin imprimir bisel");
    return out;
  }
  function ring(p) {
    const r = 40, c = 2 * Math.PI * r;
    return `<div class="ring" role="img" aria-label="Progreso ${Math.round(p * 100)} %"><svg viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="${r}"/><circle class="fg" cx="50" cy="50" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p)}"/></svg><b>${Math.round(p * 100)}%</b></div>`;
  }
  function home() {
    const t = total(), p = t.n ? t.d / t.n : 0, nx = nextStep();
    const cta = nx ? `<a class="btn p" href="#/fase/${nx.f.id}/${nx.p.id}">${t.d ? "Continuar en el paso " + nx.p.id : "Empezar"} ${ico("chev")}</a>` : `<span class="badge ok">¡Guía completada!</span>`;
    return `<section class="glass-card hero">
      <div class="eyebrow">Guía interactiva · en español</div>
      <h1>MacBerry Pi G3</h1>
      <p class="lead">Convierte un <strong>iMac G3 slot loading</strong> en un equipo moderno: una <strong>Raspberry Pi 5</strong> dentro de la carcasa, usando el tubo CRT original como monitor VGA. Paso a paso, con fotos, listas de verificación y herramientas. Reversible: no se corta nada.</p>
      <div class="row"><span class="badge acc">iMac G3 slot loading</span><span class="badge acc">Raspberry Pi 5</span><span class="badge acc">CRT como monitor VGA</span><span class="badge acc">Hardware abierto</span></div>
      <div class="row">${cta}<a class="btn" href="#/t/plan">Mi plan</a><a class="btn" href="#/t/descargas">${ico("dl")} Descargas</a><span style="margin-left:auto">${ring(p)}</span></div>
    </section>
    <section class="section"><h2>Cómo usar esta guía</h2><div class="grid g4">
      <div class="glass-card card"><h3>1 · Cuéntanos tu montaje</h3><p class="muted">Un asistente de 9 preguntas oculta lo que no necesitas y adapta cables, compras y pasos.</p></div>
      <div class="glass-card card"><h3>2 · Sigue las fases en orden</h3><p class="muted">12 fases, cada una con pasos cortos, fotos, advertencias y una forma de comprobar que salió bien.</p></div>
      <div class="glass-card card"><h3>3 · Marca lo que vas haciendo</h3><p class="muted">Tu progreso se guarda <strong>solo en este navegador</strong>; no se envía a ningún servidor.</p></div>
      <div class="glass-card card"><h3>4 · ¿Algo falla?</h3><p class="muted">Usa el <a href="#/t/diagnostico">diagnóstico</a>: eliges el síntoma y revisas las causas en orden.</p></div>
    </div></section>
    <section class="section"><h2>Tu plan actual</h2><div class="glass-card card"><div class="row" style="display:flex;gap:8px;flex-wrap:wrap">${planChips().map(x => `<span class="badge">${esc(x)}</span>`).join("")}</div><p style="margin-top:12px;margin-bottom:0"><a href="#/t/plan">Cambiar mi plan →</a></p></div></section>
    <section class="section"><h2>Las 12 fases</h2><div class="grid g2">${M.FASES.map(f => {
      const v = faseVis(f), pc = pct(f);
      return `<a class="glass-card tile ${pc === 1 && v ? "done" : ""}" href="#/fase/${f.id}" ${v ? "" : 'style="opacity:.55"'}><span class="n">${pc === 1 && v ? ico("check") : f.id}</span><h3>${esc(f.t)}</h3><p>${esc(f.r)}${v ? "" : " (omitida según tu plan)"}</p><div class="bar"><i style="width:${Math.round(pc * 100)}%"></i></div></a>`;
    }).join("")}</div></section>
    <section class="section"><h2>Herramientas</h2><div class="grid g3">${TOOLS.map(x => `<a class="glass-card tile" href="#/t/${x.id}"><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p></a>`).join("")}</div></section>
    <section class="section"><h2>Estado del proyecto</h2>${aviso("aviso", "Las placas J20, J22 y Down Converter son del proyecto original (qbancoffee) y están probadas por su autor. Esta versión en español tiene el DRC limpio y los Gerber listos, pero **todavía no se ha fabricado ni probado**. El **PCB master** tiene DRC con 0 violaciones, pero **no está fabricado ni verificado en hardware**. Si construyes algo, tu experiencia ayuda: abre un *issue* en el repositorio.")}</section>`;
  }

  function stepCard(f, p) {
    const d = done(p.id), vis = S.verTodo || ok(p.si);
    return `<article class="glass-card step ${d ? "done" : ""}" id="paso-${p.id}" data-step="${p.id}">
      <header><span class="sn">${p.id}</span><h3>${esc(p.t)}</h3>${vis ? "" : '<span class="badge warn">no aplica a tu plan</span>'}
      <button class="donebtn" type="button" data-a="hecho" data-id="${p.id}" aria-pressed="${d}"><span class="bx">${ico("check")}</span><span class="lb2">${d ? "Hecho" : "Marcar hecho"}</span></button></header>
      <div class="body">${p.b.map(blk).join("")}</div></article>`;
  }
  function fase(n) {
    const f = M.FASES[n]; if (!f) return `<p>Fase no encontrada. <a href="#/">Volver al inicio</a></p>`;
    const ps = pasosVis(f), ocultos = f.pasos.length - f.pasos.filter(p => ok(p.si)).length;
    const prev = M.FASES[n - 1], next = M.FASES[n + 1];
    let h = `<div class="phead"><div class="eyebrow">Fase ${f.id} de ${M.FASES.length - 1}</div><h1>${esc(f.t)}</h1><p class="lead">${esc(f.r)}</p>
      <div class="row"><span class="badge">${ps.filter(p => done(p.id)).length} / ${ps.length} pasos</span><div class="bar" style="flex:1;min-width:120px;max-width:320px"><i style="width:${Math.round(pct(f) * 100)}%"></i></div></div></div>`;
    if (!ok(f.si) && !S.verTodo) h += `<div class="glass-card card" style="margin-bottom:18px">${aviso("info", "Esta fase se omite según tu plan. Puedes verla de todos modos.")}<p style="margin:12px 0 0"><button class="btn" data-a="vertodo" type="button">${ico("eye")} Mostrar de todos modos</button></p></div>`;
    else {
      if (n >= 1 && !seguridadOk()) h += `<div class="glass-card gate">${ico("bolt")}<div style="flex:1"><strong>Aún no confirmas la lista de seguridad.</strong><br><span class="muted">El CRT puede retener alto voltaje. Léela y confírmala antes de continuar.</span></div><a class="btn p" href="#/fase/0/0.2">Ir a seguridad</a></div>`;
      if (ocultos && !S.verTodo) h += `<div class="hid">${ico("eye")} ${ocultos} paso(s) oculto(s) porque no aplican a tu plan. <button class="btn sm" data-a="vertodo" type="button">Mostrar todos</button></div>`;
      if (S.verTodo) h += `<div class="hid">${ico("eye")} Mostrando todos los pasos, también los que no aplican a tu plan. <button class="btn sm" data-a="vertodo" type="button">Ocultar los que no aplican</button></div>`;
      h += ps.map(p => stepCard(f, p)).join("");
    }
    h += `<div class="pnav">${prev ? `<a class="btn" href="#/fase/${prev.id}">${ico("back")} ${esc(prev.t)}</a>` : "<span></span>"}${next ? `<a class="btn p" href="#/fase/${next.id}">${esc(next.t)} ${ico("chev")}</a>` : `<a class="btn p" href="#/">Volver al inicio</a>`}</div>`;
    return h;
  }
  function tool(id, param) {
    const T = TOOLS.find(x => x.id === id); if (!T) return `<p>Herramienta no encontrada. <a href="#/">Inicio</a></p>`;
    const head = `<div class="phead"><div class="eyebrow">Herramienta</div><h1>${esc(T.t)}</h1><p class="lead">${esc(T.d)}</p></div>`;
    const body = A.TP && A.TP[id] ? A.TP[id](param) : "";
    return head + body;
  }

  /* ---------------- Shell ---------------- */
  function navHtml(r) {
    const t = total(), pc = t.n ? Math.round(t.d / t.n * 100) : 0;
    const cur = r[0] === "fase" ? +r[1] : -1, tid = r[0] === "t" ? r[1] : "";
    return `<a class="brand" href="#/"><span class="logo">Mb</span><span><b>MacBerry Pi G3</b><small>Guía interactiva</small></span></a>
      <div class="prog"><div class="bar"><i style="width:${pc}%"></i></div><small><span>${t.d} de ${t.n} pasos</span><span>${pc}%</span></small></div>
      <nav class="nav" aria-label="Fases y herramientas"><a href="#/" class="${!r[0] || r[0] === "inicio" ? "on" : ""}"><span class="n">${ico("home")}</span>Inicio</a><h6>Guía paso a paso</h6>
      ${M.FASES.map(f => { const v = faseVis(f), p = pct(f); return `<a href="#/fase/${f.id}" class="${cur === f.id ? "on" : ""} ${p === 1 && v ? "done" : ""} ${v ? "" : "skip"}"><span class="n">${p === 1 && v ? ico("check") : f.id}</span>${esc(f.t)}<span class="pc">${v ? Math.round(p * 100) + "%" : "omitida"}</span></a>`; }).join("")}
      <h6>Herramientas</h6>${TOOLS.map(x => `<a href="#/t/${x.id}" class="${tid === x.id ? "on" : ""}"><span class="n">${ico("chev")}</span>${esc(x.t)}</a>`).join("")}</nav>
      <div class="foot"><a href="${M.GH}" target="_blank" rel="noopener">Repositorio en GitHub ↗</a><button class="btn sm" type="button" data-a="reset">${ico("reset")} Reiniciar progreso</button><span>Licencia LGPL-3.0 · bisel CC BY-NC 4.0</span></div>`;
  }
  const COL = ["blue", "green", "purple", "orange", "pink", "yellow"];
  function topHtml() {
    const dark = document.documentElement.getAttribute("data-theme") !== "light";
    return `<button class="btn ic menu-btn" type="button" data-a="menu" aria-label="Abrir menú">${ico("menu")}</button>
      <button class="btn srch" type="button" data-a="buscar">${ico("search")}<span>Buscar en la guía…</span><kbd>/</kbd></button><span class="grow"></span>
      <div class="swatches" role="group" aria-label="Color de acento">${COL.map(c => `<button class="sw" type="button" data-a="color" data-v="${c}" data-color="${c}" style="background:var(--accent)" aria-pressed="${S.color === c}" aria-label="Acento ${c}"></button>`).join("")}</div>
      <button class="btn ic" type="button" data-a="tema" aria-label="Cambiar tema claro u oscuro">${ico(dark ? "sun" : "moon")}</button>
      <button class="btn ic" type="button" data-a="imprimir" aria-label="Imprimir esta página">${ico("file")}</button>`;
  }
  function pie() {
    return `<footer class="pie"><div>Basado en el proyecto original <a href="https://github.com/qbancoffee/imac_g3_ivad_board_init" target="_blank" rel="noopener">qbancoffee/imac_g3_ivad_board_init</a> (LGPL-3.0). Bisel interior de <a href="https://github.com/anthony-bernaert/imac-g3-screen-bezel" target="_blank" rel="noopener">Anthony Bernaert</a> (CC BY-NC 4.0, solo uso no comercial).</div>
      <div>Traducción, pines verificados, PCB master y esta guía: <a href="https://jjaroll.dev" target="_blank" rel="noopener">JJaroll.dev</a>, con ayuda de Claude (Anthropic). Hazlo bajo tu propia responsabilidad: el CRT puede retener alto voltaje.</div></footer>`;
  }
  function applyTheme() {
    const d = document.documentElement;
    const th = S.tema || (window.matchMedia && matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    d.setAttribute("data-theme", th); d.setAttribute("data-color", S.color || "blue");
  }
  let last = "";
  function render(keepScroll) {
    const r = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    const y = window.scrollY;
    let html;
    if (!r.length || r[0] === "inicio") html = home();
    else if (r[0] === "fase") html = fase(+r[1]);
    else if (r[0] === "t") html = tool(r[1], r[2]);
    else html = home();
    $("#side").innerHTML = navHtml(r);
    $("#top").innerHTML = topHtml();
    $("#content").innerHTML = html + pie();
    const key = r.slice(0, 2).join("/");
    if (A.after) A.after();
    if (keepScroll === true) window.scrollTo(0, y);
    else if (r[0] === "fase" && r[2]) { const el = document.getElementById("paso-" + r[2]); if (el) { el.scrollIntoView({ block: "start" }); el.classList.add("flash"); } }
    else if (key !== last) window.scrollTo(0, 0);
    last = key;
    document.title = (r[0] === "fase" && M.FASES[+r[1]] ? M.FASES[+r[1]].t + " · " : r[0] === "t" ? ((TOOLS.find(x => x.id === r[1]) || {}).t || "") + " · " : "") + "MacBerry Pi G3";
    document.body.classList.remove("nav-open");
  }
  A.render = () => render(true);
  A.refreshNav = () => { const r = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean); $("#side").innerHTML = navHtml(r); };

  /* ---------------- Interacciones ---------------- */
  function toast(t) { const e = document.createElement("div"); e.className = "toast"; e.textContent = t; document.body.appendChild(e); setTimeout(() => e.remove(), 1800); }
  A.toast = toast;
  function copyText(t) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t).then(() => true, () => false);
    const ta = document.createElement("textarea"); ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select();
    let okc = false; try { okc = document.execCommand("copy"); } catch (e) { } ta.remove(); return Promise.resolve(okc);
  }
  A.copy = copyText;
  function syncStep(el) {
    if (!el) return; const id = el.dataset.step; if (!id) return;
    const ins = $$("input[data-k]", el);
    if (ins.length && ins.every(i => i.checked) && !S.h["s:" + id]) { S.h["s:" + id] = true; }
    const d = !!S.h["s:" + id];
    el.classList.toggle("done", d);
    const b = $(".donebtn", el); if (b) { b.setAttribute("aria-pressed", d); $(".lb2", b).textContent = d ? "Hecho" : "Marcar hecho"; }
  }
  function closePop() { $$(".pop").forEach(e => e.remove()); }
  function openLightbox(src, cap) {
    const d = document.createElement("div"); d.className = "lb"; d.setAttribute("role", "dialog"); d.setAttribute("aria-label", "Imagen ampliada");
    d.innerHTML = `<button class="btn" type="button" data-a="lbx" aria-label="Cerrar">${ico("x")}</button><img src="${src}" alt=""><p>${esc(cap || "")}</p>`;
    d.addEventListener("click", () => d.remove()); document.body.appendChild(d);
  }

  /* Búsqueda */
  let idx = null;
  function textoBloque(b) {
    switch (b.t) { case "h": case "p": case "aviso": case "ok": case "fallo": return b.x; case "lista": case "num": return b.i.join(" "); case "tabla": return b.f.map(r => r.join(" ")).join(" "); case "chk": return b.tit + " " + b.i.map(x => x[1]).join(" "); case "cod": return b.x; case "img": return b.a + " " + (b.p || ""); case "enlaces": return b.i.map(x => x[0] + " " + (x[2] || "")).join(" "); default: return ""; }
  }
  function buildIdx() {
    idx = [];
    M.FASES.forEach(f => f.pasos.forEach(p => idx.push({ t: p.id + " · " + p.t, s: "Fase " + f.id + " · " + f.t, h: `#/fase/${f.id}/${p.id}`, x: p.b.map(textoBloque).join(" ") })));
    TOOLS.forEach(x => idx.push({ t: x.t, s: "Herramienta", h: "#/t/" + x.id, x: x.d }));
    Object.entries(M.GLOSARIO).forEach(([k, v]) => idx.push({ t: k, s: "Glosario", h: "#/t/glosario", x: v }));
    M.DIAG.forEach(d => idx.push({ t: d.s, s: "Diagnóstico", h: "#/t/diagnostico/" + d.id, x: d.causas.map(c => c.t + " " + c.c).join(" ") }));
    M.CABLES.forEach(c => idx.push({ t: c.titulo, s: "Cables · " + c.cat, h: "#/t/cables", x: c.desde + " " + c.hacia + " " + c.filas.map(r => r.join(" ")).join(" ") }));
    M.PINES.forEach(p => idx.push({ t: p.titulo, s: "Pines", h: "#/t/pines", x: p.filas.map(r => r.join(" ")).join(" ") }));
    idx.forEach(e => { e.nt = norm(e.t); e.nx = norm(e.x || ""); });
  }
  function openSearch() {
    if (!idx) buildIdx();
    closeSearch();
    const o = document.createElement("div"); o.className = "ov"; o.id = "ov";
    o.innerHTML = `<div class="glass-card box" role="dialog" aria-label="Buscar"><input type="search" id="q" placeholder="Busca: DCO, JP3, cmdline, +5 V…" autocomplete="off"><div id="res"></div></div>`;
    document.body.appendChild(o);
    const q = $("#q"), res = $("#res"); let sel = 0, list = [];
    const run = () => {
      const t = norm(q.value).split(/\s+/).filter(Boolean);
      if (!t.length) { res.innerHTML = `<p class="muted" style="margin:6px">Escribe para buscar en pasos, cables, pines, diagnóstico y glosario.</p>`; list = []; return; }
      list = idx.map(e => { let sc = 0; for (const w of t) { if (e.nt.includes(w)) sc += 10; else if (e.nx.includes(w)) sc += 1; else return null; } return { e, sc }; }).filter(Boolean).sort((a, b) => b.sc - a.sc).slice(0, 20);
      sel = 0;
      res.innerHTML = list.length ? list.map((r, i) => { const e = r.e; let sn = ""; const w = t[0], k = e.nx.indexOf(w); if (k >= 0 && !e.nt.includes(w)) { const s0 = Math.max(0, k - 40); sn = "…" + esc((e.x || "").slice(s0, s0 + 110)) + "…"; } return `<a class="res ${i === 0 ? "sel" : ""}" href="${e.h}" data-a="closesearch"><strong>${esc(e.t)}</strong><small>${esc(e.s)}${sn ? " · " + sn : ""}</small></a>`; }).join("") : `<p class="muted" style="margin:6px">Sin resultados.</p>`;
    };
    q.addEventListener("input", run);
    q.addEventListener("keydown", ev => {
      if (ev.key === "Escape") closeSearch();
      else if (ev.key === "ArrowDown" || ev.key === "ArrowUp") { ev.preventDefault(); sel = Math.max(0, Math.min(list.length - 1, sel + (ev.key === "ArrowDown" ? 1 : -1))); $$(".res", res).forEach((a, i) => a.classList.toggle("sel", i === sel)); const a = $$(".res", res)[sel]; if (a) a.scrollIntoView({ block: "nearest" }); }
      else if (ev.key === "Enter" && list[sel]) { location.hash = list[sel].e.h; closeSearch(); }
    });
    o.addEventListener("click", ev => { if (ev.target === o) closeSearch(); });
    run(); q.focus();
  }
  function closeSearch() { const o = $("#ov"); if (o) o.remove(); }

  document.addEventListener("click", ev => {
    const el = ev.target.closest("[data-a]");
    if (!el) { if (!ev.target.closest(".pop")) closePop(); return; }
    const a = el.dataset.a;
    if (a !== "term") closePop();
    switch (a) {
      case "menu": document.body.classList.toggle("nav-open"); break;
      case "scrim": document.body.classList.remove("nav-open"); break;
      case "tema": S.tema = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light"; save(); applyTheme(); $("#top").innerHTML = topHtml(); break;
      case "color": S.color = el.dataset.v; save(); applyTheme(); $$(".sw").forEach(s => s.setAttribute("aria-pressed", s.dataset.v === S.color)); break;
      case "imprimir": window.print(); break;
      case "buscar": openSearch(); break;
      case "closesearch": closeSearch(); break;
      case "hecho": { const id = el.dataset.id; S.h["s:" + id] = !S.h["s:" + id]; save(); syncStep(el.closest(".step")); A.refreshNav(); break; }
      case "vertodo": S.verTodo = !S.verTodo; save(); render(true); break;
      case "reset": if (confirm("¿Borrar todo tu progreso y tus respuestas del plan en este navegador?")) { S.h = {}; S.cfg = Object.assign({}, M.DEF); S.planPaso = 0; S.planOk = false; S.jmp = {}; S.med = {}; S.alimQ = []; S.verTodo = false; save(); location.hash = "#/"; render(); } break;
      case "copy": { const pre = $("pre", el.closest(".cod")); copyText(pre.textContent).then(k => { toast(k ? "Copiado al portapapeles" : "No se pudo copiar: selecciona el texto"); }); break; }
      case "img": openLightbox(el.getAttribute("src"), el.dataset.c); break;
      case "lbx": break;
      case "term": {
        ev.stopPropagation(); closePop();
        const t = el.dataset.term, def = M.GLOSARIO[t] || "";
        const pp = document.createElement("div"); pp.className = "pop"; pp.innerHTML = `<b>${esc(t)}</b>${fmt(def)} <a href="#/t/glosario">Glosario</a>`;
        document.body.appendChild(pp);
        const r = el.getBoundingClientRect();
        pp.style.left = Math.max(8, Math.min(window.scrollX + r.left, window.scrollX + document.documentElement.clientWidth - pp.offsetWidth - 8)) + "px";
        pp.style.top = (window.scrollY + r.bottom + 6) + "px";
        break;
      }
      default: if (A.act) A.act(a, el, ev);
    }
  });
  document.addEventListener("change", ev => {
    const el = ev.target;
    if (el.matches("input[data-k]")) {
      S.h["c:" + el.dataset.k] = el.checked; save();
      const st = el.closest(".step"); syncStep(st); A.refreshNav();
      if (A.onCheck) A.onCheck(el);
    } else if (A.change) A.change(el, ev);
  });
  document.addEventListener("input", ev => { if (A.input) A.input(ev.target, ev); });
  document.addEventListener("keydown", ev => {
    if (ev.key === "Escape") { closePop(); closeSearch(); $$(".lb").forEach(x => x.remove()); document.body.classList.remove("nav-open"); }
    const tg = ev.target, typing = tg.matches && tg.matches("input,textarea,select");
    if ((ev.key === "/" || (ev.key === "k" && (ev.ctrlKey || ev.metaKey))) && !typing) { ev.preventDefault(); openSearch(); }
    if (A.key) A.key(ev, typing);
  });
  window.addEventListener("hashchange", () => { closePop(); render(); });

  /* ---------------- Inicio ---------------- */
  function boot() {
    applyTheme();
    document.body.insertAdjacentHTML("afterbegin", `<div class="app"><aside class="side" id="side" aria-label="Navegación"></aside><div class="main"><div class="top" id="top"></div><main class="content" id="content" tabindex="-1"></main></div></div><div class="scrim" data-a="scrim"></div>`);
    render();
  }
  window.addEventListener("DOMContentLoaded", () => { if (A.ready) A.ready(); boot(); });
})();
