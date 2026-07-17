import { Suspense, lazy } from "react";
import { Car, DollarSign, Users, TrendingUp, ArrowUpRight, Award } from "lucide-react";
import { useData } from "../context/DataContext";
import Spinner from "./ui/Spinner";
import { ImageWithFallback } from "./figma/ImageWithFallback";
const AiAssistant = lazy(() => 
  import("./AiAssistant").then(m => ({ default: m.AiAssistant }))
);
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const GOLD = "#C9A84C";
const GOLD_DIM = "#5C4A1E";

const MONTH_NAMES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  trend: string;
}) {
  return (
    <div className="relative bg-[#141416] border border-[#C9A84C]/10 rounded-lg p-6 overflow-hidden group hover:border-[#C9A84C]/25 transition-all duration-300">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
      <div className="flex items-start justify-between mb-4">
        <div className="size-10 bg-[#C9A84C]/8 border border-[#C9A84C]/15 rounded-md flex items-center justify-center">
          <Icon className="size-4 text-[#C9A84C]" />
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/8 border border-emerald-400/15 px-2 py-1 rounded-full">
          <ArrowUpRight className="size-3" />
          <span>{trend}</span>
        </div>
      </div>
      <p className="text-3xl text-[#C9A84C]" style={{ fontFamily: "'Playfair Display', serif" }}>
        {value}
      </p>
      <p className="text-sm text-[#F0EBE1] mt-1 font-medium">{title}</p>
      <p className="text-xs text-[#6E6E7E] mt-0.5">{subtitle}</p>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1A1E] border border-[#C9A84C]/20 rounded-md px-3 py-2 text-xs shadow-xl">
        <p className="text-[#6E6E7E] mb-1">{label}</p>
        <p className="text-[#C9A84C] font-medium">
          ${(payload[0].value / 1000).toFixed(0)}k
        </p>
      </div>
    );
  }
  return null;
};

export function Dashboard() {
  const { vehicles, clients, sales, loading } = useData();
  if (loading) return (
    <div className="flex items-center justify-center py-28">
      <div className="text-center">
        <Spinner size={64} />
        <p className="text-sm text-[#6E6E7E] mt-3">Cargando datos...</p>
      </div>
    </div>
  );
  const totalInventario = vehicles.length;
  const vehiculosDisponibles = vehicles.filter((v) => v.estado === "disponible").length;
  const totalClientes = clients.length;
  const ventasMes = sales.filter((s) => {
    const d = new Date(s.fecha);
    return d.getMonth() === 5 && d.getFullYear() === 2026;
  });
  const ingresosMes = ventasMes.reduce((sum, s) => sum + s.precio, 0);
  const ingresosTotal = sales.reduce((sum, s) => sum + s.precio, 0);

  const stats = [
    {
      title: "Inventario Total",
      value: totalInventario,
      subtitle: `${vehiculosDisponibles} disponibles`,
      icon: Car,
      trend: "+2 este mes",
    },
    {
      title: "Ventas en Junio",
      value: ventasMes.length,
      subtitle: "transacciones cerradas",
      icon: TrendingUp,
      trend: "+25%",
    },
    {
      title: "Ingresos del Mes",
      value: `$${(ingresosMes / 1000).toFixed(0)}k`,
      subtitle: "Junio 2026",
      icon: DollarSign,
      trend: "+18%",
    },
    {
      title: "Clientes VIP",
      value: clients.filter((c) => c.compras >= 3).length,
      subtitle: `de ${totalClientes} clientes totales`,
      icon: Users,
      trend: "+3",
    },
  ];

  // Monthly revenue chart data (Jan–Jun 2026)
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const monthSales = sales.filter((s) => new Date(s.fecha).getMonth() === i);
    return {
      mes: MONTH_NAMES[i],
      ingresos: monthSales.reduce((sum, s) => sum + s.precio, 0),
    };
  });

  const maxRevenue = Math.max(...chartData.map((d) => d.ingresos));

  // Recent sales
  const recentSales = sales
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 4)
    .map((sale) => ({
      ...sale,
      vehiculo: vehicles.find((v) => v.id === sale.vehiculoId),
      cliente: clients.find((c) => c.id === sale.clienteId),
    }));

  // Top vehicles available
  const featured = vehicles.filter((v) => v.estado === "disponible").slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-[#6E6E7E] tracking-[0.15em] uppercase mb-1">
            Junio 2026
          </p>
          <h1 className="text-3xl text-[#F0EBE1]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Dashboard
          </h1>
          <p className="text-sm text-[#6E6E7E] mt-1">
            Resumen ejecutivo · LuxAuto Premium Motors
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-[#6E6E7E] border border-[#C9A84C]/10 bg-[#141416] px-3 py-2 rounded-md">
          <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Sistema activo
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Chart + Recent Sales */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Bar Chart */}
        <div className="xl:col-span-3 bg-[#141416] border border-[#C9A84C]/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base text-[#F0EBE1] font-medium">
                Ingresos por Mes
              </h2>
              <p className="text-xs text-[#6E6E7E] mt-0.5">
                Total acumulado: ${(ingresosTotal / 1000).toFixed(0)}k
              </p>
            </div>
            <span className="text-xs text-[#C9A84C] border border-[#C9A84C]/20 bg-[#C9A84C]/5 px-2.5 py-1 rounded-full">
              2026
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={28}>
              <XAxis
                dataKey="mes"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6E6E7E", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6E6E7E", fontSize: 11 }}
                tickFormatter={(v) => `$${v / 1000}k`}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(201,168,76,0.04)" }} />
              <Bar dataKey="ingresos" radius={[3, 3, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.ingresos === maxRevenue ? GOLD : GOLD_DIM}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Sales */}
        <div className="xl:col-span-2 bg-[#141416] border border-[#C9A84C]/10 rounded-lg p-6">
          <h2 className="text-base text-[#F0EBE1] font-medium mb-5">
            Ventas Recientes
          </h2>
          <div className="space-y-3">
            {recentSales.map((venta) => (
              <div
                key={venta.id}
                className="flex items-center gap-3 p-3 bg-[#0C0C0E] rounded-md border border-[#C9A84C]/6 hover:border-[#C9A84C]/15 transition-colors"
              >
                <div className="size-10 rounded overflow-hidden flex-shrink-0 bg-[#1A1A1E]">
                  <ImageWithFallback
                    src={venta.vehiculo?.imagen || ""}
                    alt={`${venta.vehiculo?.marca} ${venta.vehiculo?.modelo}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#F0EBE1] font-medium truncate">
                    {venta.vehiculo?.marca} {venta.vehiculo?.modelo}
                  </p>
                  <p className="text-[11px] text-[#6E6E7E] truncate">
                    {venta.cliente?.nombre}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-[#C9A84C] font-medium">
                    ${(venta.precio / 1000).toFixed(0)}k
                  </p>
                  <p className="text-[10px] text-[#4A4A5A]">{venta.fecha}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Vehicles */}
      <div className="bg-[#141416] border border-[#C9A84C]/10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base text-[#F0EBE1] font-medium">
            Vehículos Destacados
          </h2>
          <Award className="size-4 text-[#C9A84C] opacity-60" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featured.map((v) => (
            <div
              key={v.id}
              className="group relative rounded-md overflow-hidden border border-[#C9A84C]/8 hover:border-[#C9A84C]/25 transition-all duration-300"
            >
              <div className="h-36 bg-[#0C0C0E] overflow-hidden">
                <ImageWithFallback
                  src={v.imagen}
                  alt={`${v.marca} ${v.modelo}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-transparent to-transparent opacity-80" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p
                  className="text-sm text-[#F0EBE1] leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {v.marca} {v.modelo}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-[#6E6E7E]">{v.año} · {v.tipo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IA Assistant */}
      <Suspense fallback={
        <div className="bg-[#141416] border border-[#C9A84C]/10 rounded-lg p-6 text-center text-[#6E6E7E]">
          Cargando asistente inteligente...
        </div>
      }>
        <AiAssistant />
      </Suspense>
    </div>
  );
}
