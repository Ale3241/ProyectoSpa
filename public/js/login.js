document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("error-message");

    try {
        const res = await fetch("http://127.0.0.1:3000/api/empleados");
        const empleados = await res.json();

        const recepcionista = empleados.find(emp =>
            emp.usuario === username &&
            emp.pass === password &&
            emp.puesto === "Recepcionista"
        );

        if (recepcionista) {
            window.location.href = "inicio.html";
        } else {
            errorMsg.textContent = "Usuario o contraseña incorrectos, o no es recepcionista";
        }
    } catch (err) {
        console.error(err);
        errorMsg.textContent = "Hubo un error al conectarse al servidor";
    }
});
