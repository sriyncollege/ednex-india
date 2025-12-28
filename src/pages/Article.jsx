import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

export default function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const snap = await getDoc(doc(db, "articles", id));
    if (snap.exists()) setArticle(snap.data());
  }

  if (!article) return <div className="p-6">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {article.image && <img src={article.image} className="w-full h-72 object-cover mb-6" />}
      <h1 className="text-3xl font-bold">{article.title}</h1>
      {article.subtitle && <h2 className="italic text-gray-700 mt-2">{article.subtitle}</h2>}
      <p className="text-sm text-gray-500 mt-2">{article.author}</p>
      <div className="mt-6 text-lg whitespace-pre-line">{article.content}</div>
    </div>
  );
}
