// ═══════════════════════════════════════════════════════════════════════
//  LABORATORIO 3 — Programación Funcional con Métodos de Arrays
//  Guild Master: Sistema de Gestión de Gremio RPG
//
//  🎯 INSTRUCCIONES:
//  Busca los bloques marcados con "TODO" y completa el código.
//  Cada TODO tiene una descripción de lo que debes implementar.
//  NO debes modificar el código que NO está marcado como TODO.
//
//  📚 CONCEPTOS EVALUADOS:
//  - Transformación con map()
//  - Filtrado con filter()
//  - Agregación con reduce()
//  - Búsqueda con find()
//  - Verificación con some() y every()
//  - Encadenamiento de métodos
//
// ═══════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────
// DATOS: Gremio de Héroes
// ─────────────────────────────────────────────────────────────────────
// Cada héroe tiene:
//   id       → identificador único
//   nombre   → nombre del héroe
//   clase    → clase de combate (Guerrero, Mago, Arquero, Sanador, Pícaro, Paladín)
//   poder    → nivel de poder de combate
//   energia  → energía disponible para misiones
//   nivel    → nivel de experiencia (1-10)
//   activo   → si está en servicio activo o retirado
// ─────────────────────────────────────────────────────────────────────

const heroes = [
    { id: 1,  nombre: "Arthas",     clase: "Guerrero", poder: 850,  energia: 12, nivel: 5, activo: true },
    { id: 2,  nombre: "Elara",      clase: "Mago",     poder: 720,  energia: 8,  nivel: 4, activo: true },
    { id: 3,  nombre: "Legolas",    clase: "Arquero",  poder: 680,  energia: 0,  nivel: 6, activo: true },
    { id: 4,  nombre: "Celeste",    clase: "Sanador",  poder: 450,  energia: 15, nivel: 3, activo: true },
    { id: 5,  nombre: "Ragnar",     clase: "Guerrero", poder: 920,  energia: 5,  nivel: 7, activo: false },
    { id: 6,  nombre: "Lyra",       clase: "Arquero",  poder: 600,  energia: 20, nivel: 4, activo: true },
    { id: 7,  nombre: "Morgana",    clase: "Mago",     poder: 780,  energia: 0,  nivel: 5, activo: false },
    { id: 8,  nombre: "Theron",     clase: "Pícaro",   poder: 550,  energia: 10, nivel: 3, activo: true },
    { id: 9,  nombre: "Isolde",     clase: "Paladín",  poder: 800,  energia: 7,  nivel: 6, activo: true },
    { id: 10, nombre: "Zephyr",     clase: "Mago",     poder: 900,  energia: 3,  nivel: 8, activo: true }
];

// ─────────────────────────────────────────────────────────────────────
// DATOS: Registro de Misiones
// ─────────────────────────────────────────────────────────────────────
// Cada misión referencia héroes del gremio mediante heroeId.
// El campo "esfuerzo" indica cuánta energía consume esa misión al héroe.
// ─────────────────────────────────────────────────────────────────────

const misiones = [
    {
        id: 1, jugador: "Carlos Pérez", fecha: "2024-01-15",
        heroes: [
            { heroeId: 1, esfuerzo: 3 },
            { heroeId: 4, esfuerzo: 2 }
        ]
    },
    {
        id: 2, jugador: "Ana García", fecha: "2024-01-22",
        heroes: [
            { heroeId: 2, esfuerzo: 4 }
        ]
    },
    {
        id: 3, jugador: "Carlos Pérez", fecha: "2024-02-05",
        heroes: [
            { heroeId: 8, esfuerzo: 2 },
            { heroeId: 10, esfuerzo: 1 }
        ]
    },
    {
        id: 4, jugador: "María López", fecha: "2024-02-18",
        heroes: [
            { heroeId: 9, esfuerzo: 3 },
            { heroeId: 6, esfuerzo: 2 }
        ]
    },
    {
        id: 5, jugador: "Ana García", fecha: "2024-03-01",
        heroes: [
            { heroeId: 10, esfuerzo: 2 }
        ]
    },
    {
        id: 6, jugador: "Luis Rodríguez", fecha: "2024-03-10",
        heroes: [
            { heroeId: 1, esfuerzo: 2 },
            { heroeId: 6, esfuerzo: 3 },
            { heroeId: 8, esfuerzo: 1 }
        ]
    }
];

// ═══════════════════════════════════════════════════════════════════════
//  PARTE 1 — GESTIÓN DEL GREMIO (Operaciones sobre héroes)
// ═══════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════
// TODO 1: agregarHeroe(nuevoHeroe)
//
// Agrega un nuevo héroe al arreglo "heroes".
// ANTES de agregar, debe validar:
//   1. Que no exista otro héroe con el mismo id
//   2. Que no exista otro héroe con el mismo nombre
//   3. Que el poder sea mayor que 0
//   4. Que la energía no sea negativa
//
// Si alguna validación falla, retorna un objeto:
//   { exito: false, mensaje: "texto explicando el error" }
//
// Si todas pasan, agrega el héroe con heroes.push(nuevoHeroe)
// y retorna:
//   { exito: true, mensaje: "Héroe reclutado exitosamente" }
//
// 👇 Escribe tu código aquí:
// ═══════════════════════════════════════════════════════════════════════
function agregarHeroe(nuevoHeroe) {
    let resultado = { exito: false, mensaje: "" };
    const existeId = heroes.some(h => h.id === nuevoHeroe.id);
    const existeNombre = heroes.some(h => h.nombre.toLowerCase() === nuevoHeroe.nombre.toLowerCase());
    if (existeId) {
        resultado.mensaje = `Ya existe un héroe con el id ${nuevoHeroe.id}`;
    } else if (existeNombre) {
        resultado.mensaje = `Ya existe un héroe con el nombre "${nuevoHeroe.nombre}"`;
    } else if (nuevoHeroe.poder <= 0) {
        resultado.mensaje = "El poder debe ser mayor que cero";
    } else if (nuevoHeroe.energia < 0) {
        resultado.mensaje = "La energía no puede ser negativa";
    } else {
        heroes.push(nuevoHeroe);
        resultado.exito = true;
        resultado.mensaje = "Héroe reclutado exitosamente";
    }
    return resultado;
}


// ═══════════════════════════════════════════════════════════════════════
// TODO 2: obtenerHeroesDisponibles()
//
// Retorna un arreglo con los héroes que están ACTIVOS y tienen
// energía mayor a 0. De cada héroe solo necesitamos:
//   { nombre: "Arthas", poder: "⚔️ 850" }
//
// Transformarlos al formato requerido.
//
// 👇 Escribe tu código aquí:
// ═══════════════════════════════════════════════════════════════════════
function obtenerHeroesDisponibles() {
    return heroes
        .filter(h => h.activo && h.energia > 0)
        .map(h => ({ nombre: h.nombre, poder: `⚔️ ${h.poder}` }));
}


// ═══════════════════════════════════════════════════════════════════════
// TODO 3: buscarHeroe(criterio, valor)
//
// Función de búsqueda flexible:
//
//   Si criterio === "id":
//     Buscar el héroe por su id.
//     Retorna el objeto completo o undefined si no existe.
//
//   Si criterio === "nombre":
//     Buscar todos los héroes cuyo nombre contenga el valor
//     Retorna el arreglo de coincidencias.
//
//   Si el criterio no es válido, retorna null.
//
// 👇 Escribe tu código aquí:
// ═══════════════════════════════════════════════════════════════════════
function buscarHeroe(criterio, valor) {
    if (criterio === "id") {
        return heroes.find(h => h.id === valor);
    } else if (criterio === "nombre") {
        const textoLower = valor.toLowerCase();
        return heroes.filter(h => h.nombre.toLowerCase().includes(textoLower));
    } else {
        return null;
    }
}


// ═══════════════════════════════════════════════════════════════════════
// TODO 4: validacionesDelGremio()
//
// Retorna un objeto con tres verificaciones sobre el arreglo heroes:
//
//   haySinEnergia:      ¿Existe al menos un héroe con energía === 0?
//
//   todosPoderAlto:     ¿TODOS los héroes activos tienen poder > 50?
//
//   guerrerosConEnergia: ¿Hay algún héroe de clase "Guerrero" que
//                        esté activo y tenga energía > 0?
//
// Retorna:
//   {
//     haySinEnergia: true/false,
//     todosPoderAlto: true/false,
//     guerrerosConEnergia: true/false
//   }
//
// 👇 Escribe tu código aquí:
// ═══════════════════════════════════════════════════════════════════════
function validacionesDelGremio() {
    const haySinEnergia = heroes.some(h => h.energia === 0);
    const activos = heroes.filter(h => h.activo);
    const todosPoderAlto = activos.length === 0 ? false : activos.every(h => h.poder > 50);
    const guerrerosConEnergia = heroes.some(h => h.clase === "Guerrero" && h.activo && h.energia > 0);
    return { haySinEnergia, todosPoderAlto, guerrerosConEnergia };
}


// ═══════════════════════════════════════════════════════════════════════
// TODO 5: poderTotalGremio()
//
// Calcula el poder total del gremio considerando SOLO los héroes
// activos. El valor se obtiene sumando el poder de cada héroe activo.
//
// Retorna un número.
//
// 👇 Escribe tu código aquí:
// ═══════════════════════════════════════════════════════════════════════
function poderTotalGremio() {
    return heroes
        .filter(h => h.activo)
        .reduce((total, h) => total + h.poder, 0);
}


// ═══════════════════════════════════════════════════════════════════════
// TODO 6: resumenPorClase()
//
// Genera un objeto que agrupe los héroes por clase.
// Para cada clase debe indicar:
//   - cantidad:      número de héroes de esa clase
//   - energiaTotal:  suma de energía de todos los héroes de esa clase
//   - poderTotal:    suma de poder de todos los héroes de esa clase
//
// Ejemplo de resultado:
//   {
//     Guerrero: { cantidad: 2, energiaTotal: 17, poderTotal: 1770 },
//     Mago:     { cantidad: 3, energiaTotal: 11, poderTotal: 2400 },
//     ...
//   }
//
// 👇 Escribe tu código aquí:
// ═══════════════════════════════════════════════════════════════════════
function resumenPorClase() {
    return heroes.reduce((acum, h) => {
        const clase = h.clase;
        if (!acum[clase]) {
            acum[clase] = { cantidad: 0, energiaTotal: 0, poderTotal: 0 };
        }
        acum[clase].cantidad++;
        acum[clase].energiaTotal += h.energia;
        acum[clase].poderTotal += h.poder;
        return acum;
    }, {});
}


// ═══════════════════════════════════════════════════════════════════════
// TODO 7: mejorarPoderPorClase(clase, porcentaje)
//
// Retorna un NUEVO arreglo de héroes donde los que pertenecen a la
// clase indicada tienen su poder ajustado por el porcentaje dado.
//
// Ejemplo: mejorarPoderPorClase("Guerrero", 20) → aumenta 20% el
//          poder de todos los guerreros.
//          mejorarPoderPorClase("Mago", -10) → reduce 10% el poder
//          de los magos.
//
// Los héroes de OTRAS clases deben quedar sin cambios.
// El arreglo original NO debe modificarse (inmutabilidad).
//
// 👇 Escribe tu código aquí:
// ═══════════════════════════════════════════════════════════════════════
function mejorarPoderPorClase(clase, porcentaje) {
    return heroes.map(h => {
        if (h.clase === clase) {
            const factor = 1 + porcentaje / 100;
            const nuevoPoder = Math.floor(h.poder * factor);
            return { ...h, poder: nuevoPoder };
        }
        return { ...h };
    });
}


// ═══════════════════════════════════════════════════════════════════════
// TODO 8: heroesAgotados()
//
// Retorna un arreglo con los NOMBRES de los héroes activos cuya
// energía es igual a 0. Estos héroes necesitan descansar.
//
// 👇 Escribe tu código aquí:
// ═══════════════════════════════════════════════════════════════════════
function heroesAgotados() {
    return heroes
        .filter(h => h.activo && h.energia === 0)
        .map(h => h.nombre);
}

// ═══════════════════════════════════════════════════════════════════════
// TODO 9: calcularRecompensas()
//
// Genera un NUEVO arreglo de misiones donde cada misión incluye
// una propiedad adicional "recompensaTotal".
//
// La recompensa de cada héroe en la misión se calcula como:
//   esfuerzo × poder del héroe
//
// La recompensaTotal de la misión es la SUMA de las recompensas
// individuales.
//
// El arreglo original NO debe modificarse.
// Retorna el nuevo arreglo con la propiedad recompensaTotal añadida.
//
// 👇 Escribe tu código aquí:
// ═══════════════════════════════════════════════════════════════════════
function calcularRecompensas() {
    return misiones.map(mision => {
        const recompensaTotal = mision.heroes.reduce((sum, item) => {
            const heroe = heroes.find(h => h.id === item.heroeId);
            const poder = heroe ? heroe.poder : 0;
            return sum + (item.esfuerzo * poder);
        }, 0);
        return { ...mision, recompensaTotal };
    });
}


// ═══════════════════════════════════════════════════════════════════════
// TODO 10: enriquecerMisiones()
//
// Genera un NUEVO arreglo de misiones donde cada entrada de héroes
// (que solo tiene heroeId y esfuerzo) se REEMPLAZA con los datos
// completos del héroe más un campo "subtotal".
//
// Para cada héroe en cada misión, el objeto resultante debe ser:
//   {
//     nombre:   (nombre del héroe, obtenido del arreglo heroes)
//     clase:    (clase del héroe)
//     poder:    (poder del héroe)
//     esfuerzo: (el esfuerzo original de la misión)
//     subtotal: esfuerzo × poder
//   }
//
// 👇 Escribe tu código aquí:
// ═══════════════════════════════════════════════════════════════════════
function enriquecerMisiones() {
    return misiones.map(mision => {
        const heroesEnriquecidos = mision.heroes.map(item => {
            const heroe = heroes.find(h => h.id === item.heroeId);
            return {
                nombre: heroe ? heroe.nombre : "Desconocido",
                clase: heroe ? heroe.clase : "?",
                poder: heroe ? heroe.poder : 0,
                esfuerzo: item.esfuerzo,
                subtotal: heroe ? item.esfuerzo * heroe.poder : 0
            };
        });
        return { ...mision, heroes: heroesEnriquecidos };
    });
}


// ═══════════════════════════════════════════════════════════════════════
// TODO 11: resumenPorJugador()
//
// Genera un objeto que agrupe las misiones por jugador.
// Para cada jugador debe indicar:
//   - misiones:    cantidad de misiones realizadas
//   - recompensa:  recompensa total acumulada
//   - promedio:    recompensa promedio por misión
//   - heroes:      arreglo con los NOMBRES únicos (sin repetir) de
//                  todos los héroes que ha utilizado
//
// Ejemplo parcial:
//   {
//     "Carlos Pérez": {
//       misiones: 2,
//       recompensa: 5100,
//       promedio: 2550,
//       heroes: ["Arthas", "Celeste", "Theron", "Zephyr"]
//     },
//     ...
//   }
//
// 👇 Escribe tu código aquí:
// ═══════════════════════════════════════════════════════════════════════
function resumenPorJugador() {
    const misionesConRecompensa = calcularRecompensas();
    return misionesConRecompensa.reduce((acum, mision) => {
        const jugador = mision.jugador;
        if (!acum[jugador]) {
            acum[jugador] = { misiones: 0, recompensa: 0, promedio: 0, heroes: [] };
        }
        acum[jugador].misiones++;
        acum[jugador].recompensa += mision.recompensaTotal;
        acum[jugador].promedio = acum[jugador].recompensa / acum[jugador].misiones;
        // Agregar nombres de héroes únicos
        mision.heroes.forEach(item => {
            const heroe = heroes.find(h => h.id === item.heroeId);
            if (heroe && !acum[jugador].heroes.includes(heroe.nombre)) {
                acum[jugador].heroes.push(heroe.nombre);
            }
        });
        return acum;
    }, {});
}


// ═══════════════════════════════════════════════════════════════════════
// TODO 12: impactoEnEnergia()
//
// Genera un NUEVO arreglo de héroes con la energía actualizada
// tras TODAS las misiones. Para cada héroe, la energía se reduce
// según el esfuerzo total consumido en todas las misiones donde
// participó.
//
// El arreglo original NO debe modificarse.
//
// 👇 Escribe tu código aquí:
// ═══════════════════════════════════════════════════════════════════════
function impactoEnEnergia() {
    // Calcular esfuerzo total por héroe
    const esfuerzoPorHeroe = misiones.reduce((acum, mision) => {
        mision.heroes.forEach(item => {
            const heroeId = item.heroeId;
            if (!acum[heroeId]) acum[heroeId] = 0;
            acum[heroeId] += item.esfuerzo;
        });
        return acum;
    }, {});
    // Crear nuevo array con energía descontada
    return heroes.map(h => {
        const esfuerzo = esfuerzoPorHeroe[h.id] || 0;
        const nuevaEnergia = Math.max(0, h.energia - esfuerzo);
        return { ...h, energia: nuevaEnergia };
    });
}


// ═══════════════════════════════════════════════════════════════════════
// TODO 13: heroesMasActivos()
//
// Retorna un arreglo con los héroes que han participado en misiones,
// indicando para cada uno:
//   - nombre:       nombre del héroe
//   - participaciones: cantidad total de misiones en que participó
//   - esfuerzoTotal:   suma total de esfuerzo consumido
//   - recompensaTotal: suma de (esfuerzo × poder) en todas sus misiones
//
// El arreglo debe estar ordenado de MAYOR a MENOR por recompensaTotal.
//
// 👇 Escribe tu código aquí:
// ═══════════════════════════════════════════════════════════════════════
function heroesMasActivos() {
    const stats = {};
    misiones.forEach(mision => {
        mision.heroes.forEach(item => {
            const heroe = heroes.find(h => h.id === item.heroeId);
            if (!heroe) return;
            const nombre = heroe.nombre;
            if (!stats[nombre]) {
                stats[nombre] = { nombre, participaciones: 0, esfuerzoTotal: 0, recompensaTotal: 0 };
            }
            stats[nombre].participaciones++;
            stats[nombre].esfuerzoTotal += item.esfuerzo;
            stats[nombre].recompensaTotal += item.esfuerzo * heroe.poder;
        });
    });
    return Object.values(stats).sort((a, b) => b.recompensaTotal - a.recompensaTotal);
}


// ═══════════════════════════════════════════════════════════════════════
// TODO 14: misionesPorMes(mes, anio)
//
// Retorna un objeto con:
//   - misiones:   arreglo de misiones que ocurrieron en el mes/año dado
//   - total:      la recompensa total de esas misiones
//
// El parámetro "mes" es un número (1 = enero, 2 = febrero, etc.)
// El parámetro "anio" es un número (ej: 2024).
//
// Usa filter() para obtener las misiones del periodo.
//
// 👇 Escribe tu código aquí:
// ═══════════════════════════════════════════════════════════════════════
function misionesPorMes(mes, anio) {
    const misionesConRecompensa = calcularRecompensas();
    const filtradas = misionesConRecompensa.filter(m => {
        const [year, month] = m.fecha.split("-").map(Number);
        return year === anio && month === mes;
    });
    const total = filtradas.reduce((sum, m) => sum + m.recompensaTotal, 0);
    return { misiones: filtradas, total };
}


// ═══════════════════════════════════════════════════════════════════════
// TODO 15: validacionesCruzadas()
//
// Retorna un objeto con tres verificaciones que COMBINAN datos de
// heroes y misiones:
//
//   todosParticiparon:
//     ¿TODOS los héroes del gremio han participado en al menos una
//     misión?
//
//   jugadorConMuchos:
//     ¿Existe algún jugador que haya utilizado más de 3 héroes
//     diferentes en total?
//
//   misionConAgotado:
//     ¿Alguna misión incluye un héroe que actualmente tiene
//     energía 0?
//
// Retorna:
//   {
//     todosParticiparon: true/false,
//     jugadorConMuchos: true/false,
//     misionConAgotado: true/false
//   }
//
// 👇 Escribe tu código aquí:
// ═══════════════════════════════════════════════════════════════════════
function validacionesCruzadas() {
    // 1. Todos los héroes participaron al menos una vez
    const idsHeroesEnMisiones = new Set();
    misiones.forEach(m => m.heroes.forEach(h => idsHeroesEnMisiones.add(h.heroeId)));
    const todosParticiparon = heroes.every(h => idsHeroesEnMisiones.has(h.id));

    // 2. Algún jugador usó más de 3 héroes diferentes
    const jugadorHeroes = {};
    misiones.forEach(m => {
        if (!jugadorHeroes[m.jugador]) jugadorHeroes[m.jugador] = new Set();
        m.heroes.forEach(h => jugadorHeroes[m.jugador].add(h.heroeId));
    });
    const jugadorConMuchos = Object.values(jugadorHeroes).some(set => set.size > 3);

    // 3. Alguna misión incluye un héroe con energía actual 0
    const heroesSinEnergiaIds = heroes.filter(h => h.energia === 0).map(h => h.id);
    const misionConAgotado = misiones.some(m =>
        m.heroes.some(h => heroesSinEnergiaIds.includes(h.heroeId))
    );

    return { todosParticiparon, jugadorConMuchos, misionConAgotado };
}s