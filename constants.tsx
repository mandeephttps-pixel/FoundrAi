
import { CategoryGroup } from './types';

export const BUSINESS_CATEGORIES: CategoryGroup[] = [
  {
    label: "Core Business Categories",
    categories: [
      { name: "Technology Startups", iconName: "Laptop" },
      { name: "AI & Machine Learning", iconName: "Brain" },
      { name: "SaaS / Subscriptions", iconName: "Cloud" },
      { name: "E-commerce & D2C", iconName: "ShoppingBag" },
      { name: "Small & Local Biz", iconName: "Store" },
      { name: "Service-Based Biz", iconName: "Briefcase" },
      { name: "Manufacturing", iconName: "Factory" },
      { name: "Franchise & Licensing", iconName: "FileBadge" },
      { name: "Import–Export", iconName: "Ship" }
    ]
  },
  {
    label: "Digital & Online Categories",
    categories: [
      { name: "Online Businesses", iconName: "Globe" },
      { name: "No-Code Startups", iconName: "Zap" },
      { name: "Mobile App Ideas", iconName: "Smartphone" },
      { name: "Web Marketplaces", iconName: "Layers" },
      { name: "Automation Biz", iconName: "Settings" },
      { name: "Digital Products", iconName: "FileText" },
      { name: "Creator Economy", iconName: "Video" },
      { name: "Creator Tools", iconName: "Wrench" },
      { name: "Performance Marketing", iconName: "Target" }
    ]
  },
  {
    label: "Investment & Profit Categories",
    categories: [
      { name: "Zero Investment", iconName: "Coins" },
      { name: "Bootstrapped Startups", iconName: "FastForward" },
      { name: "High-Profit Biz", iconName: "Gem" },
      { name: "Passive Income", iconName: "Repeat" },
      { name: "Recurring Revenue", iconName: "RefreshCcw" },
      { name: "Fast-Growth Ideas", iconName: "TrendingUp" },
      { name: "Side Hustles", iconName: "Clock" }
    ]
  },
  {
    label: "Audience-Specific Categories",
    categories: [
      { name: "Student Entrepreneurs", iconName: "BookOpen" },
      { name: "First-Time Founders", iconName: "UserPlus" },
      { name: "Women Entrepreneurs", iconName: "Users" },
      { name: "Solopreneurs", iconName: "User" },
      { name: "Retiree Biz", iconName: "Heart" },
      { name: "Tier-2/3 Markets", iconName: "MapPin" },
      { name: "Home-Based Biz", iconName: "Home" }
    ]
  },
  {
    label: "Industry-Specific Categories",
    categories: [
      { name: "HealthTech & Wellness", iconName: "HeartPulse" },
      { name: "Fitness & Nutrition", iconName: "Activity" },
      { name: "EdTech & Skills", iconName: "GraduationCap" },
      { name: "FinTech & InsurTech", iconName: "Wallet" },
      { name: "Real Estate & PropTech", iconName: "Building" },
      { name: "Travel & Hospitality", iconName: "Plane" },
      { name: "FoodTech & Kitchens", iconName: "Utensils" },
      { name: "Fashion & Beauty", iconName: "Sparkles" },
      { name: "Logistics & Supply", iconName: "Truck" },
      { name: "AgriTech", iconName: "Sprout" },
      { name: "Pet Care & Services", iconName: "Dog" }
    ]
  },
  {
    label: "Future & Trend Categories",
    categories: [
      { name: "Sustainable Biz", iconName: "Leaf" },
      { name: "ClimateTech", iconName: "Sun" },
      { name: "Web3 & Blockchain", iconName: "Cpu" },
      { name: "Metaverse & XR", iconName: "Eye" },
      { name: "Robotics & IoT", iconName: "Bot" },
      { name: "Smart Cities", iconName: "Landmark" },
      { name: "SpaceTech & DeepTech", iconName: "Telescope" },
      { name: "AI Personalization", iconName: "UserCheck" }
    ]
  },
  {
    label: "Creative & Cultural Categories",
    categories: [
      { name: "Media & Entertainment", iconName: "Tv" },
      { name: "Gaming & Esports", iconName: "Gamepad2" },
      { name: "Creative Economy", iconName: "Music" },
      { name: "Short Video Tools", iconName: "Clapperboard" },
      { name: "Event Management", iconName: "Calendar" },
      { name: "Mindfulness", iconName: "Wind" },
      { name: "Community-Based Biz", iconName: "Share2" }
    ]
  },
  {
    label: "Geography & Market Focus",
    categories: [
      { name: "India-Focused Ideas", iconName: "Flag" },
      { name: "Global Markets", iconName: "Globe2" },
      { name: "Vernacular Biz", iconName: "Languages" },
      { name: "Export-Oriented", iconName: "ArrowUpRight" },
      { name: "Cross-Border Services", iconName: "Shuffle" }
    ]
  }
];

export const BUDGET_OPTIONS = ["Zero", "Low", "Medium", "High", "Custom"];
export const SKILL_OPTIONS = ["Beginner", "Intermediate", "Expert"];
export const TIME_OPTIONS = ["Side Hustle", "Part-Time", "Full-Time"];
export const RISK_OPTIONS = ["Low", "Medium", "High"];
export const PREFERENCE_OPTIONS = ["Online", "Offline", "Hybrid"];
