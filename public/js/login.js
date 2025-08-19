document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("error-message");

    try {
        // Traemos todos los empleados
        const res = await fetch("http://127.0.0.1:3000/api/empleados");
        const empleados = await res.json();

        // Buscamos el recepcionista con el usuario y contraseña correctos
        const recepcionista = empleados.find(emp =>
            emp.usuario === username &&
            emp.pass === password &&
            emp.puesto === "Recepcionista"
        );

        if (recepcionista) {
            // Redirige si todo coincide
            window.location.href = "inicio.html";
        } else {
            errorMsg.textContent = "Usuario o contraseña incorrectos, o no es recepcionista";
        }
    } catch (err) {
        console.error(err);
        errorMsg.textContent = "Hubo un error al conectarse al servidor";
    }
});
