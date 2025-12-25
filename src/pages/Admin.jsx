import { useState } from "react";
import { getArticles, saveArticles } from "../data/storage";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState(getArticles());
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    image: "",
    category: "News",
    author: "",
    status: "Published",
    publishDate: "",
  });

  function logout() {
    localStorage.removeItem("admin");
    navigate("/login");
  }

  function resetForm() {
    setForm({
      title: "",
      content: "",
      image: "",
      category: "News",
      author: "",
      status: "Published",
      publishDate: "",
    });
    setEditId(null);
  }

  function saveArticle() {
    if (!form.title || !form.content || !form.author) return;

    let updated;
    if (editId) {
      updated = articles.map(a => a.id === editId ? { ...a, ...form } : a);
    } else {
      updated = [
        { id: Date.now().toString(), ...form, time: "Just now" },
        ...articles,
      ];
    }

    saveArticles(updated);
    setArticles(updated);
    resetForm();
  }

  function previewArticle(article) {
    localStorage.setItem("preview_article", JSON.stringify(article));
    window.open("/preview", "_blank");
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button onClick={logout} className="bg-red-600 text-white px-4 py-2">
          Logout
        </button>
      </div>

      <div className="bg-gray-100 p-4 mb-6">
        <input className="border p-2 w-full mb-2" placeholder="Title"
          value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input className="border p-2 w-full mb-2" placeholder="Author"
          value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
        <input className="border p-2 w-full mb-2" placeholder="Image URL"
          value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
        <textarea className="border p-2 w-full mb-2" rows="4" placeholder="Content"
          value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />

        <div className="flex gap-3 mb-2">
          <select className="border p-2" value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}>
            <option>News</option>
            <option>Campus</option>
            <option>Careers</option>
            <option>Opinion</option>
            <option>Interviews</option>
          </select>

          <select className="border p-2" value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}>
            <option>Published</option>
            <option>Draft</option>
          </select>

          <input type="date" className="border p-2"
            value={form.publishDate}
            onChange={e => setForm({ ...form, publishDate: e.target.value })} />
        </div>

        <button onClick={saveArticle} className="bg-green-600 text-white px-4 py-2">
          {editId ? "Update" : "Add"} Article
        </button>
      </div>

      {articles.map(a => (
        <div key={a.id} className="flex justify-between border-b py-3">
          <div>
            <div className="font-semibold">
              {a.title}
              {a.status === "Draft" && (
                <span className="text-xs text-orange-600 ml-2">(Draft)</span>
              )}
            </div>
            <div className="text-sm text-gray-500">{a.category} · {a.author}</div>
          </div>
          <div className="space-x-3">
            <button onClick={() => previewArticle(a)} className="text-green-600">Preview</button>
            <button onClick={() => setEditId(a.id) || setForm(a)} className="text-blue-600">Edit</button>
          </div>
        </div>
      ))}
    </div>
  );
}
