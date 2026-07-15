import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Inventory } from "./components/Inventory";
import { Clients } from "./components/Clients";
import { Sales } from "./components/Sales";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "inventario", Component: Inventory },
      { path: "clientes", Component: Clients },
      { path: "ventas", Component: Sales },
    ],
  },
]);
