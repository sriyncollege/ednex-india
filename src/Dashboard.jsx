import { useState } from "react";

export default function Dashboard({ articles, setArticles }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("News");

  function add() {
    if (!title) return;
    setArticles([
      ...articles,
      {
        title,
        category,
        source: "Admin",
        time: "Just now",
        read: "2 min read",
        img: "https://images.unsplash.com/photo-1529070538774-1843cb3265df",
      },
    ]);
    setTitle("");
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      <div className="flex mb-4 gap-2">
        <input
          className="border p-2 flex-1"
          placeholder="Article title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className="border p-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>News</option>
          <option>Campus</option>
          <option>Policy</option>
          <option>Careers</option>
        </select>
        <button className="bg-green-500 text-white px-4" onClick={add}>
          Add
        </button>
      </div>

      {articles.map((a, i) => (
        <div key={i} className="flex justify-between border p-2 mb-2">
          <span>{a.title} ({a.category})</span>
        </div>
      ))}
    </div>
  );
}
