import { useMemo, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

export default function App() {
  const [projects, setProjects] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState("");
  // si editId != null, estamos editando
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

  function handleSubmit(e) {
    e.preventDefault();

    const name = projectName.trim();

    // validación
    if (!name) {
      setError("Escribe el nombre del proyecto.");
      return;
    }
    if (name.length < 3) {
      setError("Mínimo 3 letras.");
      return;
    }

    // evitar duplicados (excepto cuando editas el mismo)
    const exists = projects.some(
      (p) => p.name.toLowerCase() === name.toLowerCase() && p.id !== editId
    );
    if (exists) {
      setError("Ese proyecto ya existe. Cambia el nombre.");
      return;
    }

    // create / update (SEGURO)
    if (editId !== null) {
      setProjects((prev) =>
        prev.map((p) => (p.id === editId ? { ...p, name } : p))
      );
    } else {
      setProjects((prev) => [{ id: nextId, name }, ...prev]);
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
    // si borras el que estabas editando, cierra form
    if (editId === id) closeForm();
  }

  function cancelEditOnly() {
    // cancela edición, pero deja el form abierto para que puedas crear otro si quieres
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
            Bienvenida Yuli <span className="heartBlue">💙</span>
          </p>
        </div>
      </header>

      <section className="card">
        <h2>
          Proyectos <span style={{ opacity: 0.7 }}>({projects.length})</span>
        </h2>

        {!showForm ? (
          <button className="btn" onClick={openCreate} style={{ marginTop: "12px" }}>
            + Crear nuevo proyecto
          </button>
        ) : (
          <button className="btn" onClick={closeForm} style={{ marginTop: "12px" }}>
            Cancelar
          </button>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: "12px" }}>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Nombre del proyecto"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.06)",
                color: "inherit",
              }}
            />

            {error && (
              <p style={{ marginTop: "8px", color: "#ffb4b4" }}>{error}</p>
            )}

            <button className="btn" type="submit" style={{ marginTop: "10px" }}>
              {editId !== null ? "Guardar cambios" : "Guardar proyecto"}
            </button>

            {/*Botón extra para cancelar solo la edición */}
            {editId !== null && (
              <button
                type="button"
                className="btn"
                onClick={cancelEditOnly}
                style={{ marginTop: "10px", marginLeft: "10px" }}
              >
                Cancelar edición
              </button>
            )}
          </form>
        )}

        {projects.length === 0 ? (
          <p style={{ marginTop: "14px", opacity: 0.75 }}>
            Aún no tienes proyectos. Crea uno con el botón.
          </p>
        ) : (
          <ul className="list" style={{ marginTop: "12px" }}>
            {projects.map((p) => (
              <li key={p.id} style={{ marginBottom: "10px" }}>
                {p.name}

                <button
                  onClick={() => handleEdit(p)}
                  style={{
                    marginLeft: "10px",
                    padding: "4px 10px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "rgba(97,218,251,0.10)",
                    cursor: "pointer",
                    color: "inherit",
                  }}
                >
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(p.id)}
                  style={{
                    marginLeft: "8px",
                    padding: "4px 10px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "rgba(255,255,255,0.06)",
                    cursor: "pointer",
                    color: "inherit",
                  }}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}


