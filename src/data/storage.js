const KEY = "ednex_articles";

export function getArticles() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

export function saveArticles(articles) {
  localStorage.setItem(KEY, JSON.stringify(articles));
}
