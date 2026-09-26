// ═══════════════════════════════════════════════════════════════════════
//  MOTOR DEL JUEGO — NO MODIFICAR ESTE ARCHIVO
//
//  Este archivo contiene la lógica de la interfaz y el bucle del juego.
//  Funciona correctamente una vez que completes personajes.js.
// ═══════════════════════════════════════════════════════════════════════

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ─── Estado del juego ───
const state = {
  heroes: [],
  enemies: [],
  turnOrder: [],
  currentIndex: 0,
  turnNumber: 1,
  battleStarted: false,
  pendingAction: null,
};

// ─── Elementos del DOM ───
const DOM = {
  setupPanel: $("#setup-panel"),
  arenaPanel: $("#arena-panel"),
  charName: $("#char-name"),
  charClass: $("#char-class"),
  charLevel: $("#char-level"),
  charRace: $("#char-race"),
  btnCreate: $("#btn-create"),
  rosterList: $("#roster-list"),
  rosterCount: $("#roster-count"),
  heroCards: $("#hero-cards"),
  enemyCards: $("#enemy-cards"),
  turnNumber: $("#turn-number"),
  currentActor: $("#current-actor"),
  btnAttack: $("#btn-attack"),
  btnSkill: $("#btn-skill"),
  btnDefend: $("#btn-defend"),
  targetSelector: $("#target-selector"),
  targetButtons: $("#target-buttons"),
  logEntries: $("#log-entries"),
  actionBar: $("#action-bar"),
  gameOver: $("#game-over"),
  gameOverTitle: $("#game-over-title"),
  gameOverText: $("#game-over-text"),
  statCreated: $("#stat-created"),
  statDamage: $("#stat-damage"),
  statMaxHit: $("#stat-max-hit"),
  statDefeated: $("#stat-defeated"),
};

// ─── Creación de personaje ───
DOM.btnCreate.addEventListener("click", () => {
  const nombre = DOM.charName.value.trim();
  const clase = DOM.charClass.value;
  const nivel = parseInt(DOM.charLevel.value) || 1;
  const raza = DOM.charRace.value;

  if (!nombre) {
    shakeElement(DOM.charName);
    return;
  }

  if (state.heroes.length >= 3) return;

  try {
    const personaje = crearPersonaje(nombre, nivel, raza, clase);
    state.heroes.push(personaje);

    // Añadir chip al roster
    const chip = document.createElement("div");
    chip.className = `roster__chip roster__chip--${clase}`;
    chip.innerHTML = `${getClassIcon(clase)} <strong>${personaje.nombre}</strong> — ${clase} | Nv.${nivel} | ${raza}`;
    DOM.rosterList.appendChild(chip);
    DOM.rosterCount.textContent = state.heroes.length;

    // Limpiar input
    DOM.charName.value = "";
    DOM.charLevel.value = "1";
    DOM.charName.focus();

    // Si tenemos 3, iniciar batalla
    if (state.heroes.length >= 3) {
      DOM.btnCreate.disabled = true;
      setTimeout(startBattle, 600);
    }
  } catch (error) {
    log(`❌ Error: ${error.message}`, "system");
    console.error(error);
  }
});

// Enter para crear
DOM.charName.addEventListener("keydown", (e) => {
  if (e.key === "Enter") DOM.btnCreate.click();
});

// ─── Iniciar batalla ───
function startBattle() {
  state.enemies = generarEnemigos();
  state.battleStarted = true;

  // Ocultar setup, mostrar arena
  DOM.setupPanel.classList.add("hidden");
  DOM.arenaPanel.classList.remove("hidden");

  // Calcular orden de turno por velocidad
  computeTurnOrder();

  // Renderizar tarjetas
  renderCards();
  updateStats();

  log("⚔️ ¡La batalla comienza!", "system");
  log(`Héroes: ${state.heroes.map((h) => h.nombre).join(", ")}`, "info");
  log(`Enemigos: ${state.enemies.map((e) => e.nombre).join(", ")}`, "info");
  log("—".repeat(40), "system");

  startTurn();
}

// ─── Orden de turno ───
function computeTurnOrder() {
  const todos = [...state.heroes, ...state.enemies].filter((p) => p.estaVivo);
  todos.sort((a, b) => b.velocidad - a.velocidad);
  state.turnOrder = todos;
  state.currentIndex = 0;
}

// ─── Turno ───
function startTurn() {
  // Resetear defensa de todos
  [...state.heroes, ...state.enemies].forEach((p) => {
    if (p.estaVivo) p.defendiendo = false;
  });

  // Recomputar si es nuevo round
  if (state.currentIndex >= state.turnOrder.length) {
    state.currentIndex = 0;
    state.turnNumber++;
    DOM.turnNumber.textContent = state.turnNumber;
    computeTurnOrder();
    log(`── Turno ${state.turnNumber} ──`, "system");
  }

  // Saltarse muertos
  while (
    state.currentIndex < state.turnOrder.length &&
    !state.turnOrder[state.currentIndex].estaVivo
  ) {
    state.currentIndex++;
  }

  if (state.currentIndex >= state.turnOrder.length) {
    state.currentIndex = 0;
    state.turnNumber++;
    DOM.turnNumber.textContent = state.turnNumber;
    computeTurnOrder();
    startTurn();
    return;
  }

  const actor = state.turnOrder[state.currentIndex];

  // Marcar activo
  highlightActive(actor);
  DOM.currentActor.textContent = `${actor.nombre}`;

  if (checkWinCondition()) return;

  // ¿Es héroe o enemigo?
  if (state.heroes.includes(actor)) {
    enableActions(true);
    hideTargetSelector();
  } else {
    enableActions(false);
    setTimeout(() => enemyTurn(actor), 800);
  }
}

// ─── Acciones del jugador ───
DOM.btnAttack.addEventListener("click", () => {
  state.pendingAction = "atacar";
  showTargetSelector(getAliveEnemies());
});

DOM.btnSkill.addEventListener("click", () => {
  state.pendingAction = "habilidad";
  showTargetSelector(getAliveEnemies());
});

DOM.btnDefend.addEventListener("click", () => {
  const actor = state.turnOrder[state.currentIndex];
  const msg = actor.defender();
  log(msg, "info");
  renderCards();
  updateStats();
  endCurrentTurn();
});

function showTargetSelector(targets) {
  DOM.targetSelector.classList.remove("hidden");
  DOM.targetButtons.innerHTML = "";

  targets.forEach((target, i) => {
    const btn = document.createElement("button");
    btn.className = "btn btn--target";
    btn.textContent = `${target.nombre} (HP: ${target.vida})`;
    btn.addEventListener("click", () => {
      executePlayerAction(target);
    });
    DOM.targetButtons.appendChild(btn);
  });
}

function hideTargetSelector() {
  DOM.targetSelector.classList.add("hidden");
}

function executePlayerAction(target) {
  const actor = state.turnOrder[state.currentIndex];
  hideTargetSelector();

  let resultado;
  if (state.pendingAction === "atacar") {
    resultado = actor.atacar(target);
    log(resultado.mensaje, "damage");
    flashCard(target, "hit");
  } else if (state.pendingAction === "habilidad") {
    resultado = actor.habilidadEspecial(target);
    if (resultado.dano > 0) {
      log(resultado.mensaje, "special");
      flashCard(target, "hit");
    } else {
      log(resultado.mensaje, "info");
    }
  }

  if (target && !target.estaVivo) {
    log(`💀 ${target.nombre} ha sido derrotado.`, "defeat");
  }

  renderCards();
  updateStats();

  if (!checkWinCondition()) {
    endCurrentTurn();
  }
}

// ─── Turno del enemigo ───
function enemyTurn(enemy) {
  const heroesVivos = getAliveHeroes();
  if (heroesVivos.length === 0) return;

  const decision = enemy.decidirAccion(heroesVivos);

  if (decision.accion === "defender") {
    log(decision.resultado.mensaje, "info");
  } else {
    const tipo = decision.accion === "habilidad" ? "special" : "damage";
    log(decision.resultado.mensaje, tipo);
    if (decision.objetivo) flashCard(decision.objetivo, "hit");
    if (decision.objetivo && !decision.objetivo.estaVivo) {
      log(`💀 ${decision.objetivo.nombre} ha caído.`, "defeat");
    }
  }

  renderCards();
  updateStats();

  if (!checkWinCondition()) {
    endCurrentTurn();
  }
}

// ─── Fin de turno ───
function endCurrentTurn() {
  state.currentIndex++;
  setTimeout(startTurn, 500);
}

// ─── Condición de victoria ───
function checkWinCondition() {
  const heroesVivos = getAliveHeroes();
  const enemigosVivos = getAliveEnemies();

  if (enemigosVivos.length === 0) {
    setTimeout(() => showGameOver(true), 400);
    return true;
  }
  if (heroesVivos.length === 0) {
    setTimeout(() => showGameOver(false), 400);
    return true;
  }
  return false;
}

function showGameOver(victory) {
  DOM.gameOver.classList.remove("hidden");
  enableActions(false);

  if (victory) {
    DOM.gameOverTitle.textContent = "🏆 ¡Victoria!";
    DOM.gameOverText.textContent = "Tus héroes han derrotado a todos los enemigos.";
  } else {
    DOM.gameOverTitle.textContent = "💀 Derrota";
    DOM.gameOverText.textContent = "Tus héroes han caído en batalla.";
  }
}

// ─── Renderizar tarjetas ───
function renderCards() {
  DOM.heroCards.innerHTML = "";
  DOM.enemyCards.innerHTML = "";

  state.heroes.forEach((h) => {
    DOM.heroCards.appendChild(createCard(h, getClassName(h)));
  });

  state.enemies.forEach((e) => {
    DOM.enemyCards.appendChild(createCard(e, "enemy"));
  });
}

function createCard(personaje, tipo) {
  const card = document.createElement("div");
  card.className = `char-card char-card--${tipo}`;
  card.dataset.nombre = personaje.nombre;

  if (!personaje.estaVivo) card.classList.add("char-card--dead");

  const hpPercent = (personaje.vida / personaje.vidaMax) * 100;
  const mpPercent = (personaje.mana / personaje.manaMax) * 100;

  let statusText = "";
  if (!personaje.estaVivo) statusText = "💀 Derrotado";
  else if (personaje.defendiendo) statusText = "🛡️ Defendiendo";

  const claseLbl = tipo === "enemy" && personaje.tipo ? personaje.tipo : getClassName(personaje);

  card.innerHTML = `
    <div class="char-card__header">
      <span class="char-card__name">${getClassIcon(claseLbl)} ${personaje.nombre}</span>
      <span class="char-card__class">${claseLbl}</span>
    </div>
    <div class="char-card__bars">
      <div class="bar">
        <div class="bar__fill bar__fill--hp" style="width:${hpPercent}%"></div>
        <span class="bar__text">HP ${personaje.vida} / ${personaje.vidaMax}</span>
      </div>
      <div class="bar">
        <div class="bar__fill bar__fill--mp" style="width:${mpPercent}%"></div>
        <span class="bar__text">MP ${personaje.mana} / ${personaje.manaMax}</span>
      </div>
    </div>
    <div class="char-card__stats">
      <span>⚔️ ${personaje.ataque}</span>
      <span>🛡️ ${personaje.defensa}</span>
      <span>💨 ${personaje.velocidad}</span>
      <span>📊 Nv.${personaje.nivel}</span>
      <span>🧬 ${personaje.raza}</span>
    </div>
    ${statusText ? `<div class="char-card__status">${statusText}</div>` : ""}
  `;

  return card;
}

// ─── Utilidades de UI ───
function highlightActive(personaje) {
  $$(".char-card").forEach((c) => c.classList.remove("char-card--active"));
  const card = document.querySelector(`.char-card[data-nombre="${personaje.nombre}"]`);
  if (card) card.classList.add("char-card--active");
}

function flashCard(personaje, type) {
  const card = document.querySelector(`.char-card[data-nombre="${personaje.nombre}"]`);
  if (!card) return;
  const cls = type === "hit" ? "char-card--hit" : "char-card--heal-flash";
  card.classList.add(cls);
  setTimeout(() => card.classList.remove(cls), 500);
}

function enableActions(enabled) {
  DOM.btnAttack.disabled = !enabled;
  DOM.btnSkill.disabled = !enabled;
  DOM.btnDefend.disabled = !enabled;
}

function log(msg, type = "info") {
  const entry = document.createElement("div");
  entry.className = `log-entry log-entry--${type}`;
  entry.textContent = msg;
  DOM.logEntries.prepend(entry);
}

function updateStats() {
  DOM.statCreated.textContent = Personaje.getContadorPersonajes();
  DOM.statDamage.textContent = Personaje.getDanoTotal();
  DOM.statMaxHit.textContent = Personaje.getMayorGolpe();
  DOM.statDefeated.textContent = Personaje.getDerrotados();
}

function shakeElement(el) {
  el.style.animation = "none";
  el.offsetHeight; // trigger reflow
  el.style.animation = "hitFlash 0.4s ease";
}

// ─── Helpers ───
function getAliveHeroes() {
  return state.heroes.filter((h) => h.estaVivo);
}

function getAliveEnemies() {
  return state.enemies.filter((e) => e.estaVivo);
}

function getClassName(personaje) {
  if (personaje instanceof Guerrero) return "Guerrero";
  if (personaje instanceof Mago) return "Mago";
  if (personaje instanceof Arquero) return "Arquero";
  if (personaje instanceof Enemigo) return "Enemigo";
  return "Desconocido";
}

function getClassIcon(clase) {
  const icons = {
    Guerrero: "🗡️",
    Mago: "🔮",
    Arquero: "🏹",
    Enemigo: "💀",
    Esqueleto: "💀",
    Goblin: "👺",
    Dragón: "🐉",
    enemy: "💀",
  };
  return icons[clase] || "⚔️";
}
