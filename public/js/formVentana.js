const modal = document.getElementById("modal");
const btnAgregar = document.getElementById("btn-agregar");
const closeBtn = document.querySelector(".close");
const form = document.getElementById("formEmpleado");
const tbody = document.getElementById("empleados-body");

let editarId = null;

// Abrir 
btnAgregar.onclick = () => {
  modal.style.display = "block";
  editarId = null;
  form.reset();
};

// Cerrar 
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if(e.target == modal) modal.style.display = "none"; };
function cerrarModal() { modal.style.display = "none"; }

// Cargar empleados
async function cargarEmpleados() {
  try {
    const res = await fetch("http://127.0.0.1:3000/api/empleados");
    const empleados = await res.json();
    tbody.innerHTML = empleados.map(emp => `
      <tr>
        <td>${emp.id}</td>
        <td>${emp.nombre}</td>
        <td>${emp.apellido}</td>
        <td>${emp.puesto}</td>
        <td>${emp.telefono}</td>
        <td>${emp.horario}</td>
        <td>${emp.jornada}</td>
        <td>
          <button class="btn-editar" data-id="${emp.id}">Editar</button>
          <button class="btn-eliminar" data-id="${emp.id}">Eliminar</button>
        </td>
      </tr>
    `).join("");
  } catch (err) {
    console.error(err);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(form).entries());

  try {
    let res;
    if (editarId) {
      // Editar
      res = await fetch(`http://127.0.0.1:3000/api/empleados/${editarId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });
    } else {
      // Agregar
      res = await fetch("http://127.0.0.1:3000/api/empleados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });
    }

    const data = await res.json();
    alert(data.message);
    cerrarModal();
    form.reset();
    cargarEmpleados();
  } catch (error) {
    console.error("Error:", error);
    alert("Hubo un error al guardar el empleado");
  }
});


tbody.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;

  if (e.target.classList.contains("btn-eliminar")) {
    if (confirm("¿Seguro que quieres eliminar este empleado?")) {
      try {
        const res = await fetch(`http://127.0.0.1:3000/api/empleados/${id}`, { method: "DELETE" });
        const data = await res.json();
        alert(data.message);
        cargarEmpleados();
      } catch (err) {
        console.error(err);
        alert("No se pudo eliminar el empleado");
      }
    }
  }

  if (e.target.classList.contains("btn-editar")) {
    // Llenar formulario
    const fila = e.target.closest("tr");
    const columnas = fila.children;
    form.nombre.value = columnas[1].textContent;
    form.apellido.value = columnas[2].textContent;
    form.puesto.value = columnas[3].textContent;
    form.telefono.value = columnas[4].textContent;
    form.horario.value = columnas[5].textContent;
    form.jornada.value = columnas[6].textContent;

    editarId = id; 
    modal.style.display = "block";
  }
});


document.addEventListener("DOMContentLoaded", () => cargarEmpleados());
