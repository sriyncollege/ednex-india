import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Article from "./pages/Article";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Preview from "./pages/Preview";

export default function App() {
  return (
    <>
      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto py-6 text-center">
          <h1 className="text-6xl font-extrabold text-orange-600 tracking-wide">
            EdNex India
          </h1>
          <p className="text-xl text-gray-600 mt-2">
            The Education Nexus of India
          </p>
        </div>
      </header>

      {/* NAVBAR */}
      <nav className="bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 text-xl font-semibold">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/login" className="hover:underline">Admin</Link>
        </div>
      </nav>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:id" element={<Article />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/preview" element={<Preview />} />
      </Routes>

      {/* FOOTER */}
      <footer className="border-t mt-12 py-6 text-center text-sm text-gray-500">
        © 2025 EdNex India — The Education Nexus of India
      </footer>
    </>
  );
}
