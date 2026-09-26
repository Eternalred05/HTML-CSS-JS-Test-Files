// Clase Practica 5
// 1. Agregar producto
function addNewProduct(prod) {
    let result = false;
    const existsId = inventario.some(p => p.id === prod.id);
    const existsName = inventario.some(p => p.nombre.toLowerCase() === prod.nombre.toLowerCase());
    const validPrice = prod.precio > 0;
    const validStock = prod.stock >= 0;

    if (existsId) {
        console.log(`Error: Ya existe un producto con el id ${prod.id}`);
    } else if (existsName) {
        console.log(`Error: Ya existe un producto con el nombre "${prod.nombre}"`);
    } else if (!validPrice) {
        console.log("Error: El precio debe ser mayor que cero");
    } else if (!validStock) {
        console.log("Error: El stock no puede ser negativo");
    } else {
        const newProd = { ...prod, activo: prod.activo !== undefined ? prod.activo : true };
        inventario = [...inventario, newProd];
        console.log(`Producto "${prod.nombre}" agregado correctamente.`);
        result = true;
    }
    return result;
}

// 2. Catálogo de disponibles
const availableCatalog = () => {
    return inventario
        .filter(p => p.activo && p.stock > 0)
        .map(p => ({ nombre: p.nombre, precio: `$${p.precio.toFixed(2)}` }));
};

// 3a. Búsqueda por ID
const searchPerID = (id) => {
    let found = false;  // Cambiado de const a let para poder modificar
    const producto = inventario.find(p => p.id === id);
    if (producto) {
        console.log("Producto encontrado:");
        console.log(producto);
        found = true;
    } else {
        console.log(`No existe producto con ID ${id}`);
    }
    return found;
};

// 3b. Búsqueda por nombre
const searchPerName = (texto) => {
    const textoLower = texto.toLowerCase();
    const resultados = inventario.filter(p => p.nombre.toLowerCase().includes(textoLower));
    if (resultados.length === 0) {
        console.log("No se encontraron productos.");
    } else {
        console.table(resultados);
    }
};

// 4. Valor total inventario 
const calcTotalValue = () => {
    return inventario
        .filter(p => p.activo)
        .reduce((acc, p) => acc + (p.precio * p.stock), 0);
};

// Función para pedir datos
function promptNewProduct() {
    console.log("\n--- Agregar nuevo producto ---");
    const id = parseInt(prompt("ID: "));
    const nombre = prompt("Nombre: ");
    const categoria = prompt("Categoría: ");
    const precio = parseFloat(prompt("Precio: "));
    const stock = parseInt(prompt("Stock: "));
    const activoInput = prompt("¿Activo? (s/n): ");
    const activo = (activoInput.toLowerCase() === 's');

    if (isNaN(id) || !nombre || isNaN(precio) || isNaN(stock)) {
        console.log("Error: Datos inválidos. El producto no se agregó.");
    } else {
        const newProd = { id, nombre, categoria: categoria || "Sin categoría", precio, stock, activo };
        addNewProduct(newProd);
    }
}

// 1. Registrar nueva venta 
function registrarVenta(nuevaVenta) {
    let resultado = false;
    // Validar id único
    const idExiste = ventas.some(v => v.id === nuevaVenta.id);
    if (idExiste) {
        console.log(`Error: Ya existe una venta con el id ${nuevaVenta.id}`);
        return resultado;
    }
    // Validar existencia de productos y stock suficiente
    let productosInvalidos = [];
    let stockInsuficiente = [];
    for (let item of nuevaVenta.productos) {
        const producto = inventario.find(p => p.id === item.productoId);
        if (!producto) {
            productosInvalidos.push(item.productoId);
        } else if (producto.stock < item.cantidad) {
            stockInsuficiente.push({ id: item.productoId, stock: producto.stock, solicitado: item.cantidad });
        }
    }
    if (productosInvalidos.length > 0) {
        console.log(`Error: Los siguientes productoId no existen: ${productosInvalidos.join(', ')}`);
    } else if (stockInsuficiente.length > 0) {
        console.log("Error: Stock insuficiente para:");
        stockInsuficiente.forEach(s => console.log(`  - Producto ID ${s.id}: stock=${s.stock}, solicitado=${s.solicitado}`));
    } else {

        let nuevoInventario = inventario.map(p => {
            const itemVenta = nuevaVenta.productos.find(v => v.productoId === p.id);
            if (itemVenta) {
                return { ...p, stock: p.stock - itemVenta.cantidad };
            }
            return p;
        });
        inventario = nuevoInventario;

        ventas = [...ventas, nuevaVenta];
        console.log(`Venta ID ${nuevaVenta.id} registrada correctamente. Stock actualizado.`);
        resultado = true;
    }
    return resultado;
}

// 2. Calcular monto total de cada venta
function ventasConMontoTotal() {
    const ventasConTotal = ventas.map(venta => {
        const monto = venta.productos.reduce((total, item) => {
            const producto = inventario.find(p => p.id === item.productoId);
            const precioUnitario = producto ? producto.precio : 0;
            return total + (item.cantidad * precioUnitario);
        }, 0);
        return { ...venta, montoTotal: monto };
    });
    return ventasConTotal;
}

// 3. Resumen de compras por cliente
function resumenPorCliente() {
    const ventasConMonto = ventasConMontoTotal();
    const resumen = ventasConMonto.reduce((acum, venta) => {
        const cliente = venta.cliente;
        if (!acum[cliente]) {
            acum[cliente] = {
                compras: 0,
                montoTotal: 0,
                promedio: 0,
                productos: []
            };
        }
        acum[cliente].compras += 1;
        acum[cliente].montoTotal += venta.montoTotal;
        // Agregar nombres de productos sin repetir
        venta.productos.forEach(item => {
            const producto = inventario.find(p => p.id === item.productoId);
            if (producto && !acum[cliente].productos.includes(producto.nombre)) {
                acum[cliente].productos.push(producto.nombre);
            }
        });
        acum[cliente].promedio = acum[cliente].montoTotal / acum[cliente].compras;
        return acum;
    }, {});
    return resumen;
}

// 4. Productos más vendidos
function productosMasVendidos() {
    const ventasConMonto = ventasConMontoTotal();
    const resumenProductos = ventasConMonto.reduce((acum, venta) => {
        venta.productos.forEach(item => {
            const producto = inventario.find(p => p.id === item.productoId);
            if (producto) {
                const nombre = producto.nombre;
                if (!acum[nombre]) {
                    acum[nombre] = { nombre, unidades: 0, ingresos: 0 };
                }
                acum[nombre].unidades += item.cantidad;
                acum[nombre].ingresos += item.cantidad * producto.precio;
            }
        });
        return acum;
    }, {});

    const listado = Object.values(resumenProductos);
    listado.sort((a, b) => b.unidades - a.unidades);
    return listado;
}

function todosProductosVendidos() {
    const idsVendidos = new Set();
    ventas.forEach(venta => {
        venta.productos.forEach(item => idsVendidos.add(item.productoId));
    });
    const todos = inventario.every(producto => idsVendidos.has(producto.id));
    return todos;
}

function clienteConMasDe2Productos() {
    const clienteProductos = {};
    ventas.forEach(venta => {
        if (!clienteProductos[venta.cliente]) {
            clienteProductos[venta.cliente] = new Set();
        }
        venta.productos.forEach(item => clienteProductos[venta.cliente].add(item.productoId));
    });
    const resultado = Object.values(clienteProductos).some(set => set.size > 2);
    return resultado;
}

function mostrarResumenClientes() {
    const resumen = resumenPorCliente();
    console.log("\n=== Resumen por cliente ===");
    for (let [cliente, datos] of Object.entries(resumen)) {
        console.log(`\nCliente: ${cliente}`);
        console.log(`  Compras: ${datos.compras}`);
        console.log(`  Monto total: $${datos.montoTotal.toFixed(2)}`);
        console.log(`  Promedio: $${datos.promedio.toFixed(2)}`);
        console.log(`  Productos: ${datos.productos.join(", ")}`);
    }
}

function mostrarProductosMasVendidos() {
    const listado = productosMasVendidos();
    console.log("\n=== Productos más vendidos ===");
    if (listado.length === 0) {
        console.log("No se ha vendido ningún producto aún.");
    } else {
        console.table(listado);
    }
}

function mostrarValidaciones() {
    const todos = todosProductosVendidos();
    const clienteMas2 = clienteConMasDe2Productos();
    console.log("\n=== Validaciones cruzadas ===");
    console.log(`¿Se han vendido todos los productos del inventario al menos una vez? ${todos ? "Sí" : "No"}`);
    console.log(`¿Existe algún cliente con más de 2 productos diferentes? ${clienteMas2 ? "Sí" : "No"}`);
}

function promptRegistrarVenta() {
    console.log("\n--- Registrar nueva venta ---");
    const id = parseInt(prompt("ID de venta: "));
    const cliente = prompt("Nombre del cliente: ");
    const fecha = prompt("Fecha (YYYY-MM-DD): ");
    console.log("Ingrese los productos siguiendo la indicacion (productoId,cantidad). Escriba 'fin' sin ningun producto cuando termine:");
    const productos = [];
    while (true) {
        const entrada = prompt("productoId,cantidad: ");
        if (entrada.toLowerCase() === 'fin') break;
        const [prodId, cant] = entrada.split(',').map(s => parseInt(s.trim()));
        if (!isNaN(prodId) && !isNaN(cant) && cant > 0) {
            productos.push({ productoId: prodId, cantidad: cant });
        } else {
            console.log("Formato inválido. Use: id,cantidad (ej. 2,5)");
        }
    }
    if (productos.length === 0) {
        console.log("No se ingresaron productos. Venta cancelada.");
        return;
    }
    const nuevaVenta = { id, cliente, fecha, productos };
    registrarVenta(nuevaVenta);
}

// CP6

// Menú
function menu() {
    let opcion = 0;
    while (opcion !== 12) {
        console.log("\nBienvenido al programa de gestión de inventarios y ventas");
        console.log("1. Agregar nuevo producto");
        console.log("2. Ver catálogo de productos disponibles");
        console.log("3. Buscar producto por ID");
        console.log("4. Buscar productos por nombre");
        console.log("5. Calcular valor total del inventario");
        console.log("6. Ver productos que requieren reposición");
        console.log("7. Registrar nueva venta");
        console.log("8. Ver ventas con monto total");
        console.log("9. Resumen de compras por cliente");
        console.log("10. Productos más vendidos");
        console.log("11. Validaciones cruzadas");
        console.log("12. Cerrar aplicación");

        const choose = prompt("Escoja una opción: ");
        opcion = parseInt(choose);
        switch (opcion) {
            case 1:
                console.clear();
                promptNewProduct();
                break;
            case 2:
                console.clear();
                console.table(availableCatalog());
                break;
            case 3:
                console.clear();
                const id = parseInt(prompt("Ingrese el id que desea buscar: "));
                searchPerID(id);
                break;
            case 4:
                console.clear();
                const name = prompt("Ingrese el nombre a buscar: ");
                searchPerName(name);
                break;
            case 5:
                console.clear();
                console.log(`El valor total del inventario es de $${calcTotalValue().toFixed(2)}`);
                break;
            case 6:
                console.clear();
                const reposicion = inventario
                    .filter(p => p.activo && p.stock === 0)
                    .map(p => p.nombre);
                if (reposicion.length === 0) {
                    console.log("No hay productos activos con stock cero.");
                } else {
                    console.log("Productos que requieren reposición:");
                    console.log(reposicion.join(", "));
                }
                break;
            case 7:
                console.clear();
                promptRegistrarVenta();
                break;
            case 8:
                console.clear();
                const listaConMonto = ventasConMontoTotal();
                if (listaConMonto.length === 0) {
                    console.log("No hay ventas registradas.");
                } else {
                    console.log("\n=== VENTAS CON MONTO TOTAL ===\n");
                    listaConMonto.forEach(venta => {
                        console.log(`ID: ${venta.id} | Cliente: ${venta.cliente} | Fecha: ${venta.fecha}`);
                        console.log(`  Productos:`);
                        venta.productos.forEach(p => {
                            const prod = inventario.find(pr => pr.id === p.productoId);
                            const nombreProd = prod ? prod.nombre : `Producto ${p.productoId} (no existe)`;
                            console.log(`    - ${nombreProd} (x${p.cantidad})`);
                        });
                        console.log(`Monto total: $${venta.montoTotal.toFixed(2)}`);
                        console.log("---");
                    });
                }
                break;
            case 9:
                console.clear();
                mostrarResumenClientes();
                break;
            case 10:
                console.clear();
                mostrarProductosMasVendidos();
                break;
            case 11:
                console.clear();
                mostrarValidaciones();
                break;
            case 12:
                console.clear();
                console.log("Usted ha terminado la aplicación.");
                break;
            default:
                console.clear();
                console.log("Opción no válida.");
        }
    }
}

const prompt = require('prompt-sync')();

let inventario = [
    { id: 1, nombre: "Laptop HP 15", categoria: "Portátiles", precio: 850, stock: 12, activo: true },
    { id: 2, nombre: "Mouse Logitech MX", categoria: "Periféricos", precio: 45, stock: 200, activo: true },
    { id: 3, nombre: "Monitor Samsung 27", categoria: "Monitores", precio: 320, stock: 0, activo: true },
    { id: 4, nombre: "Teclado Mecánico RGB", categoria: "Periféricos", precio: 75, stock: 85, activo: true },
    { id: 5, nombre: "Impresora Canon", categoria: "Impresión", precio: 190, stock: 30, activo: false },
    { id: 6, nombre: "Cable HDMI 2m", categoria: "Accesorios", precio: 12, stock: 500, activo: true },
    { id: 7, nombre: "Webcam HD 1080p", categoria: "Periféricos", precio: 55, stock: 0, activo: false },
    { id: 8, nombre: "SSD Kingston 1TB", categoria: "Almacenamiento", precio: 95, stock: 45, activo: true },
    { id: 9, nombre: "MacBook Air M2", categoria: "Portátiles", precio: 1200, stock: 8, activo: true },
    { id: 10, nombre: "Auriculares Sony", categoria: "Periféricos", precio: 150, stock: 60, activo: true }
];

let ventas = [   // Se ha cambiado a let para poder añadir nuevas ventas
    {
        id: 1, cliente: "Carlos Pérez", fecha: "2024-01-15",
        productos: [
            { productoId: 1, cantidad: 1 },
            { productoId: 2, cantidad: 2 }
        ]
    },
    {
        id: 2, cliente: "Ana García", fecha: "2024-01-22",
        productos: [
            { productoId: 3, cantidad: 1 }
        ]
    },
    {
        id: 3, cliente: "Carlos Pérez", fecha: "2024-02-05",
        productos: [
            { productoId: 4, cantidad: 1 },
            { productoId: 10, cantidad: 1 }
        ]
    },
    {
        id: 4, cliente: "María López", fecha: "2024-02-18",
        productos: [
            { productoId: 8, cantidad: 2 },
            { productoId: 6, cantidad: 3 }
        ]
    },
    {
        id: 5, cliente: "Ana García", fecha: "2024-03-01",
        productos: [
            { productoId: 9, cantidad: 1 }
        ]
    },
    {
        id: 6, cliente: "Luis Rodríguez", fecha: "2024-03-10",
        productos: [
            { productoId: 2, cantidad: 1 },
            { productoId: 4, cantidad: 1 },
            { productoId: 6, cantidad: 5 }
        ]
    }
];

menu();