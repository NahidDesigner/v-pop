import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const widgetId = url.searchParams.get('id');

    if (!widgetId) {
      return new Response('// Widget ID required', {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/javascript' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    // Fetch branding settings
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: settings } = await supabase
      .from('site_settings')
      .select('branding_text, branding_url')
      .limit(1)
      .single();

    const brandingText = settings?.branding_text || 'Powered by Video Popup';
    const brandingUrl = settings?.branding_url || '/';

    console.log('Embed script loaded for widget:', widgetId, 'Branding:', brandingText);

    const script = `
(function() {
  var WIDGET_ID = "${widgetId}";
  var API_URL = "${supabaseUrl}/functions/v1";
  var BRANDING_TEXT = "${brandingText}";
  var BRANDING_URL = "${brandingUrl}";
  var visitorId = localStorage.getItem('vp_visitor') || (function() {
    var id = 'vp_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('vp_visitor', id);
    return id;
  })();
  var isMuted = true;

  function track(eventType) {
    fetch(API_URL + '/track-analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        widget_id: WIDGET_ID,
        event_type: eventType,
        visitor_id: visitorId,
        page_url: window.location.href
      })
    }).catch(function() {});
  }

  function getYouTubeId(url) {
    var match = url.match(/(?:youtu\\.be\\/|youtube\\.com(?:\\/embed\\/|\\/v\\/|\\/watch\\?v=|\\/watch\\?.+&v=))([\\w-]{11})/);
    return match ? match[1] : null;
  }

  function getVimeoId(url) {
    var match = url.match(/vimeo\\.com\\/(?:video\\/)?(\\d+)/);
    return match ? match[1] : null;
  }

  function getMuteIcon(muted) {
    if (muted) {
      return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
    }
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
  }

  function createVerticalWidget(config) {
    var container = document.createElement('div');
    container.id = 'videopopup-widget';
    container.style.cssText = 'position:fixed;bottom:20px;' + (config.position === 'bottom-left' ? 'left' : 'right') + ':20px;z-index:999999;font-family:-apple-system,BlinkMacSystemFont,sans-serif;';

    var videoHtml = '';
    var videoId = 'vp-video-' + Date.now();
    
    if (config.video_type === 'youtube') {
      var ytId = getYouTubeId(config.video_url);
      if (ytId) {
        videoHtml = '<iframe id="' + videoId + '" src="https://www.youtube.com/embed/' + ytId + '?autoplay=1&mute=1&rel=0&enablejsapi=1&playsinline=1" frameborder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>';
      }
    } else if (config.video_type === 'vimeo') {
      var vimeoId = getVimeoId(config.video_url);
      if (vimeoId) {
        videoHtml = '<iframe id="' + videoId + '" src="https://player.vimeo.com/video/' + vimeoId + '?autoplay=1&muted=1&background=0&playsinline=1" frameborder="0" allow="autoplay;fullscreen;picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>';
      }
    } else if (config.video_type === 'bunny') {
      videoHtml = '<iframe id="' + videoId + '" src="' + config.video_url + '?autoplay=true&muted=true" frameborder="0" allow="autoplay;fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>';
    } else {
      videoHtml = '<video id="' + videoId + '" src="' + config.video_url + '" autoplay muted playsinline style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;"></video>';
    }

    var borderRadius = config.border_radius || 16;

    container.innerHTML = '<div style="width:280px;height:500px;border-radius:' + borderRadius + 'px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);overflow:hidden;animation:vpSlideUp 0.4s ease-out;position:relative;">' +
      '<div style="position:absolute;top:0;left:0;width:100%;height:100%;background:#000;">' + videoHtml + '</div>' +
      '<div style="position:absolute;top:12px;right:12px;display:flex;gap:8px;z-index:10;">' +
        '<button id="vp-mute" style="width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,0.4);backdrop-filter:blur(4px);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:white;transition:background 0.2s;">' + getMuteIcon(true) + '</button>' +
        '<button id="vp-close" style="width:36px;height:36px;border-radius:50%;background:#ef4444;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.2s;">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
        '</button>' +
      '</div>' +
      '<div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,0,0,0.9) 0%,rgba(0,0,0,0.7) 50%,transparent 100%);padding:60px 16px 16px;">' +
        '<div style="background:' + config.background_color + ';border-radius:12px;padding:16px;color:' + config.text_color + ';">' +
          (config.person_name ? '<div style="text-align:center;margin-bottom:12px;"><div style="font-weight:600;font-size:16px;">' + config.person_name + '</div>' + (config.person_title ? '<div style="font-size:13px;opacity:0.7;margin-top:2px;">' + config.person_title + '</div>' : '') + '</div>' : '') +
          (config.cta_text && config.cta_url ? '<a href="' + config.cta_url + '" target="_blank" id="vp-cta" style="display:block;background:' + config.cta_color + ';color:white;text-decoration:none;padding:12px 16px;border-radius:8px;text-align:center;font-weight:600;font-size:14px;transition:opacity 0.2s;">' + config.cta_text + '</a>' : '') +
          '<div style="text-align:center;margin-top:10px;"><a href="' + BRANDING_URL + '" target="_blank" style="color:' + config.text_color + ';opacity:0.4;font-size:11px;text-decoration:none;">' + BRANDING_TEXT + '</a></div>' +
        '</div>' +
      '</div>' +
    '</div>';

    return { container, videoId, config };
  }

  function createHorizontalWidget(config) {
    var container = document.createElement('div');
    container.id = 'videopopup-widget';
    container.style.cssText = 'position:fixed;bottom:20px;' + (config.position === 'bottom-left' ? 'left' : 'right') + ':20px;z-index:999999;font-family:-apple-system,BlinkMacSystemFont,sans-serif;';

    var videoHtml = '';
    var videoId = 'vp-video-' + Date.now();
    var borderRadius = config.border_radius || 12;
    
    if (config.video_type === 'youtube') {
      var ytId = getYouTubeId(config.video_url);
      if (ytId) {
        videoHtml = '<iframe id="' + videoId + '" src="https://www.youtube.com/embed/' + ytId + '?autoplay=1&mute=1&rel=0&enablejsapi=1" frameborder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen style="width:100%;height:100%;border-radius:' + borderRadius + 'px ' + borderRadius + 'px 0 0;"></iframe>';
      }
    } else if (config.video_type === 'vimeo') {
      var vimeoId = getVimeoId(config.video_url);
      if (vimeoId) {
        videoHtml = '<iframe id="' + videoId + '" src="https://player.vimeo.com/video/' + vimeoId + '?autoplay=1&muted=1&background=0" frameborder="0" allow="autoplay;fullscreen;picture-in-picture" allowfullscreen style="width:100%;height:100%;border-radius:' + borderRadius + 'px ' + borderRadius + 'px 0 0;"></iframe>';
      }
    } else if (config.video_type === 'bunny') {
      videoHtml = '<iframe id="' + videoId + '" src="' + config.video_url + '?autoplay=true&muted=true" frameborder="0" allow="autoplay;fullscreen" allowfullscreen style="width:100%;height:100%;border-radius:' + borderRadius + 'px ' + borderRadius + 'px 0 0;"></iframe>';
    } else {
      videoHtml = '<video id="' + videoId + '" src="' + config.video_url + '" autoplay muted playsinline style="width:100%;height:100%;border-radius:' + borderRadius + 'px ' + borderRadius + 'px 0 0;object-fit:cover;"></video>';
    }

    container.innerHTML = '<div style="width:340px;background:' + config.background_color + ';border-radius:' + borderRadius + 'px;box-shadow:0 20px 40px rgba(0,0,0,0.2);overflow:hidden;animation:vpSlideUp 0.3s ease-out;">' +
      '<div style="position:absolute;top:8px;right:8px;display:flex;gap:6px;z-index:10;">' +
        '<button id="vp-mute" style="width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:white;">' + getMuteIcon(true) + '</button>' +
        '<button id="vp-close" style="width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,0.5);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
        '</button>' +
      '</div>' +
      '<div style="position:relative;width:100%;height:190px;">' + videoHtml + '</div>' +
      '<div style="padding:16px;color:' + config.text_color + ';">' +
        (config.person_name ? '<div style="margin-bottom:12px;"><div style="font-weight:600;font-size:15px;">' + config.person_name + '</div>' + (config.person_title ? '<div style="font-size:13px;opacity:0.7;">' + config.person_title + '</div>' : '') + '</div>' : '') +
        (config.cta_text && config.cta_url ? '<a href="' + config.cta_url + '" target="_blank" id="vp-cta" style="display:block;background:' + config.cta_color + ';color:white;text-decoration:none;padding:11px 16px;border-radius:8px;text-align:center;font-weight:600;font-size:14px;">' + config.cta_text + '</a>' : '') +
        '<div style="text-align:center;margin-top:10px;"><a href="' + BRANDING_URL + '" target="_blank" style="color:' + config.text_color + ';opacity:0.4;font-size:11px;text-decoration:none;">' + BRANDING_TEXT + '</a></div>' +
      '</div>' +
    '</div>';

    return { container, videoId, config };
  }

  function setupWidget(widget) {
    var container = widget.container;
    var videoId = widget.videoId;
    var config = widget.config;

    var style = document.createElement('style');
    style.textContent = '@keyframes vpSlideUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}';
    document.head.appendChild(style);

    document.body.appendChild(container);
    track('view');

    document.getElementById('vp-close').addEventListener('click', function() {
      container.style.animation = 'none';
      container.style.transition = 'opacity 0.2s, transform 0.2s';
      container.style.opacity = '0';
      container.style.transform = 'translateY(20px)';
      setTimeout(function() { container.remove(); }, 200);
      track('close');
    });

    var muteBtn = document.getElementById('vp-mute');
    muteBtn.addEventListener('click', function() {
      isMuted = !isMuted;
      muteBtn.innerHTML = getMuteIcon(isMuted);
      
      var videoEl = document.getElementById(videoId);
      if (videoEl) {
        if (videoEl.tagName === 'VIDEO') {
          videoEl.muted = isMuted;
        } else if (videoEl.tagName === 'IFRAME') {
          if (config.video_type === 'youtube') {
            videoEl.contentWindow.postMessage(JSON.stringify({
              event: 'command',
              func: isMuted ? 'mute' : 'unMute'
            }), '*');
          } else if (config.video_type === 'vimeo') {
            var vimeoId = getVimeoId(config.video_url);
            videoEl.src = 'https://player.vimeo.com/video/' + vimeoId + '?autoplay=1&muted=' + (isMuted ? '1' : '0') + '&background=0&playsinline=1';
          }
        }
      }
    });

    var ctaBtn = document.getElementById('vp-cta');
    if (ctaBtn) {
      ctaBtn.addEventListener('click', function() {
        track('click');
      });
    }
  }

  function init() {
    fetch(API_URL + '/get-widget?id=' + WIDGET_ID)
      .then(function(res) { return res.json(); })
      .then(function(config) {
        if (config.error) return;

        function show() {
          if (document.getElementById('videopopup-widget')) return;
          
          var isVertical = config.video_orientation === 'vertical';
          var widget = isVertical ? createVerticalWidget(config) : createHorizontalWidget(config);
          setupWidget(widget);
        }

        if (config.trigger_type === 'time') {
          setTimeout(show, (config.trigger_value || 3) * 1000);
        } else if (config.trigger_type === 'scroll') {
          var triggered = false;
          window.addEventListener('scroll', function() {
            if (triggered) return;
            var scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent >= (config.trigger_value || 50)) {
              triggered = true;
              show();
            }
          });
        } else if (config.trigger_type === 'exit_intent') {
          document.addEventListener('mouseout', function(e) {
            if (e.clientY < 0) show();
          });
        }
      })
      .catch(function(err) { console.error('VideoPopup error:', err); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
`;

    return new Response(script, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=60',
      },
    });

  } catch (error) {
    console.error('Error generating embed script:', error);
    return new Response('// Error loading widget', {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/javascript' },
    });
  }
});