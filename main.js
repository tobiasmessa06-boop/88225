const productos = [
    { id: 1, nombre: "The Legend of Zelda: Breath of the Wild", precio: 45000 },
    { id: 2, nombre: "Elden Ring", precio: 52000 },
    { id: 3, nombre: "God of War Ragnarök", precio: 49000 },
    { id: 4, nombre: "Minecraft", precio: 15000 },
    { id: 5, nombre: "Hollow Knight", precio: 9000 }
];

const listaProductos = document.querySelector("#listaProductos");
const contCarrito = document.querySelector("#carrito");
const totalTexto = document.querySelector("#total");
const btnVaciar = document.querySelector("#vaciar");

let carrito = [];

const guardado = localStorage.getItem("carrito");
if (guardado) {
    carrito = JSON.parse(guardado);
    mostrarCarrito();
}

function mostrarProductos() {
    listaProductos.innerHTML = "";

    productos.forEach(prod => {
        let item = document.createElement("div");
        item.innerHTML = `
            <p>${prod.nombre}</p>
            <p>Precio: $${prod.precio}</p>
            <button data-id="${prod.id}">Agregar</button>
        `;
        listaProductos.appendChild(item);
    });
}

mostrarProductos();

listaProductos.addEventListener("click", function(e) {
    if (e.target.tagName === "BUTTON") {
        let id = Number(e.target.dataset.id);
        agregarAlCarrito(id);
    }
});

function agregarAlCarrito(id) {
    let existe = carrito.find(item => item.id === id);

    if (existe) {
        existe.cantidad++;
    } else {
        let prod = productos.find(p => p.id === id);
        carrito.push({ ...prod, cantidad: 1 });
    }

    actualizar();
}

function mostrarCarrito() {
    contCarrito.innerHTML = "";
    let total = 0;

    carrito.forEach(item => {
        total += item.precio * item.cantidad;

        let fila = document.createElement("div");
        fila.innerHTML = `
            <p>${item.nombre} x${item.cantidad}</p>
            <button data-rem="${item.id}">Eliminar</button>
        `;
        contCarrito.appendChild(fila);
    });

    totalTexto.textContent = "Total: $" + total;
}

contCarrito.addEventListener("click", function(e) {
    if (e.target.tagName === "BUTTON") {
        let id = Number(e.target.dataset.rem);
        carrito = carrito.filter(i => i.id !== id);
        actualizar();
    }
});

btnVaciar.addEventListener("click", function() {
    carrito = [];
    actualizar();
});

function actualizar() {
    mostrarCarrito();
    localStorage.setItem("carrito", JSON.stringify(carrito));
}