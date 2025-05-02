
import { useState } from "react";
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

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-10 border-b border-nbBorder bg-white/80 backdrop-blur-md">
      <div className="nb-container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-nbBlue-700 flex items-center space-x-2">
            <span>news.break</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex space-x-1">
            <Button
              variant={location.pathname === "/" ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/")}
            >
              Your Library
            </Button>
            <Button
              variant={location.pathname === "/summary" ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/summary")}
            >
              The Break Room
            </Button>
          </nav>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {user?.username || user?.email}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/")}>
                Your Library
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/summary")}>
                The Break Room
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-500" onClick={logout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-nbBorder fixed bottom-0 left-0 right-0 bg-white">
        <div className="flex justify-around">
          <Button
            variant="ghost"
            className={`flex-1 py-4 rounded-none ${location.pathname === "/" ? "border-t-2 border-nbBlue-500" : ""}`}
            onClick={() => navigate("/")}
          >
            Your Library
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 py-4 rounded-none ${location.pathname === "/summary" ? "border-t-2 border-nbBlue-500" : ""}`}
            onClick={() => navigate("/summary")}
          >
            The Break Room
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
