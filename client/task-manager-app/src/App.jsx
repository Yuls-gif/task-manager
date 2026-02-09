import { useMemo, useState } from "react";
import { io } from "socket.io-client";
import reactLogo from "./assets/react.svg";
import "./App.css";

const socket = io("http://localhost:5000", {
  transports: ["websocket"]
});


socket.on("notification", (msg) => {
  alert("Notificación en tiempo real: " + msg);
});

export default function App() {
  const [projects, setProjects] = useState([]);
  socket.on("notification", (msg) => {
  alert("Notificación en tiempo real: " + msg);
});


  const [showForm, setShowForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);

  const nextId = useMemo(() => {
    const max = projects.reduce((acc, p) => Math.max(acc, p.id), 0);
    return max + 1;
  }, [projects]);

  function openCreate() {
    setShowForm(true);
    setEditId(null);
    setProjectName("");
    setError("");
  }

  function closeForm() {
    setShowForm(false);
    setEditId(null);
    setProjectName("");
    setError("");
  }

  async function enviarNotificacion(nombre) {
    await fetch("http://localhost:5000/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Nuevo proyecto creado: " + nombre,
      }),
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const name = projectName.trim();

    if (!name) {
      setError("Escribe el nombre del proyecto.");
      return;
    }
    if (name.length < 3) {
      setError("Mínimo 3 letras.");
      return;
    }

    const exists = projects.some(
      (p) => p.name.toLowerCase() === name.toLowerCase() && p.id !== editId
    );
    if (exists) {
      setError("Ese proyecto ya existe. Cambia el nombre.");
      return;
    }

    if (editId !== null) {
      setProjects((prev) =>
        prev.map((p) => (p.id === editId ? { ...p, name } : p))
      );
    } else {
      setProjects((prev) => [{ id: nextId, name }, ...prev]);

      // NOTIFICACIÓN EN TIEMPO REAL
      enviarNotificacion(name);
    }

    closeForm();
  }

  function handleEdit(p) {
    setShowForm(true);
    setEditId(p.id);
    setProjectName(p.name);
    setError("");
  }

  function handleDelete(id) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (editId === id) closeForm();
  }

  function cancelEditOnly() {
    setEditId(null);
    setProjectName("");
    setError("");
  }

  return (
    <div className="page">
      <header className="header">
        <div className="logoWrap">
          <img src={reactLogo} className="logoSpin" alt="React logo" />
        </div>

        <div className="titles">
          <h1 className="titleWave">Task Manager</h1>
          <p className="subtitle subtitleWave">
            Bienvenida Yuli 💙
          </p>
        </div>
      </header>

      <section className="card">
        <h2>
          Proyectos ({projects.length})
        </h2>

        {!showForm ? (
          <button className="btn" onClick={openCreate}>
            + Crear nuevo proyecto
          </button>
        ) : (
          <button className="btn" onClick={closeForm}>
            Cancelar
          </button>
        )}

        {showForm && (
          <form onSubmit={handleSubmit}>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Nombre del proyecto"
            />

            {error && <p>{error}</p>}

            <button className="btn" type="submit">
              {editId !== null ? "Guardar cambios" : "Guardar proyecto"}
            </button>

            {editId !== null && (
              <button type="button" className="btn" onClick={cancelEditOnly}>
                Cancelar edición
              </button>
            )}
          </form>
        )}

        {projects.length === 0 ? (
          <p>Aún no tienes proyectos.</p>
        ) : (
          <ul>
            {projects.map((p) => (
              <li key={p.id}>
                {p.name}

                <button onClick={() => handleEdit(p)}>Editar</button>

                <button onClick={() => handleDelete(p.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}


