import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  getAllGalleryImages, 
  createGalleryImage, 
  updateGalleryImage, 
  deleteGalleryImage,
  uploadImage 
} from '../../lib/supabaseQueries';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

export function AdminGalleryPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    alt_text: '',
    category: 'Facility',
    description: '',
    display_order: 0,
    is_active: true
  });

  const queryClient = useQueryClient();

  const { data: images, isLoading } = useQuery({
    queryKey: ['gallery-images-all'],
    queryFn: () => getAllGalleryImages()
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData & { image_url: string }) => {
      return await createGalleryImage(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images-all'] });
      toast.success('Image added successfully');
      resetForm();
    },
    onError: () => {
      toast.error('Failed to add image');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData & { image_url?: string }> }) => {
      return await updateGalleryImage(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images-all'] });
      toast.success('Image updated successfully');
      resetForm();
    },
    onError: () => {
      toast.error('Failed to update image');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteGalleryImage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images-all'] });
      toast.success('Image deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete image');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile && !editingId) {
      toast.error('Please select an image');
      return;
    }

    try {
      let imageUrl = '';
      
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile) || '';
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
      title: '',
      alt_text: '',
      category: 'Facility',
      description: '',
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
      title: image.title,
      alt_text: image.alt_text || '',
      category: image.category || 'Facility',
      description: image.description || '',
      display_order: image.display_order,
      is_active: image.is_active
    });
    setIsAdding(true);
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gallery Images</h1>
          <p className="text-muted-foreground mt-1">
            Manage your gallery photos • {images?.length || 0} total images
          </p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Add Image
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title*</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full px-3 py-2 border border-input rounded-md"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Facility">Facility</option>
                    <option value="Residents">Residents</option>
                    <option value="Activities">Activities</option>
                    <option value="Care">Care</option>
                    <option value="Medical">Medical</option>
                    <option value="Home Care">Home Care</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="alt_text">Alt Text</Label>
                <Input
                  id="alt_text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full px-3 py-2 border border-input rounded-md"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="image">Image {!editingId && '*'}</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  required={!editingId}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="is_active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" size="lg">
                  {editingId ? 'Update' : 'Add'} Image
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images?.map((image) => (
          <Card key={image.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2">
            <div className="aspect-square relative group">
              <img
                src={image.image_url}
                alt={image.alt_text || image.title}
                className="w-full h-full object-cover"
              />
              {!image.is_active && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">Inactive</span>
                </div>
              )}
              <div className="absolute top-2 left-2 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                {image.category}
              </div>
            </div>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold truncate">{image.title}</h3>
              <p className="text-xs text-muted-foreground">{image.category}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(image)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this image?')) {
                      deleteMutation.mutate(image.id);
                    }
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
