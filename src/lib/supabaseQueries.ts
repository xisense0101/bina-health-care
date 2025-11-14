import { supabase, type SiteSettings, type HeroSection, type HeroImage, type GalleryImage, type TeamMember, type Location, type Service, type Testimonial, type WhyChooseUs, type JobPosition } from './supabase';

// ============= SITE SETTINGS =============
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .single();
  
  if (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
  return data;
}

export async function updateSiteSettings(id: string, updates: Partial<SiteSettings>): Promise<SiteSettings | null> {
  const { data, error } = await supabase
    .from('site_settings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating site settings:', error);
    throw error;
  }
  return data;
}

// ============= HERO SECTION =============
export async function getHeroSection(): Promise<HeroSection | null> {
  const { data, error } = await supabase
    .from('hero_section')
    .select('*')
    .single();
  
  if (error) {
    console.error('Error fetching hero section:', error);
    return null;
  }
  return data;
}

export async function updateHeroSection(updates: Partial<HeroSection>): Promise<HeroSection | null> {
  const { data, error } = await supabase
    .from('hero_section')
    .update(updates)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating hero section:', error);
    throw error;
  }
  return data;
}

// ============= HERO IMAGES =============
export async function getHeroImages(): Promise<HeroImage[]> {
  const { data, error } = await supabase
    .from('hero_images')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching hero images:', error);
    return [];
  }
  return data || [];
}

export async function getAllHeroImages(): Promise<HeroImage[]> {
  const { data, error } = await supabase
    .from('hero_images')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching all hero images:', error);
    return [];
  }
  return data || [];
}

export async function createHeroImage(image: Omit<HeroImage, 'id' | 'created_at' | 'updated_at'>): Promise<HeroImage | null> {
  const { data, error } = await supabase
    .from('hero_images')
    .insert(image)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating hero image:', error);
    throw error;
  }
  return data;
}

export async function updateHeroImage(id: string, updates: Partial<HeroImage>): Promise<HeroImage | null> {
  const { data, error } = await supabase
    .from('hero_images')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating hero image:', error);
    throw error;
  }
  return data;
}

export async function deleteHeroImage(id: string): Promise<void> {
  const { error } = await supabase
    .from('hero_images')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting hero image:', error);
    throw error;
  }
}

// ============= GALLERY IMAGES =============
export async function getGalleryImages(category?: string): Promise<GalleryImage[]> {
  let query = supabase
    .from('gallery_images')
    .select('*')
    .eq('is_active', true);
  
  if (category) {
    query = query.eq('category', category);
  }
  
  query = query.order('display_order', { ascending: true });
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }
  return data || [];
}

export async function getAllGalleryImages(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching all gallery images:', error);
    return [];
  }
  return data || [];
}

export async function createGalleryImage(image: Omit<GalleryImage, 'id' | 'created_at' | 'updated_at'>): Promise<GalleryImage | null> {
  const { data, error } = await supabase
    .from('gallery_images')
    .insert(image)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating gallery image:', error);
    throw error;
  }
  return data;
}

export async function updateGalleryImage(id: string, updates: Partial<GalleryImage>): Promise<GalleryImage | null> {
  const { data, error } = await supabase
    .from('gallery_images')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating gallery image:', error);
    throw error;
  }
  return data;
}

export async function deleteGalleryImage(id: string): Promise<void> {
  const { error } = await supabase
    .from('gallery_images')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting gallery image:', error);
    throw error;
  }
}

// ============= TEAM MEMBERS =============
export async function getTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
  return data || [];
}

export async function getAllTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching all team members:', error);
    return [];
  }
  return data || [];
}

export async function createTeamMember(member: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>): Promise<TeamMember | null> {
  const { data, error } = await supabase
    .from('team_members')
    .insert(member)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating team member:', error);
    throw error;
  }
  return data;
}

export async function updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember | null> {
  const { data, error } = await supabase
    .from('team_members')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating team member:', error);
    throw error;
  }
  return data;
}

export async function deleteTeamMember(id: string): Promise<void> {
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting team member:', error);
    throw error;
  }
}

// ============= LOCATIONS =============
export async function getLocations(): Promise<Location[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
  return data || [];
}

export async function getAllLocations(): Promise<Location[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching all locations:', error);
    return [];
  }
  return data || [];
}

export async function createLocation(location: Omit<Location, 'id' | 'created_at' | 'updated_at'>): Promise<Location | null> {
  const { data, error } = await supabase
    .from('locations')
    .insert(location)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating location:', error);
    throw error;
  }
  return data;
}

export async function updateLocation(id: string, updates: Partial<Location>): Promise<Location | null> {
  const { data, error } = await supabase
    .from('locations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating location:', error);
    throw error;
  }
  return data;
}

export async function deleteLocation(id: string): Promise<void> {
  const { error } = await supabase
    .from('locations')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting location:', error);
    throw error;
  }
}

// ============= SERVICES =============
export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }
  return data || [];
}

export async function getAllServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching all services:', error);
    return [];
  }
  return data || [];
}

export async function createService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .insert(service)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating service:', error);
    throw error;
  }
  return data;
}

export async function updateService(id: number, updates: Partial<Service>): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating service:', error);
    throw error;
  }
  return data;
}

export async function deleteService(id: number): Promise<void> {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
}

// ============= TESTIMONIALS =============
export async function getTestimonials(featuredOnly: boolean = false): Promise<Testimonial[]> {
  let query = supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true);
  
  if (featuredOnly) {
    query = query.eq('is_featured', true);
  }
  
  query = query.order('display_order', { ascending: true });
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
  return data || [];
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching all testimonials:', error);
    return [];
  }
  return data || [];
}

export async function createTestimonial(testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>): Promise<Testimonial | null> {
  const { data, error } = await supabase
    .from('testimonials')
    .insert(testimonial)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating testimonial:', error);
    throw error;
  }
  return data;
}

export async function updateTestimonial(id: number, updates: Partial<Testimonial>): Promise<Testimonial | null> {
  const { data, error } = await supabase
    .from('testimonials')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating testimonial:', error);
    throw error;
  }
  return data;
}

export async function deleteTestimonial(id: number): Promise<void> {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
}

// ============= WHY CHOOSE US =============
export async function getWhyChooseUs(): Promise<WhyChooseUs[]> {
  const { data, error } = await supabase
    .from('why_choose_us')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching why choose us:', error);
    return [];
  }
  return data || [];
}

export async function getAllWhyChooseUs(): Promise<WhyChooseUs[]> {
  const { data, error } = await supabase
    .from('why_choose_us')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching all why choose us:', error);
    return [];
  }
  return data || [];
}

export async function createWhyChooseUs(item: Omit<WhyChooseUs, 'id' | 'created_at' | 'updated_at'>): Promise<WhyChooseUs | null> {
  const { data, error } = await supabase
    .from('why_choose_us')
    .insert(item)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating why choose us:', error);
    throw error;
  }
  return data;
}

export async function updateWhyChooseUs(id: string, updates: Partial<WhyChooseUs>): Promise<WhyChooseUs | null> {
  const { data, error } = await supabase
    .from('why_choose_us')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating why choose us:', error);
    throw error;
  }
  return data;
}

export async function deleteWhyChooseUs(id: string): Promise<void> {
  const { error } = await supabase
    .from('why_choose_us')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting why choose us:', error);
    throw error;
  }
}

// ============= JOB POSITIONS =============
export async function getJobPositions(): Promise<JobPosition[]> {
  const { data, error } = await supabase
    .from('job_positions')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching job positions:', error);
    return [];
  }
  return data || [];
}

export async function getAllJobPositions(): Promise<JobPosition[]> {
  const { data, error } = await supabase
    .from('job_positions')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching all job positions:', error);
    return [];
  }
  return data || [];
}

export async function createJobPosition(position: Omit<JobPosition, 'id' | 'created_at' | 'updated_at'>): Promise<JobPosition | null> {
  const { data, error } = await supabase
    .from('job_positions')
    .insert(position)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating job position:', error);
    throw error;
  }
  return data;
}

export async function updateJobPosition(id: string, updates: Partial<JobPosition>): Promise<JobPosition | null> {
  const { data, error } = await supabase
    .from('job_positions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating job position:', error);
    throw error;
  }
  return data;
}

export async function deleteJobPosition(id: string): Promise<void> {
  const { error } = await supabase
    .from('job_positions')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting job position:', error);
    throw error;
  }
}

// ============= FILE UPLOAD =============
export async function uploadImage(file: File, bucket: string = 'images'): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading image:', error);
    throw error;
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function deleteImage(url: string, bucket: string = 'images'): Promise<void> {
  // Extract file path from URL
  const urlParts = url.split('/');
  const filePath = urlParts[urlParts.length - 1];

  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}
