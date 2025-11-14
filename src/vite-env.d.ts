/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL: string;
  readonly VITE_SITE_NAME: string;
  readonly VITE_API_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_CONTACT_API: string;
  readonly VITE_BOOKING_API: string;
  readonly VITE_CAREERS_API: string;
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  readonly VITE_GA_MEASUREMENT_ID: string;
  readonly VITE_RECAPTCHA_SITE_KEY: string;
  readonly VITE_ALLOWED_ORIGINS: string;
  readonly VITE_ENABLE_BLOG: string;
  readonly VITE_ENABLE_CHAT: string;
  readonly VITE_PHONE: string;
  readonly VITE_EMAIL: string;
  readonly VITE_ADDRESS: string;
  readonly VITE_BUSINESS_HOURS: string;
  readonly VITE_FACEBOOK_URL: string;
  readonly VITE_INSTAGRAM_URL: string;
  readonly VITE_LINKEDIN_URL: string;
  readonly VITE_RESIDENTIAL_LAT: string;
  readonly VITE_RESIDENTIAL_LNG: string;
  readonly VITE_HOME_CARE_LAT: string;
  readonly VITE_HOME_CARE_LNG: string;
  readonly VITE_SANITY_PROJECT_ID: string;
  readonly VITE_SANITY_DATASET: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
