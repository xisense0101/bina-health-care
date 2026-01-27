import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { getSiteSettings } from '../lib/supabaseQueries';
import { sanitizeInput, validateForm, formRateLimiter, validateHoneypot } from '../lib/security';
import { log as logInfo, error as logError } from '../lib/logger';
import { siteConfig } from '../lib/config';

export function ContactForm() {
  const { data: siteSettings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: getSiteSettings
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    honeypot: '', // Spam protection
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateFormData = (): boolean => {
    const newErrors: Record<string, string> = {};

    try {
      validateForm.required(formData.name, 'Name');
      if (!validateForm.minLength(formData.name, 2)) {
        newErrors.name = 'Name must be at least 2 characters';
      }
    } catch (error) {
      newErrors.name = error instanceof Error ? error.message : 'Invalid name';
    }

    try {
      validateForm.required(formData.email, 'Email');
      if (!validateForm.email(formData.email)) {
        newErrors.email = 'Invalid email address';
      }
    } catch (error) {
      newErrors.email = error instanceof Error ? error.message : 'Invalid email';
    }

    try {
      validateForm.required(formData.phone, 'Phone');
      if (!validateForm.phone(formData.phone)) {
        newErrors.phone = 'Invalid phone number format';
      }
    } catch (error) {
      newErrors.phone = error instanceof Error ? error.message : 'Invalid phone';
    }

    try {
      validateForm.required(formData.message, 'Message');
      if (!validateForm.minLength(formData.message, 10)) {
        newErrors.message = 'Message must be at least 10 characters';
      }
    } catch (error) {
      newErrors.message = error instanceof Error ? error.message : 'Invalid message';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot spam protection
    if (!validateHoneypot(formData.honeypot)) {
      logInfo('Spam detected');
      return; // Silent fail for bots
    }

    // Validate form
    if (!validateFormData()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    // Rate limiting
    if (!formRateLimiter.isAllowed('contact-form')) {
      const waitTime = Math.ceil(formRateLimiter.getWaitTime('contact-form') / 1000);
      toast.error(`Please wait ${waitTime} seconds before submitting again`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize inputs
      const sanitizedData = {
        name: sanitizeInput.text(formData.name),
        email: sanitizeInput.email(formData.email),
        phone: sanitizeInput.phone(formData.phone),
        service: formData.service,
        message: sanitizeInput.message(formData.message),
      };

      // Submit to internal API (which uses Resend)
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'contact',
          data: {
            name: sanitizedData.name,
            email: sanitizedData.email,
            phone: sanitizedData.phone,
            service: sanitizedData.service || 'General Inquiry',
            message: sanitizedData.message,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit form');
      }

      toast.success('Thank you for contacting us! We will get back to you soon.');

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
        honeypot: '',
      });
      setErrors({});
    } catch (error) {
      logError('Form submission error:', error);
      toast.error(`Something went wrong. Please try again or call us directly at ${siteSettings?.phone || siteConfig.contact.phone}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            className={`bg-input-background border-border ${errors.name ? 'border-red-500' : ''}`}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-red-600" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+977-XXX-XXXX"
            value={formData.phone}
            onChange={(e) => {
              setFormData({ ...formData, phone: e.target.value });
              if (errors.phone) setErrors({ ...errors, phone: '' });
            }}
            className={`bg-input-background border-border ${errors.phone ? 'border-red-500' : ''}`}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && (
            <p id="phone-error" className="text-sm text-red-600" role="alert">
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
            if (errors.email) setErrors({ ...errors, email: '' });
          }}
          className={`bg-input-background border-border ${errors.email ? 'border-red-500' : ''}`}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-600" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="service">Service Interest</Label>
        <Select value={formData.service} onValueChange={(value: string) => setFormData({ ...formData, service: value })}>
          <SelectTrigger className="bg-input-background border-border">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="residential-care">Residential Care</SelectItem>
            <SelectItem value="home-care">Home Care</SelectItem>
            <SelectItem value="general-inquiry">General Inquiry</SelectItem>
            <SelectItem value="partnership">Partnership Opportunity</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          placeholder="Tell us how we can help..."
          value={formData.message}
          onChange={(e) => {
            setFormData({ ...formData, message: e.target.value });
            if (errors.message) setErrors({ ...errors, message: '' });
          }}
          rows={5}
          className={`bg-input-background border-border resize-none ${errors.message ? 'border-red-500' : ''}`}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <p id="message-error" className="text-sm text-red-600" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot field - hidden from users */}
      <input
        type="text"
        name="honeypot"
        value={formData.honeypot}
        onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary/90"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>

      <p className="text-sm text-muted-foreground">
        By submitting this form, you agree to our privacy policy. We respect your privacy and will never share your information.
      </p>
    </form>
  );
}
