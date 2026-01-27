/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const useSupabaseEnv = import.meta.env.VITE_USE_SUPABASE !== 'false';
const hasSupabase = useSupabaseEnv && Boolean(supabaseUrl && supabaseAnonKey);

function createMockSupabase() {
  const chain = {
    eq() { return this; },
    order() { return this; },
    select() { return Promise.resolve({ data: [], error: null }); },
    insert(payload: any) { return Promise.resolve({ data: [payload], error: null }); },
    update(payload: any) { return Promise.resolve({ data: payload, error: null }); },
    delete() { return Promise.resolve({ data: null, error: null }); },
    single() { return Promise.resolve({ data: null, error: null }); },
    remove() { return Promise.resolve({ data: null, error: null }); }
  } as any;

  return {
    from: (_table: string) => chain,
    storage: {
      from: (_bucket: string) => ({
        upload: async () => ({ error: null }),
        getPublicUrl: (_path: string) => ({ data: { publicUrl: '' } }),
        remove: async () => ({ error: null })
      })
    }
  } as any;
}

export const supabase = hasSupabase ? createClient(supabaseUrl!, supabaseAnonKey!) : createMockSupabase();
export const SUPABASE_ENABLED = hasSupabase;

// Types for our database tables
export interface SiteSettings {
  id: string; // UUID in database
  site_name: string;
  tagline: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  business_hours: string | null;
  logo_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface HeroSection {
  id: string;
  badge?: string;
  headline: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface HeroImage {
  id: string;
  image_url: string;
  alt_text?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  image_url: string;
  alt_text?: string;
  category?: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  email?: string;
  phone?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  description?: string;
  is_primary: boolean;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  description: string;
  image_url: string | null;
  features: string[];
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: number;
  quote: string;
  author_name: string;
  author_role: string | null;
  author_company: string | null;
  rating: number;
  image_url: string | null;
  is_featured: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface WhyChooseUs {
  id: string;
  title: string;
  description: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface JobPosition {
  id: string;
  title: string;
  slug: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
