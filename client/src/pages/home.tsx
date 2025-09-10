import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PropertyCard from "@/components/property-card";
import BlogCard from "@/components/blog-card";
import { Button } from "@/components/ui/button";
import { Property, Testimonial, BlogPost } from "@shared/schema";
import TestimonialCard from "@/components/testimonial-card";

export default function Home() {
  const { data: hotProperties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties/hot"],
  });

  const { data: featuredProperties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured"],
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });
const { data: blogPosts = [] } = useQuery<BlogPost[]>({
  queryKey: ["/api/blog-posts"],
  queryFn: async () => {
    const response = await fetch("/api/blog-posts");
    if (!response.ok) {
      throw new Error("Failed to fetch blog posts");
    }
    return response.json();
  },
});
console.log("Blog posts data:", blogPosts);
console.log("Blog posts length:", blogPosts?.length);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-bg min-h-screen flex items-center justify-center relative">
        <div className="fixed top-16 left-6 z-40">
          <Button
            className="btn-primary text-primary-foreground px-6 py-3 font-semibold shadow-lg"
            data-testid="hero-brokers-button"
          >
            Brokers
          </Button>
        </div>
        
        <div className="fixed top-16 right-6 z-40">
          <Link href="/listings">
            <Button
              className="btn-primary text-primary-foreground px-6 py-3 font-semibold shadow-lg"
              data-testid="hero-listings-button"
            >
              Listings
            </Button>
          </Link>
        </div>
        
        <div className="text-center text-white">
          {/* Hero content intentionally minimal per requirements */}
        </div>
      </section>

      {/* Hot Listings Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Hot Listings</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            {hotProperties.slice(0, 2).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          
          <div className="text-center">
            <Button
              className="btn-primary text-primary-foreground px-8 py-3 font-semibold"
              data-testid="see-more-hot-button"
            >
              See More Hot Listings
            </Button>
          </div>
        </div>
      </section>
{/* Blog Section */}

      {/* Featured Properties Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Featured Properties</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {featuredProperties.slice(0, 4).map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                className="h-auto"
              />
            ))}
          </div>
          
          <div className="text-center">
            <Button
              className="btn-primary text-primary-foreground px-8 py-3 font-semibold"
              data-testid="see-more-featured-button"
            >
              See More Featured
            </Button>
          </div>
        </div>
      </section>
{/* Blog Section */}
<section className="py-20 bg-background">
  <div className="container mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-foreground mb-4">Latest from Our Blog</h2>
      <p className="text-xl text-muted-foreground">
        Stay updated with market insights and property news
      </p>
    </div>
    
    <div className="grid md:grid-cols-3 gap-8 mb-12">
      {blogPosts.slice(0, 3).map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
    
    {blogPosts.length > 3 && (
      <div className="text-center">
        <Link href="/blog">
          <Button className="btn-primary text-primary-foreground px-8 py-3 font-semibold">
            View All Posts
          </Button>
        </Link>
      </div>
    )}
    
    {blogPosts.length === 0 && (
      <div className="text-center">
        <p className="text-muted-foreground">No blog posts available yet.</p>
      </div>
    )}
  </div>
</section>
      {/* See All Listings Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 text-center">
          <Link href="/listings">
            <Button
              className="btn-primary text-primary-foreground px-12 py-4 font-bold text-xl"
              data-testid="see-all-listings-button"
            >
              See All Listings
            </Button>
          </Link>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">What Our Clients Say</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-foreground mb-4">Get In Touch</h2>
            <p className="text-secondary-foreground/80">Ready to find your dream property? Contact us today.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="text-secondary-foreground">
              <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>123 Paradise Avenue, Island City, IC 12345</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span>(555) 123-4567</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span>info@islandproperties.com</span>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4">Business Hours</h4>
                <div className="space-y-2 text-secondary-foreground/80">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: By Appointment Only</p>
                </div>
              </div>
            </div>
            
            <div className="bg-background p-8 rounded-lg">
              <h3 className="text-2xl font-semibold text-foreground mb-6">Send us a Message</h3>
              <Link href="/contact">
                <Button className="btn-primary text-primary-foreground px-8 py-3 font-semibold w-full">
                  Contact Form
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
