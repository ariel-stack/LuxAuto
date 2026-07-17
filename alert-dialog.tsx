import { Link, Outlet, useLocation } from "react-router-dom";
import { Car, Users, TrendingUp, LayoutDashboard, Menu, X, Gem, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import Spinner from "./ui/Spinner";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/inventario", label: "Inventario", icon: Car },
  { path: "/clientes", label: "Clientes", icon: Users },
  { path: "/ventas", label: "Ventas", icon: TrendingUp },
];

function NavContent({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  return (
    <nav className="flex flex-col gap-1" role="navigation" aria-label="Secciones">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            style={{ color: isActive ? "#0A0A0C" : "#ffffff", textDecoration: "none" }}
            className={`
              flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-200 text-sm
              ${isActive
                ? "bg-[#C9A84C] text-[#0A0A0C] visited:text-[#0A0A0C] focus:text-[#0A0A0C] active:text-[#0A0A0C] shadow-lg border border-[#B58E2A]/60"
                : "bg-[#0A0A0C] text-white visited:text-white focus:text-white active:text-white border border-[#C9A84C]/30 hover:bg-[#C9A84C]/10 hover:text-[#0A0A0C]"
              }
            `}
          >
            <Icon className="size-[15px] flex-shrink-0" />
            <span className={isActive ? "tracking-wide text-[#0A0A0C]" : "tracking-wide text-white"}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function Layout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { loading } = useData();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-60 lg:flex-col border-r border-[#C9A84C]/10 bg-[#0A0A0C]">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand */}
          <div className="flex items-center gap-3 px-5 py-6 border-b border-[#C9A84C]/10">
            <div className="size-8 bg-gradient-to-br from-[#C9A84C] to-[#8B6914] rounded flex items-center justify-center flex-shrink-0">
              <Gem className="size-4 text-[#0A0A0C]" />
            </div>
            <div>
              <p
                className="text-[#F0EBE1] font-semibold tracking-[0.2em] text-xs uppercase"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                LuxAuto
              </p>
              <p className="text-[10px] text-[#4A4A5A] tracking-[0.12em] uppercase mt-0.5">
                Premium Motors
              </p>
            </div>
          </div>

          {/* Nav */}
          <div className="flex-1 px-3 py-5">
            <p className="text-[10px] text-[#3A3A4A] tracking-[0.2em] uppercase px-2 mb-3">
              Secciones
            </p>
            <NavContent />
          </div>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-[#C9A84C]/10 space-y-3">
            {user && (
              <div className="flex items-center gap-2 px-1">
                <div className="size-7 rounded-full bg-gradient-to-br from-[#C9A84C]/20 to-[#5C4A1E]/40 border border-[#C9A84C]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] text-[#C9A84C] font-semibold">
                    {user.nombre.split(" ").slice(0, 2).map(n => n[0]).join("")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#F0EBE1] truncate">{user.nombre}</p>
                  <p className="text-[10px] text-[#4A4A5A]">Administrador</p>
                </div>
              </div>
            )}
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-[#6E6E7E] hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/15 transition-all"
            >
              <LogOut className="size-3.5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-[#C9A84C]/10 bg-[#0A0A0C] px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="size-7 bg-gradient-to-br from-[#C9A84C] to-[#8B6914] rounded flex items-center justify-center">
            <Gem className="size-3.5 text-[#0A0A0C]" />
          </div>
          <span
            className="text-[#F0EBE1] tracking-[0.2em] text-xs uppercase"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            LuxAuto
          </span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="size-8 flex items-center justify-center rounded border border-[#C9A84C]/20 text-[#C9A84C] hover:bg-[#C9A84C]/5 transition-colors"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </header>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-60 bg-[#0A0A0C] border-r border-[#C9A84C]/10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 py-6 border-b border-[#C9A84C]/10">
              <div className="size-8 bg-gradient-to-br from-[#C9A84C] to-[#8B6914] rounded flex items-center justify-center flex-shrink-0">
                <Gem className="size-4 text-[#0A0A0C]" />
              </div>
              <p
                className="text-[#F0EBE1] font-semibold tracking-[0.2em] text-xs uppercase"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                LuxAuto
              </p>
            </div>
            <div className="px-3 py-5">
              <NavContent onClose={() => setOpen(false)} />
            </div>
            {/* Mobile footer with user + logout */}
            <div className="mt-auto px-4 py-4 border-t border-[#C9A84C]/10 space-y-3">
              {user && (
                <div className="flex items-center gap-2 px-1">
                  <div className="size-7 rounded-full bg-gradient-to-br from-[#C9A84C]/20 to-[#5C4A1E]/40 border border-[#C9A84C]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[9px] text-[#C9A84C] font-semibold">
                      {user.nombre.split(" ").slice(0, 2).map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#F0EBE1] truncate">{user.nombre}</p>
                    <p className="text-[10px] text-[#4A4A5A]">Administrador</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => { setOpen(false); logout(); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-[#6E6E7E] hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/15 transition-all"
              >
                <LogOut className="size-3.5" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Global loading overlay */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-[#0A0A0C] p-4 rounded shadow border border-[#C9A84C]/10">
              <Spinner size={56} />
            </div>
          </div>
        )}

      {/* Main */}
      <main className="lg:pl-60 min-h-screen">
        <div className="p-5 lg:p-8 max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
