
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ThemeToggle";

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navigateTo = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };
  
  return (
    <header className="sticky top-0 z-10 border-b border-nbBorder bg-white/80 dark:bg-nbText/80 backdrop-blur-md">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-nbBlue-700 flex items-center space-x-2">
            <span>news.break</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            <Button
              variant={location.pathname === "/" ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/")}
            >
              My Library
            </Button>
            <Button
              variant={location.pathname === "/summary" ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/summary")}
            >
              The Break Room
            </Button>
            <Button
              variant={location.pathname === "/account" ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/account")}
            >
              My Account
            </Button>
          </nav>
          
          {/* Mobile Menu Button */}
          {isMobile && (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px]">
                <div className="mt-6 flex flex-col gap-3">
                  <Button
                    variant={location.pathname === "/" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => navigateTo("/")}
                  >
                    My Library
                  </Button>
                  <Button
                    variant={location.pathname === "/summary" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => navigateTo("/summary")}
                  >
                    The Break Room
                  </Button>
                  <Button
                    variant={location.pathname === "/account" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => navigateTo("/account")}
                  >
                    My Account
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start mt-4"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Log out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
          
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {user?.username || user?.email}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/")}>
                My Library
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/summary")}>
                The Break Room
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/account")}>
                My Account
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-500" onClick={logout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
