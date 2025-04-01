
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Listing } from "@/types/listing";
import { Loader2 } from "lucide-react";

const EditListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState<Omit<Listing, "id" | "host_id" | "created_at">>({
    title: "",
    description: "",
    price_per_night: 0,
    location: "",
    image_url: "",
  });

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        
        if (!data) {
          toast.error("Listing not found");
          navigate("/");
          return;
        }

        // Check if the user is the host
        if (user?.id !== data.host_id) {
          toast.error("You don't have permission to edit this listing");
          navigate(`/listings/${id}`);
          return;
        }

        setFormData({
          title: data.title,
          description: data.description,
          price_per_night: data.price_per_night,
          location: data.location,
          image_url: data.image_url,
        });
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch listing");
        navigate("/");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchListing();
  }, [id, navigate, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("listings")
        .update({
          ...formData,
          price_per_night: parseFloat(formData.price_per_night.toString()),
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Listing updated successfully!");
      navigate(`/listings/${id}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (fetchLoading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Edit Listing</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Cozy apartment in the heart of the city"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe your place..."
                className="min-h-[150px]"
              />
            </div>
            <div>
              <Label htmlFor="price_per_night">Price per night (₹)</Label>
              <Input
                id="price_per_night"
                name="price_per_night"
                type="number"
                value={formData.price_per_night}
                onChange={handleChange}
                required
                min="0"
                step="1"
                placeholder="1200"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="City, Country"
              />
            </div>
            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                type="url"
                value={formData.image_url}
                onChange={handleChange}
                required
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(`/listings/${id}`)}
                className="w-1/2"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-1/2"
              >
                {loading ? "Updating..." : "Update Listing"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditListing;
