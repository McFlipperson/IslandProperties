import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { BlogPost } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function AdminBlog() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog-posts"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => 
      fetch(`/api/admin/blog-posts/${id}`, { 
        method: "DELETE",
        credentials: 'include'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => 
      fetch("/api/admin/blog-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      setShowCreateDialog(false);
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      fetch(`/api/admin/blog-posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      setEditingPost(null);
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      excerpt: formData.get('excerpt') as string,
      author: formData.get('author') as string,
      category: formData.get('category') as string,
      featuredImage: formData.get('featuredImage') as string,
      status: formData.get('status') as string,
      slug: (formData.get('title') as string).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    };

    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600">Manage your blog content</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
            </DialogHeader>
            <BlogPostForm 
              onSubmit={handleSubmit}
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {blogPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    By {post.author} • {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'No date'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Dialog open={editingPost?.id === post.id} onOpenChange={(open) => !open && setEditingPost(null)}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setEditingPost(post)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Blog Post</DialogTitle>
                      </DialogHeader>
                      <BlogPostForm 
                        onSubmit={handleSubmit}
                        defaultValues={editingPost}
                        isLoading={updateMutation.isPending}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(post.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 line-clamp-2">{post.excerpt}</p>
              <div className="mt-4 flex items-center space-x-4">
                <span className={`px-2 py-1 rounded text-xs ${
                  post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {post.status}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                  {post.category}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {blogPosts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-600">No blog posts yet. Create your first post!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

interface BlogPostFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  defaultValues?: BlogPost | null;
  isLoading: boolean;
}

function BlogPostForm({ onSubmit, defaultValues, isLoading }: BlogPostFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input 
          name="title" 
          defaultValue={defaultValues?.title || ''} 
          required 
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Excerpt</label>
        <Textarea 
          name="excerpt" 
          defaultValue={defaultValues?.excerpt || ''} 
          rows={3}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Content</label>
        <Textarea 
          name="content" 
          defaultValue={defaultValues?.content || ''} 
          rows={8}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Author</label>
          <Input 
            name="author" 
            defaultValue={defaultValues?.author || ''} 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Select name="category" defaultValue={defaultValues?.category || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Market Insights">Market Insights</SelectItem>
              <SelectItem value="Local News">Local News</SelectItem>
              <SelectItem value="Investment Tips">Investment Tips</SelectItem>
              <SelectItem value="Property Guide">Property Guide</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Featured Image URL</label>
        <Input 
          name="featuredImage" 
          type="url"
          defaultValue={defaultValues?.featuredImage || ''} 
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <Select name="status" defaultValue={defaultValues?.status || 'draft'}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : defaultValues ? 'Update Post' : 'Create Post'}
        </Button>
      </div>
    </form>
  );
}