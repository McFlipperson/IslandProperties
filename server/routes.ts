import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { randomUUID } from "crypto";
import { storage } from "./storage";
import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
const multerStorage = multer.memoryStorage();
const upload = multer({ 
  storage: multerStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images allowed.'));
    }
  }
});

// Simple session storage for demo
const adminSessions = new Map<string, { adminUserId: string; expiresAt: Date }>();

// Admin authentication middleware
const adminAuth = async (req: Request & { adminUser?: any }, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.adminToken;
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const session = adminSessions.get(token);
  if (!session || session.expiresAt < new Date()) {
    if (session) adminSessions.delete(token);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired session" });
  }

  const adminUser = await storage.getAdminUser(session.adminUserId);
  if (!adminUser) {
    adminSessions.delete(token);
    return res.status(401).json({ message: "Unauthorized: Admin user not found" });
  }

  req.adminUser = adminUser;
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // File upload route
  app.post("/api/upload", adminAuth, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const base64Data = req.file.buffer.toString('base64');
      const dataUrl = `data:${req.file.mimetype};base64,${base64Data}`;
      
      res.json({ url: dataUrl });
    } catch (error) {
      res.status(500).json({ error: "Upload failed" });
    }
  });
  // Properties API
  app.get("/api/properties", async (_req, res) => {
    try {
      const properties = await storage.getAllProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/hot", async (_req, res) => {
    try {
      const properties = await storage.getHotProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hot properties" });
    }
  });

  app.get("/api/properties/featured", async (_req, res) => {
    try {
      const properties = await storage.getFeaturedProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured properties" });
    }
  });

  app.get("/api/properties/category/:category", async (req, res) => {
    try {
      const properties = await storage.getPropertiesByCategory(req.params.category);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch properties by category" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch property" });
    }
  });

  // Testimonials API
  // Blog Posts API
  app.get("/api/blog-posts", async (_req, res) => {
    try {
      const allPosts = await storage.getAllBlogPosts();
      // Only return published posts for public API
      const publishedPosts = allPosts.filter(post => post.status === 'published');
      res.json(publishedPosts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/admin/blog-posts", adminAuth, async (_req, res) => {
    try {
      const blogPosts = await storage.getAllBlogPosts();
      res.json(blogPosts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog-posts/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.post("/api/admin/blog-posts", adminAuth, async (req: any, res) => {
    try {
      const blogPost = await storage.createBlogPost(req.body);
      
      // Log the creation
      await storage.createSecurityLog({
        adminUserId: req.adminUser.id,
        action: "create_blog_post",
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { postId: blogPost.id, title: blogPost.title }
      });
      
      res.status(201).json(blogPost);
    } catch (error) {
      console.error("Create blog post error:", error);
      res.status(400).json({ error: "Failed to create blog post" });
    }
  });

  app.put("/api/admin/blog-posts/:id", adminAuth, async (req: any, res) => {
    try {
      const blogPost = await storage.updateBlogPost(req.params.id, req.body);
      
      // Log the update
      await storage.createSecurityLog({
        adminUserId: req.adminUser.id,
        action: "update_blog_post",
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { postId: blogPost.id, title: blogPost.title }
      });
      
      res.json(blogPost);
    } catch (error) {
      console.error("Update blog post error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog-posts/:id", adminAuth, async (req: any, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      await storage.deleteBlogPost(req.params.id);
      
      // Log the deletion
      await storage.createSecurityLog({
        adminUserId: req.adminUser.id,
        action: "delete_blog_post",
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { postId: req.params.id, title: post.title }
      });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });
  app.get("/api/testimonials", async (_req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  // Admin Authentication Routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password, rememberMe } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const adminUser = await storage.getAdminUserByEmail(email);
      if (!adminUser) {
        // Log failed login attempt
        await storage.createSecurityLog({
          adminUserId: null,
          action: "failed_login",
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          details: { email, reason: "User not found" }
        });
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check if account is locked
      if (adminUser.lockedUntil && adminUser.lockedUntil > new Date()) {
        return res.status(423).json({ 
          message: "Account is temporarily locked due to multiple failed login attempts",
          lockedUntil: adminUser.lockedUntil
        });
      }

      // Simple password check (in production, use bcrypt)
      if (adminUser.password !== password) {
        // Increment login attempts
        const newAttempts = (adminUser.loginAttempts || 0) + 1;
        const updates: any = { loginAttempts: newAttempts };
        
        // Lock account after 5 failed attempts
        if (newAttempts >= 5) {
          updates.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        }
        
        await storage.updateAdminUser(adminUser.id, updates);
        
        await storage.createSecurityLog({
          adminUserId: adminUser.id,
          action: "failed_login",
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          details: { email, attempt: newAttempts }
        });

        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Successful login - reset attempts and update last login
      await storage.updateAdminUser(adminUser.id, {
        loginAttempts: 0,
        lockedUntil: null,
        lastLogin: new Date()
      });

      // Create session
      const token = randomUUID();
      const expiresAt = new Date(Date.now() + (rememberMe ? 7 * 24 : 2) * 60 * 60 * 1000);
      adminSessions.set(token, { adminUserId: adminUser.id, expiresAt });

      // Log successful login
      await storage.createSecurityLog({
        adminUserId: adminUser.id,
        action: "login",
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { email, rememberMe }
      });

      // Set secure cookie
      res.cookie('adminToken', token, {
        httpOnly: true,
        secure: true,
        maxAge: expiresAt.getTime() - Date.now()
      });

      res.json({
        success: true,
        user: {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role
        },
        token,
        expiresAt
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/logout", adminAuth, async (req: any, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.adminToken;
      
      if (token) {
        adminSessions.delete(token);
        res.clearCookie('adminToken');
      }

      // Log logout
      await storage.createSecurityLog({
        adminUserId: req.adminUser.id,
        action: "logout",
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // Admin Dashboard Stats
  app.get("/api/admin/dashboard/stats", adminAuth, async (req, res) => {
    try {
      const properties = await storage.getAllProperties();
      const totalProperties = properties.length;
      
      const propertiesByCategory = {
        houses: properties.filter(p => p.category === 'houses').length,
        land: properties.filter(p => p.category === 'land').length,
        condos: properties.filter(p => p.category === 'condos').length,
        beach: properties.filter(p => p.category === 'beach').length,
        commercial: properties.filter(p => p.category === 'commercial').length,
        agriculture: properties.filter(p => p.category === 'agriculture').length,
      };

      const recentActivity = await storage.getSecurityLogs(10);

      res.json({
        totalProperties,
        propertiesByCategory,
        recentActivity: recentActivity.map(log => ({
          id: log.id,
          action: log.action,
          timestamp: log.createdAt,
          user: log.adminUserId ? 'Admin User' : 'Unknown'
        }))
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Admin Property CRUD Routes
  app.get("/api/admin/properties", adminAuth, async (req, res) => {
    try {
      const { category, status, search } = req.query;
      let properties = await storage.getAllProperties();
      
      // Filter by category
      if (category) {
        properties = properties.filter(p => p.category === category);
      }
      
      // Filter by status (featured, hot)
      if (status === 'featured') {
        properties = properties.filter(p => p.isFeatured);
      } else if (status === 'hot') {
        properties = properties.filter(p => p.isHot);
      }
      
      // Search filter
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        properties = properties.filter(p => 
          p.title.toLowerCase().includes(searchTerm) ||
          p.location.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
        );
      }
      
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  app.post("/api/admin/properties", adminAuth, async (req: any, res) => {
    try {
      const property = await storage.createProperty(req.body);
      
      // Log the creation
      await storage.createSecurityLog({
        adminUserId: req.adminUser.id,
        action: "create_property",
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { propertyId: property.id, title: property.title, category: property.category }
      });
      
      res.status(201).json(property);
    } catch (error) {
      console.error("Create property error:", error);
      res.status(400).json({ error: "Failed to create property" });
    }
  });

  app.put("/api/admin/properties/:id", adminAuth, async (req: any, res) => {
    try {
      const property = await storage.updateProperty(req.params.id, req.body);
      
      // Log the update
      await storage.createSecurityLog({
        adminUserId: req.adminUser.id,
        action: "update_property",
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { propertyId: property.id, title: property.title, category: property.category }
      });
      
      res.json(property);
    } catch (error) {
      console.error("Update property error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to update property" });
    }
  });

  app.delete("/api/admin/properties/:id", adminAuth, async (req: any, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      
      await storage.deleteProperty(req.params.id);
      
      // Log the deletion
      await storage.createSecurityLog({
        adminUserId: req.adminUser.id,
        action: "delete_property",
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { propertyId: req.params.id, title: property.title, category: property.category }
      });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete property" });
    }
  });

  // Bulk operations for properties
  app.post("/api/admin/properties/bulk", adminAuth, async (req: any, res) => {
    try {
      const { action, propertyIds } = req.body;
      
      if (!action || !propertyIds || !Array.isArray(propertyIds)) {
        return res.status(400).json({ error: "Invalid bulk operation request" });
      }
      
      const results = [];
      
      for (const id of propertyIds) {
        try {
          switch (action) {
            case 'delete':
              await storage.deleteProperty(id);
              break;
            case 'feature':
              await storage.updateProperty(id, { isFeatured: true });
              break;
            case 'unfeature':
              await storage.updateProperty(id, { isFeatured: false });
              break;
            case 'hot':
              await storage.updateProperty(id, { isHot: true });
              break;
            case 'unhot':
              await storage.updateProperty(id, { isHot: false });
              break;
            default:
              throw new Error(`Unknown action: ${action}`);
          }
          results.push({ id, success: true });
        } catch (error) {
          results.push({ id, success: false, error: error instanceof Error ? error.message : "Unknown error" });
        }
      }
      
      // Log the bulk operation
      await storage.createSecurityLog({
        adminUserId: req.adminUser.id,
        action: "bulk_property_operation",
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { action, propertyIds, results }
      });
      
      res.json({ results });
    } catch (error) {
      res.status(500).json({ error: "Failed to perform bulk operation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
