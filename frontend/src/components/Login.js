import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINT } from "../api";
import { AuthContext } from "../provider/flashcards"
import { useContext } from 'react';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { onLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include", // This is the missing part
      });

      if (response.status === 200) {
        onLogin();
        navigate("/flashcards");
      } else {
        console.error("Fehler beim Einloggen:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Fehler beim Einloggen:", error);
    }
  };


  return (
    <div className="login-form">
      <h2>Login</h2>
      <div>
        <label htmlFor="username">Benutzername:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Passwort:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Einloggen</button>
    </div>
  );
}

export default Login;
