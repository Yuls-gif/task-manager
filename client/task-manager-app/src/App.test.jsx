import React from "react";
import { describe, test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("Pruebas de la app", () => {

  test("Muestra el título Task Manager", () => {
    render(<App />);
    expect(screen.getByText(/Task Manager/i)).toBeInTheDocument();
  });

  test("Existe botón crear proyecto", () => {
    render(<App />);
    expect(
      screen.getByRole("button", { name: /\+ Crear nuevo proyecto/i })
    ).toBeInTheDocument();
  });

  test("Al hacer clic aparece formulario", () => {
    render(<App />);

    const btn = screen.getByRole("button", {
      name: /\+ Crear nuevo proyecto/i,
    });

    fireEvent.click(btn);

    expect(
      screen.getByPlaceholderText(/Nombre del proyecto/i)
    ).toBeInTheDocument();
  });

});dir