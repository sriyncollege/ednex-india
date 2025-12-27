import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getArticles, saveArticles } from "../data/storage";

export default function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("admin")) {
      navigate("/login");
    }
  }, [navigate]);

  const [articles, setArticles] = useState(getArticles());
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("News");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("Published");

  function addArticle() {
    if (!title || !content || !author) return;

    const updated = [
      {
        id: Date.now().toString(),
        title,
        content,
        category,
        author,
        status,
        time: "Just now",
      },
      ...articles,
    ];

    saveArticles(updated);
    setArticles(updated);
    setTitle("");
    setContent("");
    setAuthor("");
  }

  function logout() {
    localStorage.removeItem("admin");
    navigate("/login");
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button onClick={logout} className="text-red-600">
          Logout
        </button>
      </div>

      <div className="bg-gray-100 p-4 mb-6 rounded">
        <input
          className="border p-2 w-full mb-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Content"
          rows="4"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex gap-2 mb-2">
          <select
            className="border p-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>News</option>
            <option>Campus</option>
            <option>Careers</option>
            <option>Opinion</option>
          </select>

          <select
            className="border p-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Published</option>
            <option>Draft</option>
          </select>
        </div>

        <button
          onClick={addArticle}
          className="bg-orange-500 text-white px-4 py-2"
        >
          Add Article
        </button>
      </div>
    </div>
  );
}
