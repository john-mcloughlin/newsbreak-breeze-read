
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export interface Article {
  id: string;
  url: string;
  title: string;
  description: string;
  imageUrl: string;
  source: string;
  savedAt: string;
}

interface ArticlesContextType {
  articles: Article[];
  loading: boolean;
  error: string | null;
  fetchArticles: () => Promise<void>;
  deleteArticle: (articleId: string) => Promise<void>;
  saveArticle: (url: string) => Promise<void>;
  generatedSummary: string | null;
  generateSummary: (readTime: number, format: "text" | "audio") => Promise<void>;
  summaryLoading: boolean;
}

const ArticlesContext = createContext<ArticlesContextType | undefined>(undefined);

export const useArticles = () => {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error("useArticles must be used within an ArticlesProvider");
  }
  return context;
};

interface ArticlesProviderProps {
  children: ReactNode;
}

export const ArticlesProvider = ({ children }: ArticlesProviderProps) => {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Mock data for development
  const mockArticles: Article[] = [
    {
      id: "1",
      url: "https://example.com/article1",
      title: "Climate Change Impacts on Global Food Security",
      description: "New research reveals how climate change is affecting global food production and distribution systems.",
      imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80",
      source: "The Guardian",
      savedAt: "2023-04-01T15:30:00Z"
    },
    {
      id: "2",
      url: "https://example.com/article2",
      title: "Advances in Quantum Computing: Breaking New Barriers",
      description: "Scientists have achieved a breakthrough in quantum computing, potentially revolutionizing data processing.",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80",
      source: "MIT Technology Review",
      savedAt: "2023-04-05T09:15:00Z"
    },
    {
      id: "3",
      url: "https://example.com/article3",
      title: "The Future of Remote Work After the Pandemic",
      description: "Companies are reimagining workplace policies as remote work becomes a permanent fixture in the business landscape.",
      imageUrl: "https://images.unsplash.com/photo-1585076641399-5c06d1b3365f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80",
      source: "Harvard Business Review",
      savedAt: "2023-04-10T14:45:00Z"
    },
    {
      id: "4",
      url: "https://example.com/article4",
      title: "New Findings on Mental Health Benefits of Nature Exposure",
      description: "Research demonstrates significant improvements in mental wellbeing from regular exposure to natural environments.",
      imageUrl: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80",
      source: "Psychology Today",
      savedAt: "2023-04-15T10:30:00Z"
    }
  ];

  // Fetch articles when user changes
  useEffect(() => {
    if (user) {
      fetchArticles();
    } else {
      setArticles([]);
    }
  }, [user]);

  const fetchArticles = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call to GET /api/articles?userId={userId}
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Use mock data for development
      setArticles(mockArticles);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
      setError("Failed to load articles. Please try again later.");
      toast.error("Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (articleId: string) => {
    if (!user) return;
    
    try {
      // In a real app, this would be an API call to DELETE /api/articles/{articleId}?userId={userId}
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setArticles(articles.filter(article => article.id !== articleId));
      toast.success("Article removed from your backlog");
    } catch (err) {
      console.error("Failed to delete article:", err);
      toast.error("Failed to delete article");
    }
  };

  const saveArticle = async (url: string) => {
    if (!user) return;
    
    try {
      // In a real app, this would be an API call to POST /api/articles
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock a new saved article
      const newArticle: Article = {
        id: `new-${Date.now()}`,
        url: url,
        title: "Newly Saved Article",
        description: "This article was just saved to your backlog.",
        imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80",
        source: "Example Source",
        savedAt: new Date().toISOString()
      };
      
      setArticles([newArticle, ...articles]);
      toast.success("Article saved to your backlog");
    } catch (err) {
      console.error("Failed to save article:", err);
      toast.error("Failed to save article");
    }
  };

  const generateSummary = async (readTime: number, format: "text" | "audio") => {
    if (!user || articles.length === 0) return;
    
    setSummaryLoading(true);
    
    try {
      // In a real app, this would be an API call to POST /api/summarize
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock summary based on read time
      let summary;
      if (readTime === 1) {
        summary = "Quick 1-minute overview: Climate change is affecting global food security through reduced crop yields and disrupted supply chains. Quantum computing is making significant breakthroughs that could revolutionize data processing capabilities. Companies are adopting hybrid work models as a permanent solution post-pandemic. Recent studies show spending just 20 minutes in nature daily significantly improves mental health outcomes.";
      } else if (readTime === 3) {
        summary = "3-minute summary: Climate change impacts on global food security are accelerating, with crop yields in tropical regions declining by up to 15% in the past decade. Heat stress, unpredictable rainfall patterns, and extreme weather events are disrupting food production worldwide.\n\nIn quantum computing, researchers have achieved stable qubits at room temperature for the first time, potentially removing one of the biggest barriers to practical quantum computers. This breakthrough could lead to exponential processing power increases within five years.\n\nThe remote work landscape has permanently shifted, with 85% of companies planning to maintain some form of hybrid work indefinitely. Productivity has remained stable or improved for 70% of knowledge workers in distributed teams.\n\nNew mental health research demonstrates that even brief nature exposure—as little as 20 minutes daily—provides measurable reductions in cortisol levels and improvements in cognitive function, particularly for urban residents with limited green space access.";
      } else {
        summary = "5-minute detailed summary: Climate change is now considered the single greatest threat to global food security in the coming decades. Recent research has documented crop yield reductions of 5-15% across major staple foods including wheat, rice, and corn, primarily in equatorial regions. Disrupted weather patterns, including more frequent droughts and floods, are affecting seasonal planting schedules and harvest yields. Additionally, changing temperatures are expanding the range of crop pests and diseases into previously unaffected regions. Food distribution systems are also vulnerable, with extreme weather events disrupting transportation networks and cold chains.\n\nIn quantum computing, the achievement of room-temperature quantum coherence represents a paradigm shift in the field. Previous quantum computing systems required cooling to near absolute zero, requiring massive infrastructure and energy costs. The new approach uses specially engineered diamond lattice structures to maintain qubit stability at standard conditions, potentially making quantum computing commercially viable for industries including pharmaceuticals, logistics, and cryptography. Experts project this could lead to practical quantum advantage within 3-5 years, decades ahead of previous estimates.\n\nThe future of work has been permanently altered by pandemic-accelerated changes, with hybrid models becoming standard across most knowledge industries. Research indicates that 85% of companies have implemented permanent flexible work policies, with productivity metrics showing stability or improvement in 70% of cases. However, challenges remain around collaboration equity between remote and in-office workers, mentoring of junior staff, and maintaining company culture. Leading organizations are reimagining office spaces as collaboration hubs rather than daily work locations, investing heavily in digital infrastructure and asynchronous communication tools.\n\nA comprehensive five-year longitudinal study on nature exposure and mental health has delivered compelling evidence of physiological and psychological benefits from regular nature contact. The research documents dose-dependent reductions in cortisol (18-25%) and blood pressure (5-8%), along with improvements in attention, working memory, and creative problem-solving from just 20-30 minutes of daily nature exposure. Urban planning experts are now calling for integration of these findings into city design, healthcare practices, and workplace wellness programs. The evidence suggests that nature exposure could provide a cost-effective complementary approach to addressing rising rates of anxiety and depression worldwide.";
      }
      
      setGeneratedSummary(summary);
      toast.success(`Your ${readTime}-minute ${format} summary is ready!`);
    } catch (err) {
      console.error("Failed to generate summary:", err);
      toast.error("Failed to generate summary");
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <ArticlesContext.Provider value={{
      articles,
      loading,
      error,
      fetchArticles,
      deleteArticle,
      saveArticle,
      generatedSummary,
      generateSummary,
      summaryLoading
    }}>
      {children}
    </ArticlesContext.Provider>
  );
};
