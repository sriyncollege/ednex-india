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
          <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 tracking-wide">
            Education Nexus of India
          </h1>
        </div>
      </header>

      {/* PUBLIC NAVBAR */}
      <nav className="bg-orange-500 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-6 px-6 py-4 text-lg font-semibold">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/?cat=News" className="hover:underline">News</Link>
          <Link to="/?cat=Campus" className="hover:underline">Campus</Link>
          <Link to="/?cat=Careers" className="hover:underline">Careers</Link>
          <Link to="/?cat=Opinion" className="hover:underline">Opinion</Link>
          <Link to="/?cat=Interviews" className="hover:underline">Interviews</Link>
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
        © 2025 Education Nexus of India
      </footer>
    </>
  );
}
