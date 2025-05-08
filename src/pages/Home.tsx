
import { useEffect, useState } from "react";
import { useArticles, Article } from "@/contexts/ArticlesContext";
import ArticleCard from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Home = () => {
  const { articles, loading, error, fetchArticles, deleteArticle } = useArticles();
  const navigate = useNavigate();
  const [suggestedArticles, setSuggestedArticles] = useState<Article[]>([]);
  
  // Fix: Remove fetchArticles from the dependency array to avoid infinite loop
  useEffect(() => {
    // Call fetchArticles only once when component mounts
    fetchArticles();
    
    // Mock suggested articles
    const mockSuggestions = [
      {
        id: "s1",
        url: "https://example.com/suggested1",
        title: "The Impact of AI on Future Employment Opportunities",
        description: "Experts predict how artificial intelligence will transform job markets over the next decade.",
        imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
        source: "Tech Insights",
        savedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: "s2",
        url: "https://example.com/suggested2",
        title: "Sustainable Urban Planning: Cities of Tomorrow",
        description: "How urban planners are incorporating green technologies into future city designs.",
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
        source: "Environment Today",
        savedAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: "s3",
        url: "https://example.com/suggested3",
        title: "The Psychology of Decision Making Under Pressure",
        description: "Research reveals how stress affects our ability to make rational choices.",
        imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
        source: "Psychology Weekly",
        savedAt: new Date(Date.now() - 259200000).toISOString()
      },
      {
        id: "s4",
        url: "https://example.com/suggested4",
        title: "Breakthroughs in Renewable Energy Storage",
        description: "New battery technologies that could revolutionize how we store and use clean energy.",
        imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
        source: "Science Daily",
        savedAt: new Date(Date.now() - 345600000).toISOString()
      }
    ];
    
    setSuggestedArticles(mockSuggestions);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleDeleteArticle = async (id: string) => {
    await deleteArticle(id);
  };
  
  const handleAcceptSuggestion = async (article: Article) => {
    // Add article to user's library
    const updatedArticle = {
      ...article,
      id: `saved-${article.id}`, // Ensure unique ID for the saved article
      savedAt: new Date().toISOString() // Update the saved timestamp
    };
    
    // Remove from suggestions
    setSuggestedArticles(prev => prev.filter(a => a.id !== article.id));
    
    // Add to articles array (user's library)
    // In a real app, this would call the saveArticle method from the context
    // For now, we'll directly update the state to simulate the behavior
    useArticles().articles.unshift(updatedArticle);
  };
  
  const handleRejectSuggestion = async (id: string) => {
    setSuggestedArticles(prev => prev.filter(a => a.id !== id));
  };
  
const renderArticlesList = () => {
  if (loading)   { /* …unchanged… */ }
  if (error)     { /* …unchanged… */ }
  if (articles.length === 0) { /* …unchanged… */ }

  return (
    <Carousel className="w-full pb-8">
      <CarouselContent
        className="
          -mx-6 md:-mx-8
          flex-nowrap overflow-x-auto scroll-smooth
          snap-x snap-mandatory
        "
      >
        {articles.map((article: Article) => (
          <CarouselItem
            key={article.id}
            className="
              snap-start flex-shrink-0
              px-6 md:px-0
              basis-full       /* 1 per row on xs */
              sm:basis-2/3     /* ~2 per row on sm */
              md:basis-1/2     /* 2 per row on md */
              lg:basis-1/3     /* 3 per row on lg */
              xl:basis-1/4     /* 4 per row on xl */
            "
          >
            <div className="p-4">
              <ArticleCard
                article={article}
                onDelete={handleDeleteArticle}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* arrows for non-touch */}
      <div className="hidden md:block">
        <CarouselPrevious className="z-10 -left-6 lg:-left-12 bg-white hover:bg-nbBackground" />
        <CarouselNext     className="z-10 -right-6 lg:-right-12 bg-white hover:bg-nbBackground" />
      </div>

      {/* swipe hint for mobile */}
      <div className="block mt-4 md:hidden">
        <p className="text-xs text-center text-nbTextLight">
          Swipe to see more articles
        </p>
      </div>
    </Carousel>
  );
};

const renderSuggestedArticles = () => {
  if (suggestedArticles.length === 0) { /* …unchanged… */ }

  return (
    <Carousel className="w-full pb-8">
      <CarouselContent
        className="
          -mx-6 md:-mx-8
          flex-nowrap overflow-x-auto scroll-smooth
          snap-x snap-mandatory
        "
      >
        {suggestedArticles.map((article: Article) => (
          <CarouselItem
            key={article.id}
            className="
              snap-start flex-shrink-0
              px-6 md:px-0
              basis-full
              sm:basis-2/3
              md:basis-1/2
              lg:basis-1/3
              xl:basis-1/4
            "
          >
            <div className="p-4">
              <ArticleCard
                article={article}
                onDelete={handleDeleteArticle}
                suggested
                onAccept={handleAcceptSuggestion}
                onReject={handleRejectSuggestion}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="hidden md:block">
        <CarouselPrevious className="z-10 -left-6 lg:-left-12 bg-white hover:bg-nbBackground" />
        <CarouselNext     className="z-10 -right-6 lg:-right-12 bg-white hover:bg-nbBackground" />
      </div>
      <div className="block mt-4 md:hidden">
        <p className="text-xs text-center text-nbTextLight">
          Swipe to see more articles
        </p>
      </div>
    </Carousel>
  );
};
  
  return (
    <div className="nb-container pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-nbText">My Library</h1>
          <p className="text-nbTextLight">
            {articles.length > 0
              ? `${articles.length} saved article${articles.length !== 1 ? "s" : ""}`
              : "Start saving articles to your library"}
          </p>
        </div>
        
        {articles.length > 0 && (
          <Button onClick={() => navigate("/summary")} className="mt-4 md:mt-0">
            Go to the Break Room
          </Button>
        )}
      </div>
      
      {renderArticlesList()}
      
      <div className="mt-10 mb-4">
        <h2 className="text-xl font-semibold text-nbText">Suggested by Friends</h2>
        <p className="text-nbTextLight text-sm">Articles your network thinks you might enjoy</p>
      </div>
      
      {renderSuggestedArticles()}
    </div>
  );
};

export default Home;
