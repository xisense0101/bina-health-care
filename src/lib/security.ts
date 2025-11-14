/**
 * Security utilities and validation functions
 * Implements OWASP best practices for web application security
 */

// Input sanitization utilities
export const sanitizeInput = {
  /**
   * Remove potentially dangerous characters from text input
   */
  text: (input: string): string => {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove < and > to prevent basic XSS
      .substring(0, 500); // Limit length
  },

  /**
   * Validate and sanitize email addresses
   */
  email: (email: string): string => {
    const sanitized = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(sanitized)) {
      throw new Error('Invalid email format');
    }
    
    return sanitized.substring(0, 254); // RFC 5321
  },

  /**
   * Sanitize phone numbers (Nepal format)
   */
  phone: (phone: string): string => {
    // Remove all non-numeric characters except + and -
    const cleaned = phone.replace(/[^\d+\-\s()]/g, '');
    return cleaned.trim().substring(0, 20);
  },

  /**
   * Sanitize textarea/message input
   */
  message: (message: string): string => {
    return message
      .trim()
      .replace(/[<>]/g, '') // Remove < and > to prevent basic XSS
      .substring(0, 2000); // Limit length
  },

  /**
   * Sanitize file names
   */
  filename: (filename: string): string => {
    return filename
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .substring(0, 255);
  }
};

// Form validation utilities
export const validateForm = {
  /**
   * Validate required field
   */
  required: (value: string, fieldName: string): string => {
    if (!value || value.trim().length === 0) {
      throw new Error(`${fieldName} is required`);
    }
    return value.trim();
  },

  /**
   * Validate email format
   */
  email: (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  },

  /**
   * Validate phone number (Nepal format)
   */
  phone: (phone: string): boolean => {
    // Nepal phone numbers can be: +977-XXX-XXX-XXXX or 9XXXXXXXXX
    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    const nepalPhoneRegex = /^(\+977)?[9][6-9]\d{8}$/;
    return nepalPhoneRegex.test(cleanPhone);
  },

  /**
   * Validate minimum length
   */
  minLength: (value: string, min: number): boolean => {
    return value.trim().length >= min;
  },

  /**
   * Validate maximum length
   */
  maxLength: (value: string, max: number): boolean => {
    return value.trim().length <= max;
  },

  /**
   * Validate file type
   */
  fileType: (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type);
  },

  /**
   * Validate file size
   */
  fileSize: (file: File, maxSizeMB: number): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }
};

// Rate limiting helper (client-side)
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 60000 // 1 minute
  ) {}

  /**
   * Check if action is allowed based on rate limit
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(
      timestamp => now - timestamp < this.windowMs
    );
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  /**
   * Get time until next allowed attempt
   */
  getWaitTime(key: string): number {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length < this.maxAttempts) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const waitTime = this.windowMs - (Date.now() - oldestAttempt);
    return Math.max(0, waitTime);
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Create singleton instance for form submissions
export const formRateLimiter = new RateLimiter(3, 60000); // 3 attempts per minute

// Security headers configuration (for backend)
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

// CORS configuration (for backend)
export const corsConfig = {
  origin: (typeof import.meta.env.VITE_ALLOWED_ORIGINS === 'string' && import.meta.env.VITE_ALLOWED_ORIGINS) 
    ? import.meta.env.VITE_ALLOWED_ORIGINS.split(',') 
    : ['https://www.binaadultcare.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Content Security Policy (for backend)
export const contentSecurityPolicy = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", 'https://www.googletagmanager.com', 'https://maps.googleapis.com'],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    imgSrc: ["'self'", 'data:', 'https:', 'https://images.unsplash.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    connectSrc: ["'self'", 'https://www.google-analytics.com'],
    frameSrc: ["'self'", 'https://www.google.com', 'https://maps.google.com'],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: []
  }
};

// Generate CSRF token (simple client-side version)
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Store CSRF token in session storage
export const setCSRFToken = (token: string): void => {
  sessionStorage.setItem('csrf_token', token);
};

// Get CSRF token from session storage
export const getCSRFToken = (): string | null => {
  return sessionStorage.getItem('csrf_token');
};

// Initialize CSRF token on app load
export const initCSRFToken = (): string => {
  let token = getCSRFToken();
  if (!token) {
    token = generateCSRFToken();
    setCSRFToken(token);
  }
  return token;
};

// Validate honeypot field (spam protection)
export const validateHoneypot = (value: string): boolean => {
  return value === '' || value === undefined || value === null;
};

// Check if environment is production
export const isProduction = (): boolean => {
  return import.meta.env.MODE === 'production';
};

// Secure localStorage wrapper
export const secureStorage = {
  set: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, btoa(value)); // Basic encoding
      }
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  get: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined') {
        const value = localStorage.getItem(key);
        return value ? atob(value) : null;
      }
    } catch (error) {
      console.error('Storage error:', error);
    }
    return null;
  },

  remove: (key: string): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Storage error:', error);
    }
  }
};
