import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { AlertCircle, Check } from "lucide-react";

interface SignUpProps {
  onBack: () => void;
}

export function SignUp({ onBack }: SignUpProps) {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) newErrors.nombre = "Nombre requerido";
    if (!formData.apellido.trim()) newErrors.apellido = "Apellido requerido";
    if (!formData.email.includes("@")) newErrors.email = "Email inválido";
    if (!/^\+?[\d\s\-()]{10,}$/.test(formData.telefono))
      newErrors.telefono = "Teléfono inválido";
    if (formData.password.length < 6) newErrors.password = "Mínimo 6 caracteres";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Las contraseñas no coinciden";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newClient = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
    };

    signup(formData.email, formData.password, newClient);
    setSuccess(true);
    setTimeout(() => onBack(), 2000);
  };

  if (success) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
        <div className="card border-success p-5 text-center" style={{ maxWidth: "400px" }}>
          <Check className="text-success mb-3" size={48} />
          <h3 className="card-title text-success mb-3">¡Cuenta creada!</h3>
          <p className="text-muted">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div className="card p-4" style={{ maxWidth: "450px", width: "100%" }}>
        <h2 className="card-title mb-4 text-center">Crear Cuenta Cliente</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre *</label>
            <input
              type="text"
              className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Tu nombre"
            />
            {errors.nombre && <div className="invalid-feedback d-block">{errors.nombre}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Apellido *</label>
            <input
              type="text"
              className={`form-control ${errors.apellido ? "is-invalid" : ""}`}
              value={formData.apellido}
              onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              placeholder="Tu apellido"
            />
            {errors.apellido && <div className="invalid-feedback d-block">{errors.apellido}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="tu@email.com"
            />
            {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Teléfono *</label>
            <input
              type="tel"
              className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
            {errors.telefono && <div className="invalid-feedback d-block">{errors.telefono}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña *</label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Mínimo 6 caracteres"
            />
            {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label">Confirmar Contraseña *</label>
            <input
              type="password"
              className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirma tu contraseña"
            />
            {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            disabled={Object.keys(errors).length > 0 && Object.keys(formData).some(k => formData[k as keyof typeof formData])}
          >
            Crear Cuenta
          </button>

          <button
            type="button"
            onClick={onBack}
            className="btn btn-secondary w-100"
          >
            Volver al Login
          </button>
        </form>
      </div>
    </div>
  );
}
