import { useEffect } from "react";
import { useArticles, Article } from "@/contexts/ArticlesContext";
import ArticleCard from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Home = () => {
  const { articles, loading, error, fetchArticles, deleteArticle } = useArticles();
  const navigate = useNavigate();
  
  // Fix: Remove fetchArticles from the dependency array to avoid infinite loop
  useEffect(() => {
    // Call fetchArticles only once when component mounts
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleDeleteArticle = async (id: string) => {
    await deleteArticle(id);
  };
  
  const renderArticlesList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-nbBlue-200 border-t-nbBlue-600 mx-auto"></div>
            <p className="text-nbTextLight">Loading your articles...</p>
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="py-10 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchArticles} variant="outline">
            Try again
          </Button>
        </div>
      );
    }
    
    if (articles.length === 0) {
      return (
        <div className="py-16 text-center">
          <BookOpen size={48} className="mx-auto mb-4 text-nbTextLight opacity-50" />
          <h3 className="text-xl font-medium mb-2">Your backlog is empty</h3>
          <p className="text-nbTextLight mb-6 max-w-md mx-auto">
            Save articles using the browser extension to build your backlog.
          </p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 gap-6">
        {articles.map((article: Article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onDelete={handleDeleteArticle}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="nb-container pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-nbText">Your Backlog</h1>
          <p className="text-nbTextLight">
            {articles.length > 0
              ? `${articles.length} saved article${articles.length !== 1 ? "s" : ""}`
              : "Start saving articles to your backlog"}
          </p>
        </div>
        
        {articles.length > 0 && (
          <Button onClick={() => navigate("/summary")} className="mt-4 md:mt-0">
            Go to the Break Room
          </Button>
        )}
      </div>
      
      {renderArticlesList()}
    </div>
  );
};

export default Home;
