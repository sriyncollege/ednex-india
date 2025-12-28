import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // ✅ Persist admin session
      localStorage.setItem("admin", "true");

      console.log("LOGIN SUCCESS:", userCred.user.email);

      navigate("/admin");
    } catch (err) {
      console.error("FIREBASE LOGIN ERROR:", err);

      // ✅ Show real Firebase error
      setError(err.code || "Login failed");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded">
      <h2 className="text-2xl font-bold text-center mb-4">
        Admin Login
      </h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Admin Email"
          className="border p-2 w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-red-600 text-sm mb-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="bg-orange-500 text-white w-full py-2"
        >
          Login
        </button>
      </form>
    </div>
  );
}
