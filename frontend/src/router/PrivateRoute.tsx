import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const PrivateRoute = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    axios
      .get("/api/session", { withCredentials: true })
      .then((res) => setIsLoggedIn(!!res.data.npm)) // Cek apakah user login
      .catch(() => setIsLoggedIn(false));
  }, []);

  if (isLoggedIn === null) {
    return <div>Testtt...</div>; // Tampilkan loading saat verifikasi login
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
