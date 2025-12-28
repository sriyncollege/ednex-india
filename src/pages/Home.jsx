import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { Link, useSearchParams } from "react-router-dom";

function getReadTime(text) {
  if (!text) return 1;
  return Math.max(1, Math.ceil(text.split(" ").length / 200));
}

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [searchParams] = useSearchParams();

  const category = searchParams.get("cat") || "All";

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
    category === "All"
      ? articles
      : articles.filter(a => a.category === category);

  return (
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

            <h2 className="font-semibold text-lg mt-3 leading-snug text-left">
              {a.title}
            </h2>

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
  );
}
