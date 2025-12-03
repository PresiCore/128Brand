
export enum ViewState {
  HOME = 'HOME',
  SERVICES = 'SERVICES',
  AI_DEMO = 'AI_DEMO',
  CONTACT = 'CONTACT',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  PRIVACY = 'PRIVACY',
  TERMS = 'TERMS'
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  productRecommendation?: string; // ID of the recommended product
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: 'brain' | 'cpu' | 'message' | 'barChart';
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

// SaaS Specific Types
export interface SaasProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  category: 'Automation' | 'Chatbot' | 'Data';
  status: 'available' | 'deploying' | 'active' | 'paused';
  iconName: 'Bot' | 'FileText' | 'Workflow' | 'Database'; // String for DB storage
  demoId?: 'sdr' | 'invoice' | 'social' | 'legal'; // ID for the interactive component
  token?: string; // New: License Token
  trialEndsAt?: string; // New: Expiration date for trial
  serviceUrl?: string; // New: External service URL
}

export interface UserProfile {
  name: string;
  company: string;
  email: string;
  activeServices: SaasProduct[];
}
