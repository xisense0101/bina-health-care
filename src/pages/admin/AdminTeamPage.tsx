import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  getAllTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  uploadImage
} from '../../lib/supabaseQueries';

interface FormData {
  name: string;
  role: string;
  bio: string;
  email: string;
  phone: string;
  display_order: number;
  is_active: boolean;
}

export function AdminTeamPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    role: '',
    bio: '',
    email: '',
    phone: '',
    display_order: 0,
    is_active: true
  });

  const queryClient = useQueryClient();

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ['team-members-all'],
    queryFn: () => getAllTeamMembers()
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData & { image_url?: string }) => {
      return await createTeamMember(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members-all'] });
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast.success('Team member added successfully');
      resetForm();
    },
    onError: () => {
      toast.error('Failed to add team member');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FormData & { image_url?: string }> }) => {
      return await updateTeamMember(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members-all'] });
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast.success('Team member updated successfully');
      resetForm();
    },
    onError: () => {
      toast.error('Failed to update team member');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteTeamMember(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members-all'] });
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast.success('Team member deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete team member');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        if (!selectedFile) {
          toast.error('Please select a profile image');
          return;
        }
        await createMutation.mutateAsync({ ...formData, image_url: imageUrl });
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      bio: '',
      email: '',
      phone: '',
      display_order: 0,
      is_active: true
    });
    setSelectedFile(null);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (member: any) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      email: member.email || '',
      phone: member.phone || '',
      display_order: member.display_order,
      is_active: member.is_active
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
          <h1 className="text-3xl font-bold text-foreground">Team Members</h1>
          <p className="text-muted-foreground mt-1">
            Manage your staff profiles • {teamMembers?.length || 0} total members
          </p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Add Team Member
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name*</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Dr. Jane Smith"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role/Position*</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                    placeholder="Medical Director"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio/Description</Label>
                <textarea
                  id="bio"
                  className="w-full px-3 py-2 border border-input rounded-md"
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Brief professional background and experience..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@binaadultcare.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+977-XXXXXXXXXX"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image">Profile Photo {!editingId && '*'}</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  required={!editingId}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 800x800px square image
                </p>
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
                <div className="flex items-center gap-2 pt-8">
                  <input
                    id="is_active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="is_active">Active (visible on website)</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" size="lg" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingId ? 'Update' : 'Add'} Team Member
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers?.map((member) => (
          <Card key={member.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2">
            <div className="aspect-square relative group">
              <img
                src={member.image_url || 'https://via.placeholder.com/400'}
                alt={member.name}
                className="w-full h-full object-cover"
              />
              {!member.is_active && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">Inactive</span>
                </div>
              )}
            </div>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold truncate">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
              {member.email && (
                <p className="text-xs text-muted-foreground truncate">{member.email}</p>
              )}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(member)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${member.name}?`)) {
                      deleteMutation.mutate(member.id);
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

      {teamMembers?.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No team members found. Add your first team member to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
