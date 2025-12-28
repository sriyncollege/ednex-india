import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    content: "",
    image: "",
    category: "News",
    author: "",
    status: "Published",
    publishDate: "",
  });

  // 🔐 PROTECT ADMIN
  useEffect(() => {
    if (!localStorage.getItem("admin")) {
      navigate("/login");
    }
    loadArticles();
  }, []);

  async function loadArticles() {
    const snap = await getDocs(collection(db, "articles"));
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    setArticles(list);
  }

  function logout() {
    localStorage.removeItem("admin");
    navigate("/login");
  }

  function resetForm() {
    setForm({
      title: "",
      subtitle: "",
      content: "",
      image: "",
      category: "News",
      author: "",
      status: "Published",
      publishDate: "",
    });
    setEditId(null);
  }

  async function saveArticle() {
    if (!form.title || !form.content || !form.author) {
      alert("Title, content, author required");
      return;
    }

    if (editId) {
      await updateDoc(doc(db, "articles", editId), form);
    } else {
      await addDoc(collection(db, "articles"), {
        ...form,
        createdAt: new Date(),
      });
    }

    resetForm();
    loadArticles();
  }

  async function deleteArticle(id) {
    if (!window.confirm("Delete this article?")) return;
    await deleteDoc(doc(db, "articles", id));
    loadArticles();
  }

  function previewArticle(article) {
    localStorage.setItem("preview_article", JSON.stringify(article));
    window.open("/preview", "_blank");
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button onClick={logout} className="bg-red-600 text-white px-4 py-2">
          Logout
        </button>
      </div>

      {/* FORM */}
      <div className="bg-gray-100 p-4 mb-8">
        <input className="border p-2 w-full mb-2" placeholder="Title"
          value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />

        <input className="border p-2 w-full mb-2" placeholder="Subtitle"
          value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} />

        <input className="border p-2 w-full mb-2" placeholder="Author"
          value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />

        <input className="border p-2 w-full mb-2" placeholder="Image URL"
          value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />

        <textarea className="border p-2 w-full mb-2" rows="6" placeholder="Content"
          value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />

        <div className="flex gap-3 mb-3">
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

      {/* LIST */}
      {articles.map(a => (
        <div key={a.id} className="flex justify-between border-b py-3">
          <div>
            <div className="font-semibold">{a.title}</div>
            <div className="text-sm text-gray-500">{a.category} · {a.author}</div>
          </div>
          <div className="space-x-4">
            <button onClick={() => previewArticle(a)} className="text-green-600">Preview</button>
            <button onClick={() => { setEditId(a.id); setForm(a); }} className="text-blue-600">Edit</button>
            <button onClick={() => deleteArticle(a.id)} className="text-red-600">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
