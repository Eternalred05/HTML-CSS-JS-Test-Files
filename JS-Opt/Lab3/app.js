// ═══════════════════════════════════════════════════════════════════════
//  MOTOR DE LA INTERFAZ — NO MODIFICAR ESTE ARCHIVO
//
//  Este archivo contiene la lógica de la interfaz del Guild Master.
//  Funciona correctamente una vez que completes funciones.js.
// ═══════════════════════════════════════════════════════════════════════

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ─── Class icons ───
const CLASS_ICONS = {
  Guerrero: "🗡️", Mago: "🔮", Arquero: "🏹",
  Sanador: "💚", Pícaro: "🗝️", Paladín: "🛡️"
};

// ─── Console logger ───
function log(msg, type = "info") {
  const entry = document.createElement("div");
  entry.className = `log-entry log-entry--${type}`;
  entry.textContent = msg;
  $("#console-entries").prepend(entry);
}

// ─── Safe executor ───
function safeCall(fn, ...args) {
  try {
    const result = fn(...args);
    if (result === undefined || result === null) {
      return null;
    }
    return result;
  } catch (e) {
    log(`❌ Error en ${fn.name || "función"}: ${e.message}`, "error");
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════
//  TAB NAVIGATION
// ═══════════════════════════════════════════════════════════════════════

$$(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    $$(".tab").forEach((t) => t.classList.remove("tab--active"));
    tab.classList.add("tab--active");

    $$(".panel").forEach((p) => p.classList.add("hidden"));
    const target = tab.dataset.tab;
    const panelMap = { gremio: "panel-gremio", misiones: "panel-misiones", estrategia: "panel-estrategia" };
    $(`#${panelMap[target]}`).classList.remove("hidden");

    // Refresh content when switching
    if (target === "misiones") renderMissions();
    if (target === "estrategia") renderAnalytics();
  });
});

// ═══════════════════════════════════════════════════════════════════════
//  HEADER STATS
// ═══════════════════════════════════════════════════════════════════════

function updateHeaderStats() {
  // Hero count
  $("#stat-heroes").textContent = heroes.length;
  // Missions count
  $("#stat-misiones").textContent = misiones.length;

  // Total power
  const poder = safeCall(poderTotalGremio);
  $("#stat-poder").textContent = poder !== null ? poder.toLocaleString() : "—";

  // Total rewards
  const recompensas = safeCall(calcularRecompensas);
  if (recompensas && Array.isArray(recompensas)) {
    const total = recompensas.reduce((s, m) => s + (m.recompensaTotal || 0), 0);
    $("#stat-recompensas").textContent = total.toLocaleString();
  } else {
    $("#stat-recompensas").textContent = "—";
  }
}

// ═══════════════════════════════════════════════════════════════════════
//  TAB 1: SALÓN DEL GREMIO
// ═══════════════════════════════════════════════════════════════════════

// ─── Render hero cards ───
function renderHeroCards(filteredList) {
  const list = filteredList || heroes;
  const grid = $("#hero-grid");
  grid.innerHTML = "";

  list.forEach((h) => {
    const energyPct = h.energia > 0 ? Math.min(100, (h.energia / 20) * 100) : 0;
    const powerPct = Math.min(100, (h.poder / 1000) * 100);
    const icon = CLASS_ICONS[h.clase] || "⚔️";

    const card = document.createElement("div");
    card.className = `hero-card hero-card--${h.clase}${h.activo ? "" : " hero-card--inactive"}`;
    card.innerHTML = `
      <div class="hero-card__header">
        <span class="hero-card__name">${icon} ${h.nombre}</span>
        <span class="hero-card__class hero-card__class--${h.clase}">${h.clase}</span>
      </div>
      <div class="hero-card__bars">
        <div class="bar">
          <div class="bar__fill bar__fill--energy" style="width:${energyPct}%"></div>
          <span class="bar__text">⚡ Energía ${h.energia}/20</span>
        </div>
        <div class="bar">
          <div class="bar__fill bar__fill--power" style="width:${powerPct}%"></div>
          <span class="bar__text">⚔️ Poder ${h.poder}</span>
        </div>
      </div>
      <div class="hero-card__stats">
        <span>📊 Nv.${h.nivel}</span>
        <span>🆔 #${h.id}</span>
        <span>${h.activo ? "✅ Activo" : "❌ Retirado"}</span>
      </div>
      ${!h.activo ? '<div class="hero-card__status">⛔ Retirado del Servicio</div>' : ""}
      ${h.activo && h.energia === 0 ? '<div class="hero-card__status">💤 Sin Energía</div>' : ""}
    `;
    grid.appendChild(card);
  });
}

// ─── Search ───
$("#search-input").addEventListener("input", (e) => {
  const query = e.target.value.trim();
  if (!query) {
    renderHeroCards();
    return;
  }
  const results = safeCall(buscarHeroe, "nombre", query);
  if (results && Array.isArray(results)) {
    renderHeroCards(results);
    log(`🔍 Búsqueda "${query}": ${results.length} resultado(s)`, "info");
  } else {
    renderHeroCards([]);
    log(`🔍 buscarHeroe() no retornó resultados válidos`, "warning");
  }
});

// ─── Add hero form ───
$("#btn-show-add").addEventListener("click", () => {
  $("#add-form").classList.toggle("hidden");
});

$("#btn-cancel-add").addEventListener("click", () => {
  $("#add-form").classList.add("hidden");
});

$("#btn-add").addEventListener("click", () => {
  const nuevoHeroe = {
    id: parseInt($("#add-id").value) || 0,
    nombre: $("#add-nombre").value.trim(),
    clase: $("#add-clase").value,
    poder: parseInt($("#add-poder").value) || 0,
    energia: parseInt($("#add-energia").value) || 0,
    nivel: parseInt($("#add-nivel").value) || 1,
    activo: $("#add-activo").checked
  };

  if (!nuevoHeroe.nombre) {
    log("⚠️ El nombre del héroe es obligatorio.", "warning");
    return;
  }

  const resultado = safeCall(agregarHeroe, nuevoHeroe);
  if (resultado) {
    if (resultado.exito) {
      log(`✅ ${resultado.mensaje}: ${nuevoHeroe.nombre}`, "success");
      // Clear form
      $("#add-id").value = "";
      $("#add-nombre").value = "";
      $("#add-poder").value = "";
      $("#add-energia").value = "";
      $("#add-nivel").value = "";
      $("#add-activo").checked = true;
      $("#add-form").classList.add("hidden");
      // Refresh
      refreshGremio();
    } else {
      log(`⚠️ ${resultado.mensaje}`, "warning");
    }
  } else {
    log("⚠️ agregarHeroe() no retornó un resultado.", "warning");
  }
});

// ─── Catalog modal ───
$("#btn-catalogo").addEventListener("click", () => {
  const catalogo = safeCall(obtenerHeroesDisponibles);
  const body = $("#catalog-body");

  if (catalogo && Array.isArray(catalogo) && catalogo.length > 0) {
    body.innerHTML = catalogo.map((h) =>
      `<div class="catalog-item">
        <span class="catalog-item__name">${h.nombre}</span>
        <span class="catalog-item__power">${h.poder}</span>
      </div>`
    ).join("");
    log(`📋 Catálogo: ${catalogo.length} héroes disponibles`, "info");
  } else {
    body.innerHTML = '<p class="placeholder">No hay héroes disponibles o la función no está implementada.</p>';
  }
  $("#catalog-modal").classList.remove("hidden");
});

$("#btn-close-catalog").addEventListener("click", () => {
  $("#catalog-modal").classList.add("hidden");
});

// Close modal on backdrop click
$("#catalog-modal").addEventListener("click", (e) => {
  if (e.target === $("#catalog-modal")) {
    $("#catalog-modal").classList.add("hidden");
  }
});

// ─── Validation badges ───
function updateBadges() {
  const val = safeCall(validacionesDelGremio);
  if (!val) return;

  function setBadge(id, condition) {
    const badge = $(`#${id}`);
    const valEl = $(`#${id}-val`);
    badge.classList.remove("badge--loading", "badge--yes", "badge--no");
    badge.classList.add(condition ? "badge--yes" : "badge--no");
    valEl.textContent = condition ? "Sí" : "No";
  }

  if (val.haySinEnergia !== undefined) setBadge("badge-agotados", val.haySinEnergia);
  if (val.todosPoderAlto !== undefined) setBadge("badge-poder-ok", val.todosPoderAlto);
  if (val.guerrerosConEnergia !== undefined) setBadge("badge-guerreros", val.guerrerosConEnergia);
}

// ─── Exhausted heroes panel ───
function updateRestPanel() {
  const agotados = safeCall(heroesAgotados);
  const list = $("#rest-list");

  if (agotados && Array.isArray(agotados) && agotados.length > 0) {
    list.innerHTML = agotados
      .map((n) => `<span class="rest-chip">💤 ${n}</span>`)
      .join("");
  } else if (agotados && agotados.length === 0) {
    list.innerHTML = '<p style="color:var(--green);font-size:0.85rem;">✅ Todos los héroes tienen energía.</p>';
  } else {
    list.innerHTML = '<p class="placeholder">Implementa <code>heroesAgotados()</code></p>';
  }
}

// ─── Refresh entire guild tab ───
function refreshGremio() {
  renderHeroCards();
  updateBadges();
  updateRestPanel();
  updateHeaderStats();
}

// ═══════════════════════════════════════════════════════════════════════
//  TAB 2: TABLÓN DE MISIONES
// ═══════════════════════════════════════════════════════════════════════

function renderMissions() {
  const enriquecidas = safeCall(enriquecerMisiones);
  const grid = $("#mission-grid");

  if (!enriquecidas || !Array.isArray(enriquecidas) || enriquecidas.length === 0) {
    grid.innerHTML = '<p class="placeholder">Implementa <code>enriquecerMisiones()</code> para ver los detalles de misiones.</p>';
    return;
  }

  // Apply month filter
  const mesFilter = parseInt($("#filter-mes").value);
  let filtered = enriquecidas;

  if (mesFilter > 0) {
    const result = safeCall(misionesPorMes, mesFilter, 2024);
    if (result && result.misiones) {
      const ids = result.misiones.map((m) => m.id);
      filtered = enriquecidas.filter((m) => ids.includes(m.id));
      $("#filter-result").textContent = `Recompensa del mes: ${result.total ? result.total.toLocaleString() : "—"} 🪙`;
    }
  } else {
    $("#filter-result").textContent = "";
  }

  grid.innerHTML = "";
  filtered.forEach((m) => {
    const card = document.createElement("div");
    card.className = "mission-card";

    const heroesHTML = m.heroes.map((h) => {
      if (h.nombre) {
        const icon = CLASS_ICONS[h.clase] || "⚔️";
        return `<div class="mission-hero">
          <span class="mission-hero__name">${icon} ${h.nombre}</span>
          <span class="mission-hero__detail">Esf: ${h.esfuerzo} × Poder: ${h.poder}</span>
          <span class="mission-hero__subtotal">${h.subtotal ? h.subtotal.toLocaleString() : "?"} 🪙</span>
        </div>`;
      } else {
        return `<div class="mission-hero">
          <span class="mission-hero__name">Héroe #${h.heroeId}</span>
          <span class="mission-hero__detail">Esfuerzo: ${h.esfuerzo}</span>
          <span class="mission-hero__subtotal">—</span>
        </div>`;
      }
    }).join("");

    const total = m.heroes.reduce((s, h) => s + (h.subtotal || 0), 0);

    card.innerHTML = `
      <div class="mission-card__header">
        <span class="mission-card__id">📜 Misión #${m.id}</span>
        <span class="mission-card__date">${m.fecha}</span>
      </div>
      <div class="mission-card__player">👤 Líder: <strong>${m.jugador}</strong></div>
      <div class="mission-card__heroes">${heroesHTML}</div>
      <div class="mission-card__total">
        <span class="mission-card__total-label">Recompensa Total</span>
        <span class="mission-card__total-value">${total.toLocaleString()} 🪙</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

$("#filter-mes").addEventListener("change", renderMissions);

// ═══════════════════════════════════════════════════════════════════════
//  TAB 3: SALA DE ESTRATEGIA
// ═══════════════════════════════════════════════════════════════════════

function renderAnalytics() {
  renderClassSummary();
  renderTopHeroes();
  renderPlayerSummary();
  renderEnergyImpact();
  renderCrossValidations();
}

// ─── Power boost tool ───
$("#btn-boost").addEventListener("click", () => {
  const clase = $("#boost-clase").value;
  const pct = parseFloat($("#boost-porcentaje").value);

  if (isNaN(pct)) {
    log("⚠️ Ingresa un porcentaje válido.", "warning");
    return;
  }

  const result = safeCall(mejorarPoderPorClase, clase, pct);
  const container = $("#boost-result");

  if (result && Array.isArray(result)) {
    container.classList.remove("hidden");
    const changed = result.filter((h, i) => h.poder !== heroes[i].poder);

    if (changed.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted);">No se encontraron héroes de esa clase.</p>';
    } else {
      container.innerHTML = changed.map((h) => {
        const original = heroes.find((o) => o.id === h.id);
        return `<div class="boost-row">
          <span class="boost-row__name">${CLASS_ICONS[h.clase] || "⚔️"} ${h.nombre}</span>
          <span class="boost-row__old">${original.poder}</span>
          <span>→</span>
          <span class="boost-row__new">${h.poder}</span>
        </div>`;
      }).join("");
    }

    log(`⚡ Mejora aplicada: ${clase} ${pct > 0 ? "+" : ""}${pct}% (${changed.length} héroes afectados)`, "success");
  } else {
    container.classList.remove("hidden");
    container.innerHTML = '<p class="placeholder">Implementa <code>mejorarPoderPorClase()</code></p>';
  }
});

// ─── Class summary ───
function renderClassSummary() {
  const data = safeCall(resumenPorClase);
  const container = $("#class-summary");

  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    container.innerHTML = '<p class="placeholder">Implementa <code>resumenPorClase()</code></p>';
    return;
  }

  let rows = "";
  for (const [clase, info] of Object.entries(data)) {
    const icon = CLASS_ICONS[clase] || "⚔️";
    rows += `<tr>
      <td>${icon} ${clase}</td>
      <td>${info.cantidad}</td>
      <td>${info.energiaTotal}</td>
      <td>${info.poderTotal.toLocaleString()}</td>
    </tr>`;
  }

  container.innerHTML = `
    <table class="cat-table">
      <thead><tr><th>Clase</th><th>Cantidad</th><th>Energía Total</th><th>Poder Total</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

// ─── Top heroes ───
function renderTopHeroes() {
  const data = safeCall(heroesMasActivos);
  const container = $("#top-heroes");

  if (!data || !Array.isArray(data) || data.length === 0) {
    container.innerHTML = '<p class="placeholder">Implementa <code>heroesMasActivos()</code></p>';
    return;
  }

  container.innerHTML = data.map((h, i) => {
    const posClass = i < 3 ? `rank-item__pos--${i + 1}` : "";
    const medals = ["🥇", "🥈", "🥉"];
    const medal = medals[i] || `#${i + 1}`;
    return `<div class="rank-item">
      <span class="rank-item__pos ${posClass}">${medal}</span>
      <div class="rank-item__info">
        <div class="rank-item__name">${h.nombre}</div>
        <div class="rank-item__detail">${h.participaciones} misión(es) · Esfuerzo: ${h.esfuerzoTotal}</div>
      </div>
      <span class="rank-item__value">${h.recompensaTotal.toLocaleString()} 🪙</span>
    </div>`;
  }).join("");
}

// ─── Player summary ───
function renderPlayerSummary() {
  const data = safeCall(resumenPorJugador);
  const container = $("#player-summary");

  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    container.innerHTML = '<p class="placeholder">Implementa <code>resumenPorJugador()</code></p>';
    return;
  }

  container.innerHTML = Object.entries(data).map(([nombre, info]) =>
    `<div class="player-card">
      <div class="player-card__name">👤 ${nombre}</div>
      <div class="player-card__stats">
        <span class="player-card__stat-label">Misiones</span>
        <span class="player-card__stat-value">${info.misiones}</span>
        <span class="player-card__stat-label">Recompensa</span>
        <span class="player-card__stat-value">${info.recompensa.toLocaleString()} 🪙</span>
        <span class="player-card__stat-label">Promedio</span>
        <span class="player-card__stat-value">${info.promedio.toLocaleString()} 🪙</span>
      </div>
      <div class="player-card__heroes">Héroes: ${info.heroes.join(", ")}</div>
    </div>`
  ).join("");
}

// ─── Energy impact ───
function renderEnergyImpact() {
  const data = safeCall(impactoEnEnergia);
  const container = $("#energy-impact");

  if (!data || !Array.isArray(data) || data.length === 0) {
    container.innerHTML = '<p class="placeholder">Implementa <code>impactoEnEnergia()</code></p>';
    return;
  }

  // Only show heroes that changed
  const changed = data.filter((h) => {
    const original = heroes.find((o) => o.id === h.id);
    return original && original.energia !== h.energia;
  });

  if (changed.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:16px;">Ningún héroe fue afectado.</p>';
    return;
  }

  container.innerHTML = changed.map((h) => {
    const original = heroes.find((o) => o.id === h.id);
    const pctNew = Math.min(100, (h.energia / 20) * 100);
    return `<div class="energy-row">
      <span class="energy-row__name">${CLASS_ICONS[h.clase] || "⚔️"} ${h.nombre}</span>
      <div class="energy-row__bar">
        <div class="bar"><div class="bar__fill bar__fill--energy" style="width:${pctNew}%"></div></div>
      </div>
      <span class="energy-row__values">
        <span class="energy-row__old">${original.energia}</span>
        <span class="energy-row__arrow">→</span>
        <span class="energy-row__new">${h.energia}</span>
      </span>
    </div>`;
  }).join("");
}

// ─── Cross validations ───
function renderCrossValidations() {
  const data = safeCall(validacionesCruzadas);
  const container = $("#cross-validations");

  if (!data || typeof data !== "object") {
    container.innerHTML = '<p class="placeholder">Implementa <code>validacionesCruzadas()</code></p>';
    return;
  }

  const items = [
    { icon: "🏰", text: "¿Todos los héroes participaron en al menos una misión?", key: "todosParticiparon" },
    { icon: "👥", text: "¿Algún jugador usó más de 3 héroes diferentes?", key: "jugadorConMuchos" },
    { icon: "💤", text: "¿Alguna misión incluye un héroe sin energía?", key: "misionConAgotado" }
  ];

  container.innerHTML = items.map((item) => {
    const val = data[item.key];
    if (val === undefined) return "";
    const cls = val ? "yes" : "no";
    const label = val ? "Sí" : "No";
    return `<div class="validation-item">
      <span class="validation-item__icon">${item.icon}</span>
      <span class="validation-item__text">${item.text}</span>
      <span class="validation-item__result validation-item__result--${cls}">${label}</span>
    </div>`;
  }).join("");
}

// ═══════════════════════════════════════════════════════════════════════
//  CONSOLE CLEAR
// ═══════════════════════════════════════════════════════════════════════

$("#btn-clear-log").addEventListener("click", () => {
  $("#console-entries").innerHTML = "";
  log("📜 Registro limpiado.", "system");
});

// ═══════════════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════════════

refreshGremio();
log("🏰 Guild Master listo. Completa los TODO en funciones.js para activar las funciones.", "system");
