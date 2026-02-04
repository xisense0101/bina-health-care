// Toggle between using Supabase data or hardcoded values/images
// Default: enabled only when SUPABASE vars are present and VITE_USE_SUPABASE !== 'false'
export const useSupabaseData = (import.meta.env.VITE_USE_SUPABASE !== 'false') && !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
/**
 * Application configuration
 * Centralized configuration management using environment variables
 */

// Site configuration
export const siteConfig = {
  name: import.meta.env.VITE_SITE_NAME || 'Bina Adult Care',
  url: import.meta.env.VITE_SITE_URL || 'https://www.binaadultcare.com',
  description: 'Providing compassionate care to needy senior adults through residential and home care services.',

  contact: {
    phone: import.meta.env.VITE_PHONE || '5107104392',
    email: import.meta.env.VITE_EMAIL || 'binasadultcare@gmail.com',
    address: import.meta.env.VITE_ADDRESS || '5667 San Pablo Dam Rd, El Sobrante, CA 94803, USA',
    businessHours: import.meta.env.VITE_BUSINESS_HOURS || '24/7'
  },

  social: {
    facebook: import.meta.env.VITE_FACEBOOK_URL || 'https://www.facebook.com/binaadultcare',
    instagram: import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/binaadultcare',
    linkedin: import.meta.env.VITE_LINKEDIN_URL || 'https://www.linkedin.com/company/binaadultcare'
  },

  location: {
    residential: {
      lat: parseFloat(import.meta.env.VITE_RESIDENTIAL_LAT) || 27.7172,
      lng: parseFloat(import.meta.env.VITE_RESIDENTIAL_LNG) || 85.3240
    },
    homeCare: {
      lat: parseFloat(import.meta.env.VITE_HOME_CARE_LAT) || 27.7172,
      lng: parseFloat(import.meta.env.VITE_HOME_CARE_LNG) || 85.3240
    }
  }
};

// API configuration
export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || '/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,

  endpoints: {
    contact: import.meta.env.VITE_CONTACT_API || '/api/contact',
    booking: import.meta.env.VITE_BOOKING_API || '/api/booking',
    careers: import.meta.env.VITE_CAREERS_API || '/api/careers/apply'
  }
};

// Email API configuration
export const emailConfig = {
  endpoint: '/api/submit-form'
};

// Google Services configuration
export const googleConfig = {
  mapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  analyticsId: import.meta.env.VITE_GA_MEASUREMENT_ID || ''
};

// Feature flags
export const features = {
  enableBlog: import.meta.env.VITE_ENABLE_BLOG === 'true',
  enableChat: import.meta.env.VITE_ENABLE_CHAT === 'true',
  enableRecaptcha: !!import.meta.env.VITE_RECAPTCHA_SITE_KEY
};

// SEO configuration
export const seoConfig = {
  defaultTitle: 'Bina Adult Care - Compassionate Senior Care in USA',
  titleTemplate: '%s | Bina Adult Care',
  description: 'Providing compassionate residential and home care services for senior adults in USA. 24/7 professional care with dignity and respect.',
  keywords: [
    'elder care USA',
    'senior care USA',
    'residential care facility',
    'home care services',
    'nursing home USA',
    'assisted living USA',
    'elderly care',
    'senior citizen care',
    'old age home',
    'professional caregivers'
  ].join(', '),
  ogImage: `${siteConfig.url}/og-image.jpg`,
  twitterHandle: '@binaadultcare'
};

// Validation limits
export const validationLimits = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  phone: { min: 10, max: 20 },
  message: { min: 10, max: 2000 },
  resume: { maxSizeMB: 5, allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] }
};

// Check if configuration is properly set up
export const checkConfig = (): { isValid: boolean; warnings: string[] } => {
  const warnings: string[] = [];

  if (!googleConfig.mapsApiKey) {
    warnings.push('Google Maps API key is not configured');
  }

  if (!googleConfig.analyticsId) {
    warnings.push('Google Analytics ID is not configured');
  }



  if (apiConfig.baseUrl === '/api') {
    warnings.push('API base URL is using default value - update in production');
  }

  if (siteConfig.url === 'https://www.binaadultcare.com' && import.meta.env.MODE === 'production') {
    warnings.push('Site URL may need to be updated');
  }

  return {
    isValid: warnings.length === 0,
    warnings
  };
};

// Export all configurations
export default {
  site: siteConfig,
  api: apiConfig,
  google: googleConfig,
  email: emailConfig,
  features,
  seo: seoConfig,
  validation: validationLimits
};
