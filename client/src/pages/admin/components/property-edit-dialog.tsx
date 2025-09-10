import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { X, Upload, Plus, Video } from "lucide-react";
import type { Property } from "@shared/schema";

interface PropertyEditDialogProps {
  property: Property | null;
  category: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

// Updated form schema with video field
const propertyFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.string().min(1, "Price is required"),
  pricePerSqm: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  detailedDescription: z.string().optional(),
  brokerName: z.string().min(1, "Broker name is required"),
  brokerPhone: z.string().min(1, "Broker phone is required"),
  brokerEmail: z.string().email("Valid email is required"),
  titleType: z.string().default("Clean Title"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  videoUrl: z.string().optional(), // NEW FIELD
  isFeatured: z.boolean().default(false),
  isHot: z.boolean().default(false),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  squareFeet: z.string().optional(),
  lotSize: z.string().optional(),
  yearBuilt: z.string().optional(),
  propertyType: z.string().default("Single Family Home"),
  // Land specific
  totalAreaSqm: z.string().optional(),
  totalAreaHectares: z.string().optional(),
  landClassification: z.string().optional(),
  topography: z.string().optional(),
});

type PropertyFormData = z.infer<typeof propertyFormSchema>;

export default function PropertyEditDialog({ 
  property, 
  category, 
  open, 
  onOpenChange, 
  onSuccess 
}: PropertyEditDialogProps) {
  const [dragActive, setDragActive] = useState(false);
  const [imageUploadUrl, setImageUploadUrl] = useState("");
  const { toast } = useToast();

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: "",
      price: "",
      pricePerSqm: "",
      location: "",
      description: "",
      detailedDescription: "",
      brokerName: "",
      brokerPhone: "",
      brokerEmail: "",
      titleType: "Clean Title",
      images: [],
      videoUrl: "", // NEW FIELD
      isFeatured: false,
      isHot: false,
      bedrooms: "",
      bathrooms: "",
      squareFeet: "",
      lotSize: "",
      yearBuilt: "",
      propertyType: "Single Family Home",
      totalAreaSqm: "",
      totalAreaHectares: "",
      landClassification: "",
      topography: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: PropertyFormData) => {
      const payload = {
        ...data,
        category,
        // Convert string fields to numbers where needed
        bedrooms: data.bedrooms ? parseInt(data.bedrooms) : undefined,
        bathrooms: data.bathrooms ? parseInt(data.bathrooms) : undefined,
        squareFeet: data.squareFeet ? parseInt(data.squareFeet) : undefined,
        yearBuilt: data.yearBuilt ? parseInt(data.yearBuilt) : undefined,
        categoryData: category === "land" ? {
          totalAreaSqm: data.totalAreaSqm ? parseInt(data.totalAreaSqm) : undefined,
          totalAreaHectares: data.totalAreaHectares ? parseFloat(data.totalAreaHectares) : undefined,
          landClassification: data.landClassification || undefined,
          topography: data.topography || undefined,
        } : {},
        contactInfo: {
          phone: data.brokerPhone,
          email: data.brokerEmail,
        },
      };
      
    if (property) {
  return apiRequest(`/api/admin/properties/${property.id}`, "PUT", payload);
} else {
  return apiRequest("/api/admin/properties", "POST", payload);
}
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Property ${property ? "updated" : "created"} successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/properties"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard/stats"] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || `Failed to ${property ? "update" : "create"} property`,
        variant: "destructive",
      });
    },
  });

  // Load property data when editing
  useEffect(() => {
    if (property && open) {
      const categoryData = property.categoryData || {};
      form.reset({
        title: property.title || "",
        price: property.price || "",
        pricePerSqm: property.pricePerSqm || "",
        location: property.location || "",
        description: property.description || "",
        detailedDescription: property.detailedDescription || "",
        brokerName: property.brokerName || "",
        brokerPhone: property.brokerPhone || "",
        brokerEmail: property.brokerEmail || "",
        titleType: property.titleType || "Clean Title",
        images: Array.isArray(property.images) ? property.images : [],
        videoUrl: property.videoUrl || "", // NEW FIELD
        isFeatured: property.isFeatured || false,
        isHot: property.isHot || false,
        bedrooms: property.bedrooms?.toString() || "",
        bathrooms: property.bathrooms?.toString() || "",
        squareFeet: property.squareFeet?.toString() || "",
        lotSize: property.lotSize || "",
        yearBuilt: property.yearBuilt?.toString() || "",
        propertyType: property.propertyType || "Single Family Home",
        totalAreaSqm: (categoryData as any)?.totalAreaSqm?.toString() || "",
        totalAreaHectares: (categoryData as any)?.totalAreaHectares?.toString() || "",
        landClassification: (categoryData as any)?.landClassification || "",
        topography: (categoryData as any)?.topography || "",
      });
    } else if (!property && open) {
      form.reset({
        title: "",
        price: "",
        pricePerSqm: "",
        location: "",
        description: "",
        detailedDescription: "",
        brokerName: "",
        brokerPhone: "",
        brokerEmail: "",
        titleType: "Clean Title",
        images: [],
        videoUrl: "", // NEW FIELD
        isFeatured: false,
        isHot: false,
        bedrooms: "",
        bathrooms: "",
        squareFeet: "",
        lotSize: "",
        yearBuilt: new Date().getFullYear().toString(),
        propertyType: "Single Family Home",
        totalAreaSqm: "",
        totalAreaHectares: "",
        landClassification: "",
        topography: "",
      });
    }
  }, [property, open, form]);

  const handleDrop = async (e: React.DragEvent) => {
  e.preventDefault();
  setDragActive(false);
  
  const files = Array.from(e.dataTransfer.files);
  const imageFiles = files.filter(file => file.type.startsWith('image/'));
  
  // Convert files to base64 data URLs
  const newImages = await Promise.all(
    imageFiles.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    })
  );
  
  const currentImages = form.getValues("images");
  form.setValue("images", [...currentImages, ...newImages]);
};

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const addImageUrl = () => {
    if (imageUploadUrl.trim()) {
      const currentImages = form.getValues("images");
      form.setValue("images", [...currentImages, imageUploadUrl.trim()]);
      setImageUploadUrl("");
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images");
    form.setValue("images", currentImages.filter((_, i) => i !== index));
  };

  // NEW FUNCTION: Validate video URL
  const isValidVideoUrl = (url: string): boolean => {
    if (!url) return false;
    
    // Check for YouTube URLs
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/;
    
    // Check for Vimeo URLs
    const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/\d+/;
    
    // Check for direct video files
    const directVideoRegex = /\.(mp4|webm|ogg|mov|avi)(\?.*)?$/i;
    
    return youtubeRegex.test(url) || vimeoRegex.test(url) || directVideoRegex.test(url);
  };

  const onSubmit = (data: PropertyFormData) => {
    mutation.mutate(data);
  };

  const renderCategorySpecificFields = () => {
    switch (category) {
      case "houses":
      case "condos":
      case "beach":
      case "commercial":
        return (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bedrooms</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="3"
                      {...field}
                      data-testid="bedrooms-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathrooms</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="2"
                      {...field}
                      data-testid="bathrooms-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="squareFeet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Square Feet</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1200"
                      {...field}
                      data-testid="square-feet-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yearBuilt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year Built</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="2020"
                      {...field}
                      data-testid="year-built-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Property Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="property-type-select">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Single Family Home">Single Family Home</SelectItem>
                      <SelectItem value="Townhouse">Townhouse</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Duplex">Duplex</SelectItem>
                      <SelectItem value="Condo">Condo</SelectItem>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Warehouse">Warehouse</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case "land":
      case "agriculture":
        return (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="totalAreaSqm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Area (sqm)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1000"
                      {...field}
                      data-testid="total-area-sqm-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalAreaHectares"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Area (hectares)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0.1"
                      {...field}
                      data-testid="total-area-hectares-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="landClassification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Land Classification</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="land-classification-select">
                        <SelectValue placeholder="Select classification" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Agricultural">Agricultural</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="topography"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topography</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="topography-select">
                        <SelectValue placeholder="Select topography" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Flat">Flat</SelectItem>
                      <SelectItem value="Gently Sloping">Gently Sloping</SelectItem>
                      <SelectItem value="Steep">Steep</SelectItem>
                      <SelectItem value="Rolling">Rolling</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {property ? `Edit ${category} Property` : `Add New ${category} Property`}
          </DialogTitle>
          <DialogDescription>
            {property ? `Update the details for this ${category} property.` : `Add a new ${category} property to your listings.`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="title-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="50000000" data-testid="price-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pricePerSqm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per SqM</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="₱10,000" data-testid="price-per-sqm-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="location-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Category-specific fields */}
            {renderCategorySpecificFields()}

            {/* Description */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description *</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} data-testid="description-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="detailedDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={5} data-testid="detailed-description-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Images */}
            <div className="space-y-4">
              <FormLabel>Property Images *</FormLabel>
              
              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-600">Drag and drop images here, or click to browse</p>
                <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, WebP</p>
              </div>

              {/* URL Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Or paste image URL..."
                  value={imageUploadUrl}
                  onChange={(e) => setImageUploadUrl(e.target.value)}
                  data-testid="image-url-input"
                />
                <Button type="button" onClick={addImageUrl} data-testid="add-image-url">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Image Preview */}
              <div className="grid grid-cols-3 gap-4">
                {form.watch("images").map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Property ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 h-6 w-6"
                      onClick={() => removeImage(index)}
                      data-testid={`remove-image-${index}`}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
              {form.formState.errors.images && (
                <p className="text-sm text-destructive">{form.formState.errors.images.message}</p>
              )}
            </div>

            {/* NEW SECTION: Video Upload */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Property Video (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/... or direct video URL"
                        data-testid="video-url-input"
                      />
                    </FormControl>
                    <div className="text-xs text-muted-foreground">
                      Supported formats: YouTube, Vimeo, or direct video file URLs (.mp4, .webm, .ogg)
                    </div>
                    {field.value && !isValidVideoUrl(field.value) && (
                      <p className="text-sm text-destructive">
                        Please enter a valid video URL (YouTube, Vimeo, or direct video file)
                      </p>
                    )}
                    {field.value && isValidVideoUrl(field.value) && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">✓ Valid video URL detected</p>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Broker Information */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brokerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Broker Name *</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="broker-name-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="brokerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Broker Phone *</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="broker-phone-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="brokerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Broker Email *</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} data-testid="broker-email-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="titleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="title-type-select">
                          <SelectValue placeholder="Select title type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Clean Title">Clean Title</SelectItem>
                        <SelectItem value="Torrens Title">Torrens Title</SelectItem>
                        <SelectItem value="Tax Declaration">Tax Declaration</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status Options */}
            <div className="flex gap-6">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="featured-checkbox"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured Property</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isHot"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="hot-checkbox"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Hot Listing</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                data-testid="cancel-button"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={mutation.isPending}
                data-testid="save-button"
              >
                {mutation.isPending ? "Saving..." : (property ? "Update Property" : "Create Property")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}