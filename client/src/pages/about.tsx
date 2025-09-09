import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Page Header */}
        <section className="py-16 bg-accent">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-foreground mb-4">About Island Properties</h1>
              <p className="text-xl text-muted-foreground">
                Your trusted partner in real estate since 2005
              </p>
            </div>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Founded in 2005, Island Properties has been serving the island community for nearly two decades. 
                    What started as a small local agency has grown into the region's most trusted real estate company, 
                    specializing in luxury homes, beachfront properties, and investment opportunities.
                  </p>
                  <p>
                    Our deep understanding of the local market, combined with our commitment to exceptional service, 
                    has helped thousands of clients find their perfect properties. Whether you're looking for a 
                    family home, a commercial investment, or a piece of paradise by the sea, we have the expertise 
                    to guide you through every step of the process.
                  </p>
                </div>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Island Properties office building"
                  className="rounded-lg shadow-lg w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">Our Values</h2>
              <p className="text-muted-foreground">The principles that guide everything we do</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Integrity</h3>
                <p className="text-muted-foreground">
                  We conduct our business with the highest ethical standards and complete transparency.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Service Excellence</h3>
                <p className="text-muted-foreground">
                  Our clients' satisfaction is our top priority, and we go above and beyond to exceed expectations.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Local Expertise</h3>
                <p className="text-muted-foreground">
                  With deep roots in the community, we know the island market like no one else.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground">Experienced professionals dedicated to your success</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300" 
                  alt="John Martinez, CEO"
                  className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-1">John Martinez</h3>
                <p className="text-primary font-medium mb-2">CEO & Founder</p>
                <p className="text-muted-foreground text-sm">
                  With over 25 years of experience, John founded Island Properties with a vision to transform real estate on the island.
                </p>
              </div>
              
              <div className="text-center">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300" 
                  alt="Sarah Chen, Sales Director"
                  className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-1">Sarah Chen</h3>
                <p className="text-primary font-medium mb-2">Sales Director</p>
                <p className="text-muted-foreground text-sm">
                  Sarah leads our sales team with expertise in luxury properties and a track record of exceptional client service.
                </p>
              </div>
              
              <div className="text-center">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300" 
                  alt="Michael Torres, Commercial Specialist"
                  className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-1">Michael Torres</h3>
                <p className="text-primary font-medium mb-2">Commercial Specialist</p>
                <p className="text-muted-foreground text-sm">
                  Michael specializes in commercial real estate and has helped numerous businesses find their perfect locations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-secondary-foreground mb-4">Ready to Work With Us?</h2>
            <p className="text-secondary-foreground/80 mb-8">
              Let our experienced team help you find your perfect property today.
            </p>
            <Link href="/contact">
              <Button 
                className="btn-primary text-primary-foreground px-8 py-3 font-semibold"
                data-testid="contact-cta-button"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
