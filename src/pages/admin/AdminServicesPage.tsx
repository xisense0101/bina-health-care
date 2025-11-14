import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Plus, Pencil, Trash2, Upload, X, Loader2, Save, Image as ImageIcon, List } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { getAllServices, createService, updateService, deleteService, uploadImage } from '../../lib/supabaseQueries';

interface Service {
  id: number;
  title: string;
  slug: string;
  description: string;
  features: string[];
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ServiceFormData {
  title: string;
  slug: string;
  description: string;
  features: string[];
  image_url: string;
  display_order: number;
  is_active: boolean;
}

export function AdminServicesPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentFeature, setCurrentFeature] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    slug: '',
    description: '',
    features: [],
    image_url: '',
    display_order: 0,
    is_active: true
  });

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: getAllServices
  });

  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service created successfully');
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(`Failed to create service: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Service> }) =>
      updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service updated successfully');
      resetForm();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update service: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete service: ${error.message}`);
    }
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData({
      title: service.title,
      slug: service.slug,
      description: service.description,
      features: service.features || [],
      image_url: service.image_url || '',
      display_order: service.display_order,
      is_active: service.is_active
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setCurrentFeature('');
    setFormData({
      title: '',
      slug: '',
      description: '',
      features: [],
      image_url: '',
      display_order: 0,
      is_active: true
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
      const imageUrl = await uploadImage(file, 'services');
      setFormData(prev => ({ ...prev, image_url: imageUrl || '' }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddFeature = () => {
    if (currentFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()]
      }));
      setCurrentFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const data = {
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      description: formData.description,
      features: formData.features,
      image_url: formData.image_url || null,
      display_order: formData.display_order,
      is_active: formData.is_active
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
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

  const activeServices = services.filter(s => s.is_active);
  const inactiveServices = services.filter(s => !s.is_active);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground mt-2">
            Manage your service offerings and features. Only the first 2 active services (by display order) appear on the homepage.
          </p>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>📌 Homepage Display:</strong> Only the first 2 active services will be shown on the homepage. 
              Set display order to control which services appear first.
            </p>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)} size="lg" className="ml-4">
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Service' : 'Add New Service'}</CardTitle>
            <CardDescription>
              {editingId ? 'Update the service information' : 'Add a new service offering'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Service Image *</Label>
                <p className="text-sm text-muted-foreground">
                  Upload an image for this service. Images are displayed on the homepage (first 2 active services only).
                </p>
                {formData.image_url && (
                  <div className="relative inline-block">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                    >
                      <X className="h-4 w-4" />
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
                  <Label htmlFor="title">Service Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        title,
                        slug: prev.slug || generateSlug(title)
                      }));
                    }}
                    placeholder="Residential Care"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="residential-care"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Describe this service..."
                  rows={4}
                  required
                />
              </div>

              {/* Features */}
              <div className="space-y-2">
                <Label>Features</Label>
                <div className="flex gap-2">
                  <Input
                    value={currentFeature}
                    onChange={(e) => setCurrentFeature(e.target.value)}
                    placeholder="Add a feature..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddFeature}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.features.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded-md">
                        <span className="flex-1 text-sm">{feature}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFeature(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
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

                <div className="flex items-center space-x-2 pt-8">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked: boolean) =>
                      setFormData(prev => ({ ...prev, is_active: checked }))
                    }
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
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
                      {editingId ? 'Update' : 'Add'} Service
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

      {/* Active Services */}
      {activeServices.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Active Services ({activeServices.length})</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {activeServices.map((service, index) => (
              <Card key={service.id} className={index < 2 ? 'border-primary border-2' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-xl">{service.title}</CardTitle>
                        {index < 2 && (
                          <Badge variant="default" className="bg-primary">
                            On Homepage
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="mt-1">{service.slug}</CardDescription>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {service.image_url && (
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  )}
                  
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {service.description}
                  </p>

                  {service.features && service.features.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <List className="h-4 w-4" />
                        Features ({service.features.length})
                      </div>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {service.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="line-clamp-1">{feature}</li>
                        ))}
                        {service.features.length > 3 && (
                          <li className="text-primary">+{service.features.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      Order: {service.display_order}
                    </span>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(service)}
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(service.id, service.title)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Inactive Services */}
      {inactiveServices.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-muted-foreground">Inactive Services</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {inactiveServices.map((service) => (
              <Card key={service.id} className="opacity-60">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription className="mt-1">{service.slug}</CardDescription>
                    </div>
                    <Badge variant="secondary">Inactive</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {service.image_url && (
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="w-full h-48 object-cover rounded-md grayscale"
                    />
                  )}
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      Order: {service.display_order}
                    </span>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(service)}
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(service.id, service.title)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {services.length === 0 && !showForm && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No services yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first service offering
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
