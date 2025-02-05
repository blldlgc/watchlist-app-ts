import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import './index.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { DialogComponent } from './components/DialogManager';
import ProtectedRoute from './components/ProtectedRoute';
import { auth } from '@/config/firebase';
import SearchPage from './pages/SearchPage'
import WatchlistPage from './pages/WatchlistPage'
import WatchlistDetailPage from './pages/WatchlistDetailPage'
import { AnimatePresence } from 'framer-motion';

const AppRouter = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div></div>;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AnimatePresence mode="wait">
        <ProtectedRoute>
          <MainPage />
        </ProtectedRoute>
      </AnimatePresence>
    },
    {
      path: "/profile",
      element: 
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
    },
    {
      path: "/search",
      element: 
        <ProtectedRoute>
          <SearchPage />
        </ProtectedRoute>
    },
    {
      path: "/watchlist",
      element: 
        <ProtectedRoute>
          <WatchlistPage />
        </ProtectedRoute>
    },
    {
      path: "/watchlist/:id",
      element: 
        <ProtectedRoute>
          <WatchlistDetailPage />
        </ProtectedRoute>
    },
    {
      path: "/login",
      element: user ? <Navigate to="/" replace /> : <LoginPage />,
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
    <DialogComponent />
  </StrictMode>,
)
