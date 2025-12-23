import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Plus, Image, Trash2, GripVertical, ExternalLink, Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Sample {
  id: string;
  title: string;
  image_url: string;
  website_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

function SortableSampleCard({ 
  sample, 
  onEdit, 
  onDelete, 
  onToggle 
}: { 
  sample: Sample; 
  onEdit: (s: Sample) => void;
  onDelete: (s: Sample) => void;
  onToggle: (s: Sample) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sample.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style}
      className={`group overflow-hidden ${!sample.is_active ? 'opacity-50' : ''}`}
    >
      <div className="relative">
        <button
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 z-10 p-1.5 rounded-md bg-background/80 backdrop-blur-sm cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <img 
          src={sample.image_url} 
          alt={sample.title} 
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => onEdit(sample)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button 
            variant="destructive" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onDelete(sample)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground">{sample.title}</h3>
            {sample.website_url && (
              <a 
                href={sample.website_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                View Site
              </a>
            )}
          </div>
          <Switch
            checked={sample.is_active}
            onCheckedChange={() => onToggle(sample)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Samples() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSample, setEditingSample] = useState<Sample | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sampleToDelete, setSampleToDelete] = useState<Sample | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    website_url: '',
    is_active: true,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchSamples = async () => {
    const { data, error } = await supabase
      .from('showcase_samples')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching samples:', error);
    } else {
      setSamples(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSamples();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = samples.findIndex((s) => s.id === active.id);
      const newIndex = samples.findIndex((s) => s.id === over.id);

      const newOrder = arrayMove(samples, oldIndex, newIndex);
      setSamples(newOrder);

      // Update display_order in database
      const updates = newOrder.map((s, index) => ({
        id: s.id,
        display_order: index,
      }));

      for (const update of updates) {
        await supabase
          .from('showcase_samples')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }

      toast({ title: 'Order updated!' });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('samples')
      .upload(fileName, file);

    if (uploadError) {
      toast({ variant: 'destructive', title: 'Upload failed', description: uploadError.message });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('samples')
      .getPublicUrl(fileName);

    setFormData({ ...formData, image_url: publicUrl });
    setUploading(false);
    toast({ title: 'Image uploaded!' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please upload an image.' });
      return;
    }

    setSaving(true);

    if (editingSample) {
      const { error } = await supabase
        .from('showcase_samples')
        .update({
          title: formData.title,
          image_url: formData.image_url,
          website_url: formData.website_url || null,
          is_active: formData.is_active,
        })
        .eq('id', editingSample.id);

      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to update sample.' });
      } else {
        toast({ title: 'Updated!', description: 'Sample updated successfully.' });
        setDialogOpen(false);
        fetchSamples();
      }
    } else {
      const maxOrder = samples.length > 0 ? Math.max(...samples.map(s => s.display_order)) : -1;
      
      const { error } = await supabase
        .from('showcase_samples')
        .insert({
          title: formData.title,
          image_url: formData.image_url,
          website_url: formData.website_url || null,
          display_order: maxOrder + 1,
          is_active: formData.is_active,
        });

      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to add sample.' });
      } else {
        toast({ title: 'Added!', description: 'Sample added successfully.' });
        setDialogOpen(false);
        fetchSamples();
      }
    }

    setSaving(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      image_url: '',
      website_url: '',
      is_active: true,
    });
    setEditingSample(null);
  };

  const openEditDialog = (sample: Sample) => {
    setEditingSample(sample);
    setFormData({
      title: sample.title,
      image_url: sample.image_url,
      website_url: sample.website_url || '',
      is_active: sample.is_active,
    });
    setDialogOpen(true);
  };

  const deleteSample = async () => {
    if (!sampleToDelete) return;

    const { error } = await supabase
      .from('showcase_samples')
      .delete()
      .eq('id', sampleToDelete.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete sample.' });
    } else {
      toast({ title: 'Deleted!', description: 'Sample has been deleted.' });
      fetchSamples();
    }
    setDeleteDialogOpen(false);
    setSampleToDelete(null);
  };

  const toggleActive = async (sample: Sample) => {
    const { error } = await supabase
      .from('showcase_samples')
      .update({ is_active: !sample.is_active })
      .eq('id', sample.id);

    if (!error) {
      fetchSamples();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Showcase Samples</h1>
          <p className="text-muted-foreground mt-1">Manage homepage carousel images (drag to reorder)</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Sample
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">{editingSample ? 'Edit Sample' : 'Add Sample'}</DialogTitle>
              <DialogDescription>
                {editingSample ? 'Update sample details.' : 'Add a new showcase sample to the homepage carousel.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Sample Website"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image *</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {formData.image_url && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-border">
                    <img src={formData.image_url} alt="Preview" className="w-full h-32 object-cover" />
                  </div>
                )}
                {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="website_url">Website URL (optional)</Label>
                <Input
                  id="website_url"
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Active</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={saving || uploading} className="gradient-primary">
                  {saving ? 'Saving...' : editingSample ? 'Update Sample' : 'Add Sample'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : samples.length === 0 ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Image className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-display font-semibold mb-2">No samples yet</h3>
            <p className="text-muted-foreground mb-4">Add showcase samples to display on the homepage carousel.</p>
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={samples.map(s => s.id)} strategy={rectSortingStrategy}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {samples.map((sample) => (
                <SortableSampleCard
                  key={sample.id}
                  sample={sample}
                  onEdit={openEditDialog}
                  onDelete={(s) => { setSampleToDelete(s); setDeleteDialogOpen(true); }}
                  onToggle={toggleActive}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sample</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{sampleToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteSample} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}