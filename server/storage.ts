import { 
  type User, 
  type InsertUser, 
  type Property, 
  type InsertProperty, 
  type Testimonial, 
  type InsertTestimonial,
  type AdminUser,
  type InsertAdminUser,
  type BlogPost,
  type InsertBlogPost,
  type FAQ,
  type InsertFAQ,
  type SecurityLog,
  type InsertSecurityLog
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Properties
  getAllProperties(): Promise<Property[]>;
  getProperty(id: string): Promise<Property | undefined>;
  getPropertiesByCategory(category: string): Promise<Property[]>;
  getFeaturedProperties(): Promise<Property[]>;
  getHotProperties(): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property>;
  deleteProperty(id: string): Promise<void>;
  
  // Testimonials
  getAllTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial>;
  deleteTestimonial(id: string): Promise<void>;
  
  // Admin Users
  getAdminUser(id: string): Promise<AdminUser | undefined>;
  getAdminUserByEmail(email: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  updateAdminUser(id: string, user: Partial<InsertAdminUser>): Promise<AdminUser>;
  
  // Blog Posts
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: string): Promise<void>;
  
  // FAQ
  getAllFAQs(): Promise<FAQ[]>;
  getFAQ(id: string): Promise<FAQ | undefined>;
  createFAQ(faq: InsertFAQ): Promise<FAQ>;
  updateFAQ(id: string, faq: Partial<InsertFAQ>): Promise<FAQ>;
  deleteFAQ(id: string): Promise<void>;
  
  // Security Logs
  createSecurityLog(log: InsertSecurityLog): Promise<SecurityLog>;
  getSecurityLogs(limit?: number): Promise<SecurityLog[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private properties: Map<string, Property>;
  private testimonials: Map<string, Testimonial>;
  private adminUsers: Map<string, AdminUser>;
  private blogPosts: Map<string, BlogPost>;
  private faqs: Map<string, FAQ>;
  private securityLogs: SecurityLog[];

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.testimonials = new Map();
    this.adminUsers = new Map();
    this.blogPosts = new Map();
    this.faqs = new Map();
    this.securityLogs = [];
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Sample properties - comprehensive detailed data for each category
    const sampleProperties: InsertProperty[] = [
      {
        title: "Private White Sand Beachfront Resort",
        price: "50000000",
        pricePerSqm: "₱10,000",
        location: "Anda, Bohol",
        category: "beach",
        description: "Exceptional beachfront resort property with pristine white sand beach.",
        detailedDescription: "Spectacular beachfront resort featuring 150 meters of pristine white sand beach, 5 traditional native cottages, main house, and all necessary permits for resort operations. Perfect for investment or personal retreat.",
        features: ["Swimming", "Snorkeling", "Kayaking", "Beach volleyball"],
        images: [
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        contactInfo: { phone: "+63 917 456 7890", email: "carlos@islandproperties.ph" },
        brokerName: "Carlos Mendoza",
        brokerPhone: "+63 917 456 7890",
        brokerEmail: "carlos@islandproperties.ph",
        titleType: "Clean Title",
        isHot: true,
        categoryData: {
          beachfrontMeters: 150,
          landSizeSqm: 5000,
          beachType: "Pristine White Sand",
          waterDepth: "Gradual slope, safe for swimming",
          tidalInfo: "Minimal tidal variation",
          accessRoad: "Concrete road to property",
          utilitiesWater: "Artesian well + municipal supply",
          utilitiesElectricity: "Generator + solar backup",
          existingStructures: "5 native cottages, main house",
          environmentalPermits: "DOT accredited, all permits current",
          beachActivities: ["Swimming", "Snorkeling", "Kayaking", "Beach volleyball"],
          nearbyAttractions: "Lamanoc Island, Cabagnow Cave Pool",
          divingSpots: "Excellent house reef for diving",
          fishingRights: "Traditional fishing area"
        }
      },
      {
        title: "Modern 4-Bedroom Villa with Pool",
        price: "25000000",
        pricePerSqm: "₱35,000",
        location: "Tagbilaran Heights, Bohol",
        category: "houses",
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 350,
        yearBuilt: 2020,
        propertyType: "Single Detached",
        description: "Stunning modern villa featuring contemporary design with resort-style amenities.",
        detailedDescription: "Exceptional modern villa featuring contemporary design, resort-style backyard with swimming pool, landscaped gardens, and premium finishes throughout. Perfect family home with all modern conveniences.",
        features: ["CCTV", "Alarm System", "24/7 Security", "Central AC"],
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        contactInfo: { phone: "+63 917 123 4567", email: "maria@islandproperties.ph" },
        brokerName: "Maria Santos",
        brokerPhone: "+63 917 123 4567",
        brokerEmail: "maria@islandproperties.ph",
        titleType: "Clean Title",
        isHot: true,
        categoryData: {
          lotSizeSqm: 800,
          parkingSpaces: 2,
          stories: 2,
          kitchenType: "Modern European Style",
          flooring: "Italian Marble & Hardwood",
          airConditioning: "Central AC",
          securityFeatures: ["CCTV", "Alarm System", "24/7 Security"],
          outdoorSpace: "Landscaped Garden with Pool",
          swimmingPool: true,
          balconyTerrace: "Master Bedroom Balcony",
          propertyTax: "₱45,000/year",
          hoaFees: "None"
        }
      },
      {
        title: "Luxury 2BR Oceanview Penthouse",
        price: "15000000",
        location: "Seaside Towers, Tagbilaran City",
        category: "condos",
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 120,
        description: "Spectacular penthouse unit with panoramic ocean and city views.",
        detailedDescription: "Stunning 25th floor penthouse featuring panoramic ocean and city views, premium finishes, semi-furnished with high-end appliances, and access to world-class building amenities.",
        features: ["Infinity Pool", "Gym", "Spa", "Rooftop Garden"],
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        contactInfo: { phone: "+63 917 345 6789", email: "lisa@islandproperties.ph" },
        brokerName: "Lisa Fernandez",
        brokerPhone: "+63 917 345 6789",
        brokerEmail: "lisa@islandproperties.ph",
        titleType: "Condominium Certificate of Title",
        isFeatured: true,
        categoryData: {
          floorLevel: "25th Floor",
          buildingName: "Seaside Towers",
          parkingSlots: 2,
          associationDues: "₱8,000/month",
          maintenanceFees: "Included in association dues",
          buildingAmenities: ["Infinity Pool", "Gym", "Spa", "Rooftop Garden"],
          security: "24/7 Security, CCTV, Card Access",
          elevators: "4 High-speed Elevators",
          viewType: "Ocean and City View",
          balcony: "10sqm Private Balcony",
          furnishedStatus: "Semi-furnished",
          petPolicy: "Small pets allowed",
          buildingAge: "3 years old"
        }
      },
      {
        title: "Productive Coconut Plantation with Processing",
        price: "12000000",
        pricePerSqm: "₱1,200,000",
        location: "Carmen, Bohol",
        category: "agriculture",
        description: "Fully operational coconut plantation with processing facilities and consistent production.",
        detailedDescription: "Exceptional 10-hectare coconut plantation featuring 500+ mature coconut trees, complete processing facilities, organic certification, and established market connections. Includes caretaker house and worker housing.",
        features: ["Copra dryer", "Processing equipment", "Farm tools", "Storage warehouses"],
        images: [
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        contactInfo: { phone: "+63 917 678 9012", email: "ricardo@islandproperties.ph" },
        brokerName: "Ricardo Villanueva",
        brokerPhone: "+63 917 678 9012",
        brokerEmail: "ricardo@islandproperties.ph",
        titleType: "Agricultural Free Patent",
        isFeatured: true,
        categoryData: {
          landSizeHectares: 10,
          soilType: "Rich alluvial soil, excellent drainage",
          currentCrops: "Mature coconut trees (500+ trees)",
          irrigationSystem: "Natural spring + irrigation channels",
          equipmentIncluded: ["Copra dryer", "Processing equipment", "Farm tools"],
          roadAccess: "All-weather farm-to-market road",
          storageFacilities: "2 large storage warehouses",
          harvestHistory: "Consistent 15,000 nuts/month average",
          organicCertification: "Organic certified by OCCP",
          workerHousing: "Caretaker house + 3 worker quarters",
          marketAccess: "Direct buyers, 30 minutes to port",
          climateConditions: "Ideal tropical climate",
          waterSource: "Natural spring, year-round flow"
        }
      },
      {
        title: "Prime Commercial Building - City Center",
        price: "35000000",
        location: "CPG Avenue, Tagbilaran City",
        category: "commercial",
        squareFeet: 800,
        description: "Excellent investment property in the heart of the business district.",
        detailedDescription: "Prime corner commercial building in Tagbilaran's main business district, featuring mixed-use spaces, established tenants, and excellent rental income potential. Perfect investment opportunity.",
        features: ["Restaurant", "Retail shops", "Office spaces", "High foot traffic"],
        images: [
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        contactInfo: { phone: "+63 917 567 8901", email: "elena@islandproperties.ph" },
        brokerName: "Elena Rodriguez",
        brokerPhone: "+63 917 567 8901",
        brokerEmail: "elena@islandproperties.ph",
        titleType: "Clean Title",
        isFeatured: true,
        categoryData: {
          buildingSizeSqm: 800,
          lotSizeSqm: 400,
          commercialType: "Mixed-use Commercial Building",
          zoning: "Commercial Business District",
          parkingSpaces: 10,
          loadingDock: "Rear loading access",
          currentIncome: "₱180,000/month",
          rentalRate: "₱200,000/month potential",
          footTraffic: "High - main commercial strip",
          visibility: "Prime corner location",
          currentTenants: ["Restaurant", "Retail shops", "Office spaces"],
          leaseTerms: "Various terms, 3-10 years",
          renovationNeeded: "Minimal - well-maintained",
          expansionPotential: "Can add 2 more floors",
          buildingAge: "8 years old"
        }
      },
      {
        title: "Prime Residential Development Land",
        price: "8000000",
        pricePerSqm: "₱4,000",
        location: "Panglao Island, Bohol",
        category: "land",
        description: "Exceptional development opportunity on Panglao Island with excellent potential.",
        detailedDescription: "Premium 2,000 sqm development land on Panglao Island, perfectly positioned for residential subdivision or resort development. Features gentle topography, excellent road access, and all utilities available.",
        features: ["Deep well available", "Fiber optic available", "6-meter concrete road", "Development potential"],
        images: [
          "https://images.unsplash.com/photo-1500076656116-558758c991c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        contactInfo: { phone: "+63 917 234 5678", email: "roberto@islandproperties.ph" },
        brokerName: "Roberto Cruz",
        brokerPhone: "+63 917 234 5678",
        brokerEmail: "roberto@islandproperties.ph",
        titleType: "Clean Title",
        isFeatured: true,
        categoryData: {
          totalAreaSqm: 2000,
          totalAreaHectares: 0.2,
          landClassification: "Residential",
          topography: "Gently Sloping",
          roadAccess: "6-meter concrete road",
          utilitiesWater: "Deep well available",
          utilitiesElectricity: "Meralco connection ready",
          utilitiesInternet: "Fiber optic available",
          zoning: "Residential, R1 Classification",
          soilType: "Clay loam, excellent for construction",
          floodHistory: "No flood history",
          developmentPotential: "Ideal for subdivision or resort",
          restrictions: "40% lot coverage maximum",
          nearbyAmenities: "5 minutes to Alona Beach, 10 minutes to airport",
          environmentalClearance: "ECC obtained"
        }
      }
    ];

    for (const property of sampleProperties) {
      await this.createProperty(property);
    }

    // Sample testimonials
    const sampleTestimonials: InsertTestimonial[] = [
      {
        name: "Sarah Johnson",
        title: "Property Investor",
        quote: "Island Properties helped me find the perfect beachfront investment. Their expertise and professionalism exceeded my expectations.",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64",
        rating: 5
      },
      {
        name: "Michael Chen",
        title: "Business Owner",
        quote: "Outstanding service from start to finish. They found us the ideal commercial space for our expanding business.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64",
        rating: 5
      },
      {
        name: "Emma Rodriguez",
        title: "First-Time Buyer",
        quote: "As a first-time buyer, I was nervous about the process. The team at Island Properties made everything smooth and stress-free.",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64",
        rating: 5
      }
    ];

    for (const testimonial of sampleTestimonials) {
      await this.createTestimonial(testimonial);
    }

    // Initialize admin users
    await this.createAdminUser({
      email: "nubesmcgee@gmail.com",
      password: ".TwentyTwo22.", // In production, this would be hashed
      role: "super_admin"
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getProperty(id: string): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getPropertiesByCategory(category: string): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.category === category
    );
  }

  async getFeaturedProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.isFeatured === true
    );
  }

  async getHotProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.isHot === true
    );
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = randomUUID();
    const property: Property = { 
      ...insertProperty, 
      id,
      bedrooms: insertProperty.bedrooms ?? null,
      bathrooms: insertProperty.bathrooms ?? null,
      squareFeet: insertProperty.squareFeet ?? null,
      lotSize: insertProperty.lotSize ?? null,
      yearBuilt: insertProperty.yearBuilt ?? null,
      propertyType: insertProperty.propertyType ?? null,
      isFeatured: insertProperty.isFeatured ?? false,
      isHot: insertProperty.isHot ?? false,
      features: insertProperty.features ?? null,
      categoryData: insertProperty.categoryData ?? null
    };
    this.properties.set(id, property);
    return property;
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = randomUUID();
    const testimonial: Testimonial = { 
      ...insertTestimonial, 
      id,
      rating: insertTestimonial.rating ?? 5
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  // Additional property methods
  async updateProperty(id: string, updates: Partial<InsertProperty>): Promise<Property> {
    const existing = this.properties.get(id);
    if (!existing) {
      throw new Error("Property not found");
    }
    const updated: Property = { ...existing, ...updates };
    this.properties.set(id, updated);
    return updated;
  }

  async deleteProperty(id: string): Promise<void> {
    this.properties.delete(id);
  }

  async updateTestimonial(id: string, updates: Partial<InsertTestimonial>): Promise<Testimonial> {
    const existing = this.testimonials.get(id);
    if (!existing) {
      throw new Error("Testimonial not found");
    }
    const updated: Testimonial = { ...existing, ...updates };
    this.testimonials.set(id, updated);
    return updated;
  }

  async deleteTestimonial(id: string): Promise<void> {
    this.testimonials.delete(id);
  }

  // Admin User methods
  async getAdminUser(id: string): Promise<AdminUser | undefined> {
    return this.adminUsers.get(id);
  }

  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    return Array.from(this.adminUsers.values()).find(
      (user) => user.email === email
    );
  }

  async createAdminUser(insertAdminUser: InsertAdminUser): Promise<AdminUser> {
    const id = randomUUID();
    const now = new Date();
    const adminUser: AdminUser = {
      ...insertAdminUser,
      id,
      loginAttempts: 0,
      lockedUntil: null,
      lastLogin: null,
      createdAt: now,
      updatedAt: now,
    };
    this.adminUsers.set(id, adminUser);
    return adminUser;
  }

  async updateAdminUser(id: string, updates: Partial<InsertAdminUser>): Promise<AdminUser> {
    const existing = this.adminUsers.get(id);
    if (!existing) {
      throw new Error("Admin user not found");
    }
    const updated: AdminUser = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.adminUsers.set(id, updated);
    return updated;
  }

  // Blog Post methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const now = new Date();
    const blogPost: BlogPost = {
      ...insertBlogPost,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }

  async updateBlogPost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost> {
    const existing = this.blogPosts.get(id);
    if (!existing) {
      throw new Error("Blog post not found");
    }
    const updated: BlogPost = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async deleteBlogPost(id: string): Promise<void> {
    this.blogPosts.delete(id);
  }

  // FAQ methods
  async getAllFAQs(): Promise<FAQ[]> {
    return Array.from(this.faqs.values());
  }

  async getFAQ(id: string): Promise<FAQ | undefined> {
    return this.faqs.get(id);
  }

  async createFAQ(insertFAQ: InsertFAQ): Promise<FAQ> {
    const id = randomUUID();
    const now = new Date();
    const faq: FAQ = {
      ...insertFAQ,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.faqs.set(id, faq);
    return faq;
  }

  async updateFAQ(id: string, updates: Partial<InsertFAQ>): Promise<FAQ> {
    const existing = this.faqs.get(id);
    if (!existing) {
      throw new Error("FAQ not found");
    }
    const updated: FAQ = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.faqs.set(id, updated);
    return updated;
  }

  async deleteFAQ(id: string): Promise<void> {
    this.faqs.delete(id);
  }

  // Security Log methods
  async createSecurityLog(insertSecurityLog: InsertSecurityLog): Promise<SecurityLog> {
    const id = randomUUID();
    const securityLog: SecurityLog = {
      ...insertSecurityLog,
      id,
      createdAt: new Date(),
    };
    this.securityLogs.push(securityLog);
    return securityLog;
  }

  async getSecurityLogs(limit: number = 50): Promise<SecurityLog[]> {
    return this.securityLogs
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
