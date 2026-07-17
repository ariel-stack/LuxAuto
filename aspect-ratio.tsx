import { useState } from "react";
import { useData } from "../context/DataContext";
import Spinner from "./ui/Spinner";
import { type Sale, type Reservation } from "../data/mockData";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { TrendingUp, DollarSign, Award, CreditCard, Calendar, Plus, Pencil, Trash2, Bookmark, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MONTH_NAMES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const METHOD_COLORS: Record<string, string> = {
  Transferencia: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Financiamiento: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Contado: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1A1E] border border-[#C9A84C]/20 rounded-md px-3 py-2.5 text-xs shadow-2xl">
        <p className="text-[#6E6E7E] mb-1">{label}</p>
        <p className="text-[#C9A84C] font-semibold text-sm">${(payload[0].value / 1000).toFixed(0)}k</p>
      </div>
    );
  }
  return null;
};

const inputCls =
  "w-full bg-[#0C0C0E] border border-[#C9A84C]/12 text-[#F0EBE1] text-sm rounded-md px-3 py-2 outline-none focus:border-[#C9A84C]/40 transition-colors placeholder:text-[#3A3A44]";
const selectCls =
  "w-full bg-[#0C0C0E] border border-[#C9A84C]/12 text-[#F0EBE1] text-sm rounded-md px-3 py-2 outline-none focus:border-[#C9A84C]/40 transition-colors cursor-pointer";

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] text-[#4A4A5A] tracking-widest uppercase">{label}</label>
      {children}
    </div>
  );
}

function SaleForm({
  initial,
  onSave,
  onClose,
  vehicleOptions,
  clientOptions,
}: {
  initial: Omit<Sale, "id">;
  onSave: (s: Omit<Sale, "id">) => void;
  onClose: () => void;
  vehicleOptions: { id: string; label: string }[];
  clientOptions: { id: string; label: string }[];
}) {
  const [form, setForm] = useState<Omit<Sale, "id">>(initial);
  const set = (k: keyof Omit<Sale, "id">, val: string | number) =>
    setForm((f) => ({ ...f, [k]: val }));

  const valid = form.vehiculoId && form.clienteId && form.precio > 0 && form.fecha;

  return (
    <div className="space-y-4 pt-1">
      <div className="grid grid-cols-2 gap-3">
        <FieldRow label="Vehículo">
          <select className={selectCls} value={form.vehiculoId} onChange={(e) => set("vehiculoId", e.target.value)}>
            <option value="" className="bg-[#0C0C0E]">Seleccionar...</option>
            {vehicleOptions.map((v) => (
              <option key={v.id} value={v.id} className="bg-[#0C0C0E]">{v.label}</option>
            ))}
          </select>
        </FieldRow>
        <FieldRow label="Cliente">
          <select className={selectCls} value={form.clienteId} onChange={(e) => set("clienteId", e.target.value)}>
            <option value="" className="bg-[#0C0C0E]">Seleccionar...</option>
            {clientOptions.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#0C0C0E]">{c.label}</option>
            ))}
          </select>
        </FieldRow>
        <FieldRow label="Fecha">
          <input className={inputCls} type="date" value={form.fecha} onChange={(e) => set("fecha", e.target.value)} />
        </FieldRow>
        <FieldRow label="Precio ($)">
          <input className={inputCls} type="number" value={form.precio || ""} onChange={(e) => set("precio", parseInt(e.target.value) || 0)} placeholder="250000" />
        </FieldRow>
        <FieldRow label="Método de Pago">
          <select className={selectCls} value={form.metodoPago} onChange={(e) => set("metodoPago", e.target.value)}>
            {["Transferencia", "Financiamiento", "Contado"].map((m) => (
              <option key={m} value={m} className="bg-[#0C0C0E]">{m}</option>
            ))}
          </select>
        </FieldRow>
        <FieldRow label="Vendedor">
          <input className={inputCls} value={form.vendedor} onChange={(e) => set("vendedor", e.target.value)} placeholder="Ana Torres" />
        </FieldRow>
        <FieldRow label="Comisión ($)">
          <input className={inputCls} type="number" value={form.comision ?? ""} onChange={(e) => set("comision", parseInt(e.target.value) || 0)} placeholder="7500" />
        </FieldRow>
        <FieldRow label="Notas">
          <input className={inputCls} value={form.notas ?? ""} onChange={(e) => set("notas", e.target.value)} placeholder="Observaciones..." />
        </FieldRow>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onClose} className="flex-1 btn-gold-outline">
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

function DeleteConfirm({ label, onConfirm, onClose }: { label: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="space-y-4 pt-1 text-center">
      <div className="size-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto">
        <Trash2 className="size-5 text-red-400" />
      </div>
      <p className="text-sm text-[#F0EBE1]">¿Eliminar la venta de <span className="text-[#C9A84C]">{label}</span>?</p>
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

const emptySale: Omit<Sale, "id"> = {
  vehiculoId: "",
  clienteId: "",
  fecha: new Date().toISOString().split("T")[0],
  precio: 0,
  metodoPago: "Transferencia",
  vendedor: "",
  comision: 0,
  notas: "",
};

export function Sales() {
  const { vehicles, clients, sales, reservations, addSale, updateSale, deleteSale, addReservation, updateReservation, deleteReservation, loading } = useData();
  if (loading) return (
    <div className="flex items-center justify-center py-28">
      <div className="text-center">
        <Spinner size={64} />
        <p className="text-sm text-[#6E6E7E] mt-3">Cargando datos...</p>
      </div>
    </div>
  );
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Sale | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Sale | null>(null);
  const [tab, setTab] = useState<"ventas" | "reservas">("ventas");

  const vehicleOptions = vehicles.map((v) => ({ id: v.id, label: `${v.marca} ${v.modelo} (${v.año})` }));
  const clientOptions = clients.map((c) => ({ id: c.id, label: c.nombre }));

  const totalVentas = sales.length;
  const ingresosTotal = sales.reduce((sum, s) => sum + s.precio, 0);
  const promedioVenta = totalVentas > 0 ? ingresosTotal / totalVentas : 0;
  const comisionTotal = sales.reduce((sum, s) => sum + (s.comision ?? 0), 0);

  const totalReservaciones = reservations.filter((r) => r.estado === "activa").length;
  const reservacionesCompletadas = reservations.filter((r) => r.estado === "completada").length;

  const salesWithDetails = sales
    .map((sale) => ({
      ...sale,
      vehiculo: vehicles.find((v) => v.id === sale.vehiculoId),
      cliente: clients.find((c) => c.id === sale.clienteId),
    }))
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const reservationsWithDetails = reservations
    .map((res) => ({
      ...res,
      vehiculo: vehicles.find((v) => v.id === res.vehiculoId),
      cliente: clients.find((c) => c.id === res.clienteId),
    }))
    .sort((a, b) => new Date(b.fechaReserva).getTime() - new Date(a.fechaReserva).getTime());

  const chartData = Array.from({ length: 6 }, (_, i) => {
    const monthSales = sales.filter((s) => new Date(s.fecha).getMonth() === i);
    return {
      mes: MONTH_NAMES[i],
      ingresos: monthSales.reduce((sum, s) => sum + s.precio, 0),
      cantidad: monthSales.length,
    };
  });

  const vendorTotals = sales.reduce((acc, s) => {
    acc[s.vendedor] = (acc[s.vendedor] || 0) + s.precio;
    return acc;
  }, {} as Record<string, number>);
  const topVendors = Object.entries(vendorTotals).sort(([, a], [, b]) => b - a).slice(0, 3);
  const maxVendor = topVendors[0]?.[1] ?? 1;

  return (
    <div className="space-y-7">
      {/* Header + Tabs */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-[#6E6E7E] tracking-[0.15em] uppercase mb-1">Análisis</p>
          <h1 className="text-3xl text-[#F0EBE1]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ventas y Reservas
          </h1>
          <p className="text-sm text-[#6E6E7E] mt-1">
            {tab === "ventas" ? `${totalVentas} transacciones` : `${totalReservaciones} reservas activas`}
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 text-sm bg-[#C9A84C] text-[#0A0A0C] font-semibold px-4 py-2.5 rounded-md hover:bg-[#D4B55A] transition-colors"
        >
          <Plus className="size-4" />
          {tab === "ventas" ? "Registrar Venta" : "Nueva Reserva"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#C9A84C]/10">
        <button
          onClick={() => setTab("ventas")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            tab === "ventas"
              ? "border-[#C9A84C] text-[#C9A84C]"
              : "border-transparent text-[#6E6E7E] hover:text-[#F0EBE1]"
          }`}
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4" />
            Ventas ({totalVentas})
          </div>
        </button>
        <button
          onClick={() => setTab("reservas")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            tab === "reservas"
              ? "border-[#C9A84C] text-[#C9A84C]"
              : "border-transparent text-[#6E6E7E] hover:text-[#F0EBE1]"
          }`}
        >
          <div className="flex items-center gap-2">
            <Bookmark className="size-4" />
            Reservas ({totalReservaciones})
          </div>
        </button>
      </div>

      {/* KPIs */}
      {tab === "ventas" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Ventas", value: totalVentas, sub: "transacciones", icon: TrendingUp },
            { label: "Ingresos Totales", value: `$${(ingresosTotal / 1000000).toFixed(2)}M`, sub: "acumulado 2026", icon: DollarSign },
            { label: "Venta Promedio", value: `$${(promedioVenta / 1000).toFixed(0)}k`, sub: "por transacción", icon: Award },
            { label: "Comisiones", value: `$${(comisionTotal / 1000).toFixed(0)}k`, sub: "total al equipo", icon: CreditCard },
          ].map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="relative bg-[#141416] border border-[#C9A84C]/10 rounded-lg p-5 overflow-hidden hover:border-[#C9A84C]/20 transition-colors">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />
                <div className="size-9 bg-[#C9A84C]/8 border border-[#C9A84C]/15 rounded-md flex items-center justify-center mb-3">
                  <Icon className="size-4 text-[#C9A84C]" />
                </div>
                <p className="text-2xl text-[#C9A84C]" style={{ fontFamily: "'Playfair Display', serif" }}>{kpi.value}</p>
                <p className="text-sm text-[#F0EBE1] font-medium mt-0.5">{kpi.label}</p>
                <p className="text-xs text-[#6E6E7E] mt-0.5">{kpi.sub}</p>
              </div>
            );
          })}
        </div>
      )}

      {tab === "reservas" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Reservas Activas", value: totalReservaciones, sub: "vigentes", icon: Bookmark },
            { label: "Completadas", value: reservacionesCompletadas, sub: "convertidas a venta", icon: CheckCircle },
            { label: "Total Reservado", value: `$${(reservationsWithDetails.reduce((sum, r) => sum + (vehicles.find((v) => v.id === r.vehiculoId)?.precio ?? 0), 0) / 1000).toFixed(0)}k`, sub: "valor de vehículos", icon: DollarSign },
            { label: "Tasa Conversión", value: totalReservaciones + reservacionesCompletadas > 0 ? `${Math.round((reservacionesCompletadas / (totalReservaciones + reservacionesCompletadas)) * 100)}%` : "0%", sub: "completadas", icon: Award },
          ].map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="relative bg-[#141416] border border-[#C9A84C]/10 rounded-lg p-5 overflow-hidden hover:border-[#C9A84C]/20 transition-colors">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />
                <div className="size-9 bg-[#C9A84C]/8 border border-[#C9A84C]/15 rounded-md flex items-center justify-center mb-3">
                  <Icon className="size-4 text-[#C9A84C]" />
                </div>
                <p className="text-2xl text-[#C9A84C]" style={{ fontFamily: "'Playfair Display', serif" }}>{kpi.value}</p>
                <p className="text-sm text-[#F0EBE1] font-medium mt-0.5">{kpi.label}</p>
                <p className="text-xs text-[#6E6E7E] mt-0.5">{kpi.sub}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Area Chart + Top Vendors — only for sales */}
      {tab === "ventas" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-[#141416] border border-[#C9A84C]/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base text-[#F0EBE1] font-medium">Evolución de Ingresos</h2>
              <p className="text-xs text-[#6E6E7E] mt-0.5">Enero — Junio 2026</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.07)" vertical={false} />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#6E6E7E", fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6E6E7E", fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} width={48} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="ingresos" stroke="#C9A84C" strokeWidth={1.5} fill="url(#goldGradient)" dot={{ r: 3, fill: "#C9A84C", strokeWidth: 0 }} activeDot={{ r: 5, fill: "#C9A84C", strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#141416] border border-[#C9A84C]/10 rounded-lg p-6">
          <h2 className="text-base text-[#F0EBE1] font-medium mb-5">Ranking Vendedores</h2>
          <div className="space-y-4">
            {topVendors.map(([name, total], idx) => (
              <div key={name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-5 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
                      style={{ background: idx === 0 ? "rgba(201,168,76,0.2)" : "rgba(58,58,68,0.6)", color: idx === 0 ? "#C9A84C" : "#6E6E7E", border: idx === 0 ? "1px solid rgba(201,168,76,0.3)" : "1px solid transparent" }}>
                      {idx + 1}
                    </span>
                    <p className="text-sm text-[#F0EBE1]">{name}</p>
                  </div>
                  <p className="text-sm text-[#C9A84C] font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>
                    ${(total / 1000).toFixed(0)}k
                  </p>
                </div>
                <div className="h-1 bg-[#1A1A1E] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(total / maxVendor) * 100}%`, background: idx === 0 ? "linear-gradient(to right, #8B6914, #C9A84C)" : "linear-gradient(to right, #2A2A32, #3A3A44)" }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-5 border-t border-[#C9A84C]/8 space-y-2">
            <p className="text-[10px] text-[#4A4A5A] tracking-widest uppercase mb-3">Por mes</p>
            {chartData.filter((d) => d.ingresos > 0).map((d) => (
              <div key={d.mes} className="flex items-center justify-between text-xs">
                <span className="text-[#6E6E7E]">{d.mes}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#4A4A5A]">{d.cantidad} venta{d.cantidad !== 1 ? "s" : ""}</span>
                  <span className="text-[#C9A84C]">${(d.ingresos / 1000).toFixed(0)}k</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Sales History */}
      <div className="bg-[#141416] border border-[#C9A84C]/10 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[#C9A84C]/8">
          <h2 className="text-base text-[#F0EBE1] font-medium">
            {tab === "ventas" ? "Historial de Ventas" : "Historial de Reservas"}
          </h2>
        </div>
        <div className="divide-y divide-[#C9A84C]/6">
          {tab === "ventas" ? (
            salesWithDetails.map((sale) => (
            <div key={sale.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#C9A84C]/[0.02] transition-colors group">
              {/* Vehicle image */}
              <div className="size-12 rounded overflow-hidden flex-shrink-0 bg-[#0C0C0E]">
                {sale.vehiculo && (
                  <ImageWithFallback
                    src={sale.vehiculo.imagen}
                    alt={`${sale.vehiculo.marca} ${sale.vehiculo.modelo}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Vehicle info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#F0EBE1] font-medium truncate">
                  {sale.vehiculo?.marca} {sale.vehiculo?.modelo}
                </p>
                <p className="text-xs text-[#6E6E7E] truncate">{sale.cliente?.nombre}</p>
              </div>

              {/* Date */}
              <div className="hidden md:flex items-center gap-1.5 text-xs text-[#6E6E7E] flex-shrink-0">
                <Calendar className="size-3 text-[#4A4A5A]" />
                {sale.fecha}
              </div>

              {/* Payment */}
              <div className="hidden lg:block flex-shrink-0">
                <span className={`text-[10px] px-2 py-0.5 rounded-full border tracking-wider uppercase font-medium ${METHOD_COLORS[sale.metodoPago] ?? "bg-[#3A3A44]/60 text-[#6E6E7E] border-[#3A3A44]"}`}>
                  {sale.metodoPago}
                </span>
              </div>

              {/* Vendor */}
              <div className="hidden lg:block flex-shrink-0">
                <p className="text-xs text-[#6E6E7E]">{sale.vendedor}</p>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <p className="text-base text-[#C9A84C]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  ${sale.precio.toLocaleString()}
                </p>
                {sale.comision ? (
                  <p className="text-[10px] text-[#4A4A5A]">Com. ${sale.comision.toLocaleString()}</p>
                ) : null}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => setEditTarget(sale)}
                  className="size-7 bg-[#0C0C0E] border border-[#C9A84C]/15 rounded flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors"
                  title="Editar"
                >
                  <Pencil className="size-3" />
                </button>
                <button
                  onClick={() => setDeleteTarget(sale)}
                  className="size-7 bg-[#0C0C0E] border border-red-500/15 rounded flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            </div>
            ))
          ) : (
            reservationsWithDetails.map((res) => (
              <div key={res.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#C9A84C]/[0.02] transition-colors group">
                {/* Vehicle image */}
                <div className="size-12 rounded overflow-hidden flex-shrink-0 bg-[#0C0C0E]">
                  {res.vehiculo && (
                    <ImageWithFallback
                      src={res.vehiculo.imagen}
                      alt={`${res.vehiculo.marca} ${res.vehiculo.modelo}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Vehicle info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#F0EBE1] font-medium truncate">
                    {res.vehiculo?.marca} {res.vehiculo?.modelo}
                  </p>
                  <p className="text-xs text-[#6E6E7E] truncate">{res.cliente?.nombre}</p>
                </div>

                {/* Date */}
                <div className="hidden md:flex items-center gap-1.5 text-xs text-[#6E6E7E] flex-shrink-0">
                  <Calendar className="size-3 text-[#4A4A5A]" />
                  {res.fechaReserva}
                </div>

                {/* Status */}
                <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
                  <span className={`text-[10px] px-2 py-1 rounded-full border tracking-wider uppercase font-medium ${
                    res.estado === "activa" 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : res.estado === "completada"
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}>
                    {res.estado}
                  </span>
                </div>

                {/* Vencimiento */}
                <div className="hidden lg:block flex-shrink-0 text-right">
                  <p className="text-xs text-[#C9A84C] font-medium">{res.fechaVencimiento}</p>
                  <p className="text-[10px] text-[#4A4A5A]">vence</p>
                </div>

                {/* Vehicle price */}
                <div className="text-right flex-shrink-0">
                  <p className="text-base text-[#C9A84C]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    ${res.vehiculo?.precio.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-[#4A4A5A]">precio</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => updateReservation(res.id, { estado: "completada" })}
                    className="size-7 bg-[#0C0C0E] border border-emerald-500/20 rounded flex items-center justify-center text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                    title="Marcar completada"
                  >
                    <CheckCircle className="size-3" />
                  </button>
                  <button
                    onClick={() => deleteReservation(res.id)}
                    className="size-7 bg-[#0C0C0E] border border-red-500/15 rounded flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Cancelar"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg bg-[#141416] border border-[#C9A84C]/15 text-[#F0EBE1]">
          <DialogHeader>
            <DialogTitle className="text-[#F0EBE1]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Registrar Venta
            </DialogTitle>
          </DialogHeader>
          <SaleForm
            initial={emptySale}
            onSave={addSale}
            onClose={() => setAddOpen(false)}
            vehicleOptions={vehicleOptions}
            clientOptions={clientOptions}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent className="max-w-lg bg-[#141416] border border-[#C9A84C]/15 text-[#F0EBE1]">
          <DialogHeader>
            <DialogTitle className="text-[#F0EBE1]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Editar Venta
            </DialogTitle>
          </DialogHeader>
          {editTarget && (
            <SaleForm
              initial={{ vehiculoId: editTarget.vehiculoId, clienteId: editTarget.clienteId, fecha: editTarget.fecha, precio: editTarget.precio, metodoPago: editTarget.metodoPago, vendedor: editTarget.vendedor, comision: editTarget.comision, notas: editTarget.notas }}
              onSave={(s) => updateSale(editTarget.id, s)}
              onClose={() => setEditTarget(null)}
              vehicleOptions={vehicleOptions}
              clientOptions={clientOptions}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm bg-[#141416] border border-[#C9A84C]/15 text-[#F0EBE1]">
          <DialogHeader>
            <DialogTitle className="text-[#F0EBE1]">Confirmar eliminación</DialogTitle>
          </DialogHeader>
          {deleteTarget && (
            <DeleteConfirm
              label={`${vehicles.find((v) => v.id === deleteTarget.vehiculoId)?.marca ?? ""} — $${deleteTarget.precio.toLocaleString()}`}
              onConfirm={() => deleteSale(deleteTarget.id)}
              onClose={() => setDeleteTarget(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
