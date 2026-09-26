// By Alexandro Valdés Piñeda
// Funciones y Clases
class Personaje {
    constructor(nombre, nivel, vida, tipo) {
        this.nombre = nombre;
        this.nivel = nivel;
        this.vida = vida;
        this.tipo = tipo;
    }
}

function ingresarPersonaje() {
    const nombre = prompt("Nombre del Personaje: ");
    const nivel = validarNumero("Ingrese el nivel del personaje, debe estar entre 1 y 100: ", 1, 100);
    const vida = validarNumero("Inserte cuanta vida tendra el personaje: ", 1, Infinity);
    const tipo = validarTipo("Diga el tipo de personaje que corresponde, estos pueden ser Guerrero,Mago u Arquero: ");
    const p = new Personaje(nombre, nivel, vida, tipo);
    return p;
}
function validarNumero(mensaje, min, max) {
    let valor;
    do {
        valor = Number(prompt(mensaje));
        if (isNaN(valor) || valor < min || valor > max) {
            if (max != Infinity)
                console.log("Usted ha ingresado un valor incorrecto debe ser un número entre " + min + " y " + max);
            else
                console.log("Usted ha ingresado un valor incorrecto debe ser un número mayor o igual que " + min);
        }
    } while (isNaN(valor) || valor < min || valor > max);
    return valor;
}

function validarTipo(mensaje) {
    const tipos = ["guerrero", "mago", "arquero"];
    let tipo;
    do {
        tipo = prompt(mensaje).toLowerCase();
        if (!tipos.includes(tipo)) {
            console.log("No ha escrito uno de los tipos que se le han dado.");
        }
    } while (!tipos.includes(tipo));
    return tipo;
}

function buscarLvlMax() {
    let find = false;
    for (let i = 0; i < personajes.length; i++) {
        const p = personajes[i];
        if (p.nivel == 100)
            find = true;
    }
    return find;
}
function mostrarExistenciaLvlMax(show) {
    if (show)
        console.log("De los personajes ingresados hay al menos uno en nivel 100.");
    else
        console.log("No hay ningún personaje en nivel 100.");

}
function calcularPromedioLvl() {
    let total = 0;
    for (let i = 0; i < personajes.length; i++) {
        total += personajes[i].nivel;
    }
    return total / personajes.length;
}
function vidaMenor50() {
    let cant = 0;
    for (let i = 0; i < personajes.length; i++) {
        const p = personajes[i];
        if (p.vida < 50)
            cant++;
    }
    return cant;
}
function buscarTiposPersonajes(tipo) {
    let cant = 0;
    for (let i = 0; i < personajes.length; i++) {
        const p = personajes[i];
        if (p.tipo.toLowerCase() == tipo)
            cant++;
    }
    return cant;
}
function buscarPersonajesMayorNivel() {
    const personajesMayorLvl = [];
    let mayor = 0;
    for (let i = 0; i < personajes.length; i++) {
        const p = personajes[i]
        if (p.nivel > mayor) {
            mayor = p.nivel;
            personajesMayorLvl.length = 0;
            personajesMayorLvl.push(p);
        }
        else if (p.nivel == mayor)
            personajesMayorLvl.push(p);
    }
    return personajesMayorLvl;
}

function buscarPersonajesMenorNivel() {

    const personajesMenorLvl = [];
    let menor = 101; // Como no hay niveles mayores que 100
    for (let i = 0; i < personajes.length; i++) {
        const p = personajes[i]
        if (p.nivel < menor) {
            menor = p.nivel;
            personajesMenorLvl.length = 0;
            personajesMenorLvl.push(p);
        }
        else if (p.nivel == mayor)
            personajesMenorLvl.push(p);
    }
    return personajesMenorLvl;
}
function mostrarPersonajes(array) {
    for (let i = 0; i < array.length; i++) {
        console.log(array[i].nombre);
    }
}


//Ejecucion Principal
const prompt = require('prompt-sync')();
const personajes = [];

console.log("Hola, Bienvenido!");
let cant = validarNumero("Diga cuantos personajes desea ingresar: ", 1, Infinity);

for (let i = 0; i < cant; i++) {
    console.log("Para el personaje #" + (i + 1) + " Diga:");
    const p = ingresarPersonaje();
    personajes.push(p);
}

// Parte para Mostrar las cosas ingresadas que se piden
mostrarExistenciaLvlMax(buscarLvlMax());
console.log("El promedio de nivel entre los personajes es de: " + calcularPromedioLvl());
console.log("Hay un total de " + vidaMenor50() + " personajes con vida menor a 50");
console.log("Hay un total de " + buscarTiposPersonajes("mago") + " Magos, " + buscarTiposPersonajes("arquero") + " Arqueros y " + buscarTiposPersonajes("guerrero") + " Guerreros.");
console.log("Los personajes con mayor nivel son:");
mostrarPersonajes(buscarPersonajesMayorNivel());
console.log("Los personajes con menor nivel son:");
mostrarPersonajes(buscarPersonajesMenorNivel());
