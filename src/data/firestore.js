import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "../firebase";

const articlesRef = collection(db, "articles");

// ➕ Add article
export async function addArticle(article) {
  await addDoc(articlesRef, article);
}

// ✏️ Update article
export async function updateArticle(id, data) {
  await updateDoc(doc(db, "articles", id), data);
}

// 📥 Get all articles
export async function getAllArticles() {
  const q = query(articlesRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
