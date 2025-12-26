import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getArticles, saveArticles } from "../data/storage";

export default function Admin() {
  const navigate = useNavigate();

  // 🔐 PROTECT ADMIN PAGE
  useEffect(() => {
    if (!localStorage.getItem("admin")) {
      navigate("/login");
    }
  }, [navigate]);

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

  // 🔓 LOGOUT
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
    if (!form.title || !form.content || !form.author) {
      alert("Title, Content and Author are required");
      return;
    }

    let updatedArticles;

    if (editId) {
      // UPDATE
      updatedArticles = articles.map((a) =>
        a.id === editId ? { ...a, ...form } : a
      );
    } else {
      // ADD
      updatedArticles = [
        {
          id: Date.now().toString(),
          ...form,
          time: "Just now",
        },
        ...articles,
      ];
    }

    saveArticles(updatedArticles);
    setArticles(updatedArticles);
    resetForm();
  }

  function editArticle(article) {
    setForm({
      title: article.title,
      content: article.content,
      image: article.image || "",
      category: article.category,
      author: article.author,
      status: article.status || "Published",
      publishDate: article.publishDate || "",
    });
    setEditId(article.id);
  }

  function deleteArticle(id) {
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    const updated = articles.filter((a) => a.id !== id);
    saveArticles(updated);
    setArticles(updated);
  }

  function previewArticle(article) {
    localStorage.setItem("preview_article", JSON.stringify(article));
    window.open("/preview", "_blank");
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2"
        >
          Logout
        </button>
      </div>

      {/* FORM */}
      <div className="bg-gray-100 p-4 rounded mb-6">
        <input
          className="border p-2 w-full mb-2"
          placeholder="Article Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Author Name"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Image URL (https://...)"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />

        <textarea
          className="border p-2 w-full mb-2"
          rows="5"
          placeholder="Article Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />

        <div className="flex flex-wrap gap-3 mb-3">
          <select
            className="border p-2"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option>News</option>
            <option>Campus</option>
            <option>Careers</option>
            <option>Opinion</option>
            <option>Interviews</option>
          </select>

          <select
            className="border p-2"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option>Published</option>
            <option>Draft</option>
          </select>

          <input
            type="date"
            className="border p-2"
            value={form.publishDate}
            onChange={(e) =>
              setForm({ ...form, publishDate: e.target.value })
            }
          />
        </div>

        <div className="space-x-2">
          <button
            onClick={saveArticle}
            className="bg-green-600 text-white px-4 py-2"
          >
            {editId ? "Update Article" : "Add Article"}
          </button>

          {editId && (
            <button
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ARTICLE LIST */}
      {articles.map((a) => (
        <div
          key={a.id}
          className="flex justify-between items-center border-b py-3"
        >
          <div>
            <div className="font-semibold">
              {a.title}
              {a.status === "Draft" && (
                <span className="ml-2 text-xs text-orange-600">(Draft)</span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {a.category} · {a.author}
            </div>
          </div>

          <div className="space-x-3">
            <button
              onClick={() => previewArticle(a)}
              className="text-green-600"
            >
              Preview
            </button>
            <button
              onClick={() => editArticle(a)}
              className="text-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => deleteArticle(a.id)}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
