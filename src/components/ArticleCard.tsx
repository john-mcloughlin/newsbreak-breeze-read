
import { useState } from "react";
import { Article } from "@/contexts/ArticlesContext";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from "date-fns";
import { Trash, BookOpen } from "lucide-react";

interface ArticleCardProps {
  article: Article;
  onDelete: (id: string) => void;
}

const ArticleCard = ({ article, onDelete }: ArticleCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(article.id);
    setIsDeleting(false);
  };

  const formatSavedAt = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "recently";
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-nbBorder overflow-hidden transition-all duration-300 hover:shadow-md card-hover">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-1/3 lg:w-1/4 h-40 sm:h-auto bg-nbBlue-50">
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-nbBlue-50 text-nbTextLight">
              No image
            </div>
          )}
        </div>
        
        <div className="flex flex-col flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs text-nbTextLight">
                {article.source} • {formatSavedAt(article.savedAt)}
              </p>
              <h3 className="text-lg font-medium line-clamp-2 hover:text-nbBlue-700 transition-colors">
                {article.title}
              </h3>
            </div>
          </div>
          
          <p className="text-sm text-nbTextLight mb-4 line-clamp-2 flex-grow">
            {article.description}
          </p>
          
          <div className="flex justify-between items-center mt-auto pt-2">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-nbBlue-600 hover:text-nbBlue-800 transition-colors"
            >
              <BookOpen size={16} className="mr-1" />
              Read article
            </a>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isDeleting}>
                  <Trash size={16} className="text-nbTextLight hover:text-red-500 transition-colors" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove from backlog?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove "{article.title}" from your reading backlog.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Remove</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
