import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  getAllHeroImages, 
  createHeroImage, 
  updateHeroImage, 
  deleteHeroImage,
  uploadImage 
} from '../../lib/supabaseQueries';
import { Pencil, Trash2, Plus, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export function AdminHeroImagesPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    image_url: '',
    alt_text: '',
    display_order: 0,
    is_active: true
  });

  const queryClient = useQueryClient();

  const { data: heroImages, isLoading } = useQuery({
    queryKey: ['hero-images-all'],
    queryFn: () => getAllHeroImages()
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await createHeroImage(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-images-all'] });
      queryClient.invalidateQueries({ queryKey: ['hero-images'] });
      toast.success('Hero image added successfully');
      resetForm();
    },
    onError: () => {
      toast.error('Failed to add hero image');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      return await updateHeroImage(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-images-all'] });
      queryClient.invalidateQueries({ queryKey: ['hero-images'] });
      toast.success('Hero image updated successfully');
      resetForm();
    },
    onError: () => {
      toast.error('Failed to update hero image');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteHeroImage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-images-all'] });
      queryClient.invalidateQueries({ queryKey: ['hero-images'] });
      toast.success('Hero image deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete hero image');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile && !editingId) {
      toast.error('Please select an image');
      return;
    }

    try {
      let imageUrl = formData.image_url;
      
      if (selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          toast.error('Failed to upload image');
          return;
        }
      }

      if (editingId) {
        await updateMutation.mutateAsync({ 
          id: editingId, 
          data: selectedFile ? { ...formData, image_url: imageUrl } : formData 
        });
      } else {
        await createMutation.mutateAsync({ ...formData, image_url: imageUrl });
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const resetForm = () => {
    setFormData({
      image_url: '',
      alt_text: '',
      display_order: 0,
      is_active: true
    });
    setSelectedFile(null);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (image: any) => {
    setEditingId(image.id);
    setFormData({
      image_url: image.image_url,
      alt_text: image.alt_text || '',
      display_order: image.display_order,
      is_active: image.is_active
    });
    setIsAdding(true);
  };

  const toggleActive = async (image: any) => {
    await updateMutation.mutateAsync({
      id: image.id,
      data: { is_active: !image.is_active }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const activeImages = heroImages?.filter(img => img.is_active) || [];
  const inactiveImages = heroImages?.filter(img => !img.is_active) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Hero Section Images</h1>
          <p className="text-muted-foreground mt-1">
            Manage homepage hero carousel images • {activeImages.length} active, {inactiveImages.length} inactive
          </p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Add Hero Image
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              {editingId ? 'Edit Hero Image' : 'Add New Hero Image'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image" className="text-base">
                    Image {!editingId && <span className="text-destructive">*</span>}
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    required={!editingId}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Recommended size: 1920x1080px (16:9 ratio) for best display
                  </p>
                </div>

                <div>
                  <Label htmlFor="alt_text" className="text-base">
                    Alt Text <span className="text-muted-foreground text-sm">(for accessibility)</span>
                  </Label>
                  <Input
                    id="alt_text"
                    value={formData.alt_text}
                    onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                    placeholder="Describe the image..."
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="display_order" className="text-base">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      min="0"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Lower numbers appear first</p>
                  </div>
                  <div>
                    <Label htmlFor="is_active" className="text-base">Status</Label>
                    <div className="flex items-center gap-3 mt-3">
                      <input
                        id="is_active"
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-300"
                      />
                      <Label htmlFor="is_active" className="font-normal cursor-pointer">
                        {formData.is_active ? 'Active (visible on homepage)' : 'Inactive (hidden)'}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button type="submit" size="lg" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingId ? 'Update Image' : 'Add Image'}
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Active Images Section */}
      {activeImages.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-600" />
            Active Images ({activeImages.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeImages
              .sort((a, b) => a.display_order - b.display_order)
              .map((image) => (
                <Card key={image.id} className="overflow-hidden hover:shadow-xl transition-shadow border-2">
                  <div className="aspect-video relative group">
                    <img
                      src={image.image_url}
                      alt={image.alt_text || 'Hero image'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(image)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => toggleActive(image)}
                      >
                        <EyeOff className="h-4 w-4 mr-1" />
                        Hide
                      </Button>
                    </div>
                    <div className="absolute top-2 left-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Order: {image.display_order}
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Alt Text:</p>
                      <p className="text-sm font-medium">{image.alt_text || 'No alt text'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleEdit(image)}
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this hero image?')) {
                            deleteMutation.mutate(image.id);
                          }
                        }}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Inactive Images Section */}
      {inactiveImages.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <EyeOff className="h-5 w-5 text-gray-400" />
            Inactive Images ({inactiveImages.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inactiveImages
              .sort((a, b) => a.display_order - b.display_order)
              .map((image) => (
                <Card key={image.id} className="overflow-hidden opacity-60 hover:opacity-100 transition-opacity">
                  <div className="aspect-video relative group">
                    <img
                      src={image.image_url}
                      alt={image.alt_text || 'Hero image'}
                      className="w-full h-full object-cover grayscale"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">Inactive</span>
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => toggleActive(image)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Activate
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Alt Text:</p>
                      <p className="text-sm font-medium">{image.alt_text || 'No alt text'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleEdit(image)}
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this hero image?')) {
                            deleteMutation.mutate(image.id);
                          }
                        }}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!heroImages || heroImages.length === 0 && (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto" />
            <h3 className="text-xl font-semibold">No hero images yet</h3>
            <p className="text-muted-foreground">
              Add your first hero image to display on the homepage carousel
            </p>
            <Button onClick={() => setIsAdding(true)} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Add First Hero Image
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
