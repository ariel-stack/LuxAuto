import { useState } from "react";
import { useData } from "../context/DataContext";
import Spinner from "./ui/Spinner";
import { type Client } from "../data/mockData";
import { Search, Mail, Phone, MapPin, Crown, Star, User, Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

function VipTier({ compras, totalGastado }: { compras: number; totalGastado: number }) {
  if (totalGastado >= 800000 || compras >= 4)
    return (
      <span className="flex items-center gap-1 text-[10px] text-[#C9A84C] bg-[#C9A84C]/8 border border-[#C9A84C]/20 px-2 py-0.5 rounded-full tracking-wider uppercase font-medium">
        <Crown className="size-2.5" /> Diamante
      </span>
    );
  if (totalGastado >= 400000 || compras >= 2)
    return (
      <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-400/8 border border-amber-400/20 px-2 py-0.5 rounded-full tracking-wider uppercase font-medium">
        <Star className="size-2.5" /> Oro
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-[10px] text-[#6E6E7E] bg-[#1A1A1E] border border-[#3A3A44] px-2 py-0.5 rounded-full tracking-wider uppercase font-medium">
      <User className="size-2.5" /> Plata
    </span>
  );
}

const inputCls =
  "w-full bg-[#0C0C0E] border border-[#C9A84C]/12 text-[#F0EBE1] text-sm rounded-md px-3 py-2 outline-none focus:border-[#C9A84C]/40 transition-colors placeholder:text-[#3A3A44]";

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] text-[#4A4A5A] tracking-widest uppercase">{label}</label>
      {children}
    </div>
  );
}

const emptyClient: Omit<Client, "id"> = {
  nombre: "",
  email: "",
  telefono: "",
  direccion: "",
  compras: 0,
  totalGastado: 0,
  ultimaCompra: "",
  nacionalidad: "",
};

function ClientForm({
  initial,
  onSave,
  onClose,
}: {
  initial: Omit<Client, "id">;
  onSave: (c: Omit<Client, "id">) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<Client, "id">>(initial);
  const set = (k: keyof Omit<Client, "id">, val: string | number) =>
    setForm((f) => ({ ...f, [k]: val }));

  const valid = form.nombre.trim() && form.email.trim();

  return (
    <div className="space-y-4 pt-1">
      <div className="grid grid-cols-2 gap-3">
        <FieldRow label="Nombre completo">
          <input className={`${inputCls} col-span-2`} value={form.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="Roberto Martínez" />
        </FieldRow>
        <FieldRow label="Email">
          <input className={inputCls} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="email@ejemplo.com" />
        </FieldRow>
        <FieldRow label="Teléfono">
          <input className={inputCls} value={form.telefono} onChange={(e) => set("telefono", e.target.value)} placeholder="+34 611 222 333" />
        </FieldRow>
        <FieldRow label="Compras">
          <input className={inputCls} type="number" value={form.compras} min={0} onChange={(e) => set("compras", parseInt(e.target.value) || 0)} />
        </FieldRow>
        <FieldRow label="Total Gastado ($)">
          <input className={inputCls} type="number" value={form.totalGastado || ""} onChange={(e) => set("totalGastado", parseInt(e.target.value) || 0)} placeholder="250000" />
        </FieldRow>
        <FieldRow label="Última Compra">
          <input className={inputCls} type="date" value={form.ultimaCompra ?? ""} onChange={(e) => set("ultimaCompra", e.target.value)} />
        </FieldRow>
        <FieldRow label="Nacionalidad">
          <input className={inputCls} value={form.nacionalidad ?? ""} onChange={(e) => set("nacionalidad", e.target.value)} placeholder="Española" />
        </FieldRow>
      </div>
      <FieldRow label="Dirección">
        <input className={inputCls} value={form.direccion} onChange={(e) => set("direccion", e.target.value)} placeholder="Paseo de la Castellana 100, Madrid" />
      </FieldRow>
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

function DeleteConfirm({ name, onConfirm, onClose }: { name: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="space-y-4 pt-1 text-center">
      <div className="size-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto">
        <Trash2 className="size-5 text-red-400" />
      </div>
      <p className="text-sm text-[#F0EBE1]">¿Eliminar a <span className="text-[#C9A84C]">{name}</span>?</p>
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

export function Clients() {
  const { clients, addClient, updateClient, deleteClient, loading } = useData();
  if (loading) return (
    <div className="flex items-center justify-center py-28">
      <div className="text-center">
        <Spinner size={64} />
        <p className="text-sm text-[#6E6E7E] mt-3">Cargando datos...</p>
      </div>
    </div>
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Client | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);

  const filtered = clients.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sorted = [...filtered].sort((a, b) => b.totalGastado - a.totalGastado);

  const totalGastado = clients.reduce((sum, c) => sum + c.totalGastado, 0);
  const totalCompras = clients.reduce((sum, c) => sum + c.compras, 0);
  const diamante = clients.filter((c) => c.totalGastado >= 800000 || c.compras >= 4).length;
  const maxSpend = Math.max(...clients.map((c) => c.totalGastado), 1);

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[#6E6E7E] tracking-[0.15em] uppercase mb-1">Gestión</p>
          <h1 className="text-3xl text-[#F0EBE1]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Clientes VIP
          </h1>
          <p className="text-sm text-[#6E6E7E] mt-1">
            Base de datos exclusiva · {clients.length} miembros
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 text-sm bg-[#C9A84C] text-[#0A0A0C] font-semibold px-4 py-2.5 rounded-md hover:bg-[#D4B55A] transition-colors"
        >
          <Plus className="size-4" />
          Añadir Cliente
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Clientes Totales", value: clients.length, sub: `${diamante} Diamante`, icon: User },
          { label: "Vehículos Adquiridos", value: totalCompras, sub: "transacciones totales", icon: Crown },
          { label: "Valor de Cartera", value: `$${(totalGastado / 1000000).toFixed(2)}M`, sub: `promedio $${(totalGastado / Math.max(clients.length, 1) / 1000).toFixed(0)}k`, icon: Star },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="relative bg-[#141416] border border-[#C9A84C]/10 rounded-lg p-5 overflow-hidden hover:border-[#C9A84C]/20 transition-colors">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />
              <div className="size-9 bg-[#C9A84C]/8 border border-[#C9A84C]/15 rounded-md flex items-center justify-center mb-3">
                <Icon className="size-4 text-[#C9A84C]" />
              </div>
              <p className="text-2xl text-[#C9A84C]" style={{ fontFamily: "'Playfair Display', serif" }}>{stat.value}</p>
              <p className="text-sm text-[#F0EBE1] font-medium mt-0.5">{stat.label}</p>
              <p className="text-xs text-[#6E6E7E] mt-0.5">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#4A4A5A]" />
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#141416] border border-[#C9A84C]/10 text-[#F0EBE1] placeholder:text-[#4A4A5A] text-sm rounded-md pl-9 pr-4 py-2.5 outline-none focus:border-[#C9A84C]/30 transition-colors"
        />
      </div>

      {/* List */}
      <div className="space-y-2">
        {sorted.map((client, idx) => {
          const spendPct = (client.totalGastado / maxSpend) * 100;
          return (
            <div key={client.id} className="bg-[#141416] border border-[#C9A84C]/8 rounded-lg p-4 hover:border-[#C9A84C]/20 transition-all duration-200 group">
              <div className="flex items-start gap-4">
                {/* Rank + Avatar */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-[#3A3A44] w-4 text-center font-mono">{idx + 1}</span>
                  <div className="size-11 rounded-full bg-gradient-to-br from-[#C9A84C]/20 to-[#5C4A1E]/40 border border-[#C9A84C]/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm text-[#C9A84C] font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {getInitials(client.nombre)}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm text-[#F0EBE1] font-medium">{client.nombre}</p>
                    <VipTier compras={client.compras} totalGastado={client.totalGastado} />
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#6E6E7E]">
                    <span className="flex items-center gap-1.5"><Mail className="size-3 text-[#4A4A5A]" />{client.email}</span>
                    <span className="flex items-center gap-1.5"><Phone className="size-3 text-[#4A4A5A]" />{client.telefono}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="size-3 text-[#4A4A5A]" />{client.direccion}</span>
                  </div>
                  {/* Spending bar */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 h-1 bg-[#1A1A1E] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#8B6914] to-[#C9A84C] rounded-full transition-all duration-700"
                        style={{ width: `${spendPct}%` }}
                      />
                    </div>
                    <span className="text-sm text-[#C9A84C] flex-shrink-0" style={{ fontFamily: "'Playfair Display', serif" }}>
                      ${client.totalGastado.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Right stats + actions */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditTarget(client)}
                      className="size-7 bg-[#0C0C0E] border border-[#C9A84C]/15 rounded flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors"
                      title="Editar"
                    >
                      <Pencil className="size-3" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(client)}
                      className="size-7 bg-[#0C0C0E] border border-red-500/15 rounded flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                  <div className="text-center bg-[#0C0C0E] border border-[#C9A84C]/8 rounded px-3 py-1.5">
                    <p className="text-[10px] text-[#4A4A5A] tracking-widest uppercase">Compras</p>
                    <p className="text-lg text-[#C9A84C]" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {client.compras}
                    </p>
                  </div>
                  {client.ultimaCompra && (
                    <p className="text-[10px] text-[#4A4A5A]">Última: {client.ultimaCompra}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-16 border border-[#C9A84C]/8 rounded-lg bg-[#141416]">
          <Search className="size-8 text-[#3A3A44] mx-auto mb-3" />
          <p className="text-sm text-[#6E6E7E]">No se encontraron clientes con esa búsqueda.</p>
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg bg-[#141416] border border-[#C9A84C]/15 text-[#F0EBE1]">
          <DialogHeader>
            <DialogTitle className="text-[#F0EBE1]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Añadir Cliente
            </DialogTitle>
          </DialogHeader>
          <ClientForm initial={emptyClient} onSave={addClient} onClose={() => setAddOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent className="max-w-lg bg-[#141416] border border-[#C9A84C]/15 text-[#F0EBE1]">
          <DialogHeader>
            <DialogTitle className="text-[#F0EBE1]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Editar Cliente
            </DialogTitle>
          </DialogHeader>
          {editTarget && (
            <ClientForm
              initial={{ nombre: editTarget.nombre, email: editTarget.email, telefono: editTarget.telefono, direccion: editTarget.direccion, compras: editTarget.compras, totalGastado: editTarget.totalGastado, ultimaCompra: editTarget.ultimaCompra, nacionalidad: editTarget.nacionalidad }}
              onSave={(c) => updateClient(editTarget.id, c)}
              onClose={() => setEditTarget(null)}
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
              name={deleteTarget.nombre}
              onConfirm={() => deleteClient(deleteTarget.id)}
              onClose={() => setDeleteTarget(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
