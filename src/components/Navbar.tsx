
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-airbnb-primary font-bold text-2xl">
            HavenHub
          </Link>
          <Link to="/">
            <Button variant="ghost" className="hover:bg-slate-100">
              Home
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/bookings">
                <Button variant="ghost" className="hover:bg-slate-100">
                  My Bookings
                </Button>
              </Link>
              <Button variant="ghost" className="hover:bg-slate-100">
                Become a Host
              </Button>
              <Button onClick={() => signOut()}>Sign out</Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" className="hover:bg-slate-100">
                  Login
                </Button>
              </Link>
              <Link to="/auth?tab=signup">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
