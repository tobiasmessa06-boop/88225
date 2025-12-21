import { formatPrecio } from './utils.js';

let carrito = [];

// =============================
// Storage
// =============================
function guardarStorage() {
  localStorage.setItem("pgp_carrito", JSON.stringify(carrito));
}

function cargarStorage() {
  carrito = JSON.parse(localStorage.getItem("pgp_carrito") || "[]");
}

function actualizarContador() {
  const span = document.getElementById("contador-carrito");
  if (span) span.textContent = carrito.reduce((a, b) => a + b.cantidad, 0);
}

// =============================
// Carrito
// =============================
function agregarAlCarrito(juego) {
  const item = carrito.find(p => p.id === juego.id);
  if (item) {
    item.cantidad++;
  } else {
    carrito.push({ ...juego, cantidad: 1 });
  }
  guardarStorage();
  actualizarContador();

  Swal.fire({
    toast: true,
    icon: "success",
    position: "top-end",
    title: juego.nombre + " agregado",
    showConfirmButton: false,
    timer: 1500
  });
}

function eliminarItem(id) {
  carrito = carrito
    .map(i => i.id === id ? { ...i, cantidad: i.cantidad - 1 } : i)
    .filter(i => i.cantidad > 0);

  guardarStorage();
}

function vaciarCarrito() {
  carrito = [];
  guardarStorage();
}

function calcularTotal() {
  return carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
}

function renderCatalogo(productos) {
  const cont = document.getElementById("contenedor-productos");
  if (!cont) return;

  cont.innerHTML = "";

  productos.forEach(juego => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${juego.imagen}">
      <h3>${juego.nombre}</h3>
      <p>${juego.categoria}</p>
      <p>$${formatPrecio(juego.precio)}</p>
      <button class="btn add">Agregar</button>
    `;

    div.querySelector(".add").onclick = () => agregarAlCarrito(juego);

    cont.appendChild(div);
  });
}

export function renderCarritoUI() {
  const vacio = document.getElementById("carrito-vacio");
  const cont = document.getElementById("carrito-contenedor");
  const lista = document.getElementById("lista-carrito");
  const total = document.getElementById("carrito-total");

  if (!lista) return;

  if (carrito.length === 0) {
    vacio.classList.remove("hidden");
    cont.classList.add("hidden");
    return;
  }

  vacio.classList.add("hidden");
  cont.classList.remove("hidden");
  lista.innerHTML = "";

  carrito.forEach(item => {
    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <p>${item.nombre} x${item.cantidad}</p>
      <p>$${formatPrecio(item.precio * item.cantidad)}</p>
      <button class="btn remove">Eliminar</button>
    `;

    div.querySelector(".remove").onclick = () => {
      eliminarItem(item.id);
      renderCarritoUI();
    };

    lista.appendChild(div);
  });

  total.textContent = "$" + formatPrecio(calcularTotal());
}

async function init() {
  cargarStorage();
  actualizarContador();

  const res = await fetch("../data/productos.json");
  const productos = await res.json();

  if (location.pathname.includes("index")) {
    renderCatalogo(productos);
  }

  if (location.pathname.includes("carrito")) {
    renderCarritoUI();

    document.getElementById("vaciar-carrito").onclick = () => {
      vaciarCarrito();
      renderCarritoUI();
    };

    document.getElementById("comprar").onclick = () => {
      Swal.fire("Compra realizada", "Gracias por tu compra", "success");
      vaciarCarrito();
      renderCarritoUI();
    };
  }
}

init();
