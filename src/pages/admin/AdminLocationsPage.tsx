import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  getAllLocations, 
  createLocation, 
  updateLocation, 
  deleteLocation
} from '../../lib/supabaseQueries';
import { Pencil, Trash2, Plus, MapPin, Phone, Mail, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export function AdminLocationsPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    country: 'USA',
    latitude: '',
    longitude: '',
    phone: '',
    email: '',
    display_order: 0,
    is_primary: false,
    is_active: true
  });

  const queryClient = useQueryClient();

  const { data: locations, isLoading } = useQuery({
    queryKey: ['locations-all'],
    queryFn: () => getAllLocations()
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await createLocation({
        ...data,
        latitude: parseFloat(data.latitude) || 0,
        longitude: parseFloat(data.longitude) || 0,
        display_order: data.display_order || 0
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations-all'] });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Location added successfully');
      resetForm();
    },
    onError: () => {
      toast.error('Failed to add location');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      return await updateLocation(id, {
        ...data,
        latitude: data.latitude ? parseFloat(data.latitude) : undefined,
        longitude: data.longitude ? parseFloat(data.longitude) : undefined
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations-all'] });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Location updated successfully');
      resetForm();
    },
    onError: () => {
      toast.error('Failed to update location');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteLocation(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations-all'] });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Location deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete location');
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
      name: '',
      address: '',
      city: '',
      country: 'USA',
      latitude: '',
      longitude: '',
      phone: '',
      email: '',
      display_order: 0,
      is_primary: false,
      is_active: true
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (location: any) => {
    setEditingId(location.id);
    setFormData({
      name: location.name,
      address: location.address || '',
      city: location.city || '',
      country: location.country || 'USA',
      latitude: location.latitude?.toString() || '',
      longitude: location.longitude?.toString() || '',
      phone: location.phone || '',
      email: location.email || '',
      display_order: location.display_order || 0,
      is_primary: location.is_primary || false,
      is_active: location.is_active
    });
    setIsAdding(true);
  };

  const toggleActive = async (location: any) => {
    await updateMutation.mutateAsync({
      id: location.id,
      data: { is_active: !location.is_active }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const activeLocations = locations?.filter(loc => loc.is_active) || [];
  const inactiveLocations = locations?.filter(loc => !loc.is_active) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Locations</h1>
          <p className="text-muted-foreground mt-1">
            Manage business locations • {activeLocations.length} active, {inactiveLocations.length} inactive
          </p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Add Location
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {editingId ? 'Edit Location' : 'Add New Location'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-base">
                    Location Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Main Office, Branch 1, etc."
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="city" className="text-base">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Kathmandu"
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-base">Address</Label>
                <textarea
                  id="address"
                  className="w-full px-3 py-2 border border-input rounded-md mt-2"
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address, building number, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-base">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+977-XXX-XXXX"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-base">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="location@example.com"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude" className="text-base">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="27.7172"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude" className="text-base">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="85.3240"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <input
                    id="is_primary"
                    type="checkbox"
                    checked={formData.is_primary}
                    onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <Label htmlFor="is_primary" className="font-normal cursor-pointer">
                    Primary Location
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="is_active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <Label htmlFor="is_active" className="font-normal cursor-pointer">
                    Active (visible on website)
                  </Label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button type="submit" size="lg" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingId ? 'Update Location' : 'Add Location'}
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Active Locations */}
      {activeLocations.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-600" />
            Active Locations ({activeLocations.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeLocations.map((location) => (
              <Card key={location.id} className="hover:shadow-xl transition-all duration-300 border-2">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        {location.name}
                        {location.is_primary && (
                          <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">Primary</span>
                        )}
                      </h3>
                      {location.city && (
                        <p className="text-sm text-muted-foreground">{location.city}</p>
                      )}
                    </div>
                  </div>

                  {location.address && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{location.address || '5667 San Pablo Dam Rd, El Sobrante, CA 94803, USA'}</span>
                    </div>
                  )}

                  {location.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-gray-600">{location.phone}</span>
                    </div>
                  )}

                  {location.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-gray-600">{location.email}</span>
                    </div>
                  )}

                  {location.latitude && location.longitude && (
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      Coordinates: {location.latitude}, {location.longitude}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEdit(location)}
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActive(location)}
                    >
                      <EyeOff className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this location?')) {
                          deleteMutation.mutate(location.id);
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

      {/* Inactive Locations */}
      {inactiveLocations.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <EyeOff className="h-5 w-5 text-gray-400" />
            Inactive Locations ({inactiveLocations.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inactiveLocations.map((location) => (
              <Card key={location.id} className="opacity-60 hover:opacity-100 transition-opacity">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{location.name}</h3>
                      {location.city && (
                        <p className="text-sm text-muted-foreground">{location.city}</p>
                      )}
                    </div>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">Inactive</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => toggleActive(location)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Activate
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this location?')) {
                          deleteMutation.mutate(location.id);
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

      {/* Empty State */}
      {!locations || locations.length === 0 && (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <MapPin className="h-16 w-16 text-muted-foreground mx-auto" />
            <h3 className="text-xl font-semibold">No locations yet</h3>
            <p className="text-muted-foreground">
              Add your first business location with address and contact details
            </p>
            <Button onClick={() => setIsAdding(true)} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Add First Location
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
