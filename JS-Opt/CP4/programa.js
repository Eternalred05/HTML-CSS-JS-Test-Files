import { Cliente, CuentaAhorro, CuentaCorriente, CuentaPremium } from './clases.js';

function mostrarInfoYAplicarInteres(cuentas) {
    console.log("\n=== PROCESANDO CUENTAS ===");
    for (const cuenta of cuentas) {
        cuenta.mostrarInfo();
        cuenta.aplicarInteres();
        console.log("------------------------");
    }
}

function realizarExtraccionEnTodas(cuentas, monto) {
    console.log(`\n=== INTENTANDO EXTRACCIÓN DE ${monto} EN TODAS LAS CUENTAS ===`);
    for (const cuenta of cuentas) {
        try {
            cuenta.retirarDinero(monto);
            console.log(`✅ Éxito: Cuenta ${cuenta.idCuenta} - Nuevo saldo: ${cuenta.saldo}`);
        } catch (error) {
            console.log(`❌ Error en cuenta ${cuenta.idCuenta}: ${error.message}`);
        }
    }
}
function calcularSaldoTotal(cuentas) {
    const total = cuentas.reduce((sum, cuenta) => sum + cuenta.saldo, 0);
    console.log(`\n El Saldo total acumulado es de: ${total.toFixed(2)}`);
    return total;
}

const cliente1 = new Cliente(1, "Juan Carlos Gomez Pita", "05091568088", "010101@gmail.com");
cliente1.mostrarInfo();


const cuentaAhorro = new CuentaAhorro(101, 1000, cliente1, "Activa", 2, 3);   // 2% de interes, 3 extracciones al mes
const cuentaCorriente = new CuentaCorriente(102, 500, cliente1, "Activa", 200); // descubierto 200
const cuentaPremium = new CuentaPremium(103, 2000, cliente1, "Activa", 5);      // 5% interes

const listaCuentas = [cuentaAhorro, cuentaCorriente, cuentaPremium];

mostrarInfoYAplicarInteres(listaCuentas);


realizarExtraccionEnTodas(listaCuentas, 300);

console.log("\n--- Saldos después de extracciones ---");
listaCuentas.forEach(c => console.log(`Cuenta ${c.idCuenta}: ${c.saldo}`));

mostrarInfoYAplicarInteres(listaCuentas);


calcularSaldoTotal(listaCuentas);

console.log("\n--- Probando límite de extracciones en CuentaAhorro ---");
try {
    cuentaAhorro.retirarDinero(100);
    cuentaAhorro.retirarDinero(100);
    cuentaAhorro.retirarDinero(100); // Aca deberia dar una excepcion
} catch (error) {
    console.log(`Error esperado: ${error.message}`);
}
cuentaAhorro.reiniciarExtractionsMensuales();
console.log("Después de reiniciar, se puede extraer nuevamente");
cuentaAhorro.retirarDinero(50);
console.log(`Nuevo saldo CuentaAhorro: ${cuentaAhorro.saldo}`);