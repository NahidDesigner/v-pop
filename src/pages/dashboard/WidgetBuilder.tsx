import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client, WidgetPosition, WidgetTrigger, WidgetStatus } from '@/types/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Play, Copy, Volume2, X } from 'lucide-react';

type VideoOrientation = 'vertical' | 'horizontal';

export default function WidgetBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    client_id: '',
    status: 'draft' as WidgetStatus,
    video_url: '',
    video_type: 'vimeo',
    video_orientation: 'vertical' as VideoOrientation,
    person_name: '',
    person_title: '',
    cta_text: 'Learn More',
    cta_url: '',
    cta_color: '#3B82F6',
    position: 'bottom-right' as WidgetPosition,
    trigger_type: 'time' as WidgetTrigger,
    trigger_value: 3,
    primary_color: '#3B82F6',
    background_color: '#FFFFFF',
    text_color: '#1F2937',
    border_radius: 16,
    animation: 'slide-up',
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: clientsData } = await supabase.from('clients').select('*').order('name');
      setClients(clientsData || []);

      if (id) {
        setLoading(true);
        const { data: widget } = await supabase.from('widgets').select('*').eq('id', id).maybeSingle();
        if (widget) {
          setFormData({
            name: widget.name,
            client_id: widget.client_id || '',
            status: widget.status,
            video_url: widget.video_url,
            video_type: widget.video_type,
            video_orientation: (widget as any).video_orientation || 'vertical',
            person_name: widget.person_name || '',
            person_title: widget.person_title || '',
            cta_text: widget.cta_text || 'Learn More',
            cta_url: widget.cta_url || '',
            cta_color: widget.cta_color || '#3B82F6',
            position: widget.position,
            trigger_type: widget.trigger_type,
            trigger_value: widget.trigger_value || 3,
            primary_color: widget.primary_color || '#3B82F6',
            background_color: widget.background_color || '#FFFFFF',
            text_color: widget.text_color || '#1F2937',
            border_radius: widget.border_radius || 16,
            animation: widget.animation || 'slide-up',
          });
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.video_url.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Name and video URL are required.' });
      return;
    }

    setSaving(true);
    const widgetData = {
      ...formData,
      client_id: formData.client_id || null,
    };

    if (id) {
      const { error } = await supabase.from('widgets').update(widgetData).eq('id', id);
      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to update widget.' });
      } else {
        toast({ title: 'Saved!', description: 'Widget has been updated.' });
      }
    } else {
      const { error } = await supabase.from('widgets').insert(widgetData);
      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to create widget.' });
      } else {
        toast({ title: 'Created!', description: 'Widget has been created.' });
        navigate('/dashboard/widgets');
      }
    }
    setSaving(false);
  };

  const copyEmbedCode = () => {
    if (!id) return;
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const code = `<script src="${supabaseUrl}/functions/v1/embed-script?id=${id}" async></script>`;
    navigator.clipboard.writeText(code);
    toast({ title: 'Copied!', description: 'Embed code copied to clipboard.' });
  };

  const isVertical = formData.video_orientation === 'vertical';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/widgets')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold">{id ? 'Edit Widget' : 'New Widget'}</h1>
        </div>
        <div className="flex gap-2">
          {id && (
            <Button variant="outline" onClick={copyEmbedCode}>
              <Copy className="w-4 h-4 mr-2" /> Copy Embed
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving} className="gradient-primary">
            <Save className="w-4 h-4 mr-2" /> Save
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="cta">CTA</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Widget Name *</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="My Video Widget" />
              </div>
              <div className="space-y-2">
                <Label>Client</Label>
                <Select value={formData.client_id || "none"} onValueChange={(v) => setFormData({ ...formData, client_id: v === "none" ? "" : v })}>
                  <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No client</SelectItem>
                    {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Video URL *</Label>
                <Input value={formData.video_url} onChange={(e) => setFormData({ ...formData, video_url: e.target.value })} placeholder="https://vimeo.com/..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Video Type</Label>
                  <Select value={formData.video_type} onValueChange={(v) => setFormData({ ...formData, video_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="vimeo">Vimeo</SelectItem>
                      <SelectItem value="bunny">Bunny CDN</SelectItem>
                      <SelectItem value="custom">Custom URL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Video Orientation</Label>
                  <Select value={formData.video_orientation} onValueChange={(v: VideoOrientation) => setFormData({ ...formData, video_orientation: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vertical">Vertical (9:16)</SelectItem>
                      <SelectItem value="horizontal">Horizontal (16:9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Person Name</Label>
                  <Input value={formData.person_name} onChange={(e) => setFormData({ ...formData, person_name: e.target.value })} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label>Person Title</Label>
                  <Input value={formData.person_title} onChange={(e) => setFormData({ ...formData, person_title: e.target.value })} placeholder="CEO" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cta" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input value={formData.cta_text} onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })} placeholder="Learn More" />
              </div>
              <div className="space-y-2">
                <Label>Button URL</Label>
                <Input value={formData.cta_url} onChange={(e) => setFormData({ ...formData, cta_url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Button Color</Label>
                <div className="flex gap-2">
                  <Input type="color" value={formData.cta_color} onChange={(e) => setFormData({ ...formData, cta_color: e.target.value })} className="w-12 h-10 p-1" />
                  <Input value={formData.cta_color} onChange={(e) => setFormData({ ...formData, cta_color: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Trigger</Label>
                <Select value={formData.trigger_type} onValueChange={(v: WidgetTrigger) => setFormData({ ...formData, trigger_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time">Time delay</SelectItem>
                    <SelectItem value="scroll">Scroll percentage</SelectItem>
                    <SelectItem value="exit_intent">Exit intent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.trigger_type !== 'exit_intent' && (
                <div className="space-y-2">
                  <Label>{formData.trigger_type === 'time' ? 'Delay (seconds)' : 'Scroll (%)'}</Label>
                  <Input type="number" value={formData.trigger_value} onChange={(e) => setFormData({ ...formData, trigger_value: parseInt(e.target.value) || 0 })} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="style" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Position</Label>
                <Select value={formData.position} onValueChange={(v: WidgetPosition) => setFormData({ ...formData, position: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input type="color" value={formData.background_color} onChange={(e) => setFormData({ ...formData, background_color: e.target.value })} className="w-12 h-10 p-1" />
                  <Input value={formData.background_color} onChange={(e) => setFormData({ ...formData, background_color: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Border Radius</Label>
                <Input type="number" value={formData.border_radius} onChange={(e) => setFormData({ ...formData, border_radius: parseInt(e.target.value) || 0 })} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-muted rounded-lg min-h-[400px] flex items-end justify-end p-4">
              {isVertical ? (
                // Vertical widget preview (like the reference image)
                <div 
                  className="w-64 shadow-xl animate-slide-up overflow-hidden relative"
                  style={{ 
                    borderRadius: `${formData.border_radius}px`,
                  }}
                >
                  {/* Video area with overlay */}
                  <div className="relative aspect-[9/16] bg-foreground/20 flex items-center justify-center">
                    <Play className="w-16 h-16 text-foreground/40" />
                    
                    {/* Control buttons */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button className="w-8 h-8 rounded-full bg-foreground/30 backdrop-blur-sm flex items-center justify-center text-white">
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Bottom overlay with info */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
                    >
                      <div 
                        className="rounded-xl p-4"
                        style={{ backgroundColor: formData.background_color, color: formData.text_color }}
                      >
                        {formData.person_name && (
                          <div className="text-center mb-3">
                            <p className="font-semibold text-base">{formData.person_name}</p>
                            {formData.person_title && <p className="text-sm opacity-70">{formData.person_title}</p>}
                          </div>
                        )}
                        {formData.cta_text && (
                          <button 
                            className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white"
                            style={{ backgroundColor: formData.cta_color }}
                          >
                            {formData.cta_text}
                          </button>
                        )}
                        <p className="text-xs text-center mt-2 opacity-50">Powered by VideoPopup</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Horizontal widget preview
                <div 
                  className="w-80 shadow-xl animate-slide-up"
                  style={{ 
                    backgroundColor: formData.background_color, 
                    borderRadius: `${formData.border_radius}px`,
                    color: formData.text_color 
                  }}
                >
                  <div className="relative">
                    <div className="aspect-video bg-foreground/10 rounded-t-lg flex items-center justify-center">
                      <Play className="w-12 h-12 text-foreground/30" />
                    </div>
                    {/* Control buttons */}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button className="w-7 h-7 rounded-full bg-black/50 flex items-center justify-center text-white">
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-7 h-7 rounded-full bg-black/50 flex items-center justify-center text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    {formData.person_name && (
                      <div>
                        <p className="font-semibold">{formData.person_name}</p>
                        {formData.person_title && <p className="text-sm opacity-70">{formData.person_title}</p>}
                      </div>
                    )}
                    {formData.cta_text && (
                      <button 
                        className="w-full py-2 px-4 rounded-lg text-sm font-medium text-white"
                        style={{ backgroundColor: formData.cta_color }}
                      >
                        {formData.cta_text}
                      </button>
                    )}
                    <p className="text-xs text-center opacity-50">Powered by VideoPopup</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
