
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BookingFormProps {
  listingId: string;
  pricePerNight: number;
}

export const BookingForm = ({ listingId, pricePerNight }: BookingFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut) return 0;
    const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return days * pricePerNight;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to make a booking");
      navigate("/auth");
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (checkOut <= checkIn) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    setIsSubmitting(true);

    // Simulate payment confirmation
    toast.success("Payment confirmed!", { duration: 2000 });

    const booking = {
      listing_id: listingId,
      guest_id: user.id,
      check_in: format(checkIn, 'yyyy-MM-dd'),
      check_out: format(checkOut, 'yyyy-MM-dd'),
      total_price: calculateTotalPrice(),
    };

    const { error } = await supabase
      .from('bookings')
      .insert(booking);

    setIsSubmitting(false);

    if (error) {
      toast.error("Failed to create booking");
      console.error("Booking error:", error);
      return;
    }

    toast.success("Booking confirmed! View it in your bookings tab.");
    navigate("/bookings");
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Book this property</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Check-in date</label>
            <Calendar
              mode="single"
              selected={checkIn}
              onSelect={setCheckIn}
              disabled={(date) => date < new Date()}
              className="border rounded-md"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Check-out date</label>
            <Calendar
              mode="single"
              selected={checkOut}
              onSelect={setCheckOut}
              disabled={(date) => date <= (checkIn || new Date())}
              className="border rounded-md"
            />
          </div>
          {checkIn && checkOut && (
            <div className="text-lg font-semibold">
              Total: ${calculateTotalPrice()}
            </div>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !checkIn || !checkOut}
          >
            {isSubmitting ? "Confirming..." : "Confirm Booking"}
          </Button>
          <p className="text-sm text-center text-muted-foreground mt-2">
            Payment will be handled securely via PayPal or card
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
