import { createContext, useContext, useState, type ReactNode } from "react";
import { clients } from "../data/mockData";
import { useData } from "./DataContext";

export type Role = "admin" | "client";

export interface AuthUser {
  email: string;
  nombre: string;
  apellido?: string;
  telefono?: string;
  role: Role;
  clienteId?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (email: string, password: string, clientData: { nombre: string; apellido: string; email: string; telefono: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_ACCOUNTS = [
  {
    email: "admin@luxauto.com",
    passwordHash:
      "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9",
    nombre: "Administrador",
  },
  {
    email: "gerente@luxauto.com",
    passwordHash:
      "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9",
    nombre: "Gerente General",
  },
  {
    email: "director@luxauto.com",
    passwordHash:
      "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9",
    nombre: "Director Comercial",
  },
  {
    email: "ariel@luxauto.com",
    passwordHash:
      "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9",
    nombre: "Director Comercial",
  },
];

const CLIENT_PASSWORD_HASH =
  "09a31a7001e261ab1e056182a71d3cf57f582ca9a29cff5eb83be0f0549730a9";

// Almacenar clientes nuevos en localStorage
const getStoredClients = (): Record<string, { password: string; data: any }> => {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem("luxauto_client_accounts");
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveStoredClients = (data: Record<string, { password: string; data: any }>) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("luxauto_client_accounts", JSON.stringify(data));
    } catch {
      console.warn("Error saving client accounts");
    }
  }
};

async function hashPassword(password: string) {
  const data = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const { addClient } = useData();

  const login = async (
    email: string,
    password: string,
  ): Promise<{ ok: boolean; error?: string }> => {
    const emailLower = email.trim().toLowerCase();
    const hashedPassword = await hashPassword(password);

    const admin = ADMIN_ACCOUNTS.find(
      (a) => a.email === emailLower && a.passwordHash === hashedPassword,
    );
    if (admin) {
      setUser({ email: admin.email, nombre: admin.nombre, role: "admin" });
      return { ok: true };
    }

    // Buscar en clientes de demostración
    if (hashedPassword === CLIENT_PASSWORD_HASH) {
      const client = clients.find((c) => c.email.toLowerCase() === emailLower);
      if (client) {
        setUser({
          email: client.email,
          nombre: client.nombre,
          apellido: client.apellido,
          telefono: client.telefono,
          role: "client",
          clienteId: client.id,
        });
        return { ok: true };
      }
    }

    // Buscar en clientes creados recientemente
    const storedClients = getStoredClients();
    const storedClient = storedClients[emailLower];
    if (storedClient && storedClient.password === password) {
      const clientData = storedClient.data;
      setUser({
        email: clientData.email,
        nombre: clientData.nombre,
        apellido: clientData.apellido,
        telefono: clientData.telefono,
        role: "client",
        clienteId: clientData.id,
      });
      return { ok: true };
    }

    return {
      ok: false,
      error: "Credenciales incorrectas. Verifique su email y contraseña.",
    };
  };

  const signup = async (
    email: string,
    password: string,
    clientData: { nombre: string; apellido: string; email: string; telefono: string },
  ): Promise<{ ok: boolean; error?: string }> => {
    const emailLower = email.trim().toLowerCase();

    // Verificar si el email ya existe
    const existingAdmin = ADMIN_ACCOUNTS.find((a) => a.email === emailLower);
    if (existingAdmin) {
      return { ok: false, error: "Este email ya está registrado" };
    }

    const existingClient = clients.find((c) => c.email.toLowerCase() === emailLower);
    if (existingClient) {
      return { ok: false, error: "Este email ya está registrado" };
    }

    const storedClients = getStoredClients();
    if (storedClients[emailLower]) {
      return { ok: false, error: "Este email ya está registrado" };
    }

    // Crear nuevo cliente
    const newClientData = {
      id: `client_${Date.now()}`,
      ...clientData,
      email: emailLower,
    };

    // Guardar en localStorage
    storedClients[emailLower] = {
      password,
      data: newClientData,
    };
    saveStoredClients(storedClients);

    // También agregar a la base de datos del contexto
    try {
      addClient(newClientData);
    } catch (error) {
      console.warn("Error adding client to data context:", error);
    }

    return { ok: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
