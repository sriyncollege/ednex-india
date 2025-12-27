import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Preview from "./pages/Preview";

export default function App() {
  return (
    <Router>
      {/* HEADER */}
      <header className="border-b sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-5xl font-extrabold text-orange-600">
            Education Nexus of India
          </h1>
          <p className="text-lg text-gray-600 mt-1">
            Education News • Campus • Careers • Opinion
          </p>
        </div>

        {/* NAV */}
        <nav className="bg-orange-500 text-white">
          <div className="max-w-7xl mx-auto flex gap-6 px-4 py-3 text-lg font-semibold">
            <Link to="/">Home</Link>
            <Link to="/?cat=News">News</Link>
            <Link to="/?cat=Campus">Campus</Link>
            <Link to="/?cat=Careers">Careers</Link>
            <Link to="/?cat=Opinion">Opinion</Link>
            <Link to="/login">Admin</Link>
          </div>
        </nav>
      </header>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/preview" element={<Preview />} />
      </Routes>

      {/* FOOTER */}
      <footer className="border-t py-6 text-center text-sm text-gray-500">
        © 2025 Education Nexus of India
      </footer>
    </Router>
  );
}
