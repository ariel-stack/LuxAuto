import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import {
  vehicles as initialVehicles,
  clients as initialClients,
  sales as initialSales,
  reservations as initialReservations,
  type Vehicle,
  type Client,
  type Sale,
  type Reservation,
} from "../data/mockData";

// Detectar IP local del servidor (por defecto localhost)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface DataContextType {
  vehicles: Vehicle[];
  clients: Client[];
  sales: Sale[];
  reservations: Reservation[];
  loading: boolean;
  setLoading: (v: boolean) => void;
  addVehicle: (v: Omit<Vehicle, "id">) => void;
  updateVehicle: (id: string, v: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  addClient: (c: Omit<Client, "id">) => void;
  updateClient: (id: string, c: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addSale: (s: Omit<Sale, "id">) => void;
  updateSale: (id: string, s: Partial<Sale>) => void;
  deleteSale: (id: string) => void;
  addReservation: (r: Omit<Reservation, "id">) => void;
  updateReservation: (id: string, r: Partial<Reservation>) => void;
  deleteReservation: (id: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

let nextId = 100;
const uid = () => String(++nextId);

// API helpers
const apiCall = async (endpoint: string, method: "GET" | "POST" | "PUT" | "DELETE" = "GET", body?: unknown) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.warn(`API error (${endpoint}):`, error);
    return null;
  }
};

// Fallback a localStorage si servidor no está disponible
const loadFromStorage = (key: string, fallback: unknown) => {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key: string, data: unknown) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      console.warn(`Storage error: ${key}`);
    }
  }
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() =>
    loadFromStorage("luxauto_vehicles", initialVehicles)
  );
  const [clients, setClients] = useState<Client[]>(() =>
    loadFromStorage("luxauto_clients", initialClients)
  );
  const [sales, setSales] = useState<Sale[]>(() =>
    loadFromStorage("luxauto_sales", initialSales)
  );
  const [reservations, setReservations] = useState<Reservation[]>(() =>
    loadFromStorage("luxauto_reservations", initialReservations)
  );

  const [loading, setLoading] = useState<boolean>(false);

  const loadingRef = useRef(false);

  // Cargar datos del servidor al iniciar
  useEffect(() => {
    if (loadingRef.current) return;
    // don't redeclare loadingRef here - use the one defined above
    const loadServerData = async () => {
      setLoading(true);
      const [vehiclesData, clientsData, salesData, reservationsData] = await Promise.all([
        apiCall("/api/vehicles"),
        apiCall("/api/clients"),
        apiCall("/api/sales"),
        apiCall("/api/reservations"),
      ]);

      if (vehiclesData) {
        setVehicles(vehiclesData);
        saveToStorage("luxauto_vehicles", vehiclesData);
      }
      if (clientsData) {
        setClients(clientsData);
        saveToStorage("luxauto_clients", clientsData);
      }
      if (salesData) {
        setSales(salesData);
        saveToStorage("luxauto_sales", salesData);
      }
      if (reservationsData) {
        setReservations(reservationsData);
        saveToStorage("luxauto_reservations", reservationsData);
      }
      setLoading(false);
    };

    // Esperar un poco para que el servidor esté listo
    setTimeout(loadServerData, 500);
  }, []);

  // Sincronizar vehículos con servidor y almacenamiento local
  useEffect(() => {
    saveToStorage("luxauto_vehicles", vehicles);
    // Optionally sync to server (commented out to avoid too many requests)
    // vehicles.forEach(v => apiCall("/api/vehicles", "PUT", v));
  }, [vehicles]);

  // Sincronizar clientes
  useEffect(() => {
    saveToStorage("luxauto_clients", clients);
  }, [clients]);

  // Sincronizar ventas
  useEffect(() => {
    saveToStorage("luxauto_sales", sales);
  }, [sales]);

  // Sincronizar reservaciones
  useEffect(() => {
    saveToStorage("luxauto_reservations", reservations);
  }, [reservations]);

  const addVehicle = (v: Omit<Vehicle, "id">) => {
    const newVehicle = { ...v, id: uid() };
    setLoading(true);
    setVehicles((prev) => [...prev, newVehicle]);
    apiCall("/api/vehicles", "POST", newVehicle)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const updateVehicle = (id: string, v: Partial<Vehicle>) => {
    setLoading(true);
    setVehicles((prev) =>
      prev.map((x) => (x.id === id ? { ...x, ...v } : x))
    );
    apiCall("/api/vehicles/" + id, "PUT", v)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const deleteVehicle = (id: string) => {
    setLoading(true);
    setVehicles((prev) => prev.filter((x) => x.id !== id));
    apiCall("/api/vehicles/" + id, "DELETE")
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const addClient = (c: Omit<Client, "id">) => {
    const newClient = { ...c, id: uid() };
    setLoading(true);
    setClients((prev) => [...prev, newClient]);
    apiCall("/api/clients", "POST", newClient)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const updateClient = (id: string, c: Partial<Client>) => {
    setLoading(true);
    setClients((prev) =>
      prev.map((x) => (x.id === id ? { ...x, ...c } : x))
    );
    apiCall("/api/clients/" + id, "PUT", c)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const deleteClient = (id: string) => {
    setLoading(true);
    setClients((prev) => prev.filter((x) => x.id !== id));
    apiCall("/api/clients/" + id, "DELETE")
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const addSale = (s: Omit<Sale, "id">) => {
    const newSale = { ...s, id: uid() };
    setLoading(true);
    setSales((prev) => [...prev, newSale]);
    apiCall("/api/sales", "POST", newSale)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const updateSale = (id: string, s: Partial<Sale>) => {
    setLoading(true);
    setSales((prev) =>
      prev.map((x) => (x.id === id ? { ...x, ...s } : x))
    );
    apiCall("/api/sales/" + id, "PUT", s)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const deleteSale = (id: string) => {
    setLoading(true);
    setSales((prev) => prev.filter((x) => x.id !== id));
    apiCall("/api/sales/" + id, "DELETE")
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const addReservation = (r: Omit<Reservation, "id">) => {
    const newReservation = { ...r, id: uid() };
    setLoading(true);
    setReservations((prev) => [...prev, newReservation]);
    apiCall("/api/reservations", "POST", newReservation)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const updateReservation = (id: string, r: Partial<Reservation>) => {
    setLoading(true);
    setReservations((prev) =>
      prev.map((x) => (x.id === id ? { ...x, ...r } : x))
    );
    apiCall("/api/reservations/" + id, "PUT", r)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const deleteReservation = (id: string) => {
    setLoading(true);
    setReservations((prev) => prev.filter((x) => x.id !== id));
    apiCall("/api/reservations/" + id, "DELETE")
      .catch(console.error)
      .finally(() => setLoading(false));
  };

    return (
    <DataContext.Provider
      value={{
        vehicles,
        clients,
        sales,
        reservations,
        loading,
        setLoading,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addClient,
        updateClient,
        deleteClient,
        addSale,
        updateSale,
        deleteSale,
        addReservation,
        updateReservation,
        deleteReservation,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
}
