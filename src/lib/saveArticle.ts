import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "./firebase";

interface ArticleData {
  url: string;
  thumbnail?: string;
  publishedAt?: Date;
}

export const saveArticle = async (
  userId: string,
  articleId: string,
  articleData: ArticleData
) => {
  // Step 1: Ensure article exists
  const articleRef = doc(firestore, "articles", articleId);
  const articleSnap = await getDoc(articleRef);

  if (!articleSnap.exists()) {
    // Create article
    await setDoc(articleRef, {
      url: articleData.url,
      thumbnail: articleData.thumbnail || null,
      publishedAt: articleData.publishedAt || null,
      createdAt: serverTimestamp(),
    });
    console.log("✅ Article created");
  } else {
    console.log("✅ Article already exists");
  }

  // Step 2: Create savedArticles document
  const savedArticleId = `${userId}_${articleId}`;
  const savedArticleRef = doc(firestore, "savedArticles", savedArticleId);

  await setDoc(savedArticleRef, {
    userId,
    articleId,
    savedAt: serverTimestamp(),
    sharedWith: []
  });

  console.log("✅ Saved article linked to user");
};

//example usage
await saveArticle(
  "user_123",
  "article_456",
  {
    url: "https://example.com/article-456",
    thumbnail: "https://example.com/thumb.jpg",
    publishedAt: new Date("2025-05-01")
  }
);
