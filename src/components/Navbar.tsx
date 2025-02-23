
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="/" className="text-airbnb-primary font-bold text-2xl">
            HavenHub
          </a>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hover:bg-slate-100">
            Become a Host
          </Button>
          <Button variant="ghost" className="hover:bg-slate-100">
            Login
          </Button>
          <Button>Sign up</Button>
        </div>
      </div>
    </nav>
  );
};
