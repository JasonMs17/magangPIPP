import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 🔹 Import useNavigate
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [npm, setNpm] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // 🔹 Inisialisasi navigate

  const handleLogin = async () => {
    setError(""); // Reset error saat login dimulai

    if (!npm.trim() || !password.trim()) {
      setError("NPM dan password harus diisi!");
      return;
    }

    setIsLoading(true); // Aktifkan loading

    try {
      const response = await axios.post(
        "/api/login",
        { npm, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        navigate("/dashboard"); // 🔹 Redirect ke halaman Dashboard
      } else {
        setError("NPM tidak ditemukan atau password salah!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("NPM tidak ditemukan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Masukkan NPM"
          value={npm}
          onChange={(e) => setNpm(e.target.value)}
          className={!npm.trim() && error ? "error-input" : ""}
        />
        <input
          type="password"
          placeholder="Masukkan Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={!password.trim() && error ? "error-input" : ""}
        />
        <button onClick={handleLogin} disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;
