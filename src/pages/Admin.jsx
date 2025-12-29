import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    content: "",
    image: "",
    imageCaption: "",
    category: "News",
    author: "",
    status: "Published",
    publishDate: "",
  });

  // 🔐 PROTECT ADMIN USING FIREBASE AUTH (FINAL FIX)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (!user) {
        navigate("/login");
      } else {
        loadArticles();
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // 🔄 LOAD ARTICLES
  async function loadArticles() {
    const q = query(
      collection(db, "articles"),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    setArticles(list);
  }

  // 🔓 LOGOUT (FIREBASE)
  async function logout() {
    await signOut(auth);
    navigate("/login");
  }

  // ♻ RESET FORM
  function resetForm() {
    setForm({
      title: "",
      subtitle: "",
      content: "",
      image: "",
      imageCaption: "",
      category: "News",
      author: "",
      status: "Published",
      publishDate: "",
    });
    setEditId(null);
  }

  // 💾 SAVE / UPDATE ARTICLE
  async function saveArticle() {
    if (!form.title || !form.content || !form.author) {
      alert("Title, content and author are required");
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

  // 🔍 PREVIEW ARTICLE
  function previewArticle(article) {
    localStorage.setItem("preview_article", JSON.stringify(article));
    window.open("/preview", "_blank");
  }

  // ❌ DELETE ARTICLE
  async function deleteArticle(id) {
    if (!window.confirm("Delete this article permanently?")) return;
    await deleteDoc(doc(db, "articles", id));
    loadArticles();
  }

  // ⏳ LOADING STATE
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Checking admin access...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* ADD / EDIT FORM */}
      <div className="bg-gray-100 p-4 rounded mb-8">
        <input
          className="border p-2 w-full mb-2"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Subtitle (italic line below title)"
          value={form.subtitle}
          onChange={e => setForm({ ...form, subtitle: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Author"
          value={form.author}
          onChange={e => setForm({ ...form, author: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Image URL"
          value={form.image}
          onChange={e => setForm({ ...form, image: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Image caption (optional)"
          value={form.imageCaption}
          onChange={e =>
            setForm({ ...form, imageCaption: e.target.value })
          }
        />

        <textarea
          className="border p-2 w-full mb-2"
          rows="6"
          placeholder="Content (use **bold**, *italic*, ***bold italic***)"
          value={form.content}
          onChange={e => setForm({ ...form, content: e.target.value })}
        />

        <div className="flex flex-wrap gap-3 mb-3">
          <select
            className="border p-2"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
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
            onChange={e => setForm({ ...form, status: e.target.value })}
          >
            <option>Published</option>
            <option>Draft</option>
          </select>

          <input
            type="date"
            className="border p-2"
            value={form.publishDate}
            onChange={e =>
              setForm({ ...form, publishDate: e.target.value })
            }
          />
        </div>

        <button
          onClick={saveArticle}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          {editId ? "Update Article" : "Add Article"}
        </button>
      </div>

      {/* EXISTING ARTICLES */}
      <h3 className="text-xl font-semibold mb-4">
        Existing Articles
      </h3>

      {articles.length === 0 && (
        <p className="text-gray-500">No articles found</p>
      )}

      {articles.map(a => (
        <div
          key={a.id}
          className="flex justify-between items-start border-b py-4"
        >
          <div>
            <div className="font-semibold">
              {a.title}
              {a.status === "Draft" && (
                <span className="text-xs text-orange-600 ml-2">
                  (Draft)
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {a.category} · {a.author}
            </div>
          </div>

          <div className="space-x-4 text-sm">
            <button
              onClick={() => previewArticle(a)}
              className="text-green-600"
            >
              Preview
            </button>

            <button
              onClick={() => {
                setEditId(a.id);
                setForm(a);
              }}
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
