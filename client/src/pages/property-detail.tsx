import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Home, Play } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PropertyCard from "@/components/property-card";
import VideoPlayerModal from "@/components/video-player-modal"; // Add this import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Property } from "@shared/schema";

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false); // NEW: Video modal state
  const { toast } = useToast();

  const { data: property, isLoading } = useQuery<Property>({
    queryKey: [`/api/properties/${id}`],
  });

  const { data: similarProperties = [] } = useQuery<Property[]>({
    queryKey: [`/api/properties/category/${property?.category}`],
    enabled: !!property?.category,
  });

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Inquiry Sent!",
      description: "Your inquiry has been sent to the broker. They will contact you soon.",
    });

    setIsSubmitting(false);
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading property details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Property Not Found</h2>
            <p className="text-muted-foreground mb-6">The property you're looking for doesn't exist.</p>
            <Link href="/listings">
              <Button>Browse All Properties</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const images = Array.isArray(property.images) ? property.images : [];
  const features = Array.isArray(property.features) ? property.features : [];
  const categoryData = property.categoryData as any || {};
  const filteredSimilarProperties = similarProperties.filter(p => p.id !== property.id).slice(0, 4);

  // NEW: Check if property has a video
  const hasVideo = property.videoUrl && property.videoUrl.trim() !== '';

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Breadcrumb Navigation */}
        <section className="py-4 bg-accent">
          <div className="container mx-auto px-6">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-primary">
                <Home className="w-4 h-4" />
              </Link>
              <span className="text-muted-foreground">/</span>
              <Link href="/listings" className="text-muted-foreground hover:text-primary">
                Listings
              </Link>
              <span className="text-muted-foreground">/</span>
              <Link href={`/${property.category}`} className="text-muted-foreground hover:text-primary capitalize">
                {property.category}
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium">{property.title}</span>
            </nav>
          </div>
        </section>

        {/* Hero Image Gallery */}
        <section className="py-8">
          <div className="container mx-auto px-6">
            <div className="relative">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                {images.length > 0 && (
                  <img 
                    src={images[currentImageIndex]} 
                    alt={`${property.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    data-testid={`property-image-${currentImageIndex}`}
                  />
                )}
              </div>
              
              {/* NEW: Video Play Button Overlay - Only show if video exists */}
              {hasVideo && (
                <Button
                  onClick={() => setShowVideoModal(true)}
                  className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  data-testid="watch-video-overlay"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Watch Video
                </Button>
              )}
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-foreground p-2 rounded-full shadow-lg"
                    data-testid="prev-image-button"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-foreground p-2 rounded-full shadow-lg"
                    data-testid="next-image-button"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
              
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                      data-testid={`image-indicator-${index}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Property Header */}
        <section className="py-8">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="property-title">
                  {property.title}
                </h1>
                <div className="flex items-center text-muted-foreground mb-6">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span data-testid="property-location">{property.location}</span>
                </div>

                {/* NEW: Watch Video Button Section - Only show if video exists */}
                {hasVideo && (
                  <div className="mb-6">
                    <Button
                      onClick={() => setShowVideoModal(true)}
                      className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg flex items-center gap-2"
                      data-testid="watch-video-main-button"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      Watch Property Video
                    </Button>
                  </div>
                )}
                
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="text-2xl font-bold text-primary" data-testid="property-price">
                        {formatPrice(property.price)}
                      </p>
                      {property.pricePerSqm && (
                        <p className="text-sm text-muted-foreground">{property.pricePerSqm}/sqm</p>
                      )}
                    </CardContent>
                  </Card>
                  
                  {property.bedrooms && (
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Bedrooms</p>
                        <p className="text-2xl font-bold" data-testid="property-bedrooms">{property.bedrooms}</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {property.bathrooms && (
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Bathrooms</p>
                        <p className="text-2xl font-bold" data-testid="property-bathrooms">{property.bathrooms}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Property Description */}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4" data-testid="property-description">
                      {property.description}
                    </p>
                    {property.detailedDescription && (
                      <p className="text-muted-foreground" data-testid="property-detailed-description">
                        {property.detailedDescription}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Features */}
                {features.length > 0 && (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {features.map((feature, index) => (
                          <Badge key={index} variant="secondary" data-testid={`feature-${index}`}>
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Category-Specific Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Property Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(categoryData).map(([key, value]) => {
                        if (Array.isArray(value)) {
                          return (
                            <div key={key}>
                              <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                              <p className="text-muted-foreground">{value.join(', ')}</p>
                            </div>
                          );
                        }
                        return (
                          <div key={key}>
                            <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                            <p className="text-muted-foreground">{String(value)}</p>
                          </div>
                        );
                      })}
                      
                      {property.squareFeet && (
                        <div>
                          <p className="font-medium">Floor Area</p>
                          <p className="text-muted-foreground">{property.squareFeet} sqm</p>
                        </div>
                      )}
                      
                      {property.yearBuilt && (
                        <div>
                          <p className="font-medium">Year Built</p>
                          <p className="text-muted-foreground">{property.yearBuilt}</p>
                        </div>
                      )}
                      
                      {property.titleType && (
                        <div>
                          <p className="font-medium">Title Type</p>
                          <p className="text-muted-foreground">{property.titleType}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Section */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle>Contact Broker</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <h3 className="font-semibold text-lg" data-testid="broker-name">{property.brokerName}</h3>
                      <p className="text-muted-foreground">Real Estate Broker</p>
                    </div>
                    
                    {/* Inquiry Form */}
                    <form onSubmit={handleInquirySubmit} className="space-y-4">
                      <Input
                        placeholder="Your Name"
                        required
                        data-testid="inquiry-name"
                      />
                      <Input
                        type="email"
                        placeholder="Your Email"
                        required
                        data-testid="inquiry-email"
                      />
                      <Input
                        type="tel"
                        placeholder="Your Phone"
                        data-testid="inquiry-phone"
                      />
                      <Textarea
                        placeholder={`I'm interested in ${property.title}. Please send me more information.`}
                        rows={3}
                        required
                        data-testid="inquiry-message"
                      />
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary"
                        data-testid="inquiry-submit"
                      >
                        {isSubmitting ? "Sending..." : "Send Inquiry"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Similar Properties */}
        {filteredSimilarProperties.length > 0 && (
          <section className="py-20 bg-accent">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">Similar Properties</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredSimilarProperties.map((similarProperty) => (
                  <PropertyCard key={similarProperty.id} property={similarProperty} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* NEW: Video Modal - Only render if video exists */}
      {hasVideo && (
        <VideoPlayerModal
          open={showVideoModal}
          onOpenChange={setShowVideoModal}
          videoUrl={property.videoUrl!}
          propertyTitle={property.title}
        />
      )}

      <Footer />
    </div>
  );
}