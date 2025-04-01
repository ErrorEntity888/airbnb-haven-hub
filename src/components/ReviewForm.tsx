
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ReviewFormProps {
  bookingId: string;
  guestId: string; // Guest ID to ensure permission check
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
      // Check if a review already exists for this booking
      const { data: existingReview, error: checkError } = await supabase
        .from("reviews")
        .select("id")
        .eq("booking_id", bookingId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        console.error("Error checking existing review:", checkError);
        toast.error("Failed to check existing reviews");
        setIsSubmitting(false);
        return;
      }

      // If review already exists, update it instead of inserting
      if (existingReview) {
        const { error: updateError } = await supabase
          .from("reviews")
          .update({
            rating,
            comment: comment.trim() || null,
          })
          .eq("booking_id", bookingId);

        if (updateError) {
          console.error("Review update error:", updateError);
          toast.error("Failed to update review");
          setIsSubmitting(false);
          return;
        }

        toast.success("Review updated successfully!");
      } else {
        // Insert new review
        const { error: insertError } = await supabase
          .from("reviews")
          .insert({
            booking_id: bookingId,
            rating,
            comment: comment.trim() || null,
          });

        if (insertError) {
          console.error("Review insertion error:", insertError);
          toast.error("Failed to submit review");
          setIsSubmitting(false);
          return;
        }

        toast.success("Review submitted successfully!");
      }

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
