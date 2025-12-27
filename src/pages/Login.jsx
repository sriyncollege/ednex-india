import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const nav = useNavigate();

  function login() {
    if (u === "admin" && p === "ednex@123") {
      localStorage.setItem("admin", "true");
      nav("/admin");
    } else alert("Invalid login");
  }

  return (
    <div className="max-w-sm mx-auto p-6">
      <input placeholder="Username" className="border p-2 w-full mb-2" onChange={e=>setU(e.target.value)} />
      <input type="password" placeholder="Password" className="border p-2 w-full mb-2" onChange={e=>setP(e.target.value)} />
      <button onClick={login} className="bg-orange-500 text-white w-full py-2">
        Login
      </button>
    </div>
  );
}
