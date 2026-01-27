import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { getJobPositions } from '../lib/supabaseQueries';
import { error as logError } from '../lib/logger';



export function JobApplicationForm() {
  const { data: jobPositions = [] } = useQuery({
    queryKey: ['job-positions'],
    queryFn: () => getJobPositions()
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    message: '',
    honeypot: '',
  });
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 3MB for direct attachment)
      if (file.size > 3 * 1024 * 1024) {
        toast.error('File size must be less than 3MB');
        return;
      }
      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF or Word document');
        return;
      }
      setResume(file);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.honeypot) return;

    if (!resume) {
      toast.error('Please upload your resume');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert file to Base64
      const base64File = await convertFileToBase64(resume);

      // Submit to Internal API
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'job',
          data: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            position: formData.position,
            experience: formData.experience,
            message: formData.message || 'No additional information provided',
            resume: {
              content: base64File,
              filename: resume.name,
            },
          },
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit application');
      }

      toast.success('Application submitted successfully! We will review and contact you soon.');

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        message: '',
        honeypot: '',
      });
      setResume(null);

      // Reset file input
      const fileInput = document.getElementById('job-resume') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      toast.error('Unable to submit application. Please try again or email us directly.');
      logError('Application submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="job-name">Full Name *</Label>
          <Input
            id="job-name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="bg-input-background border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="job-phone">Phone Number *</Label>
          <Input
            id="job-phone"
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
        <Label htmlFor="job-email">Email Address *</Label>
        <Input
          id="job-email"
          type="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="bg-input-background border-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="job-position">Position Applied For *</Label>
        <Input
          id="job-position"
          type="text"
          placeholder="Enter the position you are applying for"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          required
          className="bg-input-background border-border"
        />
        {jobPositions.length > 0 && (
          <p className="text-sm text-muted-foreground mt-2">Available positions: {jobPositions.map(p => p.title).join(', ')}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="job-experience">Years of Experience *</Label>
        <Select value={formData.experience} onValueChange={(value: string) => setFormData({ ...formData, experience: value })} required>
          <SelectTrigger className="bg-input-background border-border">
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-1">Less than 1 year</SelectItem>
            <SelectItem value="1-3">1-3 years</SelectItem>
            <SelectItem value="3-5">3-5 years</SelectItem>
            <SelectItem value="5-10">5-10 years</SelectItem>
            <SelectItem value="10+">10+ years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="job-resume">Upload Resume/CV *</Label>
        <div className="flex items-center gap-4">
          <label
            htmlFor="job-resume"
            className="flex items-center gap-2 px-4 py-2 bg-input-background border border-border rounded-md cursor-pointer hover:bg-muted transition-colors"
          >
            <Upload className="h-4 w-4" />
            {resume ? resume.name : 'Choose File'}
          </label>
          <input
            id="job-resume"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
            required
          />
          {resume && (
            <span className="text-sm text-muted-foreground">
              ({(resume.size / 1024).toFixed(1)} KB)
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Accepted formats: PDF, DOC, DOCX (Max 5MB)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="job-message">Cover Letter / Additional Information</Label>
        <Textarea
          id="job-message"
          placeholder="Tell us why you'd be a great fit for this position..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={5}
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
        {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
      </Button>

      <p className="text-sm text-muted-foreground">
        By submitting this application, you consent to the processing of your personal data for recruitment purposes.
      </p>
    </form>
  );
}
