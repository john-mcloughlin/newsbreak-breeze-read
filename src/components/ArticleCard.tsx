
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
import { Trash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ArticleCardProps {
  article: Article;
  onDelete: (id: string) => void;
  suggested?: boolean;
  onAccept?: (article: Article) => void;
  onReject?: (id: string) => void;
}

const ArticleCard = ({ article, onDelete, suggested = false, onAccept, onReject }: ArticleCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(article.id);
    setIsDeleting(false);
  };

  const handleSave = async () => {
    if (onAccept) {
      setIsSaving(true);
      await onAccept(article);
      setIsSaving(false);
    }
  };

  const handleReject = async () => {
    if (onReject) {
      await onReject(article.id);
    }
  };

  const formatSavedAt = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "recently";
    }
  };
  
  return (
    <Card className="w-full max-w-[280px] h-[320px] flex flex-col overflow-hidden shadow-sm card-hover bg-white dark:bg-nbSurface hover:bg-nbBackground dark:hover:bg-nbSurface/80">
      <div className="h-40 bg-nbBlue-50 dark:bg-nbBlue-900/30 overflow-hidden">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-nbBlue-50 dark:bg-nbBlue-900/30 text-nbTextLight">
            No image
          </div>
        )}
      </div>
      
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="mb-2">
          <p className="text-xs text-nbTextLight mb-1">
            {article.source} • {formatSavedAt(article.savedAt)}
          </p>
          <h3 className="text-md font-medium line-clamp-2 h-12 text-nbText">
            {article.title}
          </h3>
        </div>
        
        <div className="mt-auto flex justify-between items-center pt-2">
          {suggested ? (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1 hover:bg-nbBlue-600 transition-colors" 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 hover:bg-nbBlue-50 dark:hover:bg-nbBlue-900/20 transition-colors" 
                onClick={handleReject}
              >
                Ignore
              </Button>
            </div>
          ) : (
            <>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-nbBlue-600 hover:text-nbBlue-800 dark:text-nbBlue-400 dark:hover:text-nbBlue-300 transition-colors"
              >
                Read
              </a>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" disabled={isDeleting} className="hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                    <Trash size={16} className="text-nbTextLight hover:text-red-500 transition-colors" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove from library?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove "{article.title}" from your reading library.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Remove</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;
