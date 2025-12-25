import { useParams, Link } from "react-router-dom";
import { getArticles } from "../data/storage";

export default function Article() {
  const { id } = useParams();
  const article = getArticles().find(a => a.id === id);

  if (!article) return <p className="p-6">Article not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      <p className="text-gray-500 mb-4">
        {article.source} · {article.time}
      </p>

      {article.image && (
        <img src={article.image} className="w-full mb-4 rounded" />
      )}

      <p className="leading-relaxed whitespace-pre-line">
        {article.content}
      </p>

      <Link to="/" className="text-blue-500 mt-4 inline-block">
        ← Back
      </Link>
    </div>
  );
}
