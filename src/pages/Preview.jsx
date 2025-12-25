export default function Preview() {
  const article = JSON.parse(localStorage.getItem("preview_article"));

  if (!article) return <p className="p-6">No preview available</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      <p className="text-gray-500 mb-4">
        {article.author} · PREVIEW MODE
      </p>
      <p className="whitespace-pre-line leading-relaxed">
        {article.content}
      </p>
    </div>
  );
}
