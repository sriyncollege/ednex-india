import { getArticles } from "../data/storage";

export default function Home() {
  const articles = getArticles().filter(
    (a) => a.status === "Published"
  );

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 grid gap-6 md:grid-cols-3">
      {articles.map((a) => (
        <div key={a.id} className="border rounded overflow-hidden">
          {a.image && (
            <img
              src={a.image}
              alt={a.title}
              className="w-full h-48 object-cover"
            />
          )}

          <div className="p-4">
            <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded">
              {a.category}
            </span>

            <h2 className="text-lg font-semibold mt-2">{a.title}</h2>

            <p className="text-sm text-gray-500 mt-1">
              {a.author} · {a.time}
            </p>
          </div>
        </div>
      ))}
    </main>
  );
}
