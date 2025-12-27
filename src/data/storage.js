const DEFAULT_ARTICLES = [
  {
    id: "1",
    title: "NEP 2020 and the Future of Higher Education",
    content: "NEP 2020 aims to transform Indian education.",
    category: "Opinion",
    author: "Education Nexus Desk",
    status: "Published",
    time: "1 hour ago",
  },
];

export function getArticles() {
  const saved = localStorage.getItem("education_nexus_articles");
  if (saved) return JSON.parse(saved);

  localStorage.setItem(
    "education_nexus_articles",
    JSON.stringify(DEFAULT_ARTICLES)
  );
  return DEFAULT_ARTICLES;
}

export function saveArticles(articles) {
  localStorage.setItem(
    "education_nexus_articles",
    JSON.stringify(articles)
  );
}
