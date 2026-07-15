import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { type Vehicle } from "../data/mockData";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Gem, LogOut, Zap, Gauge, Search, X, CheckCircle, ShoppingBag, Bookmark } from "lucide-react";

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

function VehicleSpecRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-[#6E6E7E]">
      <Icon className="size-3 text-[#C9A84C]/50 flex-shrink-0" />
      <span className="text-[#4A4A5A]">{label}:</span>
      <span className="text-[#8A8A9A]">{value}</span>
    </div>
  );
}

function SuccessDialog({
  open,
  onClose,
  type,
  vehicleName,
}: {
  open: boolean;
  onClose: () => void;
  type: "reserva" | "compra";
  vehicleName: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-[#141416] border border-[#C9A84C]/15 text-[#F0EBE1] text-center">
        <div className="py-4 space-y-4">
          <div className="size-16 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="size-8 text-[#C9A84C]" />
          </div>
          <div>
            <h2 className="text-xl text-[#F0EBE1]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {type === "reserva" ? "Reserva Confirmada" : "Compra Completada"}
            </h2>
            <p className="text-sm text-[#6E6E7E] mt-2 leading-relaxed">
              {type === "reserva"
                ? `El ${vehicleName} ha sido reservado a su nombre. Nuestro equipo se pondrá en contacto en las próximas 24 horas.`
                : `¡Felicitaciones! El ${vehicleName} es ahora suyo. Recibirá confirmación por email con los detalles de la entrega.`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-[#C9A84C] text-[#0A0A0C] font-semibold text-sm rounded-md py-3 hover:bg-[#D4B55A] transition-colors"
          >
            Continuar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ActionDialog({
  open,
  onClose,
  vehicle,
  type,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  type: "reserva" | "compra";
  onConfirm: (metodoPago: string, contacto: { nombre: string; apellido: string; telefono: string; correo: string }) => void;
}) {
  const [metodoPago, setMetodoPago] = useState("Transferencia");
  const [formaEntrega, setFormaEntrega] = useState("concesionaria");
  const [direccion, setDireccion] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { user } = useAuth();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (type === "compra" && formaEntrega === "envio" && !direccion.trim()) {
      newErrors.direccion = "Dirección de envío requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmClick = () => {
    if (!validateForm() || !user) return;
    
    const contacto = {
      nombre: user.nombre,
      apellido: user.apellido || "",
      telefono: user.telefono || "",
      correo: user.email,
    };

    onConfirm(metodoPago, contacto);
    setMetodoPago("Transferencia");
    setFormaEntrega("concesionaria");
    setDireccion("");
    setErrors({});
  };

  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#141416] border border-[#C9A84C]/15 text-[#F0EBE1] p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="relative h-48 bg-[#0C0C0E]">
          <ImageWithFallback
            src={vehicle.imagen}
            alt={`${vehicle.marca} ${vehicle.modelo}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-white text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
              {vehicle.marca} {vehicle.modelo}
            </p>
            <p className="text-xs text-[#6E6E7E] mt-0.5">{vehicle.año} · {vehicle.tipo}</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-[#F0EBE1] flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              {type === "reserva" ? (
                <><Bookmark className="size-4 text-[#C9A84C]" /> Reservar Vehículo</>
              ) : (
                <><ShoppingBag className="size-4 text-[#C9A84C]" /> Adquirir Vehículo</>
              )}
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-[#6E6E7E] leading-relaxed">
            {type === "reserva"
              ? "La reserva bloquea el vehículo por 72 horas. Nuestro equipo se pondrá en contacto para coordinar los detalles."
              : "Al confirmar la compra, un ejecutivo de cuenta le contactará para coordinar la documentación y entrega del vehículo."}
          </p>

          {/* Datos de Transacción */}
          {type === "compra" && (
            <>
              <div className="space-y-2.5 pt-2 border-t border-[#C9A84C]/10">
                <p className="text-[10px] text-[#4A4A5A] tracking-widest uppercase font-semibold">Método de Pago</p>
                <div className="grid grid-cols-3 gap-2">
                  {["Transferencia", "Financiamiento", "Contado"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMetodoPago(m)}
                      className={`text-xs py-2.5 rounded-md border transition-all duration-200 ${
                        metodoPago === m
                          ? "bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/30"
                          : "text-[#6E6E7E] border-[#3A3A44] hover:border-[#C9A84C]/15 hover:text-[#F0EBE1]"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-[#C9A84C]/10">
                <p className="text-[10px] text-[#4A4A5A] tracking-widest uppercase font-semibold">Forma de Adquisición</p>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setFormaEntrega("concesionaria");
                      setErrors({});
                    }}
                    className={`w-full text-left text-sm p-3 rounded-md border transition-all ${
                      formaEntrega === "concesionaria"
                        ? "bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/30"
                        : "text-[#6E6E7E] border-[#3A3A44] hover:border-[#C9A84C]/15"
                    }`}
                  >
                    <p className="font-semibold text-xs">Retiro en Concesionaria</p>
                    <p className="text-[10px] opacity-60">Recibe tu vehículo en nuestras instalaciones</p>
                  </button>

                  <button
                    onClick={() => setFormaEntrega("envio")}
                    className={`w-full text-left text-sm p-3 rounded-md border transition-all ${
                      formaEntrega === "envio"
                        ? "bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/30"
                        : "text-[#6E6E7E] border-[#3A3A44] hover:border-[#C9A84C]/15"
                    }`}
                  >
                    <p className="font-semibold text-xs">Envío a Domicilio</p>
                    <p className="text-[10px] opacity-60">Recibe tu vehículo en tu dirección</p>
                  </button>
                </div>

                {formaEntrega === "envio" && (
                  <div className="space-y-1 pt-2">
                    <label className="text-[10px] text-[#4A4A5A] tracking-widest uppercase">Dirección de Envío *</label>
                    <input
                      type="text"
                      value={direccion}
                      onChange={(e) => {
                        setDireccion(e.target.value);
                        if (errors.direccion) setErrors((prev) => ({ ...prev, direccion: "" }));
                      }}
                      placeholder="Calle, número, ciudad, estado..."
                      className={`w-full bg-[#0C0C0E] border rounded-md px-3 py-2 text-sm text-[#F0EBE1] outline-none transition-colors placeholder:text-[#3A3A44] ${
                        errors.direccion ? "border-red-500/50" : "border-[#C9A84C]/12 focus:border-[#C9A84C]/40"
                      }`}
                    />
                    {errors.direccion && <p className="text-[10px] text-red-400">{errors.direccion}</p>}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Resumen datos cliente */}
          <div className="space-y-2.5 pt-2 border-t border-[#C9A84C]/10">
            <p className="text-[10px] text-[#4A4A5A] tracking-widest uppercase font-semibold">Datos de Contacto</p>
            <div className="bg-[#0C0C0E] rounded-md p-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6E6E7E]">Nombre:</span>
                <span className="text-[#F0EBE1] font-medium">{user?.nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E6E7E]">Email:</span>
                <span className="text-[#F0EBE1] font-medium">{user?.email}</span>
              </div>
              {user?.telefono && (
                <div className="flex justify-between">
                  <span className="text-[#6E6E7E]">Teléfono:</span>
                  <span className="text-[#F0EBE1] font-medium">{user.telefono}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 text-sm text-[#6E6E7E] border border-[#3A3A44] rounded-md py-2.5 hover:text-[#F0EBE1] hover:border-[#C9A84C]/20 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmClick}
              className="flex-1 text-sm bg-[#C9A84C] text-[#0A0A0C] font-semibold rounded-md py-2.5 hover:bg-[#D4B55A] transition-colors"
            >
              {type === "reserva" ? "Confirmar Reserva" : "Confirmar Compra"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function VehicleCard({
  vehicle,
  onReserve,
  onBuy,
}: {
  vehicle: Vehicle;
  onReserve: () => void;
  onBuy: () => void;
}) {
  return (
    <div className="group bg-[#141416] border border-[#C9A84C]/8 rounded-lg overflow-hidden hover:border-[#C9A84C]/25 transition-all duration-300">
      {/* Image */}
      <div className="relative h-52 bg-[#0C0C0E] overflow-hidden">
        <ImageWithFallback
          src={vehicle.imagen}
          alt={`${vehicle.marca} ${vehicle.modelo}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-[#141416]/5 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-white text-lg leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            {vehicle.marca}
          </p>
          <p className="text-[#C9A84C] text-sm font-medium">{vehicle.modelo}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Specs */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Año", value: String(vehicle.año) },
            { label: "KM", value: vehicle.kilometraje === 0 ? "Nuevo" : vehicle.kilometraje.toLocaleString() },
            { label: "Tipo", value: vehicle.tipo.split(" ")[0] },
          ].map((s) => (
            <div key={s.label} className="bg-[#0C0C0E] rounded px-2 py-2 text-center">
              <p className="text-[10px] text-[#4A4A5A] tracking-wider uppercase">{s.label}</p>
              <p className="text-xs text-[#F0EBE1] font-medium mt-0.5 truncate">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Motor + Potencia */}
        <div className="space-y-1.5">
          <VehicleSpecRow icon={Zap} label="Motor" value={vehicle.motor} />
          {vehicle.potencia && <VehicleSpecRow icon={Gauge} label="Potencia" value={vehicle.potencia} />}
          <div className="text-xs text-[#6E6E7E]">
            <span className="text-[#4A4A5A]">Color:</span>{" "}
            <span className="text-[#8A8A9A]">{vehicle.color}</span>
          </div>
        </div>

        {/* Description */}
        {vehicle.descripcion && (
          <p className="text-xs text-[#5A5A6A] leading-relaxed line-clamp-2">{vehicle.descripcion}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1 border-t border-[#C9A84C]/8">
          <button
            onClick={onReserve}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs text-[#C9A84C] border border-[#C9A84C]/25 bg-[#C9A84C]/5 rounded-md py-2.5 hover:bg-[#C9A84C]/12 transition-all duration-200"
          >
            <Bookmark className="size-3.5" />
            Reservar
          </button>
          <button
            onClick={onBuy}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs text-[#0A0A0C] bg-[#C9A84C] rounded-md py-2.5 hover:bg-[#D4B55A] transition-all duration-200 font-semibold"
          >
            <ShoppingBag className="size-3.5" />
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
}

const TIPOS = ["Todos", "Deportivo", "Superdeportivo", "Gran Turismo", "Sedán de Lujo", "SUV de Lujo", "Berlina Ultra-Lujo"];

export function ClientPortal() {
  const { user, logout } = useAuth();
  const { vehicles, updateVehicle, addSale, addReservation } = useData();

  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState("Todos");
  const [actionTarget, setActionTarget] = useState<{ vehicle: Vehicle; type: "reserva" | "compra" } | null>(null);
  const [success, setSuccess] = useState<{ type: "reserva" | "compra"; vehicleName: string } | null>(null);

  const available = vehicles.filter((v) => {
    if (v.estado !== "disponible") return false;
    const q = search.toLowerCase();
    const matchSearch = v.marca.toLowerCase().includes(q) || v.modelo.toLowerCase().includes(q) || v.tipo.toLowerCase().includes(q);
    const matchTipo = tipoFilter === "Todos" || v.tipo === tipoFilter;
    return matchSearch && matchTipo;
  });

  const handleConfirm = (metodoPago: string, contacto: { nombre: string; apellido: string; telefono: string; correo: string }) => {
    if (!actionTarget || !user) return;
    const { vehicle, type } = actionTarget;

    if (type === "reserva") {
      updateVehicle(vehicle.id, { estado: "reservado" });
      const fechaReserva = new Date().toISOString().split("T")[0];
      const fechaVencimiento = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString().split("T")[0];
      addReservation({
        vehiculoId: vehicle.id,
        clienteId: user.clienteId ?? "",
        fechaReserva,
        fechaVencimiento,
        estado: "activa",
        notas: `Reserva de ${contacto.nombre} ${contacto.apellido} (Tel: ${contacto.telefono}, Email: ${contacto.correo}) - Vehículo: ${vehicle.marca} ${vehicle.modelo}`,
      });
    } else {
      updateVehicle(vehicle.id, { estado: "vendido" });
      addSale({
        vehiculoId: vehicle.id,
        clienteId: user.clienteId ?? "",
        fecha: new Date().toISOString().split("T")[0],
        precio: vehicle.precio,
        metodoPago,
        vendedor: "Portal Cliente",
        comision: 0,
        notas: `Compra directa por ${contacto.nombre} ${contacto.apellido} (Tel: ${contacto.telefono}, Email: ${contacto.correo})`,
      });
    }

    setActionTarget(null);
    setSuccess({ type, vehicleName: `${vehicle.marca} ${vehicle.modelo}` });
  };

  return (
    <div className="min-h-screen bg-[#0C0C0E]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0A0A0C]/95 backdrop-blur-md border-b border-[#C9A84C]/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="size-8 bg-gradient-to-br from-[#C9A84C] to-[#8B6914] rounded flex items-center justify-center flex-shrink-0">
              <Gem className="size-4 text-[#0A0A0C]" />
            </div>
            <div>
              <p className="text-[#F0EBE1] tracking-[0.2em] text-xs uppercase font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                LuxAuto
              </p>
              <p className="text-[10px] text-[#4A4A5A] tracking-[0.12em] uppercase hidden sm:block">Portal Exclusivo</p>
            </div>
          </div>

          {/* User + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 bg-[#141416] border border-[#C9A84C]/10 rounded-md px-3 py-2">
              <div className="size-7 rounded-full bg-gradient-to-br from-[#C9A84C]/20 to-[#5C4A1E]/40 border border-[#C9A84C]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] text-[#C9A84C] font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {user ? getInitials(user.nombre) : "?"}
                </span>
              </div>
              <div>
                <p className="text-xs text-[#F0EBE1] font-medium">{user?.nombre}</p>
                <p className="text-[10px] text-[#4A4A5A]">Cliente VIP</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs text-[#6E6E7E] border border-[#3A3A44] px-3 py-2 rounded-md hover:text-red-400 hover:border-red-500/20 transition-colors"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-5 lg:px-8 py-8 space-y-8">
        {/* Hero heading */}
        <div className="text-center space-y-3 py-6">
          <p className="text-xs text-[#C9A84C] tracking-[0.3em] uppercase">Selección exclusiva</p>
          <h1 className="text-4xl lg:text-5xl text-[#F0EBE1]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Catálogo Premium
          </h1>
          <p className="text-sm text-[#6E6E7E] max-w-md mx-auto leading-relaxed">
            Descubra nuestra colección de automóviles de alta gama disponibles para usted. Reserve o adquiera directamente desde su portal.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="w-12 h-px bg-[#C9A84C]/30" />
            <Gem className="size-3 text-[#C9A84C]/40" />
            <div className="w-12 h-px bg-[#C9A84C]/30" />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#4A4A5A]" />
            <input
              type="text"
              placeholder="Buscar marca o modelo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#141416] border border-[#C9A84C]/10 text-[#F0EBE1] placeholder:text-[#4A4A5A] text-sm rounded-md pl-9 pr-4 py-2.5 outline-none focus:border-[#C9A84C]/30 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A4A5A] hover:text-[#C9A84C]">
                <X className="size-3.5" />
              </button>
            )}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {TIPOS.slice(0, 4).map((t) => (
              <button
                key={t}
                onClick={() => setTipoFilter(t)}
                className={`text-xs px-3 py-2 rounded-md border transition-all ${
                  tipoFilter === t
                    ? "bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/30"
                    : "text-[#6E6E7E] border-[#C9A84C]/8 hover:text-[#F0EBE1] hover:border-[#C9A84C]/20"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-px bg-[#C9A84C]/40" />
          <p className="text-xs text-[#4A4A5A]">
            {available.length} {available.length === 1 ? "vehículo disponible" : "vehículos disponibles"}
          </p>
        </div>

        {/* Grid */}
        {available.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {available.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                onReserve={() => setActionTarget({ vehicle: v, type: "reserva" })}
                onBuy={() => setActionTarget({ vehicle: v, type: "compra" })}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-[#C9A84C]/8 rounded-lg bg-[#141416]">
            <Gem className="size-10 text-[#2A2A30] mx-auto mb-4" />
            <p className="text-[#6E6E7E] text-sm">No se encontraron vehículos disponibles.</p>
            <p className="text-[#4A4A5A] text-xs mt-1">Modifique los filtros o consulte próximas incorporaciones.</p>
          </div>
        )}
      </main>

      {/* Action dialog */}
      <ActionDialog
        open={!!actionTarget}
        onClose={() => setActionTarget(null)}
        vehicle={actionTarget?.vehicle ?? null}
        type={actionTarget?.type ?? "reserva"}
        onConfirm={handleConfirm}
      />

      {/* Success dialog */}
      <SuccessDialog
        open={!!success}
        onClose={() => setSuccess(null)}
        type={success?.type ?? "reserva"}
        vehicleName={success?.vehicleName ?? ""}
      />
    </div>
  );
}
