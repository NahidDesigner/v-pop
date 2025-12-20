import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Play, 
  CheckCircle, 
  Zap, 
  Users, 
  ArrowRight, 
  TrendingUp,
  MousePointer,
  Clock,
  Palette,
  BarChart3,
  Globe,
  Video,
  ChevronDown,
  Sparkles,
  Target,
  MessageSquare,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import ShowcaseCarousel from "@/components/ShowcaseCarousel";
import TestimonialsSection from "@/components/TestimonialsSection";

interface SiteSettings {
  hero_title: string;
  hero_subtitle: string;
  pricing_enabled: boolean;
  price_amount: number;
  price_currency: string;
  demo_video_url: string | null;
  logo_url: string | null;
  branding_text: string;
}

const stats = [
  { value: "3x", label: "Higher Engagement" },
  { value: "47%", label: "More Conversions" },
  { value: "2min", label: "Setup Time" },
  { value: "24/7", label: "Always Working" },
];

const benefits = [
  {
    icon: TrendingUp,
    title: "Boost Conversions",
    description: "Video popups convert 3x better than static content. Grab attention and turn visitors into customers."
  },
  {
    icon: Target,
    title: "Smart Triggers",
    description: "Show at the perfect moment - on page load, after scrolling, or when visitors try to leave."
  },
  {
    icon: Palette,
    title: "Fully Customizable",
    description: "Match your brand with custom colors, positioning, and call-to-action buttons."
  },
  {
    icon: BarChart3,
    title: "Analytics Built-in",
    description: "Track views, engagement, and clicks. Know exactly how your videos perform."
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description: "One line of code. Works on any website - WordPress, Shopify, Webflow, or custom sites."
  },
  {
    icon: Video,
    title: "Any Video Source",
    description: "YouTube, Vimeo, or direct uploads. Use the videos you already have."
  }
];

const useCases = [
  {
    title: "Welcome Messages",
    description: "Greet visitors with a personal video introduction that builds instant trust.",
    icon: MessageSquare
  },
  {
    title: "Product Demos",
    description: "Show your product in action right when visitors are most interested.",
    icon: Play
  },
  {
    title: "Exit Intent Offers",
    description: "Capture leaving visitors with a compelling video offer they can't ignore.",
    icon: MousePointer
  },
  {
    title: "Limited Time Promotions",
    description: "Create urgency with video announcements for sales and special offers.",
    icon: Clock
  }
];

const faqs = [
  {
    question: "How long does setup take?",
    answer: "Less than 2 minutes! Simply paste one line of code on your website and your video popup is live."
  },
  {
    question: "Will it slow down my website?",
    answer: "No! Our embed script is lightweight and loads asynchronously, so it won't affect your page speed."
  },
  {
    question: "Can I use my own videos?",
    answer: "Absolutely! We support YouTube, Vimeo, and direct video uploads. Use whatever works best for you."
  },
  {
    question: "Does it work on mobile?",
    answer: "Yes! Video popups are fully responsive and look great on all devices."
  }
];

export default function Home() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    company: "",
    message: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    // Use public view that only exposes non-sensitive fields
    const { data, error } = await supabase
      .from("public_site_settings")
      .select("*")
      .limit(1)
      .single();

    if (!error && data) {
      setSettings(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const leadData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      website: formData.website || null,
      company: formData.company || null,
      message: formData.message || null,
    };

    const { error } = await supabase.from("leads").insert(leadData);

    if (error) {
      toast.error("Failed to submit. Please try again.");
    } else {
      toast.success("Thank you! We'll be in touch soon.");
      setFormData({ name: "", email: "", phone: "", website: "", company: "", message: "" });
      
      // Try to send email notification (non-blocking)
      supabase.functions.invoke('send-lead-notification', {
        body: leadData
      }).catch(err => console.log("Email notification skipped:", err));
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {settings?.logo_url ? (
              <img 
                src={settings.logo_url} 
                alt="Logo" 
                className="h-10 max-w-[200px] object-contain"
              />
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                  <Play className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
                </div>
                <span className="text-xl font-display font-bold">VideoPopup</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Pricing
            </a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Contact
            </a>
            <Link to="/auth">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 gradient-hero overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-primary/20 mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-accent-foreground">The #1 Video Popup Solution</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight animate-slide-up">
              {settings?.hero_title || "Turn Visitors Into"}{" "}
              <span className="gradient-text">Customers</span>
              {" "}With Video
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {settings?.hero_subtitle || "Capture attention instantly with beautiful video popups that engage visitors and boost your conversions by up to 47%."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Button size="lg" className="gap-2 shadow-glow text-base px-8" asChild>
                <a href="#contact">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 text-base px-8" asChild>
                <a href="#demo">
                  <Play className="h-4 w-4" /> See Demo
                </a>
              </Button>
            </div>

            {/* Mobile Widget Demo - shown on small screens */}
            <div id="demo" className="md:hidden relative max-w-xs mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="bg-card rounded-2xl shadow-2xl overflow-hidden border-2 border-primary/20 animate-float">
                <div className="aspect-[9/16] bg-gradient-to-br from-primary/30 to-accent/50 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center animate-pulse-soft">
                      <Play className="h-8 w-8 text-primary fill-primary" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-foreground/20 backdrop-blur-sm flex items-center justify-center">
                    <X className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="p-4 bg-card">
                  <div className="text-center mb-3">
                    <div className="font-semibold">Sarah Johnson</div>
                    <div className="text-sm text-muted-foreground">Founder & CEO</div>
                  </div>
                  <div className="bg-primary text-primary-foreground rounded-lg py-3 text-center font-semibold">
                    Book a Demo
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                This is how your popup appears on websites
              </p>
            </div>

            {/* Laptop Mockup with Widget Demo - hidden on mobile */}
            <div className="hidden md:block relative max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
              {/* Laptop Frame */}
              <div className="relative">
                {/* Screen bezel */}
                <div className="bg-[#1a1a1a] rounded-t-xl p-2 pt-3">
                  {/* Camera notch */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#2a2a2a]" />
                  
                  {/* Browser chrome */}
                  <div className="bg-[#2a2a2a] rounded-t-lg overflow-hidden">
                    {/* Browser toolbar */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#333]">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="bg-[#1a1a1a] rounded-md px-3 py-1 text-xs text-gray-400 flex items-center gap-2">
                          <Globe className="w-3 h-3" />
                          <span>www.your-client-website.com</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Website content */}
                    <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
                      {/* Fake website content */}
                      <div className="absolute inset-0 p-6">
                        {/* Navbar */}
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500" />
                            <div className="w-20 h-3 rounded bg-slate-300" />
                          </div>
                          <div className="flex gap-4">
                            <div className="w-12 h-2 rounded bg-slate-300" />
                            <div className="w-12 h-2 rounded bg-slate-300" />
                            <div className="w-12 h-2 rounded bg-slate-300" />
                            <div className="w-16 h-6 rounded-full bg-indigo-500" />
                          </div>
                        </div>
                        
                        {/* Hero section */}
                        <div className="flex gap-8">
                          <div className="flex-1 space-y-4">
                            <div className="w-3/4 h-6 rounded bg-slate-800" />
                            <div className="w-full h-4 rounded bg-slate-300" />
                            <div className="w-2/3 h-4 rounded bg-slate-300" />
                            <div className="flex gap-3 mt-6">
                              <div className="w-24 h-10 rounded-lg bg-indigo-500" />
                              <div className="w-24 h-10 rounded-lg bg-slate-200 border border-slate-300" />
                            </div>
                          </div>
                          <div className="w-1/3">
                            <div className="aspect-square rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100" />
                          </div>
                        </div>
                        
                        {/* Features row */}
                        <div className="flex gap-4 mt-8">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex-1 p-4 rounded-lg bg-white shadow-sm">
                              <div className="w-8 h-8 rounded bg-indigo-100 mb-2" />
                              <div className="w-full h-3 rounded bg-slate-200 mb-1" />
                              <div className="w-2/3 h-2 rounded bg-slate-100" />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Video Widget Overlay */}
                      <div className="absolute bottom-4 right-4 w-48 animate-float">
                        <div className="bg-card rounded-2xl shadow-2xl overflow-hidden border-2 border-primary/20">
                          <div className="aspect-[9/16] bg-gradient-to-br from-primary/30 to-accent/50 relative">
                            {settings?.demo_video_url ? (
                              settings.demo_video_url.includes('youtube.com') || settings.demo_video_url.includes('youtu.be') ? (
                                <iframe
                                  src={`https://www.youtube.com/embed/${settings.demo_video_url.includes('youtu.be') 
                                    ? settings.demo_video_url.split('/').pop() 
                                    : new URL(settings.demo_video_url).searchParams.get('v')}?autoplay=0&mute=1`}
                                  className="w-full h-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                                    <Play className="h-6 w-6 text-primary fill-primary" />
                                  </div>
                                </div>
                              )
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center animate-pulse-soft">
                                  <Play className="h-6 w-6 text-primary fill-primary" />
                                </div>
                              </div>
                            )}
                            {/* Close button */}
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-foreground/20 backdrop-blur-sm flex items-center justify-center">
                              <X className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          <div className="p-3 bg-card">
                            <div className="text-center mb-2">
                              <div className="font-semibold text-sm">Sarah Johnson</div>
                              <div className="text-xs text-muted-foreground">Founder & CEO</div>
                            </div>
                            <div className="bg-primary text-primary-foreground rounded-lg py-2 text-center text-sm font-semibold">
                              Book a Demo
                            </div>
                          </div>
                        </div>
                        
                        {/* Pointer annotation */}
                        <div className="absolute -left-24 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-2">
                          <span className="text-sm font-medium text-primary whitespace-nowrap bg-background/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                            Your video popup
                          </span>
                          <ArrowRight className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Laptop base */}
                <div className="h-4 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-b-lg" />
                <div className="h-2 bg-[#1a1a1a] mx-auto w-1/3 rounded-b-xl" />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full animate-bounce-slow" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-accent rounded-full animate-bounce-slow" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-display font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Convert</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features that make video popups work for your business
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-lg hover:border-primary/30 transition-all duration-300 bg-card/50 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow">
                    <benefit.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-display font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Carousel */}
      <ShowcaseCarousel />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Use Cases Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Perfect For Every{" "}
              <span className="gradient-text">Use Case</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how businesses like yours are using video popups to grow
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {useCases.map((useCase, index) => (
              <div 
                key={index}
                className="flex gap-4 p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-12 h-12 shrink-0 rounded-xl bg-accent flex items-center justify-center">
                  <useCase.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-semibold mb-1">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground">{useCase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Live in{" "}
              <span className="gradient-text">3 Simple Steps</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: "1", title: "Create Your Widget", desc: "Upload your video and customize colors, triggers, and CTAs." },
              { step: "2", title: "Copy The Code", desc: "Get your unique embed code - just one line of JavaScript." },
              { step: "3", title: "Watch It Convert", desc: "Paste on your site and start engaging visitors instantly." }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 rounded-full gradient-primary text-primary-foreground flex items-center justify-center text-2xl font-display font-bold mx-auto mb-4 shadow-glow">
                  {item.step}
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Simple,{" "}
              <span className="gradient-text">Transparent</span>{" "}
              Pricing
            </h2>
            <p className="text-lg text-muted-foreground">No hidden fees. No surprises.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard Plan */}
            <Card className="overflow-hidden border-border hover:border-primary/30 transition-colors">
              <div className="p-8">
                <h3 className="text-2xl font-display font-bold mb-2">Standard</h3>
                <p className="text-muted-foreground mb-6">Perfect for individual websites</p>
                <div className="mb-6">
                  <span className="text-5xl font-display font-bold">
                    ${(settings?.price_amount || 1000) / 100}
                  </span>
                  <span className="text-muted-foreground">/month per widget</span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {[
                    "YouTube & Vimeo support",
                    "Vertical & horizontal layouts",
                    "Custom colors & branding",
                    "Smart trigger options",
                    "Built-in analytics",
                    "Call-to-action buttons",
                    "Mobile responsive",
                    "Email support"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                        <CheckCircle className="h-3 w-3 text-success" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button size="lg" variant="outline" className="w-full" asChild>
                  <a href="#contact">Get Started</a>
                </Button>
              </div>
            </Card>

            {/* Agency Plan */}
            <Card className="overflow-hidden border-primary/30 shadow-lg relative">
              <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />
              <div className="p-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
                  <Sparkles className="h-3 w-3" />
                  Best Value
                </div>
                <h3 className="text-2xl font-display font-bold mb-2">Agency</h3>
                <p className="text-muted-foreground mb-6">For agencies managing multiple clients</p>
                <div className="mb-6">
                  <span className="text-5xl font-display font-bold">
                    Custom
                  </span>
                  <p className="text-muted-foreground mt-1">Tailored to your needs</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {[
                    "Everything in Standard",
                    "Unlimited widgets",
                    "White-label branding",
                    "Custom domain support",
                    "Client management dashboard",
                    "Flexible pricing options",
                    "Advanced analytics & reports",
                    "Priority support & onboarding"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                        <CheckCircle className="h-3 w-3 text-success" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button size="lg" className="w-full shadow-glow" asChild>
                  <a href="#contact">Start Agency Plan</a>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Frequently Asked{" "}
              <span className="gradient-text">Questions</span>
            </h2>
          </div>
          
          <div className="max-w-2xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="border border-border rounded-xl overflow-hidden bg-card"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium pr-4">{faq.question}</span>
                  <ChevronDown 
                    className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 text-muted-foreground animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                Ready to{" "}
                <span className="gradient-text">Get Started?</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Fill out the form and we'll get back to you within 24 hours with everything you need.
              </p>
            </div>
            
            <Card className="overflow-hidden shadow-lg border-0">
              <div className="grid md:grid-cols-5">
                <div className="md:col-span-2 gradient-primary p-8 text-primary-foreground">
                  <h3 className="text-2xl font-display font-bold mb-4">Let's Talk</h3>
                  <p className="opacity-90 mb-8">
                    Have questions? We'd love to hear from you and help you get started.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5" />
                      <span>Free consultation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5" />
                      <span>Custom setup help</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5" />
                      <span>24-hour response</span>
                    </div>
                  </div>
                </div>
                <CardContent className="md:col-span-3 p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="Your Company"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us about your needs..."
                        rows={4}
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full shadow-glow" disabled={submitting}>
                      {submitting ? "Sending..." : "Send Message"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
            Ready to Boost Your Conversions?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join hundreds of businesses already using video popups to grow.
          </p>
          <Button size="lg" variant="secondary" className="gap-2 text-base px-8" asChild>
            <a href="#contact">
              Get Started Today <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Play className="h-4 w-4 text-primary-foreground fill-primary-foreground" />
              </div>
              <span className="font-display font-bold">VideoPopup</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} VideoPopup. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}