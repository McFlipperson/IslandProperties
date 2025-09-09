import { useState } from "react";
import { Link } from "wouter";
import { Property } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import VideoPlayerModal from "./video-player-modal"; // You'll need to create this import path

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export default function PropertyCard({ property, className = "" }: PropertyCardProps) {
  const [showVideoModal, setShowVideoModal] = useState(false);

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const primaryImage = Array.isArray(property.images) && property.images.length > 0 
    ? property.images[0] 
    : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600';

  // NEW: Check if property has a video
  const hasVideo = property.videoUrl && property.videoUrl.trim() !== '';

  return (
    <>
      <div className={`property-card bg-card rounded-lg overflow-hidden shadow-lg cursor-pointer ${className}`}>
        <div className="relative">
          <Link href={`/property/${property.id}`}>
            <img 
              src={primaryImage} 
              alt={property.title}
              className="w-full h-64 object-cover"
              data-testid={`property-image-${property.id}`}
            />
          </Link>
          
          {/* NEW: Video Play Button Overlay - Only show if video exists */}
          {hasVideo && (
            <Button
              onClick={(e) => {
                e.preventDefault(); // Prevent Link navigation
                e.stopPropagation(); // Stop event bubbling
                setShowVideoModal(true);
              }}
              className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full"
              size="sm"
              data-testid={`watch-video-${property.id}`}
            >
              <Play className="w-4 h-4 fill-current" />
            </Button>
          )}
        </div>
        
        <div className="p-6">
          <Link href={`/property/${property.id}`}>
            <h3 
              className="text-xl font-semibold mb-2 hover:text-primary transition-colors"
              data-testid={`property-title-${property.id}`}
            >
              {property.title}
            </h3>
          </Link>
          
          <p 
            className="text-2xl font-bold text-primary mb-2"
            data-testid={`property-price-${property.id}`}
          >
            {formatPrice(property.price)}
          </p>
          
          <p 
            className="text-muted-foreground mb-4"
            data-testid={`property-location-${property.id}`}
          >
            {property.location}
          </p>
          
          {(property.bedrooms || property.bathrooms || property.squareFeet) && (
            <div className="flex space-x-4 text-sm text-muted-foreground mb-4">
              {property.bedrooms && (
                <span data-testid={`property-bedrooms-${property.id}`}>
                  {property.bedrooms} beds
                </span>
              )}
              {property.bathrooms && (
                <span data-testid={`property-bathrooms-${property.id}`}>
                  {property.bathrooms} baths
                </span>
              )}
              {property.squareFeet && (
                <span data-testid={`property-sqft-${property.id}`}>
                  {property.squareFeet.toLocaleString()} sq ft
                </span>
              )}
            </div>
          )}

          {/* NEW: Watch Video Button - Only show if video exists */}
          {hasVideo && (
            <div className="mt-4">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowVideoModal(true);
                }}
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center gap-2"
                data-testid={`watch-video-button-${property.id}`}
              >
                <Play className="w-4 h-4 fill-current" />
                Watch Video
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* NEW: Video Modal - Only render if video exists */}
      {hasVideo && (
        <VideoPlayerModal
          open={showVideoModal}
          onOpenChange={setShowVideoModal}
          videoUrl={property.videoUrl!}
          propertyTitle={property.title}
        />
      )}
    </>
  );
}