import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

function getReadTime(text = "") {
  return Math.max(1, Math.ceil(text.split(" ").length / 200));
}

function formatContent(text = "") {
  return text
    .replace(/\*\*\*(.*?)\*\*\*/g, "<b><i>$1</i></b>")
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.*?)\*/g, "<i>$1</i>")
    .replace(/\n/g, "<br />");
}

export default function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const ref = doc(db, "articles", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setError("Article not found");
          return;
        }

        const d = snap.data();

        setArticle({
          title: d.title || "Untitled",
          subtitle: d.subtitle || "",
          content: d.content || "",
          image: d.image || "",
          imageCaption: d.imageCaption || "",
          category: d.category || "News",
          author: d.author || "Education Nexus Desk",
          publishDate: d.publishDate || "",
        });
      } catch (e) {
        setError("Unable to load article");
      }
    }

    load();
  }, [id]);

  if (error) {
    return (
      <div className="p-10 text-center text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  if (!article) {
    return <div className="p-10 text-center">Loading…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {article.image && (
        <>
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-72 object-cover mb-2"
          />
          {article.imageCaption && (
            <p className="text-sm text-gray-500 italic mb-6">
              {article.imageCaption}
            </p>
          )}
        </>
      )}

      <span className="bg-orange-500 text-white px-3 py-1 text-sm">
        {article.category}
      </span>

      <h1 className="text-3xl md:text-4xl font-bold mt-4 leading-tight">
        {article.title}
      </h1>

      {article.subtitle && (
        <h2 className="text-lg italic text-gray-700 mt-3">
          {article.subtitle}
        </h2>
      )}

      <p className="text-sm text-gray-500 mt-4">
        {article.author}
        {" · "}
        {article.publishDate &&
          new Date(article.publishDate).toLocaleDateString("en-IN")}
        {" · "}
        {getReadTime(article.content)} min read
      </p>

      <div
        className="mt-8 text-lg leading-relaxed text-justify prose max-w-none"
        dangerouslySetInnerHTML={{
          __html: formatContent(article.content),
        }}
      />
    </div>
  );
}
