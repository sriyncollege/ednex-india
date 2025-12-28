import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

const categories = ["All", "News", "Campus", "Careers", "Opinion", "Interviews"];

function getReadTime(text) {
  if (!text) return 1;
  return Math.max(1, Math.ceil(text.split(" ").length / 200));
}

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    const q = query(
      collection(db, "articles"),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    const list = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(a => a.status === "Published");
    setArticles(list);
  }

  const filtered =
    activeCategory === "All"
      ? articles
      : articles.filter(a => a.category === activeCategory);

  return (
    <div className="bg-white">
      {/* CATEGORY BAR */}
      <div className="bg-orange-500 text-white overflow-x-auto">
        <div className="max-w-7xl mx-auto flex space-x-8 px-6 py-4 text-lg font-semibold">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap ${
                activeCategory === cat ? "underline" : ""
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ARTICLES GRID */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filtered.map(a => (
          <Link key={a.id} to={`/article/${a.id}`}>
            <div className="cursor-pointer">
              {a.image && (
                <img
                  src={a.image}
                  className="w-full h-52 object-cover"
                  alt=""
                />
              )}

              <span className="bg-orange-500 text-white text-sm px-3 py-1 inline-block mt-3">
                {a.category}
              </span>

              <h2 className="font-semibold text-lg mt-3 leading-snug">
                {a.title}
              </h2>

              {a.subtitle && (
                <p className="italic text-gray-600 mt-1">
                  {a.subtitle}
                </p>
              )}

              <p className="text-sm text-gray-500 mt-2">
                {a.author}
                {" · "}
                {a.publishDate
                  ? new Date(a.publishDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : ""}
                {" · "}
                {getReadTime(a.content)} min read
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
