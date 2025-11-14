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
import { web3FormsConfig } from '../lib/config';
import { supabase } from '../lib/supabase';

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
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.honeypot) {
      return; // Spam protection
    }

    if (!resume) {
      toast.error('Please upload your resume');
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if Web3Forms is configured
      if (!web3FormsConfig.accessKey) {
        throw new Error('Web3Forms is not configured. Please add VITE_WEB3FORMS_ACCESS_KEY to your .env file');
      }

      // Step 1: Upload resume to Supabase Storage
      const fileExt = resume.name.split('.').pop();
      const fileName = `${Date.now()}-${formData.name.replace(/\s+/g, '-')}.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('job-applications')
        .upload(filePath, resume, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Failed to upload resume: ${uploadError.message}`);
      }

      // Step 2: Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('job-applications')
        .getPublicUrl(filePath);

      // Step 3: Prepare form data for Web3Forms with resume link
      const web3FormData = new FormData();
      web3FormData.append('access_key', web3FormsConfig.accessKey);
      web3FormData.append('subject', `New Job Application: ${formData.position} - ${formData.name}`);
      web3FormData.append('from_name', formData.name);
      web3FormData.append('name', formData.name);
      web3FormData.append('email', formData.email);
      web3FormData.append('phone', formData.phone);
      web3FormData.append('position', formData.position);
      web3FormData.append('experience', formData.experience);
      web3FormData.append('message', formData.message || 'No additional information provided');
      
      // Include resume download link in the email
      web3FormData.append('resume_link', publicUrl);
      web3FormData.append('resume_filename', resume.name);
      
      // Add custom fields
      web3FormData.append('redirect', 'false');
      web3FormData.append('replyto', formData.email);

      // Step 4: Submit to Web3Forms
      const response = await fetch(web3FormsConfig.apiEndpoint, {
        method: 'POST',
        body: web3FormData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        // If email fails, try to delete the uploaded file to avoid orphaned files
        await supabase.storage
          .from('job-applications')
          .remove([filePath]);
        
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
      console.error('Application submission error:', error);
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
            placeholder="+977-XXX-XXXX"
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
        <Select value={formData.position} onValueChange={(value: string) => setFormData({ ...formData, position: value })} required>
          <SelectTrigger className="bg-input-background border-border">
            <SelectValue placeholder="Select position" />
          </SelectTrigger>
          <SelectContent>
            {jobPositions.length > 0 ? (
              jobPositions.map((position) => (
                <SelectItem key={position.id} value={position.slug}>
                  {position.title}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="other">Other Position</SelectItem>
            )}
          </SelectContent>
        </Select>
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
