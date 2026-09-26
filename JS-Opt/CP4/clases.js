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
    constructor(idCuenta, saldo, cliente, estado) {
        this.idCuenta = idCuenta;
        this.cliente = cliente;
        this.estado = estado;

        if (saldo >= 0)
            this._saldo = saldo;
        else
            throw new Error("El saldo no puede ser negativo");
    }

    get saldo() {
        return this._saldo;
    }

    retirarDinero(monto) {
        if (monto <= 0) {
            throw new Error("El monto a extraer debe ser mayor que 0");
        }
        if (monto > this._saldo) {
            throw new Error("El monto no puede ser mayor que el saldo actual");
        }
        this._saldo -= monto;
    }

    ingresarDinero(monto) {
        if (monto <= 0) {
            throw new Error("El monto a ingresar debe ser mayor que 0");
        }
        this._saldo += monto;
    }

    mostrarInfo() {
        console.log(`--- Cuenta ${this.idCuenta} (${this.constructor.name}) ---`);
        console.log(`  Saldo: ${this._saldo}`);
        console.log(`  Estado: ${this.estado}`);
        console.log(`  Cliente: ${this.cliente.nombre}`);
    }

    aplicarInteres() {

    }
}

export class CuentaAhorro extends Cuenta {
    #tasaInteres;
    #maxExtracciones;
    #extraccionesRealizadas;

    constructor(idCuenta, saldo, cliente, estado, tasaInteres, maxExtraccionesMensuales) {
        super(idCuenta, saldo, cliente, estado);
        this.#tasaInteres = tasaInteres;
        this.#maxExtracciones = maxExtraccionesMensuales;
        this.#extraccionesRealizadas = 0;
    }

    retirarDinero(monto) {
        if (this.#extraccionesRealizadas >= this.#maxExtracciones) {
            throw new Error(`Límite de extracciones mensuales alcanzado (${this.#maxExtracciones})`);
        }
        super.retirarDinero(monto);
        this.#extraccionesRealizadas++;
    }

    aplicarInteres() {
        const interes = this._saldo * (this.#tasaInteres / 100);
        if (interes > 0) {
            this.ingresarDinero(interes);
            console.log(`  Interés aplicado: +${interes.toFixed(2)} en cuenta ${this.idCuenta}`);
        }
    }

    reiniciarExtractionsMensuales() {
        this.#extraccionesRealizadas = 0;
        console.log(`  Contador de extracciones reiniciado para cuenta ${this.idCuenta}`);
    }

    mostrarInfo() {
        super.mostrarInfo();
        console.log(`  Tasa de interés: ${this.#tasaInteres}%`);
        console.log(`  Extracciones restantes este mes: ${this.#maxExtracciones - this.#extraccionesRealizadas}`);
    }
}

export class CuentaCorriente extends Cuenta {
    #limiteDescubierto;

    constructor(idCuenta, saldo, cliente, estado, limiteDescubierto) {
        super(idCuenta, saldo, cliente, estado);
        this.#limiteDescubierto = limiteDescubierto;
    }

    retirarDinero(monto) {
        if (monto <= 0) {
            throw new Error("El monto a extraer debe ser mayor que 0");
        }
        const nuevoSaldo = this._saldo - monto;
        if (nuevoSaldo < -this.#limiteDescubierto) {
            throw new Error(`Supera el límite de descubierto (${this.#limiteDescubierto})`);
        }
        this._saldo = nuevoSaldo;
    }

    mostrarInfo() {
        super.mostrarInfo();
        console.log(`  Límite de descubierto: ${this.#limiteDescubierto}`);
    }
}

// 3. Cuenta Premium
export class CuentaPremium extends Cuenta {
    #tasaInteres;

    constructor(idCuenta, saldo, cliente, estado, tasaInteres) {
        super(idCuenta, saldo, cliente, estado);
        this.#tasaInteres = tasaInteres;
    }

    retirarDinero(monto) {
        super.retirarDinero(monto);
    }

    aplicarInteres() {
        if (this._saldo > 0) {
            const interes = this._saldo * (this.#tasaInteres / 100);
            this.ingresarDinero(interes);
            console.log(`  Interés premium aplicado: +${interes.toFixed(2)} en cuenta ${this.idCuenta}`);
        } else {
            console.log(`  Saldo no positivo en cuenta ${this.idCuenta}, no se aplica interés.`);
        }
    }

    mostrarInfo() {
        super.mostrarInfo();
        console.log(`  Tasa de interés premium: ${this.#tasaInteres}%`);
    }
}