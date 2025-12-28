import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

export default function Home() {
  const [articles, setArticles] = useState([]);

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

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {articles.map(a => (
        <Link key={a.id} to={`/article/${a.id}`}>
          <div className="cursor-pointer">
            {a.image && (
              <img src={a.image} className="w-full h-52 object-cover" />
            )}

            <span className="bg-orange-500 text-white text-sm px-3 py-1 inline-block mt-3">
              {a.category}
            </span>

            <h2 className="font-semibold text-lg mt-2 leading-snug">
              {a.title}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {a.author}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
