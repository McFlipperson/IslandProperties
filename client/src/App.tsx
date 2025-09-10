import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Listings from "@/pages/listings";
import PropertyDetail from "@/pages/property-detail";
import Houses from "@/pages/houses";
import Land from "@/pages/land";
import Condos from "@/pages/condos";
import Beach from "@/pages/beach";
import Commercial from "@/pages/commercial";
import Agriculture from "@/pages/agriculture";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import AdminBlog from "@/pages/admin/content/blog";
import AdminTestimonials from "@/pages/admin/content/testimonials";

// Admin imports
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminHouses from "@/pages/admin/listings/houses";
import AdminLand from "@/pages/admin/listings/land";
import AdminCondos from "@/pages/admin/listings/condos";
import AdminBeach from "@/pages/admin/listings/beach";
import AdminCommercial from "@/pages/admin/listings/commercial";
import AdminAgriculture from "@/pages/admin/listings/agriculture";
import AdminLayout from "@/components/admin/admin-layout";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/listings" component={Listings} />
        <Route path="/property/:id" component={PropertyDetail} />
        <Route path="/houses" component={Houses} />
        <Route path="/land" component={Land} />
        <Route path="/condos" component={Condos} />
        <Route path="/beach" component={Beach} />
        <Route path="/commercial" component={Commercial} />
        <Route path="/agriculture" component={Agriculture} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/dashboard" component={() => (
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        )} />
        <Route path="/admin/listings/houses" component={() => (
          <AdminLayout>
            <AdminHouses />
          </AdminLayout>
        )} />
        <Route path="/admin/listings/land" component={() => (
          <AdminLayout>
            <AdminLand />
          </AdminLayout>
        )} />
        <Route path="/admin/listings/condos" component={() => (
          <AdminLayout>
            <AdminCondos />
          </AdminLayout>
        )} />
        <Route path="/admin/listings/beach" component={() => (
          <AdminLayout>
            <AdminBeach />
          </AdminLayout>
        )} />
        <Route path="/admin/listings/commercial" component={() => (
          <AdminLayout>
            <AdminCommercial />
          </AdminLayout>
        )} />
        <Route path="/admin/listings/agriculture" component={() => (
          <AdminLayout>
            <AdminAgriculture />
          </AdminLayout>
        )} />
        <Route path="/admin/content/testimonials" component={() => (
  <AdminLayout>
    <AdminTestimonials />
  </AdminLayout>
)} />
        <Route path="/admin/content/blog" component={() => (
  <AdminLayout>
    <AdminBlog />
  </AdminLayout>
)} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
