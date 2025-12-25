import { Link } from "react-router-dom";
import { getArticles } from "../data/storage";
import { useState } from "react";

const categories = ["All", "News", "Campus", "Careers", "Opinion", "Interviews"];

export default function Home() {
  const articles = getArticles().filter(a => {
    if (a.status !== "Published") return false;
    if (!a.publishDate) return true;
    return new Date(a.publishDate) <= new Date();
  });

  const [active, setActive] = useState("All");
  const [visible, setVisible] = useState(6);

  const filtered =
    active === "All"
      ? articles
      : articles.filter(a => a.category === active);

  return (
    <div className="bg-white">
      {/* CATEGORY BAR */}
      <div className="bg-orange-500 text-white overflow-x-auto">
        <div className="max-w-7xl mx-auto flex space-x-10 px-6 py-4 text-xl font-semibold whitespace-nowrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActive(cat);
                setVisible(6);
              }}
              className={active === cat ? "underline" : ""}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ARTICLES */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filtered.slice(0, visible).map(a => (
          <Link key={a.id} to={`/article/${a.id}`}>
            <div className="cursor-pointer">
              {a.image && (
                <img src={a.image} className="w-full h-52 object-cover" />
              )}
              <span className="bg-orange-500 text-white text-sm px-3 py-1 inline-block mt-3">
                {a.category}
              </span>
              <h2 className="font-semibold text-lg mt-3 hover:underline">
                {a.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {a.author} · {a.time}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {visible < filtered.length && (
        <div className="text-center my-8">
          <button
            onClick={() => setVisible(visible + 6)}
            className="border px-10 py-3 text-lg"
          >
            Read More
          </button>
        </div>
      )}
    </div>
  );
}
