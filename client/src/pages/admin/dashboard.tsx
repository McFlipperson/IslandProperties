import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Home, 
  Mountain, 
  Building, 
  Waves, 
  Store, 
  Trees, 
  FileText, 
  MessageCircle, 
  Users, 
  Shield,
  Activity,
  Plus,
  Eye
} from "lucide-react";

interface DashboardStats {
  totalProperties: number;
  propertiesByCategory: {
    houses: number;
    land: number;
    condos: number;
    beach: number;
    commercial: number;
    agriculture: number;
  };
  recentActivity: {
    id: string;
    action: string;
    timestamp: string;
    user: string;
  }[];
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const categoryIcons = {
    houses: Home,
    land: Mountain,
    condos: Building,
    beach: Waves,
    commercial: Store,
    agriculture: Trees,
  };

  const categoryColors = {
    houses: "text-blue-600 bg-blue-100",
    land: "text-green-600 bg-green-100",
    condos: "text-purple-600 bg-purple-100",
    beach: "text-cyan-600 bg-cyan-100",
    commercial: "text-orange-600 bg-orange-100",
    agriculture: "text-emerald-600 bg-emerald-100",
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to Island Properties Admin Panel</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats?.totalProperties || 0}</div>
            <p className="text-sm text-gray-600">Active listings</p>
          </CardContent>
        </Card>

        {stats?.propertiesByCategory && Object.entries(stats.propertiesByCategory).map(([category, count]) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons];
          const colorClass = categoryColors[category as keyof typeof categoryColors];
          
          return (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 capitalize flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{count}</div>
                <div className="flex space-x-2 mt-2">
  <Link href={`/admin/listings/${category}`}>
    <Button size="sm" variant="outline" data-testid={`view-${category}`}>
      <Eye className="w-3 h-3 mr-1" />
      View
    </Button>
  </Link>
  <Link href={`/admin/listings/${category}`}>
    <Button size="sm" data-testid={`add-${category}`}>
      <Plus className="w-3 h-3 mr-1" />
      Add
    </Button>
  </Link>
</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      {/* Quick Actions */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  <Button 
    className="h-24 flex flex-col space-y-2" 
    variant="outline"
    data-testid="quick-add-property"
  >
    <Plus className="w-6 h-6" />
    <span>Add Property</span>
  </Button>
  
  <Link href="/admin/content/blog">
    <Button 
      className="h-24 flex flex-col space-y-2 w-full" 
      variant="outline"
      data-testid="manage-blog"
    >
      <FileText className="w-6 h-6" />
      <span>Manage Blog</span>
    </Button>
  </Link>
  
  <Link href="/admin/content/testimonials">
    <Button 
      className="h-24 flex flex-col space-y-2 w-full" 
      variant="outline"
      data-testid="manage-testimonials"
    >
      <MessageCircle className="w-6 h-6" />
      <span>Testimonials</span>
    </Button>
  </Link>
  
  <Link href="/admin/security">
    <Button 
      className="h-24 flex flex-col space-y-2 w-full" 
      variant="outline"
      data-testid="security-logs"
    >
      <Shield className="w-6 h-6" />
      <span>Security Logs</span>
    </Button>
  </Link>
</div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentActivity?.length ? (
            <div className="space-y-3">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">by {activity.user}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No recent activity</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}