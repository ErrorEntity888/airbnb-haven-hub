
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="relative h-[85vh] flex items-center justify-center text-center">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 max-w-3xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
          Find your next perfect stay
        </h1>
        <p className="text-xl text-white/90 mb-8">
          Discover unique homes and experiences around the world
        </p>
        <Button size="lg" className="text-lg px-8">
          Start exploring
        </Button>
      </div>
    </section>
  );
};
