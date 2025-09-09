import { Testimonial } from "@shared/schema";

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export default function TestimonialCard({ testimonial, className = "" }: TestimonialCardProps) {
  const renderStars = (rating: number) => {
    return '★'.repeat(rating);
  };

  return (
    <div className={`bg-card p-6 rounded-lg shadow-lg ${className}`}>
      <div className="flex items-center mb-4">
        <img 
          src={testimonial.avatar} 
          alt={`${testimonial.name} testimonial`}
          className="w-12 h-12 rounded-full mr-4"
          data-testid={`testimonial-avatar-${testimonial.id}`}
        />
        <div>
          <h4 
            className="font-semibold"
            data-testid={`testimonial-name-${testimonial.id}`}
          >
            {testimonial.name}
          </h4>
          <p 
            className="text-sm text-muted-foreground"
            data-testid={`testimonial-title-${testimonial.id}`}
          >
            {testimonial.title}
          </p>
        </div>
      </div>
      <p 
        className="text-muted-foreground italic"
        data-testid={`testimonial-quote-${testimonial.id}`}
      >
        "{testimonial.quote}"
      </p>
      <div 
        className="flex text-primary text-sm mt-4"
        data-testid={`testimonial-rating-${testimonial.id}`}
      >
        <span>{renderStars(testimonial.rating || 5)}</span>
      </div>
    </div>
  );
}
