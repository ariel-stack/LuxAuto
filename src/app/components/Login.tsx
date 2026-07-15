import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { SignUp } from "./SignUp";
import Spinner from "./ui/Spinner";

const DEMO_PASSWORD = "cliente123";

const DEMO_ACCOUNTS = [
  {
    label: "Admin",
    email: "admin@luxauto.com",
    description: "Acceso completo al sistema",
  },
  {
    label: "Roberto Martínez",
    email: "roberto.martinez@email.com",
    description: "Portal de cliente VIP",
  },
  {
    label: "Javier López",
    email: "javier.lopez@email.com",
    description: "Portal de cliente VIP",
  },
];

export function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const { loading, setLoading } = useData();
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    if (!result.ok) setError(result.error ?? "Error al iniciar sesión.");
    setLoading(false);
  };

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(DEMO_PASSWORD);
    setError("");
  };

  if (showSignUp) {
    return <SignUp onBack={() => setShowSignUp(false)} />;
  }

  return (
    <div className="d-flex vh-100 bg-[#0A0A0C]">
      {/* Left panel */}
      <div
        className="d-none d-lg-flex w-50 px-5 py-0 flex-column justify-content-between position-relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&h=1200&fit=crop&auto=format')",
          backgroundSize: "160%",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          height: "100vh",
          overflow: 'hidden',
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1 }}
        />

        <div className="position-relative" style={{ zIndex: 2 }}>
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded d-flex align-items-center justify-content-center"
              style={{
                width: "40px",
                height: "40px",
                background: "linear-gradient(135deg, #C9A84C, #8B6914)",
              }}
            >
              <span className="text-dark fw-bold">L</span>
            </div>
            <div>
              <p className="mb-0 text-light fw-bold" style={{ letterSpacing: "0.25em" }}>
                LUXAUTO
              </p>
              <p className="mb-0 text-warning-emphasis" style={{ fontSize: "0.75rem", letterSpacing: "0.15em" }}>
                PREMIUM MOTORS
              </p>
            </div>
          </div>
        </div>

        <div className="position-relative" style={{ zIndex: 2 }}>
          <div className="border-top border-warning mb-3" style={{ width: "30px" }} />
          <h3 className="text-light mb-3" style={{ fontFamily: "serif", fontSize: "2rem" }}>
            "La perfección no es<br />un accidente."
          </h3>
          <p className="text-secondary-emphasis">— Cada automóvil, una obra maestra.</p>
          <div className="d-flex gap-2 pt-2">
            {["Ferrari", "Porsche", "Bentley", "Lamborghini"].map((b) => (
              <small key={b} className="text-secondary border rounded-pill px-2 py-1">
                {b}
              </small>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 d-flex align-items-center justify-content-center p-5">
        <div style={{ maxWidth: "450px", width: "100%" }}>
          <div className="text-center mb-4 text-[#F0EBE1]">
            <h2 className="fw-bold mb-2">Bienvenido a LuxAuto</h2>
            <p className="text-[#6E6E7E]">Accede con tus credenciales para continuar</p>
          </div>

          {/* Demo accounts */}
            <div className="mb-4">
            <small className="text-muted d-block mb-2 text-uppercase fw-bold">
              Accesos de demostración
            </small>
            <div className="d-flex flex-column gap-2">
              {DEMO_ACCOUNTS.map((acc, idx) => {
                const color = idx === 0 ? '#C9A84C' : idx === 1 ? '#2F6FFF' : '#7C3AED';
                return (
                  <button
                    key={acc.email}
                    onClick={() => fillDemo(acc)}
                    className="w-full flex items-center justify-between py-2 px-3 rounded-md"
                    style={{ border: `1px solid ${color}33`, background: 'transparent' }}
                  >
                    <div>
                      <div className="fw-bold" style={{ color }}>{acc.label}</div>
                      <small style={{ color: '#9CA3AF' }}>{acc.description}</small>
                    </div>
                    <div style={{ color }} className="text-sm">usar →</div>
                  </button>
                );
              })}
            </div>
          </div>

          <hr />

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-3">
              <label className="form-label fw-bold text-[#F0EBE1]">Email</label>
              <input
                type="email"
                className="w-full bg-[#141416] border border-[#C9A84C]/12 text-[#F0EBE1] text-sm rounded-md px-3 py-2 outline-none focus:border-[#C9A84C]/40 transition-colors"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="email@ejemplo.com"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Contraseña</label>
              <div className="input-group">
                <input
                  type={showPwd ? "text" : "password"}
                  className="w-full bg-[#141416] border border-[#C9A84C]/12 text-[#F0EBE1] text-sm rounded-l-md px-3 py-2 outline-none focus:border-[#C9A84C]/40 transition-colors"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="••••••••"
                  required
                />
                <button
                  className="px-3 bg-[#141416] border border-[#C9A84C]/12 rounded-r-md"
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger d-flex gap-2 py-2" role="alert">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span className="flex-grow-1">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-2 rounded-md font-semibold"
              style={{ background: '#C9A84C', color: '#0A0A0C' }}
            >
              {loading ? 'Verificando...' : 'Iniciar Sesión'}
            </button>
          </form>

          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-[#0A0A0C] p-4 rounded-lg border border-[#C9A84C]/10 shadow-xl">
                <Spinner size={56} />
              </div>
            </div>
          )}

          <div className="text-center mt-4">
            <p className="text-muted mb-0">
              ¿No tienes cuenta?{" "}
              <button
                className="btn btn-link p-0"
                onClick={() => setShowSignUp(true)}
                style={{ textDecoration: "none" }}
              >
                Crear cuenta como cliente
              </button>
            </p>
          </div>

          <div className="text-center mt-5">
            <small className="text-muted d-block">
              © 2026 LuxAuto Premium Motors S.L. · Todos los derechos reservados
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
