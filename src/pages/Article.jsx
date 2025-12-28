import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

/* ---------- Helpers ---------- */

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

/* ---------- Component ---------- */

export default function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadArticle();
    // eslint-disable-next-line
  }, []);

  async function loadArticle() {
    try {
      const ref = doc(db, "articles", id);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setError("Article not found");
        return;
      }

      const data = snap.data();

      setArticle({
        title: data.title || "Untitled",
        subtitle: data.subtitle || "",
        content: data.content || "",
        image: data.image || "",
        imageCaption: data.imageCaption || "",
        category: data.category || "News",
        author: data.author || "Education Nexus Desk",
        publishDate: data.publishDate || "",
      });
    } catch (err) {
      console.error(err);
      setError("Unable to load article");
    }
  }

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

  const pageUrl = window.location.href;
  const description =
    article.subtitle ||
    article.content.replace(/\*/g, "").slice(0, 150);

  /* ---------- Schema.org ---------- */
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    "headline": article.title,
    "description": description,
    "image": article.image ? [article.image] : [],
    "datePublished": article.publishDate || new Date().toISOString(),
    "dateModified": article.publishDate || new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": article.author,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Education Nexus of India",
    },
  };

  return (
    <>
      {/* ---------- SEO + SOCIAL ---------- */}
      <Helmet>
        <title>{article.title} | Education Nexus of India</title>
        <meta name="description" content={description} />

        {/* Open Graph */}
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        {article.image && (
          <meta property="og:image" content={article.image} />
        )}

        {/* Twitter / X */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={description} />
        {article.image && (
          <meta name="twitter:image" content={article.image} />
        )}

        {/* Schema */}
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>

      {/* ---------- ARTICLE ---------- */}
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
          <h2 className="text-lg md:text-xl italic text-gray-700 mt-3">
            {article.subtitle}
          </h2>
        )}

        <p className="text-sm text-gray-500 mt-4">
          {article.author}
          {" · "}
          {article.publishDate
            ? new Date(article.publishDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : ""}
          {" · "}
          {getReadTime(article.content)} min read
        </p>

        {/* ---------- SHARE ---------- */}
        <div className="flex gap-6 mt-6 font-semibold">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              article.title + " " + pageUrl
            )}`}
            target="_blank"
            rel="noreferrer"
            className="text-green-600"
          >
            WhatsApp
          </a>

          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              article.title
            )}&url=${encodeURIComponent(pageUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500"
          >
            X
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              pageUrl
            )}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-700"
          >
            Facebook
          </a>
        </div>

        {/* ---------- CONTENT ---------- */}
        {article.content && (
          <div
            className="mt-8 text-lg leading-relaxed text-justify prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: formatContent(article.content),
            }}
          />
        )}
      </div>
    </>
  );
}
