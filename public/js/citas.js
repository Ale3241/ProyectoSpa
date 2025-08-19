const modal = document.getElementById("modal");
const btnAgregar = document.getElementById("btn-agregar");
const closeBtn = document.querySelector(".close");
const form = document.getElementById("formCita");
const tbody = document.getElementById("citas-body");

let editarId = null; // Para saber si estamos editando

// Abrir modal
btnAgregar.onclick = () => {
  modal.style.display = "block";
  editarId = null;
  form.reset();
};

// Cerrar modal
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if(e.target == modal) modal.style.display = "none"; };
function cerrarModal() { modal.style.display = "none"; }

// Cargar citas
async function cargarCitas() {
  try {
    const res = await fetch("http://127.0.0.1:3000/api/citas");
    const citas = await res.json();
    tbody.innerHTML = citas.map(cita => `
      <tr>
        <td>${cita.id}</td>
        <td>${cita.cliente}</td>
        <td>${cita.contacto}</td>
        <td>${cita.masajista}</td>
        <td>${cita.paquete}</td>
        <td>${cita.hora}</td>
        <td>${cita.fecha}</td>
        <td>${cita.status}</td>
        <td>
          <button class="btn-editar" data-id="${cita.id}">Editar</button>
          <button class="btn-eliminar" data-id="${cita.id}">Cancelar</button>
        </td>
      </tr>
    `).join("");
  } catch (err) {
    console.error(err);
  }
}

// Submit del formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(form).entries());

  try {
    let res;
    if (editarId) {
      // Editar cita
      res = await fetch(`http://127.0.0.1:3000/api/citas/${editarId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });
    } else {
      // Agregar cita
      res = await fetch("http://127.0.0.1:3000/api/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });
    }

    const data = await res.json();
    alert(data.message);
    cerrarModal();
    form.reset();
    cargarCitas();
  } catch (error) {
    console.error("Error:", error);
    alert("Hubo un error al guardar la cita");
  }
});

// Delegación de eventos para Editar y Eliminar
tbody.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;

  if (e.target.classList.contains("btn-eliminar")) {
    if (confirm("¿Seguro que quieres cancelar esta cita?")) {
      try {
        const res = await fetch(`http://127.0.0.1:3000/api/citas/${id}`, { method: "DELETE" });
        const data = await res.json();
        alert(data.message);
        cargarCitas();
      } catch (err) {
        console.error(err);
        alert("No se pudo cancelar la cita");
      }
    }
  }

  if (e.target.classList.contains("btn-editar")) {
    const fila = e.target.closest("tr");
    const columnas = fila.children;

    form.cliente.value = columnas[1].textContent;
    form.contacto.value = columnas[2].textContent;
    form.masajista.value = columnas[3].textContent;
    form.paquete.value = columnas[4].textContent;
    form.hora.value = columnas[5].textContent;
    form.fecha.value = columnas[6].textContent;
    form.status.value = columnas[7].textContent;

    editarId = id;
    modal.style.display = "block";
  }
});

// Inicializar tabla al cargar la página
document.addEventListener("DOMContentLoaded", () => cargarCitas());
