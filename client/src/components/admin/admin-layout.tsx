import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
    { 
      name: "Listings", 
      icon: Home, 
      children: [
        { name: "Houses", href: "/admin/listings/houses", icon: Home },
        { name: "Land", href: "/admin/listings/land", icon: Mountain },
        { name: "Condos", href: "/admin/listings/condos", icon: Building },
        { name: "Beach", href: "/admin/listings/beach", icon: Waves },
        { name: "Commercial", href: "/admin/listings/commercial", icon: Store },
        { name: "Agriculture", href: "/admin/listings/agriculture", icon: Trees },
      ]
    },
    {
      name: "Content",
      icon: FileText,
      children: [
        { name: "Blog Posts", href: "/admin/content/blog", icon: FileText },
        { name: "FAQ", href: "/admin/content/faq", icon: MessageCircle },
        { name: "Testimonials", href: "/admin/content/testimonials", icon: MessageCircle },
      ]
    },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Security Logs", href: "/admin/security", icon: Shield },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (response.ok) {
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out",
        });
        setLocation("/admin/login");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "Unable to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isActive = (href: string) => location === href;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">Admin Panel</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-sm font-medium text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center">
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </div>
                  </div>
                  {item.children.map((child) => (
                    <Link key={child.href} href={child.href}>
                      <Button
                        variant={isActive(child.href) ? "secondary" : "ghost"}
                        className="w-full justify-start pl-8"
                        data-testid={`nav-${child.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <child.icon className="w-4 h-4 mr-2" />
                        {child.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              ) : (
                <Link href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="w-full"
            data-testid="admin-logout-button"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white shadow-sm border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Island Properties Admin</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}