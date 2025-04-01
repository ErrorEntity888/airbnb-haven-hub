
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ReviewFormProps {
  bookingId: string;
  guestId: string; // Add guest ID to ensure permission check
  onReviewSubmitted: () => void;
}

export const ReviewForm = ({ bookingId, guestId, onReviewSubmitted }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure the current user is the one who made the booking
    if (user?.id !== guestId) {
      toast.error("Only the guest who made this booking can leave a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("reviews")
        .insert({
          booking_id: bookingId,
          rating,
          comment: comment.trim() || null,
        });

      if (error) {
        if (error.code === "23505") {
          toast.error("You have already reviewed this booking");
        } else {
          toast.error("Failed to submit review");
          console.error("Review error:", error);
        }
        return;
      }

      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      onReviewSubmitted();
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="mb-2 font-medium">Rating</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star
                className={`w-6 h-6 ${
                  star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <Textarea
          placeholder="Share your experience (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="h-24"
        />
      </div>
      <Button type="submit" disabled={isSubmitting || rating === 0}>
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
};
