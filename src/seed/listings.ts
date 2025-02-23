
export const seedListings = async (hostId: string) => {
  const { supabase } = await import("@/integrations/supabase/client");

  const listings = [
    {
      title: "Luxury Mountain Cabin",
      description: "A beautiful cabin with stunning mountain views",
      price_per_night: 250,
      location: "Aspen, Colorado",
      image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      host_id: hostId,
    },
    {
      title: "Beachfront Paradise",
      description: "Modern villa right on the beach",
      price_per_night: 350,
      location: "Maui, Hawaii",
      image_url: "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151",
      host_id: hostId,
    },
    {
      title: "Urban Loft",
      description: "Stylish loft in the heart of the city",
      price_per_night: 200,
      location: "New York City, NY",
      image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      host_id: hostId,
    },
  ];

  for (const listing of listings) {
    const { error } = await supabase.from("listings").insert(listing);
    if (error) console.error("Error seeding listing:", error);
  }
};
