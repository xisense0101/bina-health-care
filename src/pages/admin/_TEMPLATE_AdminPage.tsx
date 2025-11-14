// TEMPLATE ADMIN PAGE - Copy this for creating other admin pages
// Replace ENTITY_NAME with your entity (e.g., TeamMember, Location, Service)
// Update imports, types, and form fields accordingly

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  // Import your specific query functions here
  // getAllTeamMembers,
  // createTeamMember,
  // updateTeamMember,
  // deleteTeamMember,
  // uploadImage
} from '../../lib/supabaseQueries';

// Define your form data interface
interface FormData {
  // Add your fields here
  // name: string;
  // email: string;
  // etc...
}

export function AdminTemplatePageexport() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Initialize form data with your fields
  const [formData, setFormData] = useState<FormData>({
    // Initialize your fields with default values
  });

  const queryClient = useQueryClient();

  // Fetch data
  const { data: items, isLoading } = useQuery({
    queryKey: ['your-entity-key'], // e.g., ['team-members']
    queryFn: () => {
      // Call your fetch function
      // return getAllTeamMembers();
      return Promise.resolve([]);
    }
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      // Call your create function
      // return await createTeamMember(data);
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['your-entity-key'] });
      toast.success('Item added successfully');
      resetForm();
    },
    onError: () => {
      toast.error('Failed to add item');
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FormData> }) => {
      // Call your update function
      // return await updateTeamMember(id, data);
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['your-entity-key'] });
      toast.success('Item updated successfully');
      resetForm();
    },
    onError: () => {
      toast.error('Failed to update item');
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Call your delete function
      // return await deleteTeamMember(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['your-entity-key'] });
      toast.success('Item deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete item');
    }
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Handle image upload if needed
      // let imageUrl = '';
      // if (selectedFile) {
      //   imageUrl = await uploadImage(selectedFile) || '';
      // }

      if (editingId) {
        await updateMutation.mutateAsync({ 
          id: editingId, 
          data: formData // Add image_url if needed: { ...formData, image_url: imageUrl }
        });
      } else {
        await createMutation.mutateAsync(formData); // Add image_url if needed
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      // Reset to default values
    });
    setSelectedFile(null);
    setIsAdding(false);
    setEditingId(null);
  };

  // Handle edit
  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      // Map item properties to form data
      // name: item.name,
      // email: item.email,
    });
    setIsAdding(true);
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Your Entity Name</h1>
          <p className="text-muted-foreground mt-1">Manage your items</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        )}
      </div>

      {/* Form Card */}
      {isAdding && (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Add your form fields here */}
              {/* Example:
              <div>
                <Label htmlFor="name">Name*</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              */}

              {/* Image upload (if needed) */}
              {/* <div>
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div> */}

              {/* Form Actions */}
              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? 'Update' : 'Add'} Item
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Items Grid/List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items?.map((item: any) => (
          <Card key={item.id}>
            <CardContent className="p-4 space-y-2">
              {/* Display item data here */}
              {/* Example:
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-muted-foreground">{item.email}</p>
              */}
              
              {/* Action buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(item)}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this item?')) {
                      deleteMutation.mutate(item.id);
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

      {/* Empty State */}
      {items?.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No items found. Add your first item to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
