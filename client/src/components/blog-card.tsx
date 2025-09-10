import { Link } from "wouter";
import { Calendar, User } from "lucide-react";
import { BlogPost } from "@shared/schema";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      {post.featuredImage && (
        <img 
          src={post.featuredImage} 
          alt={post.title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      )}
      <div className="p-6">
        <div className="mb-2">
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded">
            {post.category}
          </span>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <User className="w-4 h-4 mr-1" />
          <span className="mr-4">{post.author}</span>
          <Calendar className="w-4 h-4 mr-1" />
         <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'No date'}</span>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <button className="text-primary hover:text-primary/80 font-medium transition-colors">
            Read More →
          </button>
        </Link>
      </div>
    </div>
  );
}