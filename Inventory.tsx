import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { ClientPortal } from './components/ClientPortal';
import { ErrorBoundary } from './components/ErrorBoundary';

function AppRouter() {
  const { user } = useAuth();

  if (!user) return <Login />;
  if (user.role === 'client') return <ClientPortal />;
  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </DataProvider>
    </ErrorBoundary>
  );
}
