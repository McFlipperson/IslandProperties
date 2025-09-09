import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PropertyCard from "@/components/property-card";
import { Property } from "@shared/schema";

export default function Condos() {
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties/category/condos"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading properties...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Page Header */}
        <section className="py-16 bg-accent">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-foreground mb-4">Condominiums</h1>
              <p className="text-xl text-muted-foreground">
                Modern living in the heart of the city
              </p>
            </div>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            {properties.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-2xl font-semibold text-foreground mb-4">No condos available</h3>
                <p className="text-muted-foreground">Check back later for new listings.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
