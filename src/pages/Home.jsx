import { Link, useSearchParams } from "react-router-dom";
import { getArticles } from "../data/storage";
import { useState } from "react";

export default function Home() {
  const [params] = useSearchParams();
  const category = params.get("cat");

  const allArticles = getArticles().filter((a) => {
    if (a.status !== "Published") return false;
    if (!a.publishDate) return true;
    return new Date(a.publishDate) <= new Date();
  });

  const articles = category
    ? allArticles.filter((a) => a.category === category)
    : allArticles;

  const [visible, setVisible] = useState(6);

  return (
    <div className="bg-white">
      {/* ARTICLES GRID */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {articles.slice(0, visible).map((a) => (
          <Link key={a.id} to={`/article/${a.id}`}>
            <div className="cursor-pointer border rounded overflow-hidden hover:shadow-lg transition">
              {a.image && (
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-full h-52 object-cover"
                />
              )}

              <div className="p-4">
                <span className="bg-orange-500 text-white text-sm px-3 py-1 inline-block">
                  {a.category}
                </span>

                <h2 className="font-semibold text-lg mt-3 hover:underline">
                  {a.title}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {a.author} · {a.time}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* READ MORE */}
      {visible < articles.length && (
        <div className="text-center my-8">
          <button
            onClick={() => setVisible(visible + 6)}
            className="border px-10 py-3 text-lg hover:bg-gray-100"
          >
            Read More
          </button>
        </div>
      )}
    </div>
  );
}
