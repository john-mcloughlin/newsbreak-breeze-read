
import { useTheme } from "@/contexts/ThemeContext";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="flex items-center gap-2">
      <Sun size={16} className="text-nbTextLight" />
      <Switch 
        checked={theme === "dark"} 
        onCheckedChange={toggleTheme} 
        aria-label="Toggle dark mode"
      />
      <Moon size={16} className="text-nbTextLight" />
    </div>
  );
}
