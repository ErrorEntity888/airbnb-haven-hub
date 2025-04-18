
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { ReviewForm } from "@/components/ReviewForm";
import { Star } from "lucide-react";

interface Review {
  rating: number;
  comment: string | null;
}

interface ListingInfo {
  title: string;
  image_url: string;
  location: string;
}

interface Booking {
  id: string;
  listing_id: string;
  guest_id: string;
  check_in: string;
  check_out: string;
  total_price: number;
  created_at: string;
  status: string;
  listings: ListingInfo;
  reviews: Review[];
}

const BookingsPage = () => {
  const { user } = useAuth();

  const { data: bookings, isLoading, refetch } = useQuery({
    queryKey: ["bookings", user?.id],
    queryFn: async () => {
      try {
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select(`
            *,
            listings (
              title,
              image_url,
              location
            )
          `)
          .eq("guest_id", user?.id)
          .order("created_at", { ascending: false });

        if (bookingsError) throw bookingsError;

        // Fetch reviews separately since we're having issues with the join
        const bookingsWithReviews = await Promise.all((bookingsData || []).map(async (booking) => {
          const { data: reviews, error: reviewsError } = await supabase
            .from("reviews")
            .select("rating, comment")
            .eq("booking_id", booking.id);

          if (reviewsError) {
            console.error("Error fetching reviews:", reviewsError);
            return { ...booking, reviews: [] };
          }

          return {
            ...booking,
            reviews: reviews || []
          };
        }));

        return bookingsWithReviews as Booking[];
      } catch (error) {
        console.error("Error in query:", error);
        throw error;
      }
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-slate-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isPastBooking = (checkOut: string) => {
    return new Date(checkOut) < new Date();
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Bookings</h1>
        <div className="space-y-6">
          {bookings && bookings.length > 0 ? (
            bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <CardTitle>{booking.listings.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <img
                        src={booking.listings.image_url}
                        alt={booking.listings.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="md:col-span-3 space-y-2">
                      <p className="text-muted-foreground">{booking.listings.location}</p>
                      <p>Check-in: {format(new Date(booking.check_in), 'PPP')}</p>
                      <p>Check-out: {format(new Date(booking.check_out), 'PPP')}</p>
                      <p className="font-semibold">₹{booking.total_price}</p>
                      <p className="text-sm text-muted-foreground">
                        Booked on {format(new Date(booking.created_at), 'PPP')}
                      </p>
                    </div>
                  </div>

                  {isPastBooking(booking.check_out) && booking.reviews.length === 0 && (
                    <div className="mt-4 border-t pt-4">
                      <h3 className="text-lg font-medium mb-4">Leave a Review</h3>
                      <ReviewForm 
                        bookingId={booking.id} 
                        guestId={booking.guest_id} 
                        onReviewSubmitted={refetch} 
                      />
                    </div>
                  )}

                  {booking.reviews && booking.reviews.length > 0 && booking.reviews.map((review, reviewIndex) => (
                    <div key={`${booking.id}-review-${reviewIndex}`} className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      {review.comment && <p className="text-sm">{review.comment}</p>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              You haven't made any bookings yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;
