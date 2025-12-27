import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticle();
  }, []);

  async function loadArticle() {
    try {
      const ref = doc(db, "articles", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        // Hide drafts from public
        if (data.status !== "Published") {
          setArticle(null);
        } else {
          // Respect publish date
          if (data.publishDate && new Date(data.publishDate) > new Date()) {
            setArticle(null);
          } else {
            setArticle(data);
          }
        }
      } else {
        setArticle(null);
      }
    } catch (err) {
      setArticle(null);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="text-center py-20 text-lg text-gray-500">
        Loading article…
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Article not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {article.image && (
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-96 object-cover mb-6"
        />
      )}

      <span className="bg-orange-500 text-white px-3 py-1 text-sm">
        {article.category}
      </span>

      <h1 className="text-3xl font-bold mt-4">
        {article.title}
      </h1>

      <p className="text-sm text-gray-500 mt-2">
        {article.author} · {article.time || ""}
      </p>

      <div className="mt-6 text-lg leading-relaxed whitespace-pre-line">
        {article.content}
      </div>
    </div>
  );
}
