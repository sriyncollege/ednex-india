import { useParams } from "react-router-dom";
import { getArticles } from "../data/storage";

function getReadTime(text) {
  const words = text.split(" ").length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function Article() {
  const { id } = useParams();
  const article = getArticles().find(a => a.id === id);

  if (!article) {
    return <div className="p-6 text-center">Article not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {article.image && (
        <img
          src={article.image}
          className="w-full h-72 object-cover mb-6"
          alt=""
        />
      )}

      <span className="bg-orange-500 text-white px-3 py-1 text-sm">
        {article.category}
      </span>

      <h1 className="text-3xl md:text-4xl font-bold mt-4">
        {article.title}
      </h1>

      {article.subtitle && (
        <h2 className="text-lg md:text-xl italic text-gray-700 mt-3">
          {article.subtitle}
        </h2>
      )}

      <p className="text-sm text-gray-500 mt-4">
        {article.author} ·{" "}
        {article.publishDate
          ? new Date(article.publishDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "Just now"}{" "}
        · {getReadTime(article.content)} min read
      </p>

      <div
        className="mt-8 text-lg leading-relaxed text-justify prose max-w-none"
        dangerouslySetInnerHTML={{
          __html: article.content
            .replace(/\*\*\*(.*?)\*\*\*/g, "<b><i>$1</i></b>")
            .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
            .replace(/\*(.*?)\*/g, "<i>$1</i>")
            .replace(/\n/g, "<br />"),
        }}
      />
    </div>
  );
}
