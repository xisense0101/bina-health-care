import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Plus, Pencil, Trash2, Star, Upload, X, Loader2, Save, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, uploadImage } from '../../lib/supabaseQueries';

interface Testimonial {
  id: number;
  author_name: string;
  author_role: string | null;
  author_company: string | null;
  quote: string;
  rating: number;
  image_url: string | null;
  is_featured: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

interface TestimonialFormData {
  author_name: string;
  author_role: string;
  author_company: string;
  quote: string;
  rating: number;
  image_url: string;
  is_featured: boolean;
  display_order: number;
}

export function AdminTestimonialsPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<TestimonialFormData>({
    author_name: '',
    author_role: '',
    author_company: '',
    quote: '',
    rating: 5,
    image_url: '',
    is_featured: false,
    display_order: 0
  });

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: getAllTestimonials
  });

  const createMutation = useMutation({
    mutationFn: createTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial created successfully');
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(`Failed to create testimonial: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Testimonial> }) =>
      updateTestimonial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial updated successfully');
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update testimonial: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete testimonial: ${error.message}`);
    }
  });

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setFormData({
      author_name: testimonial.author_name,
      author_role: testimonial.author_role || '',
      author_company: testimonial.author_company || '',
      quote: testimonial.quote,
      rating: testimonial.rating,
      image_url: testimonial.image_url || '',
      is_featured: testimonial.is_featured,
      display_order: testimonial.display_order
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      author_name: '',
      author_role: '',
      author_company: '',
      quote: '',
      rating: 5,
      image_url: '',
      is_featured: false,
      display_order: 0
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file, 'testimonials');
      setFormData(prev => ({ ...prev, image_url: imageUrl || '' }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.author_name.trim() || !formData.quote.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const data = {
      author_name: formData.author_name,
      author_role: formData.author_role || null,
      author_company: formData.author_company || null,
      quote: formData.quote,
      rating: formData.rating,
      image_url: formData.image_url || null,
      is_featured: formData.is_featured,
      display_order: formData.display_order
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number, author_name: string) => {
    if (confirm(`Are you sure you want to delete the testimonial from "${author_name}"? This action cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground mt-2">
            Manage customer testimonials and reviews
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Testimonial' : 'Add New Testimonial'}</CardTitle>
            <CardDescription>
              {editingId ? 'Update the testimonial information' : 'Add a new customer testimonial'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Author Image (Optional)</Label>
                {formData.image_url && (
                  <div className="relative inline-block">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </>
                  )}
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author_name">Author Name *</Label>
                  <Input
                    id="author_name"
                    value={formData.author_name}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, author_name: e.target.value }))
                    }
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author_role">Role</Label>
                  <Input
                    id="author_role"
                    value={formData.author_role}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, author_role: e.target.value }))
                    }
                    placeholder="Family Member"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author_company">Company (Optional)</Label>
                <Input
                  id="author_company"
                  value={formData.author_company}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, author_company: e.target.value }))
                  }
                  placeholder="Company Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quote">Testimonial *</Label>
                <Textarea
                  id="quote"
                  value={formData.quote}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, quote: e.target.value }))
                  }
                  placeholder="Write the testimonial here..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    min="0"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked: boolean) =>
                    setFormData(prev => ({ ...prev, is_featured: checked }))
                  }
                />
                <Label htmlFor="is_featured">Feature this testimonial</Label>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {editingId ? 'Update' : 'Add'} Testimonial
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {testimonial.image_url ? (
                    <img
                      src={testimonial.image_url}
                      alt={testimonial.author_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-lg">{testimonial.author_name}</CardTitle>
                    <CardDescription>
                      {testimonial.author_role}
                      {testimonial.author_company && ` at ${testimonial.author_company}`}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-3 italic">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  {testimonial.is_featured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    Order: {testimonial.display_order}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(testimonial)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(testimonial.id, testimonial.author_name)}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {testimonials.length === 0 && !showForm && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No testimonials yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first customer testimonial
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Testimonial
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
