import { useMemo, useState, type FormEvent } from "react";
import { Search, Sparkles } from "lucide-react";
import { useData } from "../context/DataContext";
import { type Client, type Sale, type Vehicle } from "../data/mockData";

const KEYWORDS = [
  { terms: ["cliente", "clientes", "comprador", "compradores", "top cliente", "mejor cliente"], label: "clientes" },
  { terms: ["venta", "ventas", "facturacion", "facturacion", "ingreso", "ingresos", "ventas totales"], label: "ventas" },
  { terms: ["vehiculo", "vehiculos", "autos", "carro", "coche", "modelo", "marca", "vehículo"], label: "vehiculos" },
  { terms: ["recomend", "suger", "mejor", "estrategia", "promocion", "promocionar", "destacar"], label: "recomendacion" },
  { terms: ["inventario", "stock", "existencias", "reserva", "reservados", "disponibles"], label: "inventario" },
];

function normalizeQuery(query: string) {
  return query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "");
}

function hasAnyTerm(query: string, terms: string[]) {
  return terms.some((term) => query.includes(term));
}

const RELATED_TERMS = [
  "luxauto",
  "lux auto",
  "auto",
  "autos",
  "vehiculo",
  "vehículos",
  "vehiculos",
  "coche",
  "carro",
  "clientes",
  "venta",
  "ventas",
  "inventario",
  "stock",
  "reservado",
  "reservados",
  "modelo",
  "marca",
  "facturacion",
  "facturación",
];

function isRelatedQuery(query: string) {
  return hasAnyTerm(query, RELATED_TERMS);
}

function generateAiResponse(
  query: string,
  vehicles: Vehicle[],
  clients: Client[],
  sales: Sale[]
) {
  const lower = normalizeQuery(query);

  if (!query.trim()) {
    return `Escribe una pregunta concreta sobre inventario, clientes o ventas. Ejemplo: "¿Qué vehículo debo promocionar?"`;
  }

  if (!isRelatedQuery(lower)) {
    return "Solo respondo preguntas basadas en LuxAuto: inventario, clientes, ventas o vehículos de esta página.";
  }

  const topClient = clients.slice().sort((a, b) => b.totalGastado - a.totalGastado)[0] || null;
  const bestVehicle = vehicles.slice().sort((a, b) => b.precio - a.precio)[0] || null;
  const mostSoldType = vehicles.reduce((acc, vehicle) => {
    acc[vehicle.tipo] = (acc[vehicle.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topType = Object.entries(mostSoldType).sort(([, a], [, b]) => b - a)[0] || null;
  const recentSale = sales
    .slice()
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0] || null;
  const reservedCount = vehicles.filter((item) => item.estado === "reservado").length;

  if (hasAnyTerm(lower, KEYWORDS[0].terms)) {
    if (!topClient) return "No hay datos suficientes sobre clientes.";
    if (hasAnyTerm(lower, ["mas gasto", "mayor gasto", "top cliente", "mejor cliente", "cliente vip"])) {
      return `El cliente con mayor gasto es ${topClient.nombre}, con ${topClient.compras} compras y $${topClient.totalGastado.toLocaleString()}.`;
    }
    if (hasAnyTerm(lower, ["cuantos clientes", "cantidad de clientes", "clientes totales"])) {
      return `Hay ${clients.length} clientes registrados en el sistema.`;
    }
    return `Hay ${clients.length} clientes en el sistema. El cliente con mayor gasto es ${topClient.nombre}.`;
  }

  if (hasAnyTerm(lower, KEYWORDS[1].terms)) {
    if (!sales.length) return "No hay ventas registradas.";
    if (hasAnyTerm(lower, ["ultima", "ultima", "reciente", "recientes"])) {
      return recentSale
        ? `La última venta fue de $${recentSale.precio.toLocaleString()} a ${clients.find((c) => c.id === recentSale.clienteId)?.nombre ?? "un cliente"} el ${recentSale.fecha}.`
        : "No hay ventas recientes.";
    }
    if (hasAnyTerm(lower, ["cuanto", "cantidad", "total", "cuantas ventas", "ventas totales"])) {
      return `Hay ${sales.length} ventas registradas en el sistema.`;
    }
    return `En total hay ${sales.length} ventas. La venta más reciente fue de $${recentSale?.precio.toLocaleString() ?? "N/D"}.`;
  }

  if (hasAnyTerm(lower, KEYWORDS[2].terms)) {
    if (!bestVehicle) return "No hay vehículos registrados.";
    if (hasAnyTerm(lower, ["promocionar", "recomienda", "destacar", "mejor vender", "sugerencia"])) {
      return `Recomiendo promocionar el ${bestVehicle.marca} ${bestVehicle.modelo} (${bestVehicle.año}), que es el vehículo más caro del inventario.`;
    }
    if (hasAnyTerm(lower, ["mas caro", "mayor precio", "vehiculo mas caro", "vehiculo mas caro"])) {
      return `El vehículo más caro es el ${bestVehicle.marca} ${bestVehicle.modelo} (${bestVehicle.año}) por $${bestVehicle.precio.toLocaleString()}.`;
    }
    return `Hay ${vehicles.length} vehículos en inventario. El vehículo más valioso es ${bestVehicle.marca} ${bestVehicle.modelo}.`;
  }

  if (hasAnyTerm(lower, KEYWORDS[4].terms)) {
    const availableVehicles = vehicles.filter((item) => item.estado !== "reservado");
    const topAvailable = availableVehicles
      .slice()
      .sort((a, b) => b.precio - a.precio)
      .slice(0, 3);

    if (!topAvailable.length) {
      return "No hay vehículos disponibles en este momento.";
    }

    if (
      hasAnyTerm(lower, ["mejores", "top", "top 3", "3 mejores", "disponibles", "mejores carros"]) ||
      hasAnyTerm(lower, ["inventario", "stock", "existencias", "cuantos", "cantidad", "total", "cuantos vehiculos", "vehiculos disponibles"])
    ) {
      return [
        `Top ${topAvailable.length} carros disponibles en inventario:`,
        ...topAvailable.map(
          (vehicle, index) =>
            `${index + 1}. ${vehicle.marca} ${vehicle.modelo} (${vehicle.año}) - $${vehicle.precio.toLocaleString()}`
        ),
      ].join("\n");
    }

    if (hasAnyTerm(lower, ["reservados", "reservado"])) {
      return `Hay ${reservedCount} vehículos reservados de un total de ${vehicles.length} vehículos.`;
    }
    if (hasAnyTerm(lower, ["cuantos", "cantidad", "total", "cuantos vehiculos", "stock"])) {
      return `El inventario tiene ${vehicles.length} vehículos registrados.`;
    }
    return `Inventario: ${vehicles.length} vehículos totales, ${reservedCount} reservados.`;
  }

  if (hasAnyTerm(lower, KEYWORDS[3].terms)) {
    return `Sugerencia: enfoca tus ventas en ${topType?.[0] ?? "los vehículos más vendidos"}, que es la categoría con más unidades disponibles.`;
  }

  return `No entendí tu pregunta. Pregunta algo concreto como "¿Qué vehículo debo promocionar?", "¿Cuántas ventas hay?" o "¿Quién es el cliente con mayor gasto?"`;
}

export function AiAssistant() {
  const { vehicles, clients, sales } = useData();
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string>(
    "Escribe una pregunta para recibir recomendaciones estratégicas de inventario, clientes o ventas."
  );

  const summary = useMemo(() => {
    const reservedCount = vehicles.filter((item) => item.estado === "reservado").length;
    const totalValue = vehicles.reduce((sum, item) => sum + item.precio, 0);
    return {
      reservedCount,
      totalValue,
      bestClient: clients.slice().sort((a, b) => b.totalGastado - a.totalGastado)[0],
      bestVehicle: vehicles.slice().sort((a, b) => b.precio - a.precio)[0],
    };
  }, [vehicles, clients]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const answer = generateAiResponse(query, vehicles, clients, sales);
    setResponse(answer);
  };

  return (
    <section className="bg-[#141416] border border-[#C9A84C]/10 rounded-lg p-6">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="text-xs text-[#6E6E7E] uppercase tracking-[0.2em] mb-2">Asistente IA</p>
          <h2 className="text-2xl text-[#F0EBE1] font-semibold">Sugerencias inteligentes</h2>
          <p className="text-sm text-[#6E6E7E] mt-1">
            Usa este asistente para obtener ideas rápidas de ventas, inventario y clientes.
          </p>
        </div>
        <div className="size-11 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center border border-[#C9A84C]/20">
          <Sparkles className="size-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg border border-[#C9A84C]/10 bg-[#0C0C0E] p-4">
          <p className="text-[10px] text-[#4A4A5A] uppercase tracking-[0.2em] mb-2">Valor total de inventario</p>
          <p className="text-xl text-[#C9A84C] font-semibold">${(summary.totalValue / 1000).toFixed(1)}k</p>
        </div>
        <div className="rounded-lg border border-[#C9A84C]/10 bg-[#0C0C0E] p-4">
          <p className="text-[10px] text-[#4A4A5A] uppercase tracking-[0.2em] mb-2">Reservados</p>
          <p className="text-xl text-[#C9A84C] font-semibold">{summary.reservedCount}</p>
        </div>
        <div className="rounded-lg border border-[#C9A84C]/10 bg-[#0C0C0E] p-4">
          <p className="text-[10px] text-[#4A4A5A] uppercase tracking-[0.2em] mb-2">Cliente top</p>
          <p className="text-xl text-[#C9A84C] font-semibold truncate">{summary.bestClient?.nombre}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-[10px] text-[#4A4A5A] uppercase tracking-[0.2em]">
          Pregunta para IA
        </label>
        <div className="flex gap-2 flex-col sm:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ej: ¿Qué vehículo debería promocionar?"
            className="w-full bg-[#0C0C0E] border border-[#C9A84C]/12 rounded-md px-4 py-3 text-sm text-[#F0EBE1] focus:border-[#C9A84C]/40 outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#C9A84C] px-4 py-3 text-sm font-semibold text-[#0A0A0C] hover:bg-[#D4B55A] transition-colors"
          >
            <Search className="size-4" />
            Consultar IA
          </button>
        </div>
      </form>

      <div className="mt-6 rounded-lg border border-[#C9A84C]/10 bg-[#0A0A0C] p-4 text-sm text-[#F0EBE1]">
        {response.split("\n").map((line, index) => (
          <p key={index} className="mt-2 first:mt-0">{line}</p>
        ))}
      </div>
    </section>
  );
}
