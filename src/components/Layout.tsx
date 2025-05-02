
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-nbBackground p-4">
        <div className="w-full max-w-md text-center">
          <h1 className="mb-6 text-3xl font-bold text-nbBlue-700">news.break</h1>
          <p className="mb-8 text-nbTextLight">Please log in to access your personalized news backlog.</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate("/login")}>Log In</Button>
            <Button variant="outline" onClick={() => navigate("/register")}>Sign Up</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-nbBackground">
      <Navigation />
      <main className="flex-1 w-full max-w-full mx-auto">
        <div className={`${isMobile ? 'px-4' : 'px-6'}`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
