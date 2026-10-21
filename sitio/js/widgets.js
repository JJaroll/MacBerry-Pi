/* MacBerry Pi G3 · widgets interactivos y páginas de herramientas. */
(function () {
  "use strict";
  const A = window.MBA, M = A.M, S = A.S, W = A.W;
  const { esc, fmt, ico, $, $$, norm, save, ckb, tabla, aviso, blk } = A;
  const TP = (A.TP = {});
  const ok = A.ok;
  const num = v => parseFloat(String(v).replace(",", "."));
  const hum = n => n == null ? "" : n < 1024 ? n + " B" : n < 1048576 ? (n / 1024).toFixed(0) + " KB" : (n / 1048576).toFixed(1) + " MB";
  const rr = () => A.render();

  /* ---------- Diagrama de bloques ---------- */
  W.diagrama = () => {
    const bx = (x, y, w, h, t, s, hl) => `<rect class="box ${hl ? "hl" : ""}" x="${x}" y="${y}" width="${w}" height="${h}" rx="14"/><text x="${x + w / 2}" y="${y + h / 2 - (s ? 4 : -4)}" text-anchor="middle">${t}</text>${s ? `<text class="s" x="${x + w / 2}" y="${y + h / 2 + 14}" text-anchor="middle">${s}</text>` : ""}`;
    const ln = (c, d) => `<path class="ln ${c}" d="${d}" marker-end="url(#ar)"/>`;
    const lb = (x, y, t, a) => `<text class="s" x="${x}" y="${y}" text-anchor="${a || "middle"}">${t}</text>`;
    return `<div class="glass-card w"><h4>Mapa general del sistema</h4>
    <svg class="dg" viewBox="0 0 900 400" role="img" aria-label="Diagrama de bloques: la placa analógica del iMac se conecta a las placas J20, J22 y Down Converter; la Raspberry Pi 5 da video por el adaptador HDMI a VGA y audio por el amplificador">
      <defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1l8 4-8 4z" fill="var(--text-muted)"/></marker></defs>
      ${bx(14, 30, 160, 340, "Placa analógica", "+ IVAD + tubo CRT", 1)}
      ${bx(260, 20, 150, 80, "Placa J20", "ATmega + relé + VGA")}${bx(260, 160, 150, 80, "Placa J22", "botón · LED · parlantes")}${bx(260, 300, 150, 80, "Down Converter", "PAV → rieles DC")}
      ${bx(520, 20, 150, 80, "Adaptador", "HDMI → VGA")}${bx(520, 160, 150, 80, "PAM8403", "amplificador")}${bx(730, 20, 156, 80, "Raspberry Pi 5", "", 1)}${bx(730, 160, 156, 80, "Parlantes", "originales 28 mm")}
      ${ln("vd", "M174 60 L258 60")}${lb(216, 50, "Arnés J20")}${ln("ct", "M174 200 L258 200")}${lb(216, 190, "Arnés J22")}${ln("ac", "M174 340 L258 340")}${lb(216, 330, "PAV J7")}
      ${ln("ac", "M335 242 L335 298")}${lb(372, 274, "24 VAC")}${ln("ct", "M335 158 L335 102")}${lb(378, 134, "botón · LED")}
      ${ln("ct", "M412 50 L440 50 L440 345 L412 345")}${lb(452, 200, "DCO", "start")}
      ${ln("vd", "M520 60 L412 60")}${lb(466, 50, "VGA")}${ln("vd", "M730 60 L672 60")}${lb(701, 50, "HDMI")}
      ${ln("au", "M595 102 L595 158")}${lb(640, 134, "audio")}${ln("au", "M520 200 L412 200")}${lb(466, 190, "parlantes")}${ln("au", "M672 200 L728 200")}
      ${ln("dc", "M412 350 L808 350 L808 102")}${lb(620, 342, "+5 V a la Pi y al amplificador", "middle")}${ln("dc", "M595 350 L595 242")}
    </svg>
    <div class="row"><span class="badge"><i class="tipo k-ac" style="display:inline-block;width:10px;height:10px;border-radius:50%"></i> alterna 24 VAC</span><span class="badge"><i class="tipo k-vd" style="display:inline-block;width:10px;height:10px;border-radius:50%"></i> video</span><span class="badge"><i class="tipo k-au" style="display:inline-block;width:10px;height:10px;border-radius:50%"></i> audio</span><span class="badge"><i class="tipo k-ct" style="display:inline-block;width:10px;height:10px;border-radius:50%"></i> control</span><span class="badge"><i class="tipo k-dc" style="display:inline-block;width:10px;height:10px;border-radius:50%"></i> +5 V</span></div></div>`;
  };

  /* ---------- Asistente de plan ---------- */
  const CORTO = { ruta: "Unión de placas", alim: "Alimentación Pi 5", uart: "UART en la Pi", jack: "Audio del adaptador", usbad: "USB del adaptador", mic: "Micrófono del chasis", ambar: "LED ámbar", fan: "Ventilador", bezel: "Bisel interior" };
  const optOf = q => q.op.find(o => o.v === S.cfg[q.k]) || q.op[0];
  W.plan = () => {
    const Q = M.PLAN, i = S.planPaso;
    if (S.planOk || i >= Q.length) {
      let ocultos = 0; M.FASES.forEach(f => { if (!ok(f.si)) ocultos += f.pasos.length; else ocultos += f.pasos.filter(p => !ok(p.si)).length; });
      const nx = (() => { for (const f of M.FASES) { if (!ok(f.si)) continue; for (const p of f.pasos) if (ok(p.si) && !S.h["s:" + p.id]) return `#/fase/${f.id}/${p.id}`; } return "#/"; })();
      const ncab = M.CABLES.filter(c => (c.ruta === "ambas" || c.ruta === S.cfg.ruta) && ok(c.si)).length;
      return `<div class="glass-card w"><h4>Tu plan <span class="badge ok">listo</span></h4>
        <div>${Q.map((q, k) => `<div class="sumrow"><span>${CORTO[q.k]}</span><span><strong>${esc(optOf(q).t)}</strong> <button class="btn sm" type="button" data-a="plan-edit" data-i="${k}">Cambiar</button></span></div>`).join("")}</div>
        <p class="muted" style="margin:0">Con este plan: <strong>${ncab}</strong> conexiones de cableado y <strong>${ocultos}</strong> paso(s) oculto(s).</p>
        <div class="row"><a class="btn p" href="${nx}">Seguir con la guía ${ico("chev")}</a><button class="btn" type="button" data-a="plan-def">Usar valores recomendados</button></div></div>`;
    }
    const q = Q[i];
    return `<div class="glass-card w"><div class="row" style="justify-content:space-between"><span class="badge acc">Pregunta ${i + 1} de ${Q.length}</span><div class="dots" aria-hidden="true">${Q.map((_, k) => `<i class="${k <= i ? "on" : ""}"></i>`).join("")}</div></div>
      <h3>${esc(q.q)}</h3><p class="muted" style="margin:0">${fmt(q.ayuda)}</p>
      <div class="opts">${q.op.map((o, k) => `<button class="opt" type="button" data-a="plan-set" data-k="${q.k}" data-i="${k}" aria-pressed="${S.cfg[q.k] === o.v}"><b>${esc(o.t)}${o.rec ? ' <span class="badge ok">recomendado</span>' : ""}</b><span>${esc(o.d)}</span></button>`).join("")}</div>
      <div class="row">${i > 0 ? `<button class="btn" type="button" data-a="plan-back">${ico("back")} Atrás</button>` : ""}<button class="btn" type="button" data-a="plan-def">Usar valores recomendados</button>${q.k === "alim" ? `<a class="btn" href="#/t/alim">No sé: ayúdame a elegir</a>` : ""}</div></div>`;
  };

  /* ---------- Compras ---------- */
  W.compras = () => {
    const gs = M.COMPRAS.filter(g => ok(g.si));
    let n = 0, d = 0;
    const html = gs.map(g => {
      const its = g.items.filter(i => ok(i.si));
      its.forEach(i => { n++; if (S.h["c:b_" + i.id]) d++; });
      return `<div class="chk"><b>${esc(g.g)}</b>${its.map(i => ckb("b_" + i.id, i.t, i.n ? ` <small class="muted">· ${esc(i.n)}</small>` : "")).join("")}</div>`;
    }).join("");
    return `<div class="glass-card w"><h4>Lista adaptada a tu plan <span class="badge">${n} elementos</span></h4>${html}<p class="muted" style="margin:0">Los códigos de las placas salen de sus BOM (Digi-Key). El adaptador, el PAM8403 y los cables varían por tienda: compra lo equivalente.</p></div>`;
  };

  /* ---------- Jumpers ---------- */
  const jdef = j => j.id === "j22_mic" ? (S.cfg.mic ? 0 : 2) : j.id === "dc_fan" ? (S.cfg.fan === "5" ? 0 : S.cfg.fan === "12" ? 1 : 2) : 0;
  const jmode = j => (S.jmp[j.id] != null ? S.jmp[j.id] : jdef(j));
  function padSvg(n, bridge, name) {
    const w = n * 42 + 8, y = 14;
    let s = `<svg viewBox="0 0 ${w} 74" width="${w * 1.2}" role="img" aria-label="${esc(name)}: ${bridge.length ? "pastillas " + bridge.join(" y ") + " unidas con estaño" : "abierto"}">`;
    for (let k = 0; k < n; k++) s += `<rect class="pad" x="${8 + k * 42}" y="${y}" width="26" height="36" rx="4"/><text x="${21 + k * 42}" y="70" text-anchor="middle" style="font:600 11px var(--font-mono);fill:var(--text-muted)">${k + 1}</text>`;
    if (bridge.length === 2) { const a = bridge[0] - 1, b = bridge[1] - 1, x0 = 14 + a * 42, x1 = 28 + b * 42; s += `<rect class="solder" x="${x0}" y="${y + 6}" width="${x1 - x0}" height="24" rx="12"/><ellipse class="shine" cx="${(x0 + x1) / 2}" cy="${y + 13}" rx="${(x1 - x0) / 3}" ry="3"/>`; }
    return s + "</svg>";
  }
  W.jumpers = b => {
    const f = b && b.f, js = M.JUMPERS.filter(j => !f || j.placa === f);
    return `<div class="grid">${js.map(j => {
      const mi = jmode(j), m = j.modos[mi];
      const pads = j.pads.map((p, k) => `<div class="pg">${padSvg(p[0], m.p[k] || [], p[1])}<small><b>${p[1]}</b><br>${esc(p[2])}</small></div>`).join("");
      const inst = j.pads.map((p, k) => { const br = m.p[k] || []; return br.length ? `<li><strong>${p[1]}</strong>: une las pastillas <strong>${br[0]} y ${br[1]}</strong> con una gota de estaño.</li>` : `<li><strong>${p[1]}</strong>: déjalo <strong>abierto</strong> (sin estaño).</li>`; }).join("");
      return `<div class="glass-card w"><h4>${esc(j.placa)} · ${esc(j.nombre)} <span class="badge ${j.rec.startsWith("Soldar siempre") ? "bad" : j.rec.startsWith("Recomendado") ? "ok" : "warn"}">${esc(j.rec)}</span></h4>
        <p style="margin:0">${fmt(j.que)}</p>
        ${j.modos.length > 1 ? `<div class="row" role="group" aria-label="Modo">${j.modos.map((o, k) => `<button class="chip" type="button" data-a="jm" data-id="${j.id}" data-i="${k}" aria-pressed="${k === mi}">${esc(o.t)}</button>`).join("")}</div>` : ""}
        <div class="pads">${pads}</div><ul class="l">${inst}</ul>
        ${aviso("info", j.nota)}
        ${ckb("jmp_" + j.id, "Hecho: lo soldé (o lo dejé abierto) según lo indicado")}</div>`;
    }).join("")}</div>`;
  };

  /* ---------- Cables ---------- */
  const KC = { "24 VAC": "k-ac", Control: "k-ct", Video: "k-vd", "Energía DC": "k-dc", Audio: "k-au", Datos: "k-dt" };
  const cabs = () => M.CABLES.filter(c => S.verTodo || ((c.ruta === "ambas" || c.ruta === S.cfg.ruta) && ok(c.si)));
  W.cables = () => {
    const list = cabs(), flt = S.cabF || "todos", cats = [...new Set(list.map(c => c.cat))];
    const d = list.filter(c => S.h["c:cab_" + c.id]).length;
    const shown = list.filter(c => flt === "todos" ? true : flt === "pend" ? !S.h["c:cab_" + c.id] : c.cat === flt);
    const card = c => {
      const dn = !!S.h["c:cab_" + c.id], opt = c.si && (c.si.uart || c.si.ambar || c.si.usbad);
      return `<div class="cab ${dn ? "done" : ""}" id="cab-${c.id}"><label class="ck cbx" title="Marcar como conectado"><span class="sr">Conectado: ${esc(c.titulo)}</span><input type="checkbox" data-a="ck" data-k="cab_${c.id}" ${dn ? "checked" : ""}><span class="bx">${ico("check")}</span></label><details><summary><div><div class="ti"><i class="tipo ${KC[c.cat] || "k-pl"}"></i>${esc(c.titulo)} ${opt ? '<span class="badge">opcional</span>' : ""}${S.verTodo ? `<span class="badge">${c.ruta === "ambas" ? "ambas rutas" : c.ruta === "master" ? "solo master" : "solo individuales"}</span>` : ""}</div>
        <div class="ft"><span>${esc(c.desde)}</span><span class="arrow">→</span><span>${esc(c.hacia)}</span></div><div class="ft"><span>Cable: ${esc(c.cable)}</span></div></div><span class="ar">${ico("chev")}</span></summary>
        <div class="det">${tabla(["Desde", "Hacia", "Referencia"], c.filas.map(r => [r[0], r[1], r[2] || ""]))}${c.notas.map(n => `<p style="margin:0">${fmt(n)}</p>`).join("")}</div></details></div>`;
    };
    return `<div class="glass-card w"><h4>Conexiones de tu montaje <span class="badge acc">${d} de ${list.length}</span></h4>
      <div class="bar"><i style="width:${list.length ? Math.round(d / list.length * 100) : 0}%"></i></div>
      <div class="row" role="group" aria-label="Filtrar">${[["todos", "Todos"], ["pend", "Pendientes"]].concat(cats.map(c => [c, c])).map(([v, t]) => `<button class="chip" type="button" data-a="cabf" data-v="${esc(v)}" aria-pressed="${flt === v}">${esc(t)}</button>`).join("")}</div>
      <div class="grid">${shown.map(card).join("") || '<p class="muted">Nada pendiente en este filtro.</p>'}</div>
      <p class="muted" style="margin:0">${S.verTodo ? "Mostrando todos los cables de ambas rutas." : `Según tu plan (${S.cfg.ruta === "master" ? "PCB master" : "placas individuales"}). `}<button class="btn sm" type="button" data-a="vertodo">${S.verTodo ? "Volver a mi plan" : "Ver todos los cables"}</button></p></div>`;
  };

  /* ---------- Alimentación ---------- */
  const AQ = [
    { q: "¿Quieres que la Pi siga encendida cuando la CRT esté apagada?", sig: [1, 2] },
    { q: "¿Aceptas un cargador oficial aparte, enchufado a la pared (independiente del iMac)?", sig: ["F", "B"] },
    { q: "¿Prefieres entrar por el puerto USB-C en vez de los pines GPIO?", sig: [3, "A"] },
    { q: "¿Aceptas un módulo reductor extra (buck desde +12 V)?", sig: ["D", "C"] }
  ];
  function alimRec() {
    const a = S.alimQ; // respuestas: array de 0/1 (sí=0, no=1)
    let n = 0;
    for (let k = 0; k < 4; k++) {
      if (a[n] == null) return { q: n, rec: null };
      const nx = AQ[n].sig[a[n]];
      if (typeof nx === "string") return { rec: nx };
      n = nx;
    }
    return { rec: "A" };
  }
  W.alim = () => {
    const r = alimRec(), nq = r.rec ? -1 : r.q;
    const asked = []; { let n = 0; for (let k = 0; k < 4 && S.alimQ[n] != null; k++) { asked.push([n, S.alimQ[n]]); const nx = AQ[n].sig[S.alimQ[n]]; if (typeof nx === "string") break; n = nx; } }
    return `<div class="glass-card w"><h4>¿Cuál me conviene?</h4>
      ${asked.map(([q, v]) => `<div class="sumrow"><span>${esc(AQ[q].q)}</span><strong>${v === 0 ? "Sí" : "No"}</strong></div>`).join("")}
      ${nq >= 0 ? `<p style="margin:0"><strong>${esc(AQ[nq].q)}</strong></p><div class="row"><button class="btn p" type="button" data-a="aq" data-q="${nq}" data-v="0">Sí</button><button class="btn" type="button" data-a="aq" data-q="${nq}" data-v="1">No</button></div>` : `<div class="okbox">${ico("check")}<div>Te recomiendo la <strong>opción ${r.rec}</strong>: ${esc(M.ALIM.find(x => x.id === r.rec).n)}. <button class="btn sm p" type="button" data-a="alim-set" data-v="${r.rec}">Usar la opción ${r.rec}</button></div></div>`}
      ${asked.length ? `<div><button class="btn sm" type="button" data-a="aq-reset">${ico("reset")} Empezar de nuevo</button></div>` : ""}</div>
      <div class="grid">${M.ALIM.map(o => `<div class="alcard ${S.cfg.alim === o.id ? "on" : ""}"><header><span class="ltr">${o.id}</span><strong>${esc(o.n)}</strong>${o.tag ? `<span class="badge ${o.id === "E" ? "bad" : "ok"}">${esc(o.tag)}</span>` : ""}${S.cfg.alim === o.id ? '<span class="badge acc">tu elección</span>' : ""}</header>
        <p style="margin:0">${fmt(o.txt)}</p>
        <div class="row"><span class="badge">Riel: ${esc(o.riel)}</span><span class="badge">¿Se apaga con la CRT? ${esc(o.apaga)}</span><span class="badge">Complejidad: ${esc(o.comp)}</span></div>
        <div class="pc2"><div><strong>A favor</strong><ul>${o.pro.map(x => `<li>${fmt(x)}</li>`).join("")}</ul></div><div><strong>En contra</strong><ul>${o.con.map(x => `<li>${fmt(x)}</li>`).join("")}</ul></div></div>
        ${o.id === "F" ? tabla(["Evento", "CRT", "Pi"], M.ALIM_EVENTOS_F) : ""}
        ${S.cfg.alim === o.id ? "" : `<div><button class="btn sm" type="button" data-a="alim-set" data-v="${o.id}">Usar la opción ${o.id}</button></div>`}</div>`).join("")}</div>
      ${aviso("aviso", "Sea cual sea la opción: **nunca alimentes la Pi por dos caminos a la vez** y valida bajo carga con `vcgencmd get_throttled` (debe dar `0x0`).")}`;
  };

  /* ---------- Generador de configuración Pi 5 ---------- */
  const P5 = () => (S.pi5 = Object.assign({ modo: "1024", cvt: false, hdmi: "HDMI-A-1", uart: S.cfg.uart, usb: false }, S.pi5 || {}));
  W.pi5cfg = () => {
    const c = P5(), mo = M.MODOS.find(m => m.id === c.modo);
    let cmd = (c.cvt ? mo.alt : mo.cmd).replace("HDMI-A-1", c.hdmi);
    const arg = cmd;
    const cfg = ["# /boot/firmware/config.txt", "dtoverlay=vc4-kms-v3d"];
    if (c.usb) cfg.push("# solo si el riel +5 V entrega 5 A reales", "usb_max_current_enable=1");
    if (c.uart) cfg.push("# UART de la GPIO para calibrar con el ATmega", "dtparam=uart0=on");
    const t = (k, v, lab) => `<button class="chip" type="button" data-a="p5" data-k="${k}" data-v="${v}" aria-pressed="${String(c[k]) === String(v)}">${lab}</button>`;
    const tg = (k, lab) => `<button class="chip" type="button" data-a="p5" data-k="${k}" data-v="${!c[k]}" aria-pressed="${!!c[k]}">${lab}</button>`;
    return `<div class="glass-card w"><h4>Generador de configuración para la CRT</h4>
      <div><strong>Modo de video</strong><div class="row" style="margin-top:6px">${M.MODOS.map(m => t("modo", m.id, m.nombre + (m.rec ? " (recomendado)" : ""))).join("")}</div></div>
      <div class="row"><strong>Opciones:</strong>${tg("cvt", "Timings CVT («M»)")}${tg("uart", "UART para calibrar")}${tg("usb", "usb_max_current_enable")}</div>
      <div class="row"><strong>Salida:</strong>${t("hdmi", "HDMI-A-1", "micro-HDMI 0 (HDMI-A-1)")}${t("hdmi", "HDMI-A-2", "micro-HDMI 1 (HDMI-A-2)")}</div>
      ${c.usb ? aviso("aviso", "`usb_max_current_enable=1` solo si tu riel entrega **5 A reales**. Si no, la Pi puede reiniciarse bajo carga.") : ""}
      <div class="cod"><div class="cap">1 · Añade al final de la única línea de /boot/firmware/cmdline.txt</div><pre><code>${esc(arg)}</code></pre><button class="btn sm cp" data-a="copy" type="button">${ico("copy")}<span>Copiar</span></button></div>
      <div class="cod"><div class="cap">…o hazlo con un comando (guarda copia de seguridad; ejecútalo una sola vez)</div><pre><code>${esc("sudo cp /boot/firmware/cmdline.txt /boot/firmware/cmdline.txt.bak\nsudo sed -i '1 s|$| " + arg + "|' /boot/firmware/cmdline.txt\ncat /boot/firmware/cmdline.txt")}</code></pre><button class="btn sm cp" data-a="copy" type="button">${ico("copy")}<span>Copiar</span></button></div>
      <div class="cod"><div class="cap">2 · Revisa /boot/firmware/config.txt (sudo nano /boot/firmware/config.txt)</div><pre><code>${esc(cfg.join("\n"))}</code></pre><button class="btn sm cp" data-a="copy" type="button">${ico("copy")}<span>Copiar</span></button></div>
      <div class="cod"><div class="cap">3 · Reinicia y comprueba</div><pre><code>${esc("sudo reboot\n# después:\nvcgencmd get_throttled   # esperado: throttled=0x0" + (c.uart ? "\nscreen /dev/ttyAMA0 115200   # luego pulsa p" : ""))}</code></pre><button class="btn sm cp" data-a="copy" type="button">${ico("copy")}<span>Copiar</span></button></div>
      ${aviso("info", "Si la imagen no sincroniza prueba la variante «M» (timings CVT) o baja a 800×600@95. Mantén la frecuencia horizontal cerca de 60 kHz. Con KMS, `hdmi_group`, `hdmi_mode` y `hdmi_ignore_edid` de `config.txt` se ignoran.")}</div>`;
  };

  /* ---------- Divisor de tensión ---------- */
  W.divisor = () => `<div class="glass-card w" id="div"><h4>Calculadora del divisor del UART</h4>
    <div class="row"><label>R1 serie <input class="vin" type="number" id="d1" value="1000" min="1"> Ω</label><label>R2 a GND <input class="vin" type="number" id="d2" value="2000" min="1"> Ω</label><label>Entrada <input class="vin" type="number" id="d3" value="5" step="0.1"> V</label></div>
    <div id="dout"></div></div>`;
  function divCalc() {
    const o = $("#dout"); if (!o) return;
    const r1 = num($("#d1").value), r2 = num($("#d2").value), v = num($("#d3").value);
    if (!(r1 > 0 && r2 > 0)) { o.innerHTML = ""; return; }
    const vo = v * r2 / (r1 + r2), good = vo <= 3.45 && vo >= 2.0;
    o.innerHTML = `<div class="${good ? "okbox" : "failbox"}">${ico(good ? "check" : "warn")}<div>Salida: <strong>${vo.toFixed(2)} V</strong> — ${good ? "segura para una GPIO de 3,3 V." : vo > 3.45 ? "demasiado alta para la GPIO de la Pi: no la conectes." : "demasiado baja para leerse como nivel alto."}</div></div>`;
  }

  /* ---------- Calibración ---------- */
  const CAL = (A.cal = { x: 0, y: 0, w: 0, h: 0, con: 0, bri: 0, par: 0, key: 0, rot: 0, pin: 0, off: false });
  const KMAP = { a: ["x", -1], s: ["x", 1], w: ["y", -1], z: ["y", 1], d: ["w", -1], f: ["w", 1], r: ["h", 1], c: ["h", -1], g: ["con", -1], h: ["con", 1], j: ["bri", -1], k: ["bri", 1], x: ["par", -1], v: ["par", 1], b: ["key", 1], n: ["key", -1], t: ["rot", -1], y: ["rot", 1], u: ["pin", 1], i: ["pin", -1] };
  function calSvg() {
    const c = CAL, pt = (u, v) => {
      let x = u * (1 + c.w * 0.04), y = v * (1 + c.h * 0.04);
      x += c.par * 0.04 * y; x *= 1 + c.key * 0.05 * y;
      const f = 1 + c.pin * 0.035 * (x * x + y * y); x *= f; y *= f;
      const a = c.rot * 0.03, X = x * Math.cos(a) - y * Math.sin(a), Y = x * Math.sin(a) + y * Math.cos(a);
      return [160 + (X + c.x * 0.05) * 135, 120 + (Y + c.y * 0.05) * 100];
    };
    const path = (f, n) => { let d = ""; for (let i = 0; i <= n; i++) { const [x, y] = f(i / n); d += (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1); } return d; };
    let g = "";
    [-1, -0.5, 0, 0.5, 1].forEach(k => { g += `<path d="${path(t => pt(-1 + 2 * t, k), 24)}" stroke-width="${Math.abs(k) === 1 ? 2.2 : 1}"/><path d="${path(t => pt(k, -1 + 2 * t), 24)}" stroke-width="${Math.abs(k) === 1 ? 2.2 : 1}"/>`; });
    g += `<path d="${path(t => pt(0.6 * Math.cos(t * 6.2832), 0.6 * Math.sin(t * 6.2832)), 60)}" stroke-width="1.6"/>`;
    const br = 1 + c.bri * 0.07, co = 1 + c.con * 0.08;
    return `<rect width="320" height="240" fill="#050607"/><g fill="none" stroke="var(--accent-green-60)" stroke-linecap="round" style="filter:brightness(${br.toFixed(2)}) contrast(${co.toFixed(2)})" opacity="${c.off ? 0 : 1}">${g}</g>${c.off ? `<text x="160" y="124" text-anchor="middle" fill="#9095A2" style="font:12px var(--font-mono)">CRT apagada (tecla o)</text>` : ""}`;
  }
  const calRO = () => { const c = CAL; return `<span>Pos H ${c.x}</span><span>Pos V ${c.y}</span><span>Ancho ${c.w}</span><span>Alto ${c.h}</span><span>Contraste ${c.con}</span><span>Brillo ${c.bri}</span><span>Paralelogramo ${c.par}</span><span>Keystone ${c.key}</span><span>Rotación ${c.rot}</span><span>Cojín ${c.pin}</span>`; };
  function calUpd() { const s = $("#calsvg"); if (s) { s.innerHTML = calSvg(); $("#calro").innerHTML = calRO(); } }
  function calKey(k) {
    if (k === "o") { CAL.off = !CAL.off; calUpd(); return; }
    if (k === "p") { const ro = $("#calro"); if (ro) { ro.style.color = "var(--text-main)"; setTimeout(() => ro.style.color = "", 700); } A.toast("p → imprime los valores actuales"); return; }
    const m = KMAP[k]; if (!m || CAL.off) return;
    CAL[m[0]] = Math.max(-10, Math.min(10, CAL[m[0]] + m[1])); calUpd();
  }
  W.calib = () => `<div class="glass-card w cal-w"><h4>Simulador de calibración <span class="badge">ilustrativo</span></h4>
    <div class="cal"><div><div class="crt"><svg id="calsvg" viewBox="0 0 320 240" role="img" aria-label="Pantalla simulada de la CRT">${calSvg()}</svg></div><div class="readout" id="calro" style="margin-top:10px" aria-live="polite">${calRO()}</div></div>
    <div class="keys">${M.TECLAS.map(t => `<div class="krow"><div class="nm">${t[2]}<small>${t[0]}: ${t[3]} · ${t[1]}: ${t[4]}</small></div><button class="key" type="button" data-a="tecla" data-k="${t[0]}" aria-label="${t[2]}, ${t[3]}">${t[0]}</button><button class="key" type="button" data-a="tecla" data-k="${t[1]}" aria-label="${t[2]}, ${t[4]}">${t[1]}</button></div>`).join("")}
      <div class="krow"><div class="nm">Mostrar valores<small>p: imprime los ajustes actuales</small></div><button class="key" type="button" data-a="tecla" data-k="p">p</button><span></span></div>
      <div class="krow"><div class="nm">Apagar la CRT<small>o: apaga la circuitería (y la Pi si está en el riel conmutado)</small></div><button class="key" type="button" data-a="tecla" data-k="o">o</button><span></span></div>
      <div><button class="btn sm" type="button" data-a="calreset">${ico("reset")} Restablecer</button></div></div></div>
    <p class="muted" style="margin:0">También puedes usar el teclado de tu computadora. En el equipo real escribes estas teclas en la terminal serie (115200 baudios). Solo funciona con la CRT encendida. El simulador es ilustrativo: cuánto mueve cada pulsación depende del firmware.</p></div>`;

  /* ---------- Multímetro ---------- */
  function medEstado(m, v) {
    const x = num(v); if (v === "" || v == null || isNaN(x)) return null;
    return x >= m.min && x <= m.max;
  }
  const medCard = m => {
    const v = S.med[m.id] != null ? S.med[m.id] : "", e = medEstado(m, v);
    return `<div class="med ${e === true ? "ok" : e === false ? "bad" : ""}" data-id="${m.id}"><div class="row"><strong>${esc(m.t)}</strong><span class="badge">${m.modo}</span><span class="badge">${esc(m.cond)}</span></div>
      <div class="pr"><span><i class="red"></i>Rojo: <code>${esc(m.rojo)}</code></span><span><i class="blk"></i>Negro: <code>${esc(m.negro)}</code></span><span class="muted">Esperado: ${m.nom} V (${m.tol}: ${m.min}–${m.max})</span></div>
      <div class="row"><label>Tu medida <input class="vin" type="text" inputmode="decimal" data-a="med" data-id="${m.id}" value="${esc(v)}" placeholder="p. ej. 5,02"> V</label><span class="st" data-st="${m.id}">${medTxt(m, e)}</span></div></div>`;
  };
  const medTxt = (m, e) => e === null ? "" : e ? `<span class="badge ok">✓ dentro de rango</span>` : `<span class="badge bad">✗ fuera de rango</span> <a href="#/t/diagnostico/${m.fallo}">Ver qué revisar</a>`;
  W.multi = () => {
    const g = id => medCard(M.MEDIDAS.find(m => m.id === id));
    return `<div class="glass-card w"><h4>Primer encendido guiado</h4>
      <div class="chk"><b>A · Con el iMac enchufado y la CRT apagada</b>${g("m1")}${g("m2")}</div>
      <div class="chk"><b>B · Pulsa y suelta el botón</b>${ckb("mu_led", "El LED verde se enciende.")}${ckb("mu_snd", "La CRT hace su sonido de activación.")}${g("m3")}${g("m4")}${g("m5")}</div>
      <div class="chk"><b>C · Con carga resistiva</b>${g("m6")}</div>
      <div class="chk"><b>D · Apagado</b>${ckb("mu_off", "Al pulsar otra vez, la CRT y el LED se apagan.")}</div>
      <p class="muted" style="margin:0">Los márgenes son tolerancias generales (±5 %); la de 24 VAC es orientativa. Un valor fuera de rango no siempre es una avería: revisa el punto de medida primero.</p></div>`;
  };

  /* ---------- Secuencia de encendido ---------- */
  A.seq = 0;
  W.secuencia = () => `<div class="glass-card w"><h4>Qué pasa al encender <button class="btn sm" type="button" data-a="seqplay" id="seqbtn">${ico("play")} Reproducir</button></h4><div class="timeline">${M.SECUENCIA.map((s, i) => `<button class="tl ${i === A.seq ? "on" : i < A.seq ? "past" : ""}" type="button" data-a="seq" data-i="${i}"><span class="d">${i + 1}</span><span class="tx"><b>${esc(s.t)}</b><span>${fmt(s.x)}</span></span></button>`).join("")}</div></div>`;
  function seqSet(i) { A.seq = i; $$(".tl").forEach((e, k) => { e.classList.toggle("on", k === i); e.classList.toggle("past", k < i); }); }
  function seqStop() { clearInterval(A.seqT); A.seqT = null; const b = $("#seqbtn"); if (b) b.innerHTML = ico("play") + " Reproducir"; }

  /* ---------- Descargas, visores ---------- */
  const raw = p => p;
  const gh = p => M.GH + "/blob/master/" + p;
  const dlr = it => {
    const p = it.p, ext = (p || "").split(".").pop().toLowerCase(), dl = ["zip", "stl", "jar", "dxf", "bin"].includes(ext);
    const sz = p && window.MB_TAM ? window.MB_TAM[p] : null;
    const href = it.gh ? gh(it.gh) : raw(p);
    return `<div class="dlrow"><div><strong>${esc(it.t)}</strong><br><small>${esc(it.gh || p)}${sz != null ? " · " + hum(sz) : ""}</small></div><a class="btn sm ${dl ? "p" : ""}" href="${href}" ${dl ? "download" : 'target="_blank" rel="noopener"'}>${ico(dl ? "dl" : "ext")} ${dl ? "Descargar" : "Abrir"}</a></div>`;
  };
  const dlBox = (tit, items, nota) => `<div class="glass-card w"><h4>${esc(tit)}</h4><div>${items.map(dlr).join("")}</div>${nota ? `<p class="muted" style="margin:0">${fmt(nota)}</p>` : ""}</div>`;
  W.dl_placas = () => dlBox("Gerber de las placas individuales", M.DESCARGAS[0].items.filter(i => i.k === "gerber"), "Sube cada ZIP tal cual a tu fabricante.");
  W.dl_master = () => dlBox("Archivos del PCB master", M.DESCARGAS[1].items.filter(i => i.k).concat(M.DESCARGAS[1].items.slice(2, 4)), "El master no está fabricado ni verificado en hardware.");
  W.dl_firmware = () => dlBox("Firmware del ATmega", M.DESCARGAS[4].items.slice(0, 3), "Original de qbancoffee (LGPL-3.0).");
  W.ibom_links = () => { const l = [["J20", "hardware/placas_individuales/J20_video/ibom_es.html"], ["J22", "hardware/placas_individuales/J22_frontal_audio/ibom_es.html"], ["Down Converter", "hardware/placas_individuales/DownConverter/ibom_es.html"]]; if (S.cfg.ruta === "master") l.push(["Master", "hardware/master_pcb/ibom_master.html"]); return `<div class="row">${l.map(([t, h]) => `<a class="btn" href="${h}" target="_blank" rel="noopener">${ico("ext")} iBOM ${t}</a>`).join("")}</div>`; };
  W.visor3d_link = () => `<div class="row"><a class="btn" href="visores/visor3d_pcbs.html" target="_blank" rel="noopener">${ico("ext")} Abrir el visor 3D de las placas</a></div>`;
  W.visor_cableado = () => { const p = S.cfg.ruta === "master" ? "visores/cableado_con_master.html" : "visores/cableado_sin_master.html"; return `<div class="glass-card w"><h4>Mapa de cableado ${S.cfg.ruta === "master" ? "con master" : "sin master"}</h4><div id="vf">${S.vload ? `<iframe class="frame" src="${p}" title="Mapa de cableado" loading="lazy"></iframe>` : `<button class="btn" type="button" data-a="vload">Cargar el mapa aquí</button>`}</div><div class="row"><a class="btn" href="${p}" target="_blank" rel="noopener">${ico("ext")} Abrir en pantalla completa</a></div></div>`; };

  /* ---------- Páginas de herramientas ---------- */
  TP.plan = () => W.plan();
  TP.cables = () => W.cables();
  TP.jumpers = () => W.jumpers({});
  TP.alim = () => W.alim();
  TP.pi5 = () => W.pi5cfg() + W.divisor();
  TP.calib = () => W.calib();
  TP.multi = () => W.multi();
  TP.compras = () => W.compras();
  TP.descargas = () => M.DESCARGAS.map(g => `<div class="glass-card w"><h4>${esc(g.g)}</h4><p class="muted" style="margin:0">${fmt(g.d)}</p><div>${g.items.map(dlr).join("")}</div>${g.nota ? `<p class="muted" style="margin:0">${fmt(g.nota)}</p>` : ""}</div>`).join("") + `<div class="glass-card w"><h4>Vídeos del proyecto original</h4><div class="links">${M.VIDEOS.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${ico("ext")}<span><strong>${esc(t)}</strong></span></a>`).join("")}</div></div>`;
  TP.visores = () => `<div class="grid">${M.VISORES.map(v => `<div class="glass-card w"><h4>${esc(v.t)} ${v.pesado ? '<span class="badge warn">pesado</span>' : ""}</h4><p style="margin:0">${esc(v.d)}</p>${v.iframe ? `<div id="vf-${v.p.split("/").pop()}"><button class="btn" type="button" data-a="vload2" data-p="${v.p}">Previsualizar aquí</button></div>` : ""}<div class="row"><a class="btn p" href="${v.p}" target="_blank" rel="noopener">${ico("ext")} Abrir</a></div></div>`).join("")}</div>${aviso("info", "Los visores son archivos HTML autónomos (three.js y los STL van incrustados). Algunos cargan tipografías de Google Fonts; sin conexión usan la del sistema.")}`;
  TP.pines = () => `<div class="glass-card w"><h4>Buscar un pin o una señal</h4><input type="search" id="pq" data-a="pq" placeholder="p. ej. DCO, J1-5, 17, rojo, +5 V…" aria-label="Buscar en las tablas de pines"><div class="row">${M.PINES.map(p => `<a class="chip" href="#pin-${p.id}" data-a="pinjump" data-id="${p.id}">${esc(p.titulo.replace(/\s*\(.*\)/, ""))}</a>`).join("")}</div></div>${aviso("aviso", "Estas tablas están **verificadas contra los archivos KiCad**. Si difieren de otras guías, manda esta.")}<div id="pt" class="grid">${M.PINES.map(p => `<div class="glass-card w" id="pin-${p.id}" data-pin="${p.id}"><h4>${esc(p.titulo)}</h4><p class="muted" style="margin:0">${fmt(p.sub)}</p>${tabla(p.cab, p.filas)}</div>`).join("")}</div><p id="pq0" class="muted" hidden>Sin coincidencias.</p>`;
  TP.diagnostico = param => {
    const sel = param || S.diag; const d = M.DIAG.find(x => x.id === sel);
    let h = `<div class="diag-s">${M.DIAG.map(x => `<a class="opt" href="#/t/diagnostico/${x.id}" aria-pressed="${x.id === sel}" style="text-decoration:none;color:inherit"><b>${esc(x.s)}</b></a>`).join("")}</div>`;
    if (d) { S.diag = d.id; h += `<div class="glass-card w" id="diag-res" style="margin-top:18px"><h4>${esc(d.s)}</h4><p class="muted" style="margin:0">Revisa las causas en este orden, de la más probable a la menos.</p>${d.causas.map((c, i) => `<div class="cause"><span class="nb">${i + 1}</span><div><b>${esc(c.t)}</b>${fmt(c.c)}</div></div>`).join("")}<p class="muted" style="margin:0">Si nada de esto lo resuelve, abre un *issue* en el <a href="${M.GH}/issues" target="_blank" rel="noopener">repositorio</a> con una foto del montaje y lo que mediste.</p></div>`; }
    else h += `<p class="muted" style="margin-top:14px">Elige el síntoma que se parece más a lo que ves.</p>`;
    return h;
  };
  TP.extras = () => (M.EXTRAS || []).map(blk).join("");
  TP.creditos = () => (M.CREDITOS || []).map(blk).join("");
  TP.glosario = () => `<div class="glass-card w"><input type="search" id="gq" data-a="gq" placeholder="Filtrar términos…" aria-label="Filtrar el glosario"></div><div class="glass-card w" id="gl">${Object.keys(M.GLOSARIO).sort((a, b) => a.localeCompare(b, "es")).map(k => `<div class="sumrow" data-t="${esc(norm(k + " " + M.GLOSARIO[k]))}" style="display:grid;grid-template-columns:minmax(110px,170px) 1fr;gap:12px;align-items:start"><strong>${esc(k)}</strong><span style="color:var(--text-main);font-size:15px">${fmt(M.GLOSARIO[k])}</span></div>`).join("")}</div>`;

  /* ---------- Acciones ---------- */
  A.act = (a, el, ev) => {
    switch (a) {
      case "plan-set": { const q = M.PLAN.find(x => x.k === el.dataset.k); S.cfg[q.k] = q.op[+el.dataset.i].v; S.planPaso++; if (S.planPaso >= M.PLAN.length) S.planOk = true; save(); rr(); A.refreshNav(); break; }
      case "plan-back": S.planPaso = Math.max(0, (S.planOk ? M.PLAN.length : S.planPaso) - 1); S.planOk = false; save(); rr(); break;
      case "plan-edit": S.planPaso = +el.dataset.i; S.planOk = false; save(); rr(); break;
      case "plan-def": S.cfg = Object.assign({}, M.DEF); S.planOk = true; S.planPaso = M.PLAN.length; save(); rr(); A.refreshNav(); break;
      case "jm": S.jmp[el.dataset.id] = +el.dataset.i; save(); rr(); break;
      case "cabf": S.cabF = el.dataset.v; rr(); break;
      case "aq": { const q = +el.dataset.q; const arr = S.alimQ.slice(); let n = 0, i = 0; while (n !== q && i < 5) { n = AQ[n].sig[arr[n]]; i++; } arr[q] = +el.dataset.v; S.alimQ = arr; save(); rr(); break; }
      case "aq-reset": S.alimQ = []; save(); rr(); break;
      case "alim-set": S.cfg.alim = el.dataset.v; save(); rr(); A.toast("Alimentación: opción " + el.dataset.v); break;
      case "p5": { const c = P5(); const v = el.dataset.v; c[el.dataset.k] = v === "true" ? true : v === "false" ? false : v; save(); rr(); break; }
      case "tecla": calKey(el.dataset.k); break;
      case "calreset": Object.keys(CAL).forEach(k => CAL[k] = k === "off" ? false : 0); calUpd(); break;
      case "seq": seqSet(+el.dataset.i); break;
      case "seqplay": if (A.seqT) seqStop(); else { if (A.seq >= M.SECUENCIA.length - 1) seqSet(0); el.innerHTML = ico("pause") + " Pausar"; A.seqT = setInterval(() => { if (!$("#seqbtn")) return seqStop(); if (A.seq >= M.SECUENCIA.length - 1) return seqStop(); seqSet(A.seq + 1); }, 2600); } break;
      case "vload": S.vload = true; rr(); break;
      case "vload2": { const box = el.parentElement; box.innerHTML = `<iframe class="frame" src="${el.dataset.p}" title="Vista previa" loading="lazy"></iframe>`; break; }
      case "pinjump": ev.preventDefault(); { const t = document.getElementById("pin-" + el.dataset.id); if (t) t.scrollIntoView({ behavior: "smooth", block: "start" }); } break;
      case "ck": break;
    }
  };
  A.input = el => {
    if (el.id === "pq") {
      const q = norm(el.value).trim(); let any = false;
      $$("#pt [data-pin]").forEach(card => {
        let hit = false;
        $$("tbody tr", card).forEach(tr => { const m = !q || norm(tr.textContent).includes(q); tr.hidden = !m; tr.classList.toggle("hit", !!q && m); if (m) hit = true; });
        card.hidden = !hit; if (hit) any = true;
      });
      $("#pq0").hidden = any;
    } else if (el.id === "gq") {
      const q = norm(el.value).trim(); $$("#gl [data-t]").forEach(r => { r.hidden = q && !r.dataset.t.includes(q); });
    } else if (el.dataset && el.dataset.a === "med") {
      S.med[el.dataset.id] = el.value; save();
      const m = M.MEDIDAS.find(x => x.id === el.dataset.id), e = medEstado(m, el.value), card = el.closest(".med");
      card.classList.toggle("ok", e === true); card.classList.toggle("bad", e === false);
      $(`[data-st="${m.id}"]`, card).innerHTML = medTxt(m, e);
    } else if (el.id === "d1" || el.id === "d2" || el.id === "d3") divCalc();
  };
  A.key = (ev, typing) => {
    if (typing || ev.ctrlKey || ev.metaKey || ev.altKey || !$("#calsvg")) return;
    const k = ev.key.length === 1 ? ev.key.toLowerCase() : ""; if (!k || (!KMAP[k] && k !== "o" && k !== "p")) return;
    calKey(k); const b = $(`.key[data-k="${k}"]`); if (b) { b.classList.add("press"); setTimeout(() => b.classList.remove("press"), 120); }
  };
  A.onCheck = el => {
    const cab = el.closest(".cab"); if (!cab) return;
    cab.classList.toggle("done", el.checked);
    const w = cab.closest(".w"), list = cabs(), d = list.filter(c => S.h["c:cab_" + c.id]).length;
    const b = $("h4 .badge.acc", w); if (b) b.textContent = d + " de " + list.length;
    const bar = $(".bar > i", w); if (bar) bar.style.width = (list.length ? Math.round(d / list.length * 100) : 0) + "%";
  };
  A.after = () => { seqStop(); divCalc(); };
})();
