
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
    const producto = inventario.find(p => p.id === id);
    if (producto) {
        console.log("Producto encontrado:");
        console.log(producto);
    } else {
        console.log(`No existe producto con ID ${id}`);
    }
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

// Menú
function menu() {
    let opcion = 0;
    while (opcion !== 7) {
        console.log("\nBienvenido al programa de gestión de inventarios");
        console.log("1. Agregar nuevo producto");
        console.log("2. Ver catálogo de productos disponibles");
        console.log("3. Buscar producto por ID");
        console.log("4. Buscar productos por nombre");
        console.log("5. Calcular valor total del inventario");
        console.log("6. Ver productos que requieren reposición");
        console.log("7. Cerrar aplicación.");

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

menu();

