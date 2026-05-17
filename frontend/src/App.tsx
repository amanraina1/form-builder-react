import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Mini/Navbar";
import { setUnauthorizedHandler } from "./lib/axios";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    setUnauthorizedHandler((redirectTo: string) => {
      navigate(`/login?redirect=${encodeURIComponent(redirectTo)}`, {
        replace: true,
      });
    });
  }, [navigate]);

  return (
    <main className="app-wrapper">
      <Navbar />
      <div className="main bg-gray-100 min-h-screen">
        <Outlet />
      </div>
    </main>
  );
}
