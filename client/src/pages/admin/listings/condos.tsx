import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  TrendingUp,
  Building2
} from "lucide-react";
import type { Property } from "@shared/schema";
import PropertyEditDialog from "../components/property-edit-dialog";

export default function AdminCondos() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();

  const { data: properties = [], isLoading, refetch } = useQuery<Property[]>({
  queryKey: ["/api/admin/properties", "condos", search, statusFilter],
  queryFn: async () => {
    const params = new URLSearchParams();
    params.append('category', 'condos');
    if (search) params.append('search', search);
    if (statusFilter !== 'all') params.append('status', statusFilter);
    
    const response = await fetch(`/api/admin/properties?${params.toString()}`, {
      credentials: 'include'
    });
    
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  }
});
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/admin/properties/${id}`, "DELETE"),
    onSuccess: () => {
      toast({ title: "Success", description: "Condo deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/properties"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard/stats"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete condo", variant: "destructive" });
    },
  });

  const bulkMutation = useMutation({
    mutationFn: ({ action, propertyIds }: { action: string, propertyIds: string[] }) => 
      apiRequest("/api/admin/properties/bulk", "POST", { action, propertyIds }),
    onSuccess: () => {
      toast({ title: "Success", description: "Bulk operation completed" });
      setSelectedProperties([]);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/properties"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard/stats"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Bulk operation failed", variant: "destructive" });
    },
  });

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setShowEditDialog(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this condo?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedProperties.length === 0) {
      toast({ title: "Warning", description: "No condos selected", variant: "destructive" });
      return;
    }
    
    if (action === "delete") {
      if (!confirm(`Are you sure you want to delete ${selectedProperties.length} condos?`)) {
        return;
      }
    }
    
    bulkMutation.mutate({ action, propertyIds: selectedProperties });
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedProperties(checked ? properties.map(p => p.id) : []);
  };

  const handleSelectProperty = (id: string, checked: boolean) => {
    setSelectedProperties(prev => 
      checked ? [...prev, id] : prev.filter(p => p !== id)
    );
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(search.toLowerCase()) ||
                         property.location.toLowerCase().includes(search.toLowerCase());
    
    if (statusFilter === "featured") return matchesSearch && property.isFeatured;
    if (statusFilter === "hot") return matchesSearch && property.isHot;
    
    return matchesSearch;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Building2 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold">Condos Management</h1>
              <p className="text-gray-600">Manage condo listings, edit details, and control visibility</p>
            </div>
          </div>
          <Button 
            onClick={() => {
              setEditingProperty(null);
              setShowEditDialog(true);
            }}
            data-testid="add-condo-button"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Condo
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search condos by title or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              data-testid="search-condos"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="featured">Featured Only</SelectItem>
              <SelectItem value="hot">Hot Listings Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedProperties.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedProperties.length} condos selected
              </span>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkAction("feature")}
                  data-testid="bulk-feature"
                >
                  <Star className="w-3 h-3 mr-1" />
                  Feature
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkAction("hot")}
                  data-testid="bulk-hot"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Mark Hot
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleBulkAction("delete")}
                  data-testid="bulk-delete"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Properties Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Select All */}
          <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
            <Checkbox
              checked={selectedProperties.length === filteredProperties.length && filteredProperties.length > 0}
              onCheckedChange={handleSelectAll}
              data-testid="select-all-condos"
            />
            <label className="text-sm font-medium">
              Select All ({filteredProperties.length} condos)
            </label>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No condos found</h3>
              <p className="text-gray-600 mb-4">No condos match your current filters.</p>
              <Button onClick={() => { setSearch(""); setStatusFilter("all"); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={Array.isArray(property.images) && property.images.length > 0 
                        ? property.images[0] 
                        : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'
                      }
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Checkbox
                        checked={selectedProperties.includes(property.id)}
                        onCheckedChange={(checked) => handleSelectProperty(property.id, !!checked)}
                        className="bg-white"
                        data-testid={`select-condo-${property.id}`}
                      />
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      {property.isFeatured && (
                        <Badge className="bg-yellow-500">Featured</Badge>
                      )}
                      {property.isHot && (
                        <Badge className="bg-red-500">Hot</Badge>
                      )}
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{property.title}</CardTitle>
                    <div className="text-2xl font-bold text-primary">
                      {formatPrice(property.price)}
                    </div>
                    <p className="text-muted-foreground text-sm">{property.location}</p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                      {property.bedrooms && <span>{property.bedrooms} beds</span>}
                      {property.bathrooms && <span>{property.bathrooms} baths</span>}
                      {property.squareFeet && <span>{property.squareFeet.toLocaleString()} sq ft</span>}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleEdit(property)}
                        data-testid={`edit-condo-${property.id}`}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        data-testid={`view-condo-${property.id}`}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDelete(property.id)}
                        data-testid={`delete-condo-${property.id}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      <PropertyEditDialog
        property={editingProperty}
        category="condos"
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={() => {
          setShowEditDialog(false);
          setEditingProperty(null);
          refetch();
        }}
      />
    </div>
  );
}