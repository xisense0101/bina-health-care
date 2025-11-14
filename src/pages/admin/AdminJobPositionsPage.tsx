import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  getAllJobPositions, 
  createJobPosition, 
  updateJobPosition, 
  deleteJobPosition
} from '../../lib/supabaseQueries';
import { Pencil, Trash2, Plus, Briefcase, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export function AdminJobPositionsPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    display_order: 0,
    is_active: true
  });

  const queryClient = useQueryClient();

  const { data: positions, isLoading } = useQuery({
    queryKey: ['job-positions-all'],
    queryFn: () => getAllJobPositions()
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await createJobPosition(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-positions-all'] });
      queryClient.invalidateQueries({ queryKey: ['job-positions'] });
      toast.success('Job position added successfully');
      resetForm();
    },
    onError: () => {
      toast.error('Failed to add job position');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      return await updateJobPosition(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-positions-all'] });
      queryClient.invalidateQueries({ queryKey: ['job-positions'] });
      toast.success('Job position updated successfully');
      resetForm();
    },
    onError: () => {
      toast.error('Failed to update job position');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteJobPosition(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-positions-all'] });
      queryClient.invalidateQueries({ queryKey: ['job-positions'] });
      toast.success('Job position deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete job position');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      display_order: 0,
      is_active: true
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (position: any) => {
    setEditingId(position.id);
    setFormData({
      title: position.title,
      slug: position.slug,
      display_order: position.display_order || 0,
      is_active: position.is_active
    });
    setIsAdding(true);
  };

  const toggleActive = async (position: any) => {
    await updateMutation.mutateAsync({
      id: position.id,
      data: { is_active: !position.is_active }
    });
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const activePositions = positions?.filter(p => p.is_active) || [];
  const inactivePositions = positions?.filter(p => !p.is_active) || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Positions</h1>
          <p className="text-muted-foreground mt-2">
            Manage job openings displayed on the careers page
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="h-4 w-4 mr-2" />
          Add Position
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Position' : 'Add New Position'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Position Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g., Registered Nurse (RN)"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (auto-generated)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="registered-nurse"
                  />
                  <p className="text-xs text-muted-foreground">
                    Used as the value in the application form dropdown
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                  <p className="text-xs text-muted-foreground">Lower numbers appear first</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="is_active">Status</Label>
                  <select
                    id="is_active"
                    value={formData.is_active ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingId ? 'Update Position' : 'Add Position'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {activePositions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-600" />
            Active Positions ({activePositions.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePositions.map((position) => (
              <Card key={position.id} className="hover:shadow-xl transition-all duration-300 border-2">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        {position.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Slug: {position.slug}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Order: {position.display_order}
                      </p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEdit(position)}
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActive(position)}
                    >
                      <EyeOff className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this position?')) {
                          deleteMutation.mutate(position.id);
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
      )}

      {inactivePositions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <EyeOff className="h-5 w-5 text-gray-600" />
            Inactive Positions ({inactivePositions.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inactivePositions.map((position) => (
              <Card key={position.id} className="opacity-60 hover:opacity-100 transition-opacity">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">
                        {position.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Slug: {position.slug}
                      </p>
                    </div>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">Inactive</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => toggleActive(position)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Activate
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this position?')) {
                          deleteMutation.mutate(position.id);
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
      )}

      {(!positions || positions.length === 0) && (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No job positions yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first job position to get started
            </p>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Position
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
