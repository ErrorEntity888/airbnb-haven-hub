
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ListingsGrid } from "@/components/ListingsGrid";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">Featured Stays</h2>
        <ListingsGrid />
      </div>
    </div>
  );
};

export default Index;
