const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Conexión a la BD
const dbPath = path.join(__dirname, "sql", "Spa.db");
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) console.error("Error al conectar a la BD:", err.message);
  else console.log("Conectado a Spa.db ✅");
});

/* =====================
   EMPLEADOS
===================== */

// POST – Agregar empleado
app.post("/api/empleados", (req, res) => {
  const { nombre, apellido, puesto, telefono, horario, jornada, status, usuario, pass } = req.body;
  if (!nombre || !apellido || !puesto || !telefono || !horario || !jornada || !status || !usuario || !pass)
    return res.status(400).json({ error: "Todos los campos son obligatorios" });

  const statusDB = (status === "Activo") ? 1 : 0;
  const sql = `INSERT INTO empleados (nombre, apellido, puesto, telefono, horario, jornada, status, usuario, pass) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [nombre, apellido, puesto, telefono, horario, jornada, statusDB, usuario, pass], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Empleado agregado con éxito ✅", id: this.lastID });
  });
});

// GET – Obtener empleados
app.get("/api/empleados", (req, res) => {
  db.all(`SELECT id, nombre, apellido, puesto, telefono, horario, jornada, status, usuario, pass FROM empleados`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// PUT – Editar empleado
app.put("/api/empleados/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, puesto, telefono, horario, jornada, status, usuario, pass } = req.body;
  const statusDB = (status === "Activo") ? 1 : 0;

  const sql = `
    UPDATE empleados
    SET nombre=?, apellido=?, puesto=?, telefono=?, horario=?, jornada=?, status=?, usuario=?, pass=?
    WHERE id=?
  `;
  db.run(sql, [nombre, apellido, puesto, telefono, horario, jornada, statusDB, usuario, pass, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Empleado actualizado ✅" });
  });
});

// DELETE – Eliminar empleado
app.delete("/api/empleados/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM empleados WHERE id=?`, [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Empleado eliminado ✅" });
  });
});

/* =====================
   CITAS
===================== */

// POST – Agregar cita
app.post("/api/citas", (req, res) => {
  const { cliente, contacto, masajista, paquete, hora, fecha, status } = req.body;
  if (!cliente || !contacto || !masajista || !paquete || !hora || !fecha || !status)
    return res.status(400).json({ error: "Todos los campos son obligatorios" });

  const sql = `INSERT INTO citas (cliente, contacto, masajista, paquete, hora, fecha, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [cliente, contacto, masajista, paquete, hora, fecha, status], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Cita agregada con éxito ✅", id: this.lastID });
  });
});

// GET – Obtener citas
app.get("/api/citas", (req, res) => {
  db.all(`SELECT * FROM citas`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// PUT – Editar cita
app.put("/api/citas/:id", (req, res) => {
  const { id } = req.params;
  const { cliente, contacto, masajista, paquete, hora, fecha, status } = req.body;
  const sql = `
    UPDATE citas
    SET cliente=?, contacto=?, masajista=?, paquete=?, hora=?, fecha=?, status=?
    WHERE id=?
  `;
  db.run(sql, [cliente, contacto, masajista, paquete, hora, fecha, status, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Cita actualizada ✅" });
  });
});

// DELETE – Cancelar cita
app.delete("/api/citas/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM citas WHERE id=?`, [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Cita cancelada ✅" });
  });
});

/* =====================
   PAQUETES
===================== */

// POST – Agregar paquete
app.post("/api/paquetes", (req, res) => {
  const { nombre, descripcion, duracion } = req.body;
  if (!nombre || !descripcion || !duracion) return res.status(400).json({ error: "Todos los campos son obligatorios" });

  db.run(`INSERT INTO paquetes (nombre, descripcion, duracion) VALUES (?, ?, ?)`, [nombre, descripcion, duracion], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Paquete agregado con éxito ✅", id: this.lastID });
  });
});

// GET – Obtener paquetes
app.get("/api/paquetes", (req, res) => {
  db.all(`SELECT * FROM paquetes`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// PUT – Editar paquete
app.put("/api/paquetes/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, duracion } = req.body;
  const sql = `UPDATE paquetes SET nombre=?, descripcion=?, duracion=? WHERE id=?`;
  db.run(sql, [nombre, descripcion, duracion, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Paquete actualizado ✅" });
  });
});

// DELETE – Eliminar paquete
app.delete("/api/paquetes/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM paquetes WHERE id=?`, [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Paquete eliminado ✅" });
  });
});

/* =====================
   LEVANTAR SERVIDOR
===================== */
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://127.0.0.1:${PORT}`);
});
