import { useState } from "react";
import { useData } from "../context/DataContext";
import Spinner from "./ui/Spinner";
import { type Vehicle } from "../data/mockData";
import { Search, SlidersHorizontal, X, Zap, ChevronRight, Plus, Pencil, Trash2, Gauge } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type EstadoFilter = "todos" | "disponible" | "reservado" | "vendido";

function StatusBadge({ estado }: { estado: string }) {
  const styles: Record<string, string> = {
    disponible: "bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/25",
    reservado: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    vendido: "bg-[#3A3A44]/60 text-[#6E6E7E] border-[#3A3A44]",
  };
  const labels: Record<string, string> = {
    disponible: "Disponible",
    reservado: "Reservado",
    vendido: "Vendido",
  };
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border tracking-wider uppercase ${styles[estado] ?? ""}`}>
      {labels[estado] ?? estado}
    </span>
  );
}

const emptyVehicle: Omit<Vehicle, "id"> = {
  marca: "",
  modelo: "",
  año: new Date().getFullYear(),
  precio: 0,
  color: "",
  kilometraje: 0,
  estado: "disponible",
  imagen: "",
  tipo: "Deportivo",
  motor: "",
  transmision: "",
  potencia: "",
  descripcion: "",
};

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] text-[#4A4A5A] tracking-widest uppercase">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-[#0C0C0E] border border-[#C9A84C]/12 text-[#F0EBE1] text-sm rounded-md px-3 py-2 outline-none focus:border-[#C9A84C]/40 transition-colors placeholder:text-[#3A3A44]";
const selectCls =
  "w-full bg-[#0C0C0E] border border-[#C9A84C]/12 text-[#F0EBE1] text-sm rounded-md px-3 py-2 outline-none focus:border-[#C9A84C]/40 transition-colors cursor-pointer";

function VehicleForm({
  initial,
  onSave,
  onClose,
}: {
  initial: Omit<Vehicle, "id">;
  onSave: (v: Omit<Vehicle, "id">) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<Vehicle, "id">>(initial);
  const set = (k: keyof Omit<Vehicle, "id">, val: string | number) =>
    setForm((f) => ({ ...f, [k]: val }));

  const valid = form.marca && form.modelo && form.precio > 0;

  return (
    <div className="space-y-4 pt-1">
      <div className="grid grid-cols-2 gap-3">
        <FieldRow label="Marca">
          <input className={inputCls} value={form.marca} onChange={(e) => set("marca", e.target.value)} placeholder="Ferrari" />
        </FieldRow>
        <FieldRow label="Modelo">
          <input className={inputCls} value={form.modelo} onChange={(e) => set("modelo", e.target.value)} placeholder="488 GTB" />
        </FieldRow>
        <FieldRow label="Año">
          <input className={inputCls} type="number" value={form.año} onChange={(e) => set("año", parseInt(e.target.value))} />
        </FieldRow>
        <FieldRow label="Precio ($)">
          <input className={inputCls} type="number" value={form.precio || ""} onChange={(e) => set("precio", parseInt(e.target.value))} placeholder="250000" />
        </FieldRow>
        <FieldRow label="Color">
          <input className={inputCls} value={form.color} onChange={(e) => set("color", e.target.value)} placeholder="Rojo Rosso Corsa" />
        </FieldRow>
        <FieldRow label="Kilometraje">
          <input className={inputCls} type="number" value={form.kilometraje} onChange={(e) => set("kilometraje", parseInt(e.target.value))} />
        </FieldRow>
        <FieldRow label="Tipo">
          <select className={selectCls} value={form.tipo} onChange={(e) => set("tipo", e.target.value)}>
            {["Deportivo", "Superdeportivo", "Gran Turismo", "Sedán de Lujo", "SUV de Lujo", "Berlina Ultra-Lujo", "Cabrio"].map((t) => (
              <option key={t} value={t} className="bg-[#0C0C0E]">{t}</option>
            ))}
          </select>
        </FieldRow>
        <FieldRow label="Estado">
          <select className={selectCls} value={form.estado} onChange={(e) => set("estado", e.target.value as Vehicle["estado"])}>
            <option value="disponible" className="bg-[#0C0C0E]">Disponible</option>
            <option value="reservado" className="bg-[#0C0C0E]">Reservado</option>
            <option value="vendido" className="bg-[#0C0C0E]">Vendido</option>
          </select>
        </FieldRow>
        <FieldRow label="Motor">
          <input className={inputCls} value={form.motor} onChange={(e) => set("motor", e.target.value)} placeholder="V8 3.9L Twin-Turbo" />
        </FieldRow>
        <FieldRow label="Transmisión">
          <input className={inputCls} value={form.transmision} onChange={(e) => set("transmision", e.target.value)} placeholder="Automática 8 vel." />
        </FieldRow>
        <FieldRow label="Potencia">
          <input className={inputCls} value={form.potencia ?? ""} onChange={(e) => set("potencia", e.target.value)} placeholder="650 CV" />
        </FieldRow>
        <FieldRow label="URL de Imagen">
          <input className={inputCls} value={form.imagen} onChange={(e) => set("imagen", e.target.value)} placeholder="https://..." />
        </FieldRow>
      </div>
      <FieldRow label="Descripción">
        <textarea
          className={`${inputCls} h-20 resize-none`}
          value={form.descripcion ?? ""}
          onChange={(e) => set("descripcion", e.target.value)}
          placeholder="Descripción del vehículo..."
        />
      </FieldRow>
      <div className="flex gap-3 pt-2">
        <button
          onClick={onClose}
          className="flex-1 btn-gold-outline"
        >
          Cancelar
        </button>
        <button
          onClick={() => { if (valid) { onSave(form); onClose(); } }}
          disabled={!valid}
          className="flex-1 btn-gold disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

function DeleteConfirm({ name, onConfirm, onClose }: { name: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="space-y-4 pt-1 text-center">
      <div className="size-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto">
        <Trash2 className="size-5 text-red-400" />
      </div>
      <p className="text-sm text-[#F0EBE1]">¿Eliminar <span className="text-[#C9A84C]">{name}</span>?</p>
      <p className="text-xs text-[#6E6E7E]">Esta acción no se puede deshacer.</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 text-sm text-[#6E6E7E] border border-[#3A3A44] rounded-md py-2 hover:border-[#C9A84C]/20 hover:text-[#F0EBE1] transition-colors">
          Cancelar
        </button>
        <button onClick={() => { onConfirm(); onClose(); }} className="flex-1 text-sm bg-red-500/80 text-white font-semibold rounded-md py-2 hover:bg-red-500 transition-colors">
          Eliminar
        </button>
      </div>
    </div>
  );
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const { updateVehicle, deleteVehicle } = useData();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <div className="group bg-[#141416] border border-[#C9A84C]/8 rounded-lg overflow-hidden hover:border-[#C9A84C]/25 transition-all duration-300">
      {/* Image */}
      <div className="relative h-44 bg-[#0C0C0E] overflow-hidden">
        <ImageWithFallback
          src={vehicle.imagen}
          alt={`${vehicle.marca} ${vehicle.modelo}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-[#141416]/10 to-transparent" />
        <div className="absolute top-3 right-3">
          <StatusBadge estado={vehicle.estado} />
        </div>
        {/* Edit/Delete overlay buttons */}
        <div className="absolute top-3 left-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setEditOpen(true)}
            className="size-7 bg-[#141416]/90 border border-[#C9A84C]/20 rounded flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors"
            title="Editar"
          >
            <Pencil className="size-3" />
          </button>
          <button
            onClick={() => setDeleteOpen(true)}
            className="size-7 bg-[#141416]/90 border border-red-500/20 rounded flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-colors"
            title="Eliminar"
          >
            <Trash2 className="size-3" />
          </button>
        </div>
        <div className="absolute bottom-3 left-4">
          <p className="text-white text-base leading-tight drop-shadow-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
            {vehicle.marca}
          </p>
          <p className="text-[#C9A84C] text-sm font-medium">{vehicle.modelo}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Año", value: vehicle.año },
            { label: "KM", value: vehicle.kilometraje === 0 ? "Nuevo" : vehicle.kilometraje.toLocaleString() },
            { label: "Tipo", value: vehicle.tipo.split(" ")[0] },
          ].map((spec) => (
            <div key={spec.label} className="bg-[#0C0C0E] rounded px-2 py-2 text-center">
              <p className="text-[10px] text-[#4A4A5A] tracking-wider uppercase">{spec.label}</p>
              <p className="text-xs text-[#F0EBE1] font-medium mt-0.5 truncate">{spec.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#6E6E7E]">
          <Zap className="size-3 text-[#C9A84C]/60 flex-shrink-0" />
          <span className="truncate">{vehicle.motor}</span>
        </div>

        <div className="flex items-center justify-end pt-1 border-t border-[#C9A84C]/8">
          <button
            onClick={() => setDetailOpen(true)}
            className="flex items-center gap-1.5 text-xs text-[#6E6E7E] hover:text-[#C9A84C] border border-[#C9A84C]/12 hover:border-[#C9A84C]/30 px-3 py-2 rounded transition-all duration-200"
          >
            Detalles <ChevronRight className="size-3" />
          </button>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-xl bg-[#141416] border border-[#C9A84C]/15 text-[#F0EBE1] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#F0EBE1]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Editar Vehículo
            </DialogTitle>
          </DialogHeader>
          <VehicleForm
            initial={{ marca: vehicle.marca, modelo: vehicle.modelo, año: vehicle.año, precio: vehicle.precio, color: vehicle.color, kilometraje: vehicle.kilometraje, estado: vehicle.estado, imagen: vehicle.imagen, tipo: vehicle.tipo, motor: vehicle.motor, transmision: vehicle.transmision, potencia: vehicle.potencia, descripcion: vehicle.descripcion }}
            onSave={(v) => updateVehicle(vehicle.id, v)}
            onClose={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm bg-[#141416] border border-[#C9A84C]/15 text-[#F0EBE1]">
          <DialogHeader>
            <DialogTitle className="text-[#F0EBE1]">Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <DeleteConfirm
            name={`${vehicle.marca} ${vehicle.modelo}`}
            onConfirm={() => deleteVehicle(vehicle.id)}
            onClose={() => setDeleteOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl bg-[#141416] border border-[#C9A84C]/15 text-[#F0EBE1] p-0 overflow-hidden">
          <div className="relative h-64 bg-[#0C0C0E]">
            <ImageWithFallback
              src={vehicle.imagen}
              alt={`${vehicle.marca} ${vehicle.modelo}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <StatusBadge estado={vehicle.estado} />
              <h2 className="text-2xl text-white mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                {vehicle.marca} {vehicle.modelo}
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-5">
            {vehicle.descripcion && (
              <p className="text-sm text-[#8A8A9A] leading-relaxed">{vehicle.descripcion}</p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Año", value: vehicle.año },
                { label: "Color", value: vehicle.color },
                { label: "Kilometraje", value: vehicle.kilometraje === 0 ? "0 km · Nuevo" : `${vehicle.kilometraje.toLocaleString()} km` },
                { label: "Motor", value: vehicle.motor },
                { label: "Transmisión", value: vehicle.transmision },
                { label: "Tipo", value: vehicle.tipo },
                ...(vehicle.potencia ? [{ label: "Potencia", value: vehicle.potencia }] : []),
              ].map((spec) => (
                <div key={spec.label} className="bg-[#0C0C0E] rounded px-3 py-2.5">
                  <p className="text-[10px] text-[#4A4A5A] tracking-widest uppercase">{spec.label}</p>
                  <p className="text-sm text-[#F0EBE1] font-medium mt-0.5">{spec.value}</p>
                </div>
              ))}
            </div>
            {vehicle.potencia && (
              <div className="flex items-center gap-2 text-sm text-[#6E6E7E] pt-2 border-t border-[#C9A84C]/10">
                <Gauge className="size-4 text-[#C9A84C]/60" />
                {vehicle.potencia}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function Inventory() {
  const { vehicles, addVehicle, loading } = useData();
  if (loading) return (
    <div className="flex items-center justify-center py-28">
      <div className="text-center">
        <Spinner size={64} />
        <p className="text-sm text-[#6E6E7E] mt-3">Cargando datos...</p>
      </div>
    </div>
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<EstadoFilter>("todos");
  const [filterTipo, setFilterTipo] = useState("todos");
  const [addOpen, setAddOpen] = useState(false);

  const tipos = ["todos", ...Array.from(new Set(vehicles.map((v) => v.tipo)))];

  const filtered = vehicles.filter((v) => {
    const q = searchTerm.toLowerCase();
    return (
      (v.marca.toLowerCase().includes(q) || v.modelo.toLowerCase().includes(q) || v.color.toLowerCase().includes(q)) &&
      (filterEstado === "todos" || v.estado === filterEstado) &&
      (filterTipo === "todos" || v.tipo === filterTipo)
    );
  });

  const counts = {
    todos: vehicles.length,
    disponible: vehicles.filter((v) => v.estado === "disponible").length,
    reservado: vehicles.filter((v) => v.estado === "reservado").length,
    vendido: vehicles.filter((v) => v.estado === "vendido").length,
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[#6E6E7E] tracking-[0.15em] uppercase mb-1">Gestión de flota</p>
          <h1 className="text-3xl text-[#F0EBE1]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Inventario
          </h1>
          <p className="text-sm text-[#6E6E7E] mt-1">
            {vehicles.length} vehículos · {counts.disponible} disponibles
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 text-sm bg-[#C9A84C] text-[#0A0A0C] font-semibold px-4 py-2.5 rounded-md hover:bg-[#D4B55A] transition-colors"
        >
          <Plus className="size-4" />
          Añadir Vehículo
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 flex-wrap">
        {(["todos", "disponible", "reservado", "vendido"] as EstadoFilter[]).map((estado) => (
          <button
            key={estado}
            onClick={() => setFilterEstado(estado)}
            className={`text-xs px-3.5 py-1.5 rounded-full border transition-all duration-200 ${
              filterEstado === estado
                ? "bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/30"
                : "text-[#6E6E7E] border-[#C9A84C]/10 hover:text-[#F0EBE1] hover:border-[#C9A84C]/20"
            }`}
          >
            {estado === "todos" ? "Todos" : estado.charAt(0).toUpperCase() + estado.slice(1)}
            <span className="ml-1.5 text-[10px] opacity-60">{counts[estado]}</span>
          </button>
        ))}
      </div>

      {/* Search + tipo */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#4A4A5A]" />
          <input
            type="text"
            placeholder="Buscar marca, modelo o color..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141416] border border-[#C9A84C]/10 text-[#F0EBE1] placeholder:text-[#4A4A5A] text-sm rounded-md pl-9 pr-4 py-2.5 outline-none focus:border-[#C9A84C]/30 transition-colors"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A4A5A] hover:text-[#C9A84C]">
              <X className="size-3.5" />
            </button>
          )}
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#4A4A5A]" />
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="bg-[#141416] border border-[#C9A84C]/10 text-[#F0EBE1] text-sm rounded-md pl-9 pr-8 py-2.5 outline-none focus:border-[#C9A84C]/30 transition-colors appearance-none cursor-pointer min-w-40"
          >
            {tipos.map((t) => (
              <option key={t} value={t} className="bg-[#141416]">
                {t === "todos" ? "Todos los tipos" : t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((v) => (
          <VehicleCard key={v.id} vehicle={v} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 border border-[#C9A84C]/8 rounded-lg bg-[#141416]">
          <Search className="size-8 text-[#3A3A44] mx-auto mb-3" />
          <p className="text-sm text-[#6E6E7E]">No se encontraron vehículos con los filtros seleccionados.</p>
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-xl bg-[#141416] border border-[#C9A84C]/15 text-[#F0EBE1] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#F0EBE1]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Añadir Vehículo
            </DialogTitle>
          </DialogHeader>
          <VehicleForm
            initial={emptyVehicle}
            onSave={(v) => addVehicle(v)}
            onClose={() => setAddOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
