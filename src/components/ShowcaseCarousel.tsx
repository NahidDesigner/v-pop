import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink } from 'lucide-react';

interface Sample {
  id: string;
  title: string;
  image_url: string;
  website_url: string | null;
  display_order: number;
}

export default function ShowcaseCarousel() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSamples = async () => {
      const { data, error } = await supabase
        .from('showcase_samples')
        .select('id, title, image_url, website_url, display_order')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (!error && data) {
        setSamples(data);
      }
      setLoading(false);
    };

    fetchSamples();
  }, []);

  if (loading || samples.length === 0) {
    return null;
  }

  // Duplicate samples for seamless infinite scroll
  const duplicatedSamples = [...samples, ...samples];

  return (
    <section className="py-20 overflow-hidden bg-muted/30">
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            See It In Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real examples of our video popups driving engagement on websites across different industries.
          </p>
        </div>
      </div>

      {/* Infinite Scrolling Carousel */}
      <div className="relative">
        <div className="flex animate-scroll gap-6 hover:[animation-play-state:paused]">
          {duplicatedSamples.map((sample, index) => {
            const Wrapper = sample.website_url ? 'a' : 'div';
            const wrapperProps = sample.website_url 
              ? { 
                  href: sample.website_url, 
                  target: '_blank', 
                  rel: 'noopener noreferrer',
                  className: 'group'
                } 
              : { className: 'group' };

            return (
              <Wrapper key={`${sample.id}-${index}`} {...wrapperProps}>
                <div className="relative flex-shrink-0 w-80 md:w-96 rounded-xl overflow-hidden border border-border/50 shadow-lg bg-card transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={sample.image_url}
                      alt={sample.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-between text-white">
                      <span className="font-medium">{sample.title}</span>
                      {sample.website_url && (
                        <ExternalLink className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}