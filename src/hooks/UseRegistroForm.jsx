import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrarUsuario } from "../services/registro";
import { mapFirebaseError } from "../utils/firebaseErrors";

/**
 * Hook compartido para los formularios de registro.
 *
 * @param {object} initialValues - valores iniciales del formulario,
 *   incluyendo email, password, confirmPassword y los campos propios
 *   de cada rol (ej. nombreArtesano, especialidad...).
 * @param {string} rutaExito - a dónde navegar si el registro sale bien
 *   (ej. "/home" para turista, "/pendiente-aprobacion" para los demás).
 */
export function useRegistroForm({ initialValues, rutaExito }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialValues);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validarCredenciales = () => {
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return false;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }
    return true;
  };

  /**
   * @param {object} datosPerfil - role, actorType, estadoVerificacion y
   *   los campos específicos ya armados a partir de `form` (cada
   *   componente decide qué campos de `form` enviar y cómo transformarlos,
   *   ej. dividir idiomasQueDomina por coma).
   */
  const registrar = async (datosPerfil) => {
    setError("");
    if (!validarCredenciales()) return;

    try {
      setCargando(true);
      await registrarUsuario(form.email, form.password, datosPerfil);
      navigate(rutaExito);
    } catch (err) {
      setError(mapFirebaseError(err.code));
    } finally {
      setCargando(false);
    }
  };

  return {
    form,
    setForm,
    handleChange,
    mostrarPassword,
    setMostrarPassword,
    mostrarConfirmPassword,
    setMostrarConfirmPassword,
    error,
    cargando,
    registrar,
  };
}