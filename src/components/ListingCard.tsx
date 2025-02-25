
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Listing } from "@/types/listing";

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard = ({ listing }: ListingCardProps) => {
  const formattedPrice = Math.round(listing.price_per_night).toLocaleString('en-IN');

  return (
    <Link to={`/listings/${listing.id}`}>
      <Card className="overflow-hidden transition-transform hover:scale-[1.02]">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={listing.image_url}
            alt={listing.title}
            className="object-cover w-full h-full"
          />
        </div>
        <CardHeader className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">{listing.title}</h3>
            <p className="font-semibold">₹{formattedPrice}/night</p>
          </div>
          <p className="text-sm text-muted-foreground">{listing.location}</p>
        </CardHeader>
      </Card>
    </Link>
  );
};

