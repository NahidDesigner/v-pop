import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Plus, Quote, Trash2, Pencil, Star, GripVertical } from 'lucide-react';
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Testimonial {
  id: string;
  name: string;
  title: string | null;
  company: string | null;
  avatar_url: string | null;
  quote: string;
  rating: number | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

function SortableTestimonialCard({ 
  testimonial, 
  onEdit, 
  onDelete, 
  onToggle 
}: { 
  testimonial: Testimonial; 
  onEdit: (t: Testimonial) => void;
  onDelete: (t: Testimonial) => void;
  onToggle: (t: Testimonial) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: testimonial.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style}
      className={`group ${!testimonial.is_active ? 'opacity-50' : ''}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <button
            {...attributes}
            {...listeners}
            className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          >
            <GripVertical className="w-5 h-5" />
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {testimonial.avatar_url ? (
                  <img 
                    src={testimonial.avatar_url} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Quote className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-foreground">{testimonial.name}</h3>
                  {(testimonial.title || testimonial.company) && (
                    <p className="text-sm text-muted-foreground">
                      {testimonial.title}{testimonial.title && testimonial.company && ' at '}{testimonial.company}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={testimonial.is_active}
                  onCheckedChange={() => onToggle(testimonial)}
                />
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(testimonial)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(testimonial)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <p className="mt-3 text-muted-foreground italic">"{testimonial.quote}"</p>
            
            {testimonial.rating && (
              <div className="mt-2 flex gap-0.5">
                {Array(5).fill(0).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < testimonial.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    avatar_url: '',
    quote: '',
    rating: 5,
    is_active: true,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching testimonials:', error);
    } else {
      setTestimonials(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = testimonials.findIndex((t) => t.id === active.id);
      const newIndex = testimonials.findIndex((t) => t.id === over.id);

      const newOrder = arrayMove(testimonials, oldIndex, newIndex);
      setTestimonials(newOrder);

      // Update display_order in database
      const updates = newOrder.map((t, index) => ({
        id: t.id,
        display_order: index,
      }));

      for (const update of updates) {
        await supabase
          .from('testimonials')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const testimonialData = {
      name: formData.name,
      title: formData.title || null,
      company: formData.company || null,
      avatar_url: formData.avatar_url || null,
      quote: formData.quote,
      rating: formData.rating,
      is_active: formData.is_active,
    };

    if (editingTestimonial) {
      const { error } = await supabase
        .from('testimonials')
        .update(testimonialData)
        .eq('id', editingTestimonial.id);

      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to update testimonial.' });
      } else {
        toast({ title: 'Updated!', description: 'Testimonial updated successfully.' });
        setDialogOpen(false);
        fetchTestimonials();
      }
    } else {
      const maxOrder = testimonials.length > 0 ? Math.max(...testimonials.map(t => t.display_order)) : -1;
      
      const { error } = await supabase
        .from('testimonials')
        .insert({
          ...testimonialData,
          display_order: maxOrder + 1,
        });

      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to add testimonial.' });
      } else {
        toast({ title: 'Added!', description: 'Testimonial added successfully.' });
        setDialogOpen(false);
        fetchTestimonials();
      }
    }

    setSaving(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      company: '',
      avatar_url: '',
      quote: '',
      rating: 5,
      is_active: true,
    });
    setEditingTestimonial(null);
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      title: testimonial.title || '',
      company: testimonial.company || '',
      avatar_url: testimonial.avatar_url || '',
      quote: testimonial.quote,
      rating: testimonial.rating || 5,
      is_active: testimonial.is_active,
    });
    setDialogOpen(true);
  };

  const deleteTestimonial = async () => {
    if (!testimonialToDelete) return;

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', testimonialToDelete.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete testimonial.' });
    } else {
      toast({ title: 'Deleted!', description: 'Testimonial has been deleted.' });
      fetchTestimonials();
    }
    setDeleteDialogOpen(false);
    setTestimonialToDelete(null);
  };

  const toggleActive = async (testimonial: Testimonial) => {
    const { error } = await supabase
      .from('testimonials')
      .update({ is_active: !testimonial.is_active })
      .eq('id', testimonial.id);

    if (!error) {
      fetchTestimonials();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Testimonials</h1>
          <p className="text-muted-foreground mt-1">Manage customer testimonials</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
              <DialogDescription>
                {editingTestimonial ? 'Update testimonial details.' : 'Add a new customer testimonial.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    min={1}
                    max={5}
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="CEO"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Acme Inc"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Input
                  id="avatar_url"
                  type="url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quote">Quote *</Label>
                <Textarea
                  id="quote"
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="This product changed everything..."
                  rows={3}
                  required
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
                <Button type="submit" disabled={saving} className="gradient-primary">
                  {saving ? 'Saving...' : editingTestimonial ? 'Update' : 'Add Testimonial'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Quote className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-display font-semibold mb-2">No testimonials yet</h3>
            <p className="text-muted-foreground mb-4">Add customer testimonials to display on the homepage.</p>
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={testimonials.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <SortableTestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  onEdit={openEditDialog}
                  onDelete={(t) => { setTestimonialToDelete(t); setDeleteDialogOpen(true); }}
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
            <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this testimonial from {testimonialToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteTestimonial} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}