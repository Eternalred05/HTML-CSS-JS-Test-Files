class Personaje {
  static #contadorPersonajes = 0;
  static #danoTotal = 0;
  static #mayorGolpe = 0;
  static #derrotados = 0;

  #nombre;
  #vida;
  #vidaMax;
  #mana;
  #manaMax;
  #ataque;
  #defensa;
  #velocidad;
  #nivel;
  #raza;
  #estaVivo;
  #defendiendo;

  constructor(nombre, vida, mana, ataque, defensa, velocidad, nivel, raza) {
    if (new.target === Personaje) {
      throw new Error("Es una clase abstracta, use una subclase.");
    }
    this.#nombre = nombre;
    this.#vida = vida;
    this.#vidaMax = vida;
    this.#mana = mana;
    this.#manaMax = mana;
    this.#ataque = ataque;
    this.#defensa = defensa;
    this.#velocidad = velocidad;
    this.#nivel = nivel;
    this.#raza = raza;
    this.#estaVivo = true;
    this.#defendiendo = false;
    Personaje.#contadorPersonajes++;
  }

  get nombre() { return this.#nombre; }
  get vida() { return this.#vida; }
  get vidaMax() { return this.#vidaMax; }
  get mana() { return this.#mana; }
  get manaMax() { return this.#manaMax; }
  get ataque() { return this.#ataque; }
  get defensa() { return this.#defensa; }
  get velocidad() { return this.#velocidad; }
  get nivel() { return this.#nivel; }
  get raza() { return this.#raza; }
  get estaVivo() { return this.#estaVivo; }
  get defendiendo() { return this.#defendiendo; }

  set vida(valor) {
    if (valor < 0) {
      this.#vida = 0;
    } else if (valor > this.#vidaMax) {
      this.#vida = this.#vidaMax;
    } else {
      this.#vida = valor;
    }
    if (this.#vida === 0) {
      this.#estaVivo = false;
    }
  }

  set mana(valor) {
    if (valor < 0) {
      this.#mana = 0;
    } else if (valor > this.#manaMax) {
      this.#mana = this.#manaMax;
    } else {
      this.#mana = valor;
    }
  }

  set defendiendo(valor) {
    this.#defendiendo = valor;
  }

  static getContadorPersonajes() {
    return Personaje.#contadorPersonajes;
  }

  static getDanoTotal() {
    return Personaje.#danoTotal;
  }

  static getMayorGolpe() {
    return Personaje.#mayorGolpe;
  }

  static getDerrotados() {
    return Personaje.#derrotados;
  }

  static registrarDano(cantidad) {
    Personaje.#danoTotal += cantidad;
    if (cantidad > Personaje.#mayorGolpe) {
      Personaje.#mayorGolpe = cantidad;
    }
  }

  static registrarDerrota() {
    Personaje.#derrotados++;
  }

  habilidadEspecial(objetivo) {
    throw new Error("Método habilidadEspecial debe ser implementado por la subclase.");
  }

  atacar(objetivo) {
    const variacion = Math.floor(Math.random() * 7) - 3;
    let dano = Math.max(1, this.ataque - Math.floor(objetivo.defensa / 2) + variacion);
    if (objetivo.defendiendo) {
      dano = Math.max(1, Math.floor(dano / 2));
    }
    objetivo.vida -= dano;
    Personaje.registrarDano(dano);
    if (!objetivo.estaVivo) {
      Personaje.registrarDerrota();
    }
    return {
      dano: dano,
      mensaje: `${this.nombre} ataca a ${objetivo.nombre} causando ${dano} de daño.`
    };
  }

  defender() {
    this.defendiendo = true;
    return `${this.nombre} se pone en guardia. 🛡️`;
  }

  toString() {
    return `${this.nombre} [HP: ${this.vida}/${this.vidaMax} | MP: ${this.mana}/${this.manaMax}]`;
  }
}

class Guerrero extends Personaje {
  constructor(nombre, nivel, raza) {
    const vida = 120;
    const mana = 30;
    const ataque = 18;
    const defensa = 15;
    const velocidad = 8;
    super(nombre, vida, mana, ataque, defensa, velocidad, nivel, raza);
  }

  habilidadEspecial(objetivo) {
    const costo = 15;
    const nombreHabilidad = "Golpe Devastador";
    let dano = 0;
    let mensaje = "";
    if (this.mana < costo) {
      mensaje = `${this.nombre} intenta usar ${nombreHabilidad} pero no tiene suficiente maná.`;
    } else {
      this.mana -= costo;
      dano = Math.floor(this.ataque * 2);
      objetivo.vida -= dano;
      Personaje.registrarDano(dano);
      if (!objetivo.estaVivo) Personaje.registrarDerrota();
      mensaje = `${this.nombre} usa ${nombreHabilidad} contra ${objetivo.nombre} causando ${dano} de daño. ⚡`;
    }
    return { dano: dano, mensaje: mensaje };
  }
}

class Mago extends Personaje {
  constructor(nombre, nivel, raza) {
    const vida = 70;
    const mana = 100;
    const ataque = 22;
    const defensa = 6;
    const velocidad = 10;
    super(nombre, vida, mana, ataque, defensa, velocidad, nivel, raza);
  }

  habilidadEspecial(objetivo) {
    const costo = 25;
    const nombreHabilidad = "Bola de Fuego";
    let dano = 0;
    let mensaje = "";
    if (this.mana < costo) {
      mensaje = `${this.nombre} intenta lanzar ${nombreHabilidad} pero no tiene suficiente maná.`;
    } else {
      this.mana -= costo;
      dano = Math.floor(this.ataque * 2.5);
      objetivo.vida -= dano;
      Personaje.registrarDano(dano);
      if (!objetivo.estaVivo) Personaje.registrarDerrota();
      mensaje = `${this.nombre} lanza ${nombreHabilidad} contra ${objetivo.nombre} causando ${dano} de daño. 🔥`;
    }
    return { dano: dano, mensaje: mensaje };
  }
}

class Arquero extends Personaje {
  constructor(nombre, nivel, raza) {
    const vida = 85;
    const mana = 50;
    const ataque = 16;
    const defensa = 8;
    const velocidad = 15;
    super(nombre, vida, mana, ataque, defensa, velocidad, nivel, raza);
  }

  habilidadEspecial(objetivo) {
    const costo = 20;
    const nombreHabilidad = "Lluvia de Flechas";
    let dano = 0;
    let mensaje = "";
    if (this.mana < costo) {
      mensaje = `${this.nombre} intenta usar ${nombreHabilidad} pero no tiene suficiente maná.`;
    } else {
      this.mana -= costo;
      dano = Math.floor(this.ataque * 1.8);
      objetivo.vida -= dano;
      Personaje.registrarDano(dano);
      if (!objetivo.estaVivo) Personaje.registrarDerrota();
      mensaje = `${this.nombre} ejecuta ${nombreHabilidad} contra ${objetivo.nombre} causando ${dano} de daño. 🏹`;
    }
    return { dano: dano, mensaje: mensaje };
  }
}

class Enemigo extends Personaje {
  #tipo;

  constructor(nombre, tipo, vida, mana, ataque, defensa, velocidad, nivel = 1, raza = "Monstruo") {
    super(nombre, vida, mana, ataque, defensa, velocidad, nivel, raza);
    this.#tipo = tipo;
  }

  get tipo() {
    return this.#tipo;
  }

  habilidadEspecial(objetivo) {
    const costoMana = 10;
    let dano = 0;
    let mensaje = "";
    if (this.mana < costoMana) {
      mensaje = `${this.nombre} intenta usar su habilidad pero no tiene maná.`;
    } else {
      this.mana -= costoMana;
      let multiplicador = 1.2;
      let nombreHabilidad = "Ataque Salvaje";
      switch (this.#tipo) {
        case "Esqueleto":
          multiplicador = 1.5;
          nombreHabilidad = "Tajo Óseo";
          break;
        case "Dragón":
          multiplicador = 2.8;
          nombreHabilidad = "Aliento de Fuego";
          break;
        case "Goblin":
          multiplicador = 1.3;
          nombreHabilidad = "Puñalada Traicionera";
          break;
        default:
          multiplicador = 1.2;
          nombreHabilidad = "Ataque Salvaje";
          break;
      }
      dano = Math.floor(this.ataque * multiplicador);
      objetivo.vida -= dano;
      Personaje.registrarDano(dano);
      if (!objetivo.estaVivo) Personaje.registrarDerrota();
      mensaje = `${this.nombre} usa ${nombreHabilidad} contra ${objetivo.nombre} causando ${dano} de daño. 💀`;
    }
    return { dano: dano, mensaje: mensaje };
  }

  decidirAccion(heroesVivos) {
    const roll = Math.random();
    const objetivo = heroesVivos[Math.floor(Math.random() * heroesVivos.length)];
    let accion = "";
    let resultado = null;
    if (roll < 0.2) {
      accion = "defender";
      resultado = { mensaje: this.defender() };
    } else if (roll < 0.45 && this.mana >= 10) {
      accion = "habilidad";
      resultado = this.habilidadEspecial(objetivo);
    } else {
      accion = "atacar";
      resultado = this.atacar(objetivo);
    }
    return { accion: accion, resultado: resultado, objetivo: objetivo };
  }
}

function crearPersonaje(nombre, nivel, raza, clase) {
  let personaje = null;
  switch (clase) {
    case "Guerrero":
      personaje = new Guerrero(nombre, nivel, raza);
      break;
    case "Mago":
      personaje = new Mago(nombre, nivel, raza);
      break;
    case "Arquero":
      personaje = new Arquero(nombre, nivel, raza);
      break;
    default:
      throw new Error(`Clase no válida: ${clase}. Debe ser Guerrero, Mago o Arquero.`);
  }
  return personaje;
}

function generarEnemigos() {
  const plantillas = [
    { nombre: "Esqueleto Oscuro", tipo: "Esqueleto", vida: 60, mana: 20, ataque: 12, defensa: 5, velocidad: 9 },
    { nombre: "Goblin Saqueador", tipo: "Goblin", vida: 45, mana: 15, ataque: 10, defensa: 4, velocidad: 14 },
    { nombre: "Dragón Joven", tipo: "Dragón", vida: 150, mana: 40, ataque: 20, defensa: 12, velocidad: 7 },
    { nombre: "Esqueleto Arquero", tipo: "Esqueleto", vida: 50, mana: 20, ataque: 14, defensa: 3, velocidad: 11 },
    { nombre: "Goblin Chamán", tipo: "Goblin", vida: 55, mana: 35, ataque: 8, defensa: 5, velocidad: 10 }
  ];
  const cantidad = Math.floor(Math.random() * 2) + 2;
  const seleccionados = [];
  const copia = [...plantillas];
  for (let i = 0; i < cantidad && copia.length > 0; i++) {
    const idx = Math.floor(Math.random() * copia.length);
    seleccionados.push(copia.splice(idx, 1)[0]);
  }
  const enemigos = [];
  for (let i = 0; i < seleccionados.length; i++) {
    const e = seleccionados[i];
    enemigos.push(new Enemigo(e.nombre, e.tipo, e.vida, e.mana, e.ataque, e.defensa, e.velocidad));
  }
  return enemigos;
}