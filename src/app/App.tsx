import { useState, useRef } from "react";
import {
  BookOpen, Search, Bell, User, Star, Clock, Users, Play,
  Award, TrendingUp, DollarSign, Settings, LogOut, Menu, X,
  Sun, Moon, ArrowRight, Check, ChevronRight, ChevronDown,
  CreditCard, Shield, Globe, Filter, GraduationCap,
  PlusCircle, Edit, Trash2, Eye, CheckCircle, XCircle,
  Video, FileText, Home, LayoutDashboard, BookMarked,
  MessageSquare, Receipt, AlertTriangle, MoreHorizontal,
  PlayCircle, BarChart2, Zap, Target, Layers, ChevronLeft,
  ShoppingCart, Share2, Download, List, Activity,
  Upload, Lock, ChevronUp, Percent, Heart,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { motion } from "motion/react";

// ── Types ──────────────────────────────────────────────────────────────────────
type Page = "home" | "catalog" | "course" | "checkout" | "player" | "student" | "instructor" | "admin" | "auth";
type Role = "student" | "instructor" | "admin";

interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  thumbnail: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  rating: number;
  reviewCount: number;
  students: number;
  duration: string;
  price: number;
  originalPrice: number;
  lessons: number;
  badge?: "Bestseller" | "New" | "Hot";
  progress?: number;
  published?: boolean;
  revenue?: number;
}

// ── Mock Data ──────────────────────────────────────────────────────────────────
const COURSES: Course[] = [
  {
    id: "1", title: "React & TypeScript Masterclass: Build Modern Apps",
    instructor: "Sarah Chen", instructorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&auto=format",
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53ad39282d04?w=400&h=225&fit=crop&auto=format",
    category: "Web Development", level: "Intermediate", rating: 4.9, reviewCount: 3241, students: 18420,
    duration: "42h 30m", price: 89.99, originalPrice: 199.99, lessons: 156, badge: "Bestseller", progress: 68, published: true, revenue: 24800,
  },
  {
    id: "2", title: "Machine Learning with Python: From Zero to Expert",
    instructor: "Dr. James Park", instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&auto=format",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop&auto=format",
    category: "Data Science", level: "Advanced", rating: 4.8, reviewCount: 2187, students: 12350,
    duration: "56h 15m", price: 119.99, originalPrice: 249.99, lessons: 201, badge: "Bestseller", progress: 32, published: true, revenue: 19600,
  },
  {
    id: "3", title: "UI/UX Design Fundamentals: Figma to Prototype",
    instructor: "Maya Rodriguez", instructorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&auto=format",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop&auto=format",
    category: "Design", level: "Beginner", rating: 4.7, reviewCount: 1893, students: 9870,
    duration: "28h 45m", price: 79.99, originalPrice: 169.99, lessons: 112, badge: "Hot", published: true, revenue: 11200,
  },
  {
    id: "4", title: "Digital Marketing Strategy: Growth & Analytics",
    instructor: "Alex Kim", instructorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&auto=format",
    thumbnail: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=225&fit=crop&auto=format",
    category: "Marketing", level: "Intermediate", rating: 4.6, reviewCount: 1456, students: 7230,
    duration: "22h 10m", price: 69.99, originalPrice: 149.99, lessons: 88, published: true, revenue: 8900,
  },
  {
    id: "5", title: "Node.js & Express: Complete Backend Development",
    instructor: "Marcus Johnson", instructorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&auto=format",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=225&fit=crop&auto=format",
    category: "Web Development", level: "Intermediate", rating: 4.8, reviewCount: 2034, students: 11280,
    duration: "38h 20m", price: 94.99, originalPrice: 199.99, lessons: 143, badge: "New", published: true, revenue: 16400,
  },
  {
    id: "6", title: "AWS Cloud Practitioner: Architecture & Deployment",
    instructor: "Priya Sharma", instructorAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&auto=format",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop&auto=format",
    category: "Cloud Computing", level: "Advanced", rating: 4.9, reviewCount: 1678, students: 8940,
    duration: "45h 00m", price: 99.99, originalPrice: 219.99, lessons: 178, published: false, revenue: 12100,
  },
  {
    id: "7", title: "Figma Master: Advanced UI Design Techniques",
    instructor: "Elena Torres", instructorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&auto=format",
    thumbnail: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=400&h=225&fit=crop&auto=format",
    category: "Design", level: "Intermediate", rating: 4.7, reviewCount: 1234, students: 6720,
    duration: "24h 30m", price: 74.99, originalPrice: 159.99, lessons: 96, published: true, revenue: 7800,
  },
  {
    id: "8", title: "Python for Data Analysis: Pandas & Visualization",
    instructor: "Dr. James Park", instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&auto=format",
    thumbnail: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=225&fit=crop&auto=format",
    category: "Data Science", level: "Beginner", rating: 4.8, reviewCount: 2891, students: 15640,
    duration: "32h 45m", price: 84.99, originalPrice: 179.99, lessons: 124, badge: "Bestseller", published: true, revenue: 18700,
  },
];

const CATEGORIES = [
  { name: "Web Development", icon: Globe, count: 342, color: "bg-indigo-500", light: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" },
  { name: "Data Science", icon: BarChart2, count: 218, color: "bg-violet-500", light: "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400" },
  { name: "Design", icon: Layers, count: 195, color: "bg-pink-500", light: "bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" },
  { name: "Business", icon: TrendingUp, count: 167, color: "bg-emerald-500", light: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { name: "Marketing", icon: Target, count: 143, color: "bg-amber-500", light: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
  { name: "Cloud Computing", icon: Zap, count: 128, color: "bg-cyan-500", light: "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400" },
];

const REVENUE_DATA = [
  { month: "Jan", revenue: 12400, students: 142 }, { month: "Feb", revenue: 15600, students: 178 },
  { month: "Mar", revenue: 18200, students: 209 }, { month: "Apr", revenue: 16800, students: 193 },
  { month: "May", revenue: 21400, students: 245 }, { month: "Jun", revenue: 24600, students: 282 },
  { month: "Jul", revenue: 22100, students: 254 }, { month: "Aug", revenue: 26800, students: 308 },
  { month: "Sep", revenue: 29200, students: 335 }, { month: "Oct", revenue: 31400, students: 361 },
  { month: "Nov", revenue: 28600, students: 328 }, { month: "Dec", revenue: 34200, students: 393 },
];

const PLATFORM_DATA = [
  { month: "Jan", users: 8240, courses: 198 }, { month: "Feb", users: 10120, students: 234 },
  { month: "Mar", users: 12600, courses: 267 }, { month: "Apr", users: 11800, courses: 259 },
  { month: "May", users: 15400, courses: 312 }, { month: "Jun", users: 18900, courses: 348 },
  { month: "Jul", users: 17200, courses: 334 }, { month: "Aug", users: 22400, courses: 401 },
  { month: "Sep", users: 26100, courses: 445 }, { month: "Oct", users: 28900, courses: 478 },
  { month: "Nov", users: 25600, courses: 452 }, { month: "Dec", users: 31200, courses: 512 },
];

const CATEGORY_DIST = [
  { name: "Web Dev", value: 342 }, { name: "Data Science", value: 218 },
  { name: "Design", value: 195 }, { name: "Business", value: 167 },
  { name: "Marketing", value: 143 }, { name: "Cloud", value: 128 },
];

const CHART_COLORS = ["#4f46e5", "#7c3aed", "#ec4899", "#10b981", "#f59e0b", "#06b6d4"];

const TRANSACTIONS = [
  { id: "TXN-8821", user: "Liam Foster", course: "React & TypeScript Masterclass", amount: 89.99, date: "2024-12-18", status: "completed" },
  { id: "TXN-8820", user: "Aisha Patel", course: "Machine Learning with Python", amount: 119.99, date: "2024-12-18", status: "completed" },
  { id: "TXN-8819", user: "Carlos Vega", course: "UI/UX Design Fundamentals", amount: 79.99, date: "2024-12-17", status: "refunded" },
  { id: "TXN-8818", user: "Nina Okonkwo", course: "Node.js & Express", amount: 94.99, date: "2024-12-17", status: "completed" },
  { id: "TXN-8817", user: "Tom Brennan", course: "AWS Cloud Practitioner", amount: 99.99, date: "2024-12-16", status: "pending" },
  { id: "TXN-8816", user: "Zoe Laurent", course: "Digital Marketing Strategy", amount: 69.99, date: "2024-12-16", status: "completed" },
];

const ADMIN_USERS = [
  { id: 1, name: "Sarah Chen", email: "sarah@courshare.io", role: "Instructor", courses: 4, joined: "2023-03-12", status: "active", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&auto=format" },
  { id: 2, name: "Dr. James Park", email: "james@courshare.io", role: "Instructor", courses: 3, joined: "2023-01-08", status: "active", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&auto=format" },
  { id: 3, name: "Liam Foster", email: "liam@gmail.com", role: "Student", courses: 5, joined: "2024-02-20", status: "active", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&auto=format" },
  { id: 4, name: "Carlos Vega", email: "carlos@hotmail.com", role: "Student", courses: 2, joined: "2024-06-14", status: "suspended", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=32&h=32&fit=crop&auto=format" },
  { id: 5, name: "Maya Rodriguez", email: "maya@courshare.io", role: "Instructor", courses: 2, joined: "2023-07-30", status: "active", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&auto=format" },
];

const PENDING_COURSES = [
  { id: 1, title: "Kubernetes: Production-Grade Deployments", instructor: "Alex Kim", category: "Cloud", submitted: "2024-12-15", lessons: 64 },
  { id: 2, title: "Advanced SQL & Database Optimization", instructor: "Priya Sharma", category: "Data Science", submitted: "2024-12-14", lessons: 48 },
  { id: 3, title: "Brand Identity Design System", instructor: "Elena Torres", category: "Design", submitted: "2024-12-12", lessons: 36 },
];

const CURRICULUM = [
  { title: "Getting Started", lessons: [{ title: "Course Introduction", dur: "4:30", free: true }, { title: "Setting Up Your Environment", dur: "12:15", free: true }, { title: "Understanding the Project Structure", dur: "8:45", free: false }] },
  { title: "Core Concepts", lessons: [{ title: "React Hooks Deep Dive", dur: "24:10", free: false }, { title: "TypeScript Fundamentals", dur: "18:30", free: false }, { title: "State Management Patterns", dur: "32:20", free: false }] },
  { title: "Advanced Patterns", lessons: [{ title: "Custom Hooks & Composition", dur: "28:15", free: false }, { title: "Performance Optimization", dur: "22:45", free: false }, { title: "Testing Strategies", dur: "35:00", free: false }] },
  { title: "Real-World Projects", lessons: [{ title: "Building a Full-Stack App", dur: "45:30", free: false }, { title: "Deployment & CI/CD", dur: "20:15", free: false }, { title: "Final Project Review", dur: "15:00", free: false }] },
];

const LESSON_LIST = [
  { section: "Getting Started", lessons: [{ title: "Course Introduction", dur: "4:30", done: true }, { title: "Setup Environment", dur: "12:15", done: true }, { title: "Project Structure", dur: "8:45", done: true }] },
  { section: "Core Concepts", lessons: [{ title: "React Hooks Deep Dive", dur: "24:10", done: true }, { title: "TypeScript Fundamentals", dur: "18:30", done: true }, { title: "State Management", dur: "32:20", done: false }] },
  { section: "Advanced Patterns", lessons: [{ title: "Custom Hooks", dur: "28:15", done: false }, { title: "Performance Optimization", dur: "22:45", done: false }, { title: "Testing Strategies", dur: "35:00", done: false }] },
];

const TESTIMONIALS = [
  { name: "Liam Foster", role: "Software Engineer at Google", text: "CourShare completely changed my career trajectory. The courses are incredibly well-structured and the instructors are world-class.", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=48&h=48&fit=crop&auto=format", rating: 5 },
  { name: "Aisha Patel", role: "Data Scientist at Netflix", text: "I went from knowing nothing about ML to landing my dream job in 8 months. The hands-on projects made all the difference.", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=48&h=48&fit=crop&auto=format", rating: 5 },
  { name: "Carlos Vega", role: "Freelance UI Designer", text: "The design courses here are miles ahead of anything else I found online. Real-world projects and genuine community support.", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=48&h=48&fit=crop&auto=format", rating: 5 },
];

// ── Utilities ──────────────────────────────────────────────────────────────────
function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function formatK(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();
}

// ── Shared Components ──────────────────────────────────────────────────────────
function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "warning" | "danger" | "outline" | "purple" }) {
  const v = {
    default: "bg-primary/10 text-primary",
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    outline: "border border-border text-muted-foreground",
    purple: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  };
  return <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", v[variant])}>{children}</span>;
}

function StarRating({ rating, count, size = "sm" }: { rating: number; count?: number; size?: "sm" | "xs" }) {
  return (
    <div className="flex items-center gap-1">
      <span className={cn("text-amber-500 font-semibold", size === "xs" ? "text-xs" : "text-sm")}>{rating.toFixed(1)}</span>
      <div className="flex">
        {[1, 2, 3, 4, 5].map(i => (
          <Star key={i} className={cn(size === "xs" ? "w-3 h-3" : "w-3.5 h-3.5", i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600")} />
        ))}
      </div>
      {count !== undefined && <span className="text-xs text-muted-foreground">({count.toLocaleString()})</span>}
    </div>
  );
}

function ProgressBar({ value, className, color = "bg-primary" }: { value: number; className?: string; color?: string }) {
  return (
    <div className={cn("h-1.5 bg-muted rounded-full overflow-hidden", className)}>
      <div className={cn("h-full rounded-full transition-all duration-500", color)} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color = "text-primary", bg = "bg-primary/10" }: {
  icon: React.ElementType; label: string; value: string; sub?: string; color?: string; bg?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className={cn("p-2 rounded-lg", bg)}>
          <Icon className={cn("w-4 h-4", color)} />
        </div>
      </div>
      <div className="text-2xl font-bold font-display text-foreground">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

function CourseCard({ course, onNavigate }: { course: Course; onNavigate: (p: Page) => void }) {
  return (
    <div
      onClick={() => onNavigate("course")}
      className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
    >
      <div className="relative overflow-hidden bg-muted">
        <img src={course.thumbnail} alt={course.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
        {course.badge && (
          <span className={cn("absolute top-2 left-2 px-2 py-0.5 rounded-md text-xs font-bold",
            course.badge === "Bestseller" ? "bg-amber-400 text-amber-900" :
            course.badge === "Hot" ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"
          )}>{course.badge}</span>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white/95 dark:bg-card/95 rounded-full p-3 shadow-lg scale-90 group-hover:scale-100 transition-transform duration-200">
            <Play className="w-5 h-5 text-primary fill-primary" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">{course.category}</span>
          <span className="text-xs text-muted-foreground">{course.level}</span>
        </div>
        <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2 font-display">{course.title}</h3>
        <div className="flex items-center gap-2 mb-2">
          <img src={course.instructorAvatar} alt={course.instructor} className="w-5 h-5 rounded-full object-cover" />
          <span className="text-xs text-muted-foreground">{course.instructor}</span>
        </div>
        <StarRating rating={course.rating} count={course.reviewCount} />
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.duration}</span>
          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{course.lessons}</span>
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{formatK(course.students)}</span>
        </div>
        {course.progress !== undefined && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span><span className="font-medium text-primary">{course.progress}%</span>
            </div>
            <ProgressBar value={course.progress} />
          </div>
        )}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div>
            <span className="font-bold text-foreground">${course.price}</span>
            <span className="text-xs text-muted-foreground line-through ml-1">${course.originalPrice}</span>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md">
            {Math.round((1 - course.price / course.originalPrice) * 100)}% off
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────────
function Navbar({ page, onNavigate, dark, onDark, role, isLoggedIn, onLogout }: {
  page: Page; onNavigate: (p: Page) => void; dark: boolean; onDark: () => void;
  role: Role; isLoggedIn: boolean; onLogout: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const navLinks: { label: string; page: Page }[] = [
    { label: "Browse", page: "catalog" },
    ...(isLoggedIn && role === "student" ? [{ label: "My Learning", page: "student" as Page }] : []),
    ...(isLoggedIn && role === "instructor" ? [{ label: "Instructor", page: "instructor" as Page }] : []),
    ...(isLoggedIn && role === "admin" ? [{ label: "Admin", page: "admin" as Page }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-4">
        <button onClick={() => onNavigate("home")} className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg font-display text-foreground">Cour<span className="text-primary">Share</span></span>
        </button>

        <div className="hidden md:flex items-center gap-1 ml-2">
          {navLinks.map(l => (
            <button key={l.page} onClick={() => onNavigate(l.page)}
              className={cn("px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                page === l.page ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}>{l.label}</button>
          ))}
        </div>

        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              className="w-full pl-9 pr-4 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              placeholder="Search courses..."
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={onDark} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {isLoggedIn ? (
            <>
              <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
              </button>
              <div className="relative">
                <button onClick={() => setUserOpen(!userOpen)} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors">
                  <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {role === "student" ? "S" : role === "instructor" ? "I" : "A"}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                {userOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-border">
                      <div className="font-semibold text-sm">{role === "student" ? "Alex Student" : role === "instructor" ? "Sarah Chen" : "Admin User"}</div>
                      <div className="text-xs text-muted-foreground">{role}@courshare.io</div>
                    </div>
                    <div className="p-1">
                      <button onClick={() => { onNavigate(role === "student" ? "student" : role === "instructor" ? "instructor" : "admin"); setUserOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </button>
                      <button className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors">
                        <Settings className="w-4 h-4" /> Settings
                      </button>
                      <div className="border-t border-border my-1" />
                      <button onClick={() => { onLogout(); setUserOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 transition-colors">
                        <LogOut className="w-4 h-4" /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={() => onNavigate("auth")} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Log in</button>
              <button onClick={() => onNavigate("auth")} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">Get started</button>
            </div>
          )}

          <button className="md:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1">
          {navLinks.map(l => (
            <button key={l.page} onClick={() => { onNavigate(l.page); setMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">{l.label}</button>
          ))}
          {!isLoggedIn && (
            <div className="flex gap-2 pt-2">
              <button onClick={() => { onNavigate("auth"); setMenuOpen(false); }} className="flex-1 py-2 text-sm border border-border rounded-lg hover:bg-muted">Log in</button>
              <button onClick={() => { onNavigate("auth"); setMenuOpen(false); }} className="flex-1 py-2 text-sm bg-primary text-white rounded-lg">Get started</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

// ── Home Page ──────────────────────────────────────────────────────────────────
function HomePage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent py-24 px-4">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-accent/90" />
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 text-white/90 rounded-full text-sm font-medium mb-6 border border-white/20">
              <Zap className="w-3.5 h-3.5" /> Over 2,400 courses now available
            </span>
            <h1 className="text-5xl sm:text-6xl font-bold font-display text-white mb-6 leading-tight">
              Learn Without<br /><span className="text-white/80">Limits</span>
            </h1>
            <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              Master in-demand skills with world-class instructors. From web development to data science, design to business — unlock your potential.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white text-foreground placeholder-gray-400 shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-sm" placeholder="What do you want to learn?" />
              </div>
              <button onClick={() => onNavigate("catalog")} className="w-full sm:w-auto px-6 py-3.5 bg-white text-primary font-semibold rounded-xl hover:bg-white/90 transition-colors shadow-xl flex items-center gap-2 justify-center whitespace-nowrap">
                Search <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 text-sm text-white/60">
              <span>Popular:</span>
              {["React", "Python", "UI Design", "Machine Learning"].map(t => (
                <button key={t} onClick={() => onNavigate("catalog")} className="text-white/80 hover:text-white transition-colors">{t}</button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "52,000+", label: "Active Students", icon: Users },
            { value: "2,400+", label: "Expert Courses", icon: BookOpen },
            { value: "480+", label: "Top Instructors", icon: GraduationCap },
            { value: "95%", label: "Satisfaction Rate", icon: Award },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-xl font-bold font-display text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-medium text-primary mb-1">Explore Topics</p>
            <h2 className="text-3xl font-bold font-display">Top Categories</h2>
          </div>
          <button onClick={() => onNavigate("catalog")} className="flex items-center gap-1 text-sm text-primary hover:underline">View all <ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(cat => (
            <button key={cat.name} onClick={() => onNavigate("catalog")} className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-md transition-all group text-left">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110", cat.light)}>
                <cat.icon className="w-5 h-5" />
              </div>
              <div className="font-semibold text-sm font-display leading-tight mb-1">{cat.name}</div>
              <div className="text-xs text-muted-foreground">{cat.count} courses</div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-sm font-medium text-primary mb-1">Handpicked for You</p>
              <h2 className="text-3xl font-bold font-display">Featured Courses</h2>
            </div>
            <button onClick={() => onNavigate("catalog")} className="flex items-center gap-1 text-sm text-primary hover:underline">Browse all <ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {COURSES.slice(0, 4).map(c => <CourseCard key={c.id} course={c} onNavigate={onNavigate} />)}
          </div>
        </div>
      </section>

      {/* Become Instructor CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
          <div className="absolute right-20 bottom-0 w-40 h-40 bg-white/5 rounded-full translate-y-10" />
          <div className="relative">
            <h2 className="text-3xl font-bold font-display text-white mb-3">Become an Instructor</h2>
            <p className="text-white/70 max-w-md leading-relaxed">Share your expertise with 52,000+ students worldwide. Create your first course and start earning today.</p>
          </div>
          <button onClick={() => onNavigate("auth")} className="relative flex-shrink-0 px-7 py-3.5 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-colors shadow-lg flex items-center gap-2">
            Start Teaching <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-primary mb-1">Student Stories</p>
            <h2 className="text-3xl font-bold font-display">What Learners Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-card border border-border rounded-xl p-6">
                <StarRating rating={t.rating} />
                <p className="text-sm text-muted-foreground mt-4 mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold font-display">Cour<span className="text-primary">Share</span></span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">The modern learning platform for professionals and lifelong learners.</p>
            </div>
            {[
              { title: "Platform", links: ["Browse Courses", "Become Instructor", "Pricing", "Enterprise"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
              { title: "Support", links: ["Help Center", "Contact", "Refund Policy", "Accessibility"] },
            ].map(s => (
              <div key={s.title}>
                <h4 className="font-semibold text-sm mb-3">{s.title}</h4>
                <ul className="space-y-2">
                  {s.links.map(l => <li key={l}><button className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</button></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">© 2024 CourShare. All rights reserved.</span>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <button className="hover:text-foreground transition-colors">Privacy</button>
              <button className="hover:text-foreground transition-colors">Terms</button>
              <button className="hover:text-foreground transition-colors">Cookies</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Course Catalog ─────────────────────────────────────────────────────────────
function CourseCatalogPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [selectedCat, setSelectedCat] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [sortBy, setSortBy] = useState("Popular");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState("All");

  const levels = ["All", "Beginner", "Intermediate", "Advanced"];
  const sorts = ["Popular", "Newest", "Highest Rated", "Price: Low–High"];
  const prices = ["All", "Free", "Under $50", "$50–$100", "Over $100"];
  const cats = ["All", ...CATEGORIES.map(c => c.name)];

  const filtered = COURSES.filter(c => {
    if (selectedCat !== "All" && c.category !== selectedCat) return false;
    if (selectedLevel !== "All" && c.level !== selectedLevel) return false;
    return true;
  });

  return (
    <div className="min-h-screen">
      <div className="bg-card border-b border-border py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold font-display mb-2">Course Catalog</h1>
          <p className="text-muted-foreground">Explore {COURSES.length * 12}+ courses across all topics</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className="lg:w-60 flex-shrink-0">
            <div className="bg-card border border-border rounded-xl p-5 sticky top-24">
              <h3 className="font-semibold mb-4 font-display flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">Category</h4>
                  <div className="space-y-1">
                    {cats.map(c => (
                      <button key={c} onClick={() => setSelectedCat(c)} className={cn("flex items-center justify-between w-full text-left px-2 py-1.5 rounded-lg text-sm transition-colors",
                        selectedCat === c ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                      )}>
                        <span>{c}</span>
                        {selectedCat === c && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">Level</h4>
                  <div className="space-y-1">
                    {levels.map(l => (
                      <button key={l} onClick={() => setSelectedLevel(l)} className={cn("flex items-center justify-between w-full text-left px-2 py-1.5 rounded-lg text-sm transition-colors",
                        selectedLevel === l ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                      )}>
                        <span>{l}</span>
                        {selectedLevel === l && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">Price</h4>
                  <div className="space-y-1">
                    {prices.map(p => (
                      <button key={p} onClick={() => setPriceRange(p)} className={cn("flex items-center justify-between w-full text-left px-2 py-1.5 rounded-lg text-sm transition-colors",
                        priceRange === p ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                      )}>
                        <span>{p}</span>
                        {priceRange === p && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">Minimum Rating</h4>
                  <div className="space-y-1">
                    {["4.5+", "4.0+", "3.5+", "Any"].map(r => (
                      <button key={r} className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg text-sm hover:bg-muted text-muted-foreground transition-colors">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Course grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <span className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">{filtered.length * 3}</span> courses found</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
                  <button onClick={() => setView("grid")} className={cn("p-1.5 rounded-md transition-colors", view === "grid" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground")}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>
                  </button>
                  <button onClick={() => setView("list")} className={cn("p-1.5 rounded-md transition-colors", view === "list" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground")}>
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-1.5 bg-card focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {sorts.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            {view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(c => <CourseCard key={c.id} course={c} onNavigate={onNavigate} />)}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(c => (
                  <div key={c.id} onClick={() => onNavigate("course")} className="bg-card border border-border rounded-xl p-4 flex gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
                    <div className="relative w-40 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">{c.category}</span>
                          <h3 className="font-semibold text-sm mt-1 mb-1 font-display line-clamp-1">{c.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                            <img src={c.instructorAvatar} alt={c.instructor} className="w-4 h-4 rounded-full object-cover" />
                            {c.instructor}
                          </div>
                          <StarRating rating={c.rating} count={c.reviewCount} size="xs" />
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                            <span><Clock className="inline w-3 h-3 mr-0.5" />{c.duration}</span>
                            <span><BookOpen className="inline w-3 h-3 mr-0.5" />{c.lessons} lessons</span>
                            <span>{c.level}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-bold text-foreground">${c.price}</div>
                          <div className="text-xs text-muted-foreground line-through">${c.originalPrice}</div>
                          {c.badge && <span className={cn("inline-block mt-1 px-1.5 py-0.5 rounded text-xs font-bold",
                            c.badge === "Bestseller" ? "bg-amber-400 text-amber-900" : "bg-emerald-500 text-white"
                          )}>{c.badge}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Course Detail ──────────────────────────────────────────────────────────────
function CourseDetailPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const course = COURSES[0];
  const [activeTab, setActiveTab] = useState("overview");
  const [openSection, setOpenSection] = useState(0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-white/60 mb-3">
              <button onClick={() => onNavigate("home")} className="hover:text-white">Home</button>
              <ChevronRight className="w-3.5 h-3.5" />
              <button onClick={() => onNavigate("catalog")} className="hover:text-white">Web Development</button>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white/40 truncate">React & TypeScript</span>
            </div>
            <div className="mb-2">
              <span className="inline-block px-2.5 py-0.5 bg-amber-400 text-amber-900 rounded text-xs font-bold">Bestseller</span>
            </div>
            <h1 className="text-3xl font-bold font-display mb-3 leading-tight">{course.title}</h1>
            <p className="text-white/70 mb-5 leading-relaxed max-w-2xl">Master React and TypeScript from the ground up. Build 5 production-ready projects, learn advanced patterns, and become job-ready.</p>
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
              <StarRating rating={course.rating} count={course.reviewCount} />
              <span className="text-white/60 flex items-center gap-1"><Users className="w-4 h-4" />{formatK(course.students)} students</span>
              <span className="text-white/60 flex items-center gap-1"><Clock className="w-4 h-4" />{course.duration}</span>
              <span className="text-white/60 flex items-center gap-1"><BookOpen className="w-4 h-4" />{course.lessons} lessons</span>
            </div>
            <div className="flex items-center gap-3">
              <img src={course.instructorAvatar} alt={course.instructor} className="w-9 h-9 rounded-full object-cover border-2 border-white/20" />
              <span className="text-sm">Created by <button className="text-indigo-300 hover:underline">{course.instructor}</button></span>
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-white/50">
              <span>Last updated Dec 2024</span>
              <span>English</span>
              <span>{course.level}</span>
            </div>
          </div>
          {/* Sticky Sidebar (shown inline on mobile) */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-card text-foreground rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative bg-muted">
                <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <button className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-xl">
                    <Play className="w-7 h-7 text-primary fill-primary ml-1" />
                  </button>
                </div>
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">Preview</div>
              </div>
              <div className="p-5">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold font-display">${course.price}</span>
                  <span className="text-muted-foreground line-through">${course.originalPrice}</span>
                  <span className="text-emerald-600 font-semibold text-sm">{Math.round((1 - course.price / course.originalPrice) * 100)}% off</span>
                </div>
                <p className="text-xs text-rose-500 font-medium mb-4">⏰ 2 days left at this price!</p>
                <button onClick={() => onNavigate("checkout")} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors mb-2">
                  Enroll Now
                </button>
                <button className="w-full py-3 border border-border rounded-xl font-medium hover:bg-muted transition-colors text-sm flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </button>
                <p className="text-xs text-center text-muted-foreground mt-3">30-Day Money-Back Guarantee</p>
                <div className="mt-4 space-y-2">
                  {[
                    { icon: Video, text: `${course.duration} on-demand video` },
                    { icon: FileText, text: "18 articles & resources" },
                    { icon: Download, text: "Downloadable projects" },
                    { icon: Globe, text: "Full lifetime access" },
                    { icon: Award, text: "Certificate of completion" },
                  ].map(f => (
                    <div key={f.text} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <f.icon className="w-3.5 h-3.5 text-primary" />{f.text}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                  <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Heart className="w-3.5 h-3.5" /> Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="lg:max-w-3xl">
          {/* Tabs */}
          <div className="flex border-b border-border mb-6 overflow-x-auto">
            {["overview", "curriculum", "instructor", "reviews"].map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={cn("px-5 py-3 text-sm font-medium capitalize border-b-2 -mb-px transition-colors whitespace-nowrap",
                  activeTab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                )}>{t}</button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold font-display mb-4">What you will learn</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {["Build production-grade React apps", "Master TypeScript generics & utility types", "Implement Redux Toolkit & Zustand", "Write comprehensive test suites", "Deploy to Vercel & AWS", "Advanced performance optimization", "Custom hooks & design patterns", "CI/CD pipelines with GitHub Actions"].map(item => (
                    <div key={item} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> {item}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold font-display mb-3">Requirements</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />Basic JavaScript knowledge (ES6+)</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />Familiarity with HTML & CSS</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />A computer with internet access</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "curriculum" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">{CURRICULUM.length} sections • {course.lessons} lessons • {course.duration} total</span>
                <button className="text-sm text-primary hover:underline">Expand all</button>
              </div>
              <div className="space-y-2">
                {CURRICULUM.map((sec, si) => (
                  <div key={si} className="border border-border rounded-xl overflow-hidden">
                    <button onClick={() => setOpenSection(openSection === si ? -1 : si)}
                      className="flex items-center justify-between w-full px-4 py-4 hover:bg-muted transition-colors text-left">
                      <div className="flex items-center gap-3">
                        {openSection === si ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        <span className="font-medium text-sm">{sec.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{sec.lessons.length} lessons</span>
                    </button>
                    {openSection === si && (
                      <div className="border-t border-border">
                        {sec.lessons.map((l, li) => (
                          <div key={li} className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors border-b last:border-0 border-border">
                            {l.free ? <PlayCircle className="w-4 h-4 text-primary flex-shrink-0" /> : <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                            <span className="flex-1 text-sm">{l.title}</span>
                            {l.free && <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">Preview</span>}
                            <span className="text-xs text-muted-foreground">{l.dur}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "instructor" && (
            <div className="flex gap-5">
              <img src={course.instructorAvatar} alt={course.instructor} className="w-20 h-20 rounded-2xl object-cover flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold font-display">{course.instructor}</h3>
                <p className="text-sm text-muted-foreground mb-3">Senior Software Engineer & Educator</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 4.9 Rating</span>
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" /> 42,000 Students</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> 8 Courses</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">Sarah is a senior software engineer with 10+ years of experience at companies like Google and Stripe. She specializes in React, TypeScript, and modern frontend architecture. Her courses combine deep technical depth with practical, real-world projects.</p>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <div className="flex items-start gap-8 mb-8">
                <div className="text-center">
                  <div className="text-6xl font-bold font-display text-foreground">{course.rating}</div>
                  <StarRating rating={course.rating} />
                  <div className="text-sm text-muted-foreground mt-1">Course Rating</div>
                </div>
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map(n => (
                    <div key={n} className="flex items-center gap-3">
                      <ProgressBar value={n === 5 ? 78 : n === 4 ? 16 : n === 3 ? 4 : 1} className="flex-1" />
                      <div className="flex items-center gap-1 text-xs text-muted-foreground w-14">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {n}
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">{n === 5 ? "78%" : n === 4 ? "16%" : n === 3 ? "4%" : "1%"}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                {[
                  { name: "Liam Foster", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&auto=format", date: "Dec 2024", rating: 5, text: "Absolutely the best React course I have taken. Sarah explains complex concepts clearly and the projects are genuinely challenging. I landed my first dev job after completing this!" },
                  { name: "Aisha Patel", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&auto=format", date: "Nov 2024", rating: 5, text: "The TypeScript section alone is worth the price. Finally understand generics and utility types after struggling with them for years. Highly recommended." },
                ].map(r => (
                  <div key={r.name} className="border-b border-border pb-6 last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={r.avatar} alt={r.name} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <div className="font-medium text-sm">{r.name}</div>
                        <div className="flex items-center gap-2"><StarRating rating={r.rating} size="xs" /><span className="text-xs text-muted-foreground">{r.date}</span></div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Checkout ───────────────────────────────────────────────────────────────────
function CheckoutPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const course = COURSES[0];
  const [step, setStep] = useState(1);
  const [coupon, setCoupon] = useState("");

  if (step === 3) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold font-display mb-3">Enrollment Successful!</h1>
          <p className="text-muted-foreground mb-8">You have been enrolled in <strong>{course.title}</strong>. Start learning right now!</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => onNavigate("player")} className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Play className="w-4 h-4" /> Start Learning
            </button>
            <button onClick={() => onNavigate("student")} className="px-6 py-3 border border-border rounded-xl font-medium hover:bg-muted transition-colors">Dashboard</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => onNavigate("course")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to course
        </button>
        <h1 className="text-3xl font-bold font-display mb-2">Checkout</h1>
        <div className="flex items-center gap-3 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                step >= s ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              )}>{step > s ? <Check className="w-4 h-4" /> : s}</div>
              <span className={cn("text-sm", step >= s ? "text-foreground font-medium" : "text-muted-foreground")}>{s === 1 ? "Order Review" : "Payment"}</span>
              {s < 2 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="space-y-5">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="font-semibold font-display mb-4">Your Order</h2>
                  <div className="flex gap-4">
                    <img src={course.thumbnail} alt={course.title} className="w-28 h-16 object-cover rounded-lg flex-shrink-0 bg-muted" />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm mb-1 font-display">{course.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <img src={course.instructorAvatar} alt={course.instructor} className="w-4 h-4 rounded-full" />
                        {course.instructor}
                      </div>
                      <StarRating rating={course.rating} count={course.reviewCount} size="xs" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <h3 className="text-sm font-medium mb-3">Have a coupon?</h3>
                    <div className="flex gap-2">
                      <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Enter coupon code" className="flex-1 px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      <button className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">Apply</button>
                    </div>
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="font-semibold font-display mb-5">Payment Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-1.5">Card Number</label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input className="w-full pl-9 pr-4 py-2.5 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="1234 5678 9012 3456" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium block mb-1.5">Expiry Date</label>
                        <input className="w-full px-3 py-2.5 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="MM / YY" />
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-1.5">CVC</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input className="w-full pl-9 pr-4 py-2.5 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="•••" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1.5">Cardholder Name</label>
                      <input className="w-full px-3 py-2.5 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Full name on card" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-6 pt-5 border-t border-border">
                    <Shield className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">Your payment is secured by 256-bit SSL encryption. We never store your card details.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="px-5 py-3 border border-border rounded-xl font-medium hover:bg-muted transition-colors text-sm">Back</button>
                  <button onClick={() => setStep(3)} className="flex-1 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" /> Complete Purchase — ${course.price}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-card border border-border rounded-xl p-5 sticky top-24">
              <h3 className="font-semibold font-display mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Original price</span>
                  <span className="line-through text-muted-foreground">${course.originalPrice}</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount</span>
                  <span>-${(course.originalPrice - course.price).toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>${course.price}</span>
                </div>
              </div>
              <div className="mt-5 space-y-2">
                {[{ icon: Shield, text: "30-day money-back guarantee" }, { icon: Award, text: "Certificate of completion" }, { icon: Globe, text: "Lifetime access" }].map(f => (
                  <div key={f.text} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <f.icon className="w-3.5 h-3.5 text-primary" /> {f.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Learning Player ────────────────────────────────────────────────────────────
function LearningPlayerPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [activeLesson, setActiveLesson] = useState({ s: 1, l: 0 });
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const course = COURSES[0];

  const currentLesson = LESSON_LIST[activeLesson.s]?.lessons[activeLesson.l];
  const totalDone = LESSON_LIST.flatMap(s => s.lessons).filter(l => l.done).length;
  const totalLessons = LESSON_LIST.flatMap(s => s.lessons).length;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Player navbar */}
      <div className="bg-gray-900 dark:bg-gray-950 text-white h-14 flex items-center px-4 gap-4 flex-shrink-0">
        <button onClick={() => onNavigate("student")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <ChevronLeft className="w-4 h-4" />
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <BookOpen className="w-3 h-3 text-white" />
          </div>
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-medium truncate">{course.title}</h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{totalDone}/{totalLessons} complete</span>
          <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${(totalDone / totalLessons) * 100}%` }} />
          </div>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
          <List className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Video */}
          <div className="bg-black aspect-video w-full flex items-center justify-center relative">
            <img src={course.thumbnail} alt="Lesson thumbnail" className="w-full h-full object-cover opacity-40" />
            <button className="absolute w-20 h-20 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm border border-white/20">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 flex items-center px-4 gap-4">
              <button className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"><Play className="w-4 h-4 fill-white" /></button>
              <div className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer">
                <div className="h-full bg-primary rounded-full w-1/3" />
              </div>
              <span className="text-white text-xs">8:32 / {currentLesson?.dur || "24:10"}</span>
              <button className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"><Settings className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Lesson info */}
          <div className="p-6 max-w-3xl">
            <h2 className="text-xl font-bold font-display mb-2">{currentLesson?.title || "React Hooks Deep Dive"}</h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{currentLesson?.dur}</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />1,284 views</span>
            </div>
            <div className="flex border-b border-border mb-5">
              {["overview", "notes", "resources", "discussion"].map(t => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={cn("px-4 py-2.5 text-sm font-medium capitalize border-b-2 -mb-px transition-colors",
                    activeTab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                  )}>{t}</button>
              ))}
            </div>
            {activeTab === "overview" && (
              <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>In this lesson, we do a deep dive into React Hooks — the building blocks of modern React development. We will explore useState, useEffect, useCallback, useMemo, and useRef with practical, real-world examples.</p>
                <p>By the end of this lesson, you will understand when and why to use each hook, and how they interact with the React rendering cycle.</p>
              </div>
            )}
            {activeTab === "notes" && (
              <textarea className="w-full h-40 p-3 text-sm bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" placeholder="Add your notes for this lesson..." />
            )}
            {activeTab === "resources" && (
              <div className="space-y-2">
                {[{ name: "Lesson slides.pdf", size: "2.4 MB" }, { name: "Starter code.zip", size: "1.1 MB" }, { name: "React Hooks cheatsheet.pdf", size: "0.8 MB" }].map(r => (
                  <div key={r.name} className="flex items-center justify-between p-3 border border-border rounded-xl hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3"><FileText className="w-4 h-4 text-primary" /><div><div className="text-sm font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.size}</div></div></div>
                    <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Download className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "discussion" && (
              <div>
                <div className="flex gap-3 mb-6">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">S</div>
                  <input className="flex-1 px-3 py-2 text-sm bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Ask a question or leave a comment..." />
                </div>
                <div className="space-y-4">
                  {[{ user: "Liam Foster", text: "Great explanation of useCallback! Could you elaborate on the dependency array?", time: "2 days ago", likes: 12 }].map(c => (
                    <div key={c.user} className="flex gap-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">LF</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1"><span className="text-sm font-medium">{c.user}</span><span className="text-xs text-muted-foreground">{c.time}</span></div>
                        <p className="text-sm text-muted-foreground">{c.text}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <button className="flex items-center gap-1 hover:text-foreground"><Heart className="w-3 h-3" />{c.likes}</button>
                          <button className="hover:text-foreground">Reply</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lesson sidebar */}
        {sidebarOpen && (
          <aside className="w-80 flex-shrink-0 border-l border-border overflow-y-auto bg-card hidden lg:block">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold font-display text-sm">Course Content</h3>
              <div className="text-xs text-muted-foreground mt-0.5">{totalDone}/{totalLessons} lessons complete</div>
              <ProgressBar value={(totalDone / totalLessons) * 100} className="mt-2" />
            </div>
            <div>
              {LESSON_LIST.map((section, si) => (
                <div key={si}>
                  <div className="px-4 py-2.5 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{section.section}</div>
                  {section.lessons.map((lesson, li) => (
                    <button key={li} onClick={() => setActiveLesson({ s: si, l: li })}
                      className={cn("flex items-start gap-3 w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border/50 last:border-0",
                        activeLesson.s === si && activeLesson.l === li ? "bg-primary/10 border-l-2 border-l-primary" : ""
                      )}>
                      {lesson.done ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> : <div className="w-4 h-4 rounded-full border-2 border-muted-foreground flex-shrink-0 mt-0.5" />}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium line-clamp-2 leading-snug">{lesson.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{lesson.dur}</div>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

// ── Student Dashboard ──────────────────────────────────────────────────────────
function StudentDashboardPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [activeTab, setActiveTab] = useState("learning");
  const enrolled = COURSES.filter(c => c.progress !== undefined);

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-primary/10 to-accent/5 border-b border-border py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold font-display mb-1">Welcome back, Alex 👋</h1>
          <p className="text-muted-foreground text-sm">Keep up the great work! You are on a 7-day learning streak.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={BookMarked} label="Enrolled Courses" value="5" sub="2 in progress" color="text-primary" bg="bg-primary/10" />
          <StatCard icon={CheckCircle} label="Completed" value="2" sub="40% completion rate" color="text-emerald-600" bg="bg-emerald-100 dark:bg-emerald-900/30" />
          <StatCard icon={Clock} label="Hours Learned" value="84h" sub="This month: 12h" color="text-violet-600" bg="bg-violet-100 dark:bg-violet-900/30" />
          <StatCard icon={Award} label="Certificates" value="2" sub="Share on LinkedIn" color="text-amber-600" bg="bg-amber-100 dark:bg-amber-900/30" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex border-b border-border mb-6">
              {["learning", "completed", "wishlist"].map(t => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={cn("px-5 py-2.5 text-sm font-medium capitalize border-b-2 -mb-px transition-colors",
                    activeTab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                  )}>{t}</button>
              ))}
            </div>

            {activeTab === "learning" && (
              <div className="space-y-4">
                {enrolled.map(c => (
                  <div key={c.id} className="bg-card border border-border rounded-xl p-4 flex gap-4 hover:shadow-md transition-all cursor-pointer group" onClick={() => onNavigate("player")}>
                    <div className="relative w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                        <PlayCircle className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1 font-display line-clamp-1">{c.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{c.instructor}</p>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">{c.progress}% complete</span>
                        <span className="text-xs text-primary font-medium">{c.lessons} lessons</span>
                      </div>
                      <ProgressBar value={c.progress!} />
                    </div>
                  </div>
                ))}
                <button onClick={() => onNavigate("catalog")} className="w-full py-3 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                  <PlusCircle className="w-4 h-4" /> Browse more courses
                </button>
              </div>
            )}

            {activeTab === "completed" && (
              <div className="space-y-4">
                {COURSES.slice(2, 4).map(c => (
                  <div key={c.id} className="bg-card border border-border rounded-xl p-4 flex gap-4">
                    <div className="w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm mb-1 font-display line-clamp-1">{c.title}</h3>
                        <span className="flex-shrink-0 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">Completed</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{c.instructor}</p>
                      <div className="flex items-center gap-3">
                        <button className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"><Award className="w-3.5 h-3.5" /> View Certificate</button>
                        <StarRating rating={c.rating} size="xs" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {COURSES.slice(4, 6).map(c => <CourseCard key={c.id} course={c} onNavigate={onNavigate} />)}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold font-display mb-4">Learning Activity</h3>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={REVENUE_DATA.slice(6)}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: 11 }} />
                  <Area type="monotone" dataKey="students" stroke="#4f46e5" fill="url(#colorStudents)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold font-display mb-4">Achievements</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: "🎯", label: "First Course", earned: true },
                  { icon: "🔥", label: "7-Day Streak", earned: true },
                  { icon: "⭐", label: "Top Student", earned: false },
                  { icon: "🏆", label: "Certificate", earned: true },
                  { icon: "📚", label: "5 Courses", earned: false },
                  { icon: "💡", label: "Fast Learner", earned: false },
                ].map(a => (
                  <div key={a.label} className={cn("rounded-xl p-3 text-center", a.earned ? "bg-primary/10 border border-primary/20" : "bg-muted border border-border opacity-50")}>
                    <div className="text-2xl mb-1">{a.icon}</div>
                    <div className="text-xs font-medium leading-tight">{a.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold font-display mb-4">Recommended</h3>
              <div className="space-y-3">
                {COURSES.slice(4, 6).map(c => (
                  <div key={c.id} onClick={() => onNavigate("course")} className="flex gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                    <img src={c.thumbnail} alt={c.title} className="w-14 h-10 rounded-lg object-cover flex-shrink-0 bg-muted" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium line-clamp-2 font-display">{c.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">${c.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Instructor Portal ──────────────────────────────────────────────────────────
function InstructorPortalPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [activeTab, setActiveTab] = useState("courses");
  const myCourses = COURSES.slice(0, 4);

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-violet-600/10 to-primary/5 border-b border-border py-8 px-4">
        <div className="max-w-7xl mx-auto flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display mb-1">Instructor Dashboard</h1>
            <p className="text-muted-foreground text-sm">Welcome back, Sarah. Your courses are performing great!</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors">
            <PlusCircle className="w-4 h-4" /> New Course
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={DollarSign} label="Total Revenue" value="$62,100" sub="+18% this month" color="text-emerald-600" bg="bg-emerald-100 dark:bg-emerald-900/30" />
          <StatCard icon={Users} label="Total Students" value="46,960" sub="+324 this week" color="text-primary" bg="bg-primary/10" />
          <StatCard icon={BookOpen} label="Published Courses" value="4" sub="1 in draft" color="text-violet-600" bg="bg-violet-100 dark:bg-violet-900/30" />
          <StatCard icon={Star} label="Average Rating" value="4.85" sub="From 9,155 reviews" color="text-amber-600" bg="bg-amber-100 dark:bg-amber-900/30" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Revenue Chart */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold font-display">Revenue Overview</h3>
                <select className="text-xs border border-border rounded-lg px-2.5 py-1.5 bg-card focus:outline-none">
                  <option>Last 12 months</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: 11 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fill="url(#revGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Course Management */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex border-b border-border">
                {["courses", "analytics"].map(t => (
                  <button key={t} onClick={() => setActiveTab(t)}
                    className={cn("px-5 py-3.5 text-sm font-medium capitalize border-b-2 -mb-px transition-colors",
                      activeTab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                    )}>{t}</button>
                ))}
              </div>

              {activeTab === "courses" && (
                <table className="w-full">
                  <thead><tr className="border-b border-border bg-muted/50">
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Course</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Students</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Revenue</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Rating</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                    <th className="px-4 py-3" />
                  </tr></thead>
                  <tbody>
                    {myCourses.map(c => (
                      <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={c.thumbnail} alt={c.title} className="w-10 h-7 object-cover rounded-md flex-shrink-0 bg-muted" />
                            <div className="min-w-0"><div className="text-xs font-medium truncate font-display max-w-40">{c.title}</div><div className="text-xs text-muted-foreground">{c.lessons} lessons</div></div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-xs">{formatK(c.students)}</td>
                        <td className="px-4 py-3 text-right text-xs font-medium">${(c.revenue! / 1000).toFixed(1)}k</td>
                        <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-1 text-xs"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{c.rating}</div></td>
                        <td className="px-4 py-3 text-right"><Badge variant={c.published ? "success" : "warning"}>{c.published ? "Published" : "Draft"}</Badge></td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><MoreHorizontal className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "analytics" && (
                <div className="p-5">
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={REVENUE_DATA.slice(6)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                      <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                      <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: 11 }} />
                      <Bar dataKey="students" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-5">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold font-display mb-4">Student Growth</h3>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="studGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: 11 }} />
                  <Area type="monotone" dataKey="students" stroke="#7c3aed" fill="url(#studGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold font-display mb-4">Top Performing</h3>
              <div className="space-y-3">
                {myCourses.slice(0, 3).map((c, i) => (
                  <div key={c.id} className="flex items-center gap-3">
                    <span className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                      i === 0 ? "bg-amber-400 text-amber-900" : i === 1 ? "bg-gray-300 text-gray-700" : "bg-orange-400 text-orange-900"
                    )}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{c.title.split(":")[0]}</div>
                      <div className="text-xs text-muted-foreground">${(c.revenue! / 1000).toFixed(1)}k revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold font-display mb-4">Recent Reviews</h3>
              <div className="space-y-3">
                {[{ user: "L. Foster", text: "Absolutely excellent course!", rating: 5, time: "2h ago" },
                  { user: "A. Patel", text: "TypeScript section is gold.", rating: 5, time: "1d ago" }].map(r => (
                  <div key={r.user} className="text-xs border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{r.user}</span>
                      <span className="text-muted-foreground">{r.time}</span>
                    </div>
                    <StarRating rating={r.rating} size="xs" />
                    <p className="text-muted-foreground mt-1">"{r.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Admin Dashboard ────────────────────────────────────────────────────────────
function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-rose-600/10 to-primary/5 border-b border-border py-8 px-4">
        <div className="max-w-7xl mx-auto flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display mb-1">Admin Panel</h1>
            <p className="text-muted-foreground text-sm">Platform health looks great — 3 items need your attention.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-xl text-sm hover:bg-muted transition-colors"><Download className="w-4 h-4" /> Export</button>
            <button className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-xl text-sm hover:bg-primary/90 transition-colors"><Settings className="w-4 h-4" /> Settings</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Total Users" value="52,480" sub="+1,240 this week" color="text-primary" bg="bg-primary/10" />
          <StatCard icon={DollarSign} label="Platform Revenue" value="$284k" sub="+22% this month" color="text-emerald-600" bg="bg-emerald-100 dark:bg-emerald-900/30" />
          <StatCard icon={BookOpen} label="Total Courses" value="2,418" sub="48 pending review" color="text-violet-600" bg="bg-violet-100 dark:bg-violet-900/30" />
          <StatCard icon={Activity} label="Monthly Growth" value="18.4%" sub="vs 14.2% last month" color="text-amber-600" bg="bg-amber-100 dark:bg-amber-900/30" />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-6 overflow-x-auto">
          {["overview", "users", "courses", "transactions"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={cn("px-5 py-3 text-sm font-medium capitalize border-b-2 -mb-px transition-colors whitespace-nowrap",
                activeTab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              )}>{t}</button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold font-display">Platform Growth</h3>
                  <Badge variant="success">+18.4% MoM</Badge>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={PLATFORM_DATA}>
                    <defs>
                      <linearGradient id="platGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                    <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: number) => [v.toLocaleString(), "Users"]} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: 11 }} />
                    <Area type="monotone" dataKey="users" stroke="#4f46e5" fill="url(#platGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Pending approvals */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <h3 className="font-semibold font-display">Pending Course Approvals</h3>
                  <Badge variant="warning">{PENDING_COURSES.length} pending</Badge>
                </div>
                <table className="w-full">
                  <thead><tr className="border-b border-border bg-muted/50">
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Course</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Instructor</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Submitted</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
                  </tr></thead>
                  <tbody>
                    {PENDING_COURSES.map(c => (
                      <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="text-xs font-medium font-display">{c.title}</div>
                          <div className="text-xs text-muted-foreground">{c.category} • {c.lessons} lessons</div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{c.instructor}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{c.submitted}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500 text-white text-xs font-medium rounded-lg hover:bg-emerald-600 transition-colors"><CheckCircle className="w-3 h-3" /> Approve</button>
                            <button className="flex items-center gap-1 px-2.5 py-1 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors"><XCircle className="w-3 h-3" /> Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold font-display mb-4">Course Distribution</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={CATEGORY_DIST} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                      {CATEGORY_DIST.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {CATEGORY_DIST.slice(0, 4).map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS[i] }} />{d.name}</div>
                      <span className="text-muted-foreground">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold font-display mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { icon: AlertTriangle, label: "3 Reported Content", color: "text-amber-500", badge: "warning" as const },
                    { icon: MessageSquare, label: "12 Support Tickets", color: "text-blue-500", badge: "default" as const },
                    { icon: Upload, label: "5 Refund Requests", color: "text-rose-500", badge: "danger" as const },
                  ].map(a => (
                    <button key={a.label} className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-muted transition-colors">
                      <div className="flex items-center gap-2">
                        <a.icon className={cn("w-4 h-4", a.color)} />
                        <span className="text-sm">{a.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-semibold font-display">User Management</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input className="pl-8 pr-3 py-1.5 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Search users..." />
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-sm hover:bg-muted transition-colors"><Filter className="w-3.5 h-3.5" />Filter</button>
              </div>
            </div>
            <table className="w-full">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">User</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Role</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Courses</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Joined</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr></thead>
              <tbody>
                {ADMIN_USERS.map(u => (
                  <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                        <div><div className="text-sm font-medium">{u.name}</div><div className="text-xs text-muted-foreground">{u.email}</div></div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant={u.role === "Instructor" ? "purple" : "default"}>{u.role}</Badge></td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{u.courses}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{u.joined}</td>
                    <td className="px-4 py-3"><Badge variant={u.status === "active" ? "success" : "danger"}>{u.status}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/30">
              <span className="text-xs text-muted-foreground">Showing 5 of 52,480 users</span>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground transition-colors"><ChevronLeft className="w-3.5 h-3.5" /></button>
                {[1,2,3].map(p => <button key={p} className={cn("w-7 h-7 rounded-lg text-xs font-medium transition-colors", p === 1 ? "bg-primary text-white" : "border border-border hover:bg-muted text-muted-foreground")}>{p}</button>)}
                <button className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground transition-colors"><ChevronRight className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COURSES.map(c => (
              <div key={c.id} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="relative">
                  <img src={c.thumbnail} alt={c.title} className="w-full h-36 object-cover bg-muted" />
                  <div className="absolute top-2 right-2"><Badge variant={c.published ? "success" : "warning"}>{c.published ? "Published" : "Draft"}</Badge></div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm font-display line-clamp-2 mb-2">{c.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <img src={c.instructorAvatar} alt={c.instructor} className="w-4 h-4 rounded-full object-cover" />
                    {c.instructor}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <StarRating rating={c.rating} count={c.reviewCount} size="xs" />
                    <span className="text-muted-foreground">{formatK(c.students)} students</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 py-1.5 text-xs border border-border rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-1"><Eye className="w-3 h-3" />Review</button>
                    {!c.published && <button className="flex-1 py-1.5 text-xs bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1"><CheckCircle className="w-3 h-3" />Approve</button>}
                    <button className="p-1.5 border border-border rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-semibold font-display">Transaction History</h3>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-sm hover:bg-muted transition-colors"><Download className="w-3.5 h-3.5" />Export CSV</button>
            </div>
            <table className="w-full">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Transaction ID</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Student</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Course</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Amount</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Date</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
              </tr></thead>
              <tbody>
                {TRANSACTIONS.map(t => (
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 text-xs font-mono text-muted-foreground">{t.id}</td>
                    <td className="px-4 py-3 text-sm">{t.user}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate">{t.course}</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold">${t.amount}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{t.date}</td>
                    <td className="px-4 py-3">
                      <Badge variant={t.status === "completed" ? "success" : t.status === "pending" ? "warning" : "danger"}>
                        {t.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-border bg-muted/30 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Total: <strong>$554.94</strong> across 6 transactions</span>
              <button className="text-xs text-primary hover:underline">View all transactions</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Auth Page ──────────────────────────────────────────────────────────────────
function AuthPage({ onNavigate, onLogin }: { onNavigate: (p: Page) => void; onLogin: (role: Role) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [selectedRole, setSelectedRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
    onNavigate(selectedRole === "student" ? "student" : selectedRole === "instructor" ? "instructor" : "admin");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-accent flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&fit=crop')] bg-cover bg-center" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-16">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl font-display text-white">CourShare</span>
          </div>
          <div>
            <h2 className="text-4xl font-bold font-display text-white mb-4 leading-tight">
              {mode === "login" ? "Welcome back,\nlearner." : "Start your\nlearning journey."}
            </h2>
            <p className="text-white/70 leading-relaxed max-w-sm">Join 52,000+ students mastering new skills with world-class instructors.</p>
          </div>
        </div>
        <div className="relative space-y-4">
          {TESTIMONIALS.slice(0, 2).map(t => (
            <div key={t.name} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-white/80 text-sm mb-3">"{t.text.substring(0, 80)}..."</p>
              <div className="flex items-center gap-2">
                <img src={t.avatar} alt={t.name} className="w-7 h-7 rounded-full object-cover" />
                <div>
                  <div className="text-white text-xs font-medium">{t.name}</div>
                  <div className="text-white/50 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold font-display">Cour<span className="text-primary">Share</span></span>
          </div>

          <h1 className="text-3xl font-bold font-display mb-2">{mode === "login" ? "Sign in" : "Create account"}</h1>
          <p className="text-muted-foreground text-sm mb-8">
            {mode === "login" ? "New to CourShare? " : "Already have an account? "}
            <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="text-primary hover:underline font-medium">
              {mode === "login" ? "Create account" : "Sign in"}
            </button>
          </p>

          {/* Role picker */}
          <div className="mb-6">
            <label className="text-sm font-medium block mb-2">I am joining as</label>
            <div className="grid grid-cols-3 gap-2">
              {(["student", "instructor", "admin"] as Role[]).map(r => (
                <button key={r} onClick={() => setSelectedRole(r)}
                  className={cn("py-2.5 rounded-xl text-sm font-medium capitalize border-2 transition-all",
                    selectedRole === r ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
                  )}>{r}</button>
              ))}
            </div>
          </div>

          {/* Social login */}
          <div className="flex gap-3 mb-6">
            {[{ name: "Google", color: "text-red-500" }, { name: "GitHub", color: "text-foreground" }].map(s => (
              <button key={s.name} className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-border rounded-xl text-sm hover:bg-muted transition-colors font-medium">
                <Globe className={cn("w-4 h-4", s.color)} /> {s.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or continue with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-sm font-medium block mb-1.5">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2.5 text-sm bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" placeholder="Your full name" required />
              </div>
            )}
            <div>
              <label className="text-sm font-medium block mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2.5 text-sm bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" placeholder="your@email.com" required />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium">Password</label>
                {mode === "login" && <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-9 pr-4 py-2.5 text-sm bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" placeholder="••••••••" required />
              </div>
            </div>
            {mode === "register" && (
              <div className="flex items-start gap-2.5">
                <input type="checkbox" id="terms" className="mt-0.5 accent-primary" required />
                <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
                  I agree to the <button type="button" className="text-primary hover:underline">Terms of Service</button> and <button type="button" className="text-primary hover:underline">Privacy Policy</button>
                </label>
              </div>
            )}
            <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors mt-2">
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Demo Banner ────────────────────────────────────────────────────────────────
function DemoBanner({ role, setRole, page, onNavigate }: { role: Role; setRole: (r: Role) => void; page: Page; onNavigate: (p: Page) => void }) {
  const dashPages: Record<Role, Page> = { student: "student", instructor: "instructor", admin: "admin" };

  return (
    <div className="bg-gray-900 dark:bg-gray-950 text-white text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <span className="text-gray-400 hidden sm:block">Demo Mode — switch roles to explore different views</span>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-gray-500">Role:</span>
          {(["student", "instructor", "admin"] as Role[]).map(r => (
            <button key={r} onClick={() => { setRole(r); onNavigate(dashPages[r]); }}
              className={cn("px-3 py-0.5 rounded-full capitalize font-medium transition-all",
                role === r ? "bg-primary text-white" : "text-gray-400 hover:text-white"
              )}>{r}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [dark, setDark] = useState(false);
  const [role, setRole] = useState<Role>("student");
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogin = (r: Role) => {
    setRole(r);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("home");
  };

  const showNav = page !== "player" && page !== "auth";
  const showFooter = ["home"].includes(page);

  return (
    <div className={cn("min-h-screen bg-background text-foreground", dark && "dark")}>
      <DemoBanner role={role} setRole={setRole} page={page} onNavigate={navigate} />
      {showNav && (
        <Navbar page={page} onNavigate={navigate} dark={dark} onDark={() => setDark(!dark)} role={role} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      )}

      <motion.div key={page} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        {page === "home" && <HomePage onNavigate={navigate} />}
        {page === "catalog" && <CourseCatalogPage onNavigate={navigate} />}
        {page === "course" && <CourseDetailPage onNavigate={navigate} />}
        {page === "checkout" && <CheckoutPage onNavigate={navigate} />}
        {page === "player" && <LearningPlayerPage onNavigate={navigate} />}
        {page === "student" && <StudentDashboardPage onNavigate={navigate} />}
        {page === "instructor" && <InstructorPortalPage onNavigate={navigate} />}
        {page === "admin" && <AdminDashboardPage />}
        {page === "auth" && <AuthPage onNavigate={navigate} onLogin={handleLogin} />}
      </motion.div>
    </div>
  );
}
