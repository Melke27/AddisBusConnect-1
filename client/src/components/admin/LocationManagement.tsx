import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin, Plus, Search, Trash2, Edit } from 'lucide-react';

interface Stop {
  _id: string;
  nameEn: string;
  nameAm: string;
  nameOm: string;
  latitude: number;
  longitude: number;
}

interface LocationFormData {
  nameEn: string;
  nameAm: string;
  nameOm: string;
  latitude: number;
  longitude: number;
}

export function LocationManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Stop | null>(null);
  const [formData, setFormData] = useState<LocationFormData>({
    nameEn: '',
    nameAm: '',
    nameOm: '',
    latitude: 0,
    longitude: 0,
  });

  // Fetch locations
  const { data: locations = [], isLoading } = useQuery<Stop[]>({
    queryKey: ['/api/stops'],
  });

  // Filter locations based on search term
  const filteredLocations = locations.filter(location => 
    location.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.nameAm.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.nameOm.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Create location mutation
  const createLocation = useMutation({
    mutationFn: async (data: LocationFormData) => {
      const response = await fetch('/api/stops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create location');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stops'] });
      toast({ title: 'Location created successfully' });
      resetForm();
    },
    onError: () => {
      toast({ title: 'Failed to create location', variant: 'destructive' });
    },
  });

  // Delete location mutation
  const deleteLocation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/stops/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete location');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stops'] });
      toast({ title: 'Location deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete location', variant: 'destructive' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLocation.mutate(formData);
  };

  const handleEdit = (location: Stop) => {
    setEditingLocation(location);
    setFormData({
      nameEn: location.nameEn,
      nameAm: location.nameAm,
      nameOm: location.nameOm,
      latitude: location.latitude,
      longitude: location.longitude,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      nameEn: '',
      nameAm: '',
      nameOm: '',
      latitude: 0,
      longitude: 0,
    });
    setEditingLocation(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search locations..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Location
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>English Name</TableHead>
              <TableHead>Amharic Name</TableHead>
              <TableHead>Oromiffa Name</TableHead>
              <TableHead>Coordinates</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading locations...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredLocations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No locations found
                </TableCell>
              </TableRow>
            ) : (
              filteredLocations.map((location) => (
                <TableRow key={location._id}>
                  <TableCell>{location.nameEn}</TableCell>
                  <TableCell>{location.nameAm}</TableCell>
                  <TableCell>{location.nameOm}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(location)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteLocation.mutate(location._id)}
                        disabled={deleteLocation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLocation ? 'Edit Location' : 'Add New Location'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nameEn">English Name</Label>
                <Input
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({...formData, nameEn: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameAm">Amharic Name</Label>
                <Input
                  id="nameAm"
                  value={formData.nameAm}
                  onChange={(e) => setFormData({...formData, nameAm: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameOm">Oromiffa Name</Label>
                <Input
                  id="nameOm"
                  value={formData.nameOm}
                  onChange={(e) => setFormData({...formData, nameOm: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={(e) => setFormData({...formData, latitude: parseFloat(e.target.value)})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={(e) => setFormData({...formData, longitude: parseFloat(e.target.value)})}
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={createLocation.isPending}>
                {createLocation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {editingLocation ? 'Update' : 'Create'} Location
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
