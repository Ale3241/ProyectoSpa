const modal = document.getElementById("modal");
const btnAgregar = document.getElementById("btn-agregar");
const closeBtn = document.querySelector(".close");
const form = document.getElementById("formPaquete");
const tbody = document.getElementById("paquetes-body");

let editId = null; 

// Abrir
btnAgregar.onclick = () => {
  editId = null;
  form.reset();
  modal.style.display = "block";
  document.querySelector(".modal-content h2").textContent = "Agregar Paquete";
};

// Cerrar 
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };
function cerrarModal() { modal.style.display = "none"; }

// Cargar paquetes
async function cargarPaquetes() {
  try {
    const res = await fetch("http://127.0.0.1:3000/api/paquetes");
    const paquetes = await res.json();
    tbody.innerHTML = paquetes.map((p, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${p.nombre}</td>
        <td>${p.descripcion}</td>
        <td>${p.duracion}</td>
        <td>
          <button class="editar" data-id="${p.id}">Editar</button>
          <button class="eliminar" data-id="${p.id}">Eliminar</button>
        </td>
      </tr>
    `).join("");


    document.querySelectorAll(".editar").forEach(btn => {
      btn.onclick = () => editarPaquete(btn.dataset.id);
    });
    document.querySelectorAll(".eliminar").forEach(btn => {
      btn.onclick = () => eliminarPaquete(btn.dataset.id);
    });

  } catch (err) {
    console.error("Error al cargar paquetes:", err);
  }
}

// Agregar o actualizar
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(form).entries());

  try {
    let res;
    if (editId) {
      // Editar
      res = await fetch(`http://127.0.0.1:3000/api/paquetes/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });
    } else {
      // Agregar
      res = await fetch("http://127.0.0.1:3000/api/paquetes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });
    }

    const data = await res.json();
    alert(data.message);
    cerrarModal();
    form.reset();
    cargarPaquetes();
  } catch (err) {
    console.error("Error al guardar paquete:", err);
    alert("Hubo un error al guardar el paquete");
  }
});

async function editarPaquete(id) {
  try {
    const res = await fetch(`http://127.0.0.1:3000/api/paquetes`);
    const paquetes = await res.json();
    const paquete = paquetes.find(p => p.id == id);
    if (!paquete) return alert("Paquete no encontrado");

    form.nombre.value = paquete.nombre;
    form.descripcion.value = paquete.descripcion;
    form.duracion.value = paquete.duracion;
    editId = id;
    document.querySelector(".modal-content h2").textContent = "Editar Paquete";
    modal.style.display = "block";

  } catch (err) {
    console.error("Error al cargar paquete:", err);
  }
}

// Eliminar
async function eliminarPaquete(id) {
  if (!confirm("¿Deseas eliminar este paquete?")) return;
  try {
    const res = await fetch(`http://127.0.0.1:3000/api/paquetes/${id}`, { method: "DELETE" });
    const data = await res.json();
    alert(data.message);
    cargarPaquetes();
  } catch (err) {
    console.error("Error al eliminar paquete:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => cargarPaquetes());
