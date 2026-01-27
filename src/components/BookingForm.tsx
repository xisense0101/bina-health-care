import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Clock } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { error as logError } from '../lib/logger';


export function BookingForm() {
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    time: '',
    notes: '',
    honeypot: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.honeypot) {
      return; // Spam protection
    }

    if (!date) {
      toast.error('Please select a date for your visit');
      return;
    }

    setIsSubmitting(true);

    try {
      // Format date for display
      const formattedDate = format(date, 'MMMM dd, yyyy');

      // Submit to Internal API (uses Resend)
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'booking',
          data: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            serviceType: formData.service,
            date: formattedDate,
            time: formData.time,
            notes: formData.notes || 'No additional notes',
          },
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to schedule visit');
      }

      toast.success('Visit scheduled! We will send you a confirmation email shortly.');

      // Reset form
      setDate(undefined);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        time: '',
        notes: '',
        honeypot: '',
      });
    } catch (error) {
      toast.error('Unable to schedule visit. Please call us directly.');
      logError('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="booking-name">Full Name *</Label>
          <Input
            id="booking-name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="bg-input-background border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="booking-phone">Phone Number *</Label>
          <Input
            id="booking-phone"
            type="tel"
            placeholder="XXX-XXXX"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            className="bg-input-background border-border"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="booking-email">Email Address *</Label>
        <Input
          id="booking-email"
          type="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="bg-input-background border-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="booking-service">Service *</Label>
        <Select value={formData.service} onValueChange={(value: string) => setFormData({ ...formData, service: value })} required>
          <SelectTrigger className="bg-input-background border-border">
            <SelectValue placeholder="Select service to visit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="residential-care">Residential Care Facility Tour</SelectItem>
            <SelectItem value="home-care">Home Care Consultation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="booking-date">Preferred Date *</Label>
          <Input
            id="booking-date"
            type="date"
            value={date ? format(date, 'yyyy-MM-dd') : ''}
            onChange={(e) => {
              if (e.target.value) {
                setDate(new Date(e.target.value));
              }
            }}
            min={format(new Date(), 'yyyy-MM-dd')}
            required
            className="bg-input-background border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="booking-time">Preferred Time *</Label>
          <Select value={formData.time} onValueChange={(value: string) => setFormData({ ...formData, time: value })} required>
            <SelectTrigger className="bg-input-background border-border">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {time}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="booking-notes">Additional Notes</Label>
        <Textarea
          id="booking-notes"
          placeholder="Any specific questions or requirements?"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={4}
          className="bg-input-background border-border resize-none"
        />
      </div>

      {/* Honeypot */}
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
        {isSubmitting ? 'Scheduling...' : 'Schedule Visit'}
      </Button>

      <p className="text-sm text-muted-foreground">
        You will receive a confirmation email with visit details. Our team will contact you if any changes are needed.
      </p>
    </form>
  );
}
