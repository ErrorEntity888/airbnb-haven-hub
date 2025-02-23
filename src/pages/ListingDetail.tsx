
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Listing } from "@/types/listing";
import { Navbar } from "@/components/Navbar";
import { BookingForm } from "@/components/BookingForm";

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Listing;
    },
  });

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-slate-200 rounded-lg mb-8" />
            <div className="h-8 bg-slate-200 w-1/2 rounded mb-4" />
            <div className="h-4 bg-slate-200 w-1/4 rounded mb-8" />
            <div className="h-24 bg-slate-200 rounded mb-8" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold">Listing not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="aspect-video rounded-lg overflow-hidden mb-6">
              <img
                src={listing.image_url}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">{listing.location}</p>
            <p className="text-lg mb-4">${listing.price_per_night} per night</p>
            <div className="prose max-w-none">
              <p>{listing.description}</p>
            </div>
          </div>
          <div>
            <BookingForm 
              listingId={listing.id} 
              pricePerNight={listing.price_per_night} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
