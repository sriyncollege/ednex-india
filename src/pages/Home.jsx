import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

export default function Home() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    const snap = await getDocs(collection(db, "articles"));
    const list = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(a => a.status === "Published");
    setArticles(list);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-8">
      {articles.map(a => (
        <Link key={a.id} to={`/article/${a.id}`}>
          <div>
            {a.image && <img src={a.image} className="w-full h-48 object-cover" />}
            <span className="bg-orange-500 text-white text-sm px-2 py-1 mt-3 inline-block">
              {a.category}
            </span>
            <h2 className="font-semibold text-lg mt-2">{a.title}</h2>
            <p className="text-sm text-gray-500">{a.author}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
