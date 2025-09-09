import Header from "@/components/header";
import Footer from "@/components/footer";
import CategoryCard from "@/components/category-card";

export default function Listings() {
  const categories = [
    {
      title: "Hot Listings",
      href: "/beach", // Using beach as hot listings example
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
    },
    {
      title: "Featured",
      href: "/houses", // Using houses as featured example
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
    },
    {
      title: "Houses",
      href: "/houses",
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
    },
    {
      title: "Land",
      href: "/land",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
    },
    {
      title: "Condos",
      href: "/condos",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
    },
    {
      title: "Beach",
      href: "/beach",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
    },
    {
      title: "Commercial",
      href: "/commercial",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
    },
    {
      title: "Agriculture",
      href: "/agriculture",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Page Header */}
        <section className="py-16 bg-accent">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-foreground mb-4">Browse Properties</h1>
              <p className="text-xl text-muted-foreground">
                Discover your perfect property from our extensive collection
              </p>
            </div>
          </div>
        </section>

        {/* Category Grid */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.title}
                  title={category.title}
                  href={category.href}
                  image={category.image}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
