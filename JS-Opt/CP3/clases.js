export class Cliente {
    #id;
    constructor(id, nombre, carnet, correo) {
        this.#id = id;
        this.nombre = nombre;
        this.carnet = carnet;
        this.correo = correo;
    }
    get id() {
        return this.#id;
    }

    mostrarInfo() {
        console.log("--- Datos del Cliente ---");
        console.log(`Identificador: ${this.#id}`);
        console.log(`Nombre: ${this.nombre}`);
        console.log(`Documento: ${this.carnet}`);
        console.log(`Correo: ${this.correo}`);
    }
}

export class Cuenta {
    #saldo;
    constructor(idCuenta, saldo, cliente, estado) {
        this.idCuenta = idCuenta;
        this.cliente = cliente;
        this.estado = estado;

        if (saldo >= 0)
            this.#saldo = saldo;
        else
            throw new Error("El saldo no puede ser negativo");
    }


    get saldo() {
        return this.#saldo;
    }

    retirarDinero(monto) {
        if (monto > 0) {
            if (monto <= this.#saldo) {
                this.#saldo -= monto;
            }
            else
                throw new Error("El monto no puede ser mayor que el saldo actual");
        }
        else
            throw new Error("El monto a extraer debe ser mayor que 0");

    }
    ingresarDinero(monto) {
        if (monto > 0) {
            this.#saldo += monto;
        }
        else
            throw new Error("El monto a ingresar debe ser mayor que 0");

    }
}