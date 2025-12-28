import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllArticles } from "../data/firestore";

export default function Home() {
  const [params] = useSearchParams();
  const category = params.get("cat");

  const [articles, setArticles] = useState([]);
  const [visible, setVisible] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    const data = await getAllArticles();

    const published = data.filter((a) => {
      if (a.status !== "Published") return false;
      if (!a.publishDate) return true;
      return new Date(a.publishDate) <= new Date();
    });

    setArticles(published);
    setLoading(false);
  }

  const filtered = category
    ? articles.filter((a) => a.category === category)
    : articles;

  if (loading) {
    return (
      <div className="text-center py-20 text-lg text-gray-500">
        Loading articles…
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filtered.slice(0, visible).map((a) => (
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
                  {a.author} ·{" "}
                  {a.publishDate
                    ? new Date(a.publishDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Just now"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {visible < filtered.length && (
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
