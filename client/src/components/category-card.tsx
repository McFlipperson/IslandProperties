import { Link } from "wouter";

interface CategoryCardProps {
  title: string;
  href: string;
  image: string;
  className?: string;
}

export default function CategoryCard({ title, href, image, className = "" }: CategoryCardProps) {
  return (
    <Link href={href}>
      <div className={`category-card bg-card rounded-lg overflow-hidden shadow-lg cursor-pointer ${className}`}>
        <img 
          src={image} 
          alt={`${title} category`}
          className="w-full h-48 object-cover"
          data-testid={`category-image-${title.toLowerCase()}`}
        />
        <div className="p-4 text-center">
          <h3 
            className="category-title text-lg font-semibold text-foreground"
            data-testid={`category-title-${title.toLowerCase()}`}
          >
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
