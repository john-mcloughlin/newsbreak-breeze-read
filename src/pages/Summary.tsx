import { useState } from "react";
import { useArticles } from "@/contexts/ArticlesContext";
import TimeSelector from "@/components/TimeSelector";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Summary = () => {
  const [readTime, setReadTime] = useState<number>(3);
  const [format, setFormat] = useState<"text" | "audio">("text");
  const { articles, generatedSummary, generateSummary, summaryLoading } = useArticles();
  const navigate = useNavigate();
  
  const handleGenerateSummary = () => {
    generateSummary(readTime, format);
  };
  
  if (articles.length === 0) {
    return (
      <div className="nb-container pt-10">
        <div className="bg-white rounded-lg shadow-sm border border-nbBorder p-8 text-center">
          <BookOpen size={48} className="mx-auto mb-4 text-nbTextLight opacity-50" />
          <h2 className="text-xl font-medium mb-2">No articles to summarize</h2>
          <p className="text-nbTextLight mb-6">
            You need to save some articles to your library before you can generate summaries.
          </p>
          <Button onClick={() => navigate("/")}>Go to library</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="nb-container pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-nbText">Time to news.break</h1>
        <p className="text-nbTextLight">Generate summaries based on your available time</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <TimeSelector
          onSelectTime={setReadTime}
          onSelectFormat={setFormat}
          onSubmit={handleGenerateSummary}
          disabled={summaryLoading}
        />
        
        <div className="bg-white rounded-lg shadow-sm border border-nbBorder p-6">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium">Summary</h3>
            {generatedSummary && (
              <div className="text-xs px-2 py-1 bg-nbGreen-50 text-nbGreen-700 rounded-full">
                {readTime} min {format}
              </div>
            )}
          </div>
          
          {summaryLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-nbBlue-200 border-t-nbBlue-600 mx-auto"></div>
                <p className="text-nbTextLight">Generating your {readTime}-minute summary...</p>
              </div>
            </div>
          ) : generatedSummary ? (
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-line text-nbText">{generatedSummary}</p>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-center">
              <div className="text-nbTextLight">
                <p className="mb-1">Select your available time and format</p>
                <p className="text-sm">We'll generate a summary of your library articles</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary;
