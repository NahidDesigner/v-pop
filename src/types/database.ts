export type AppRole = 'admin' | 'user';
export type WidgetStatus = 'active' | 'paused' | 'draft';
export type WidgetPosition = 'bottom-left' | 'bottom-right';
export type WidgetTrigger = 'time' | 'scroll' | 'exit_intent';
export type VideoOrientation = 'vertical' | 'horizontal';

export interface Client {
  id: string;
  name: string;
  email: string | null;
  website: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Widget {
  id: string;
  client_id: string | null;
  name: string;
  status: WidgetStatus;
  video_url: string;
  video_type: string;
  person_name: string | null;
  person_title: string | null;
  person_avatar: string | null;
  cta_text: string | null;
  cta_url: string | null;
  cta_color: string | null;
  position: WidgetPosition;
  trigger_type: WidgetTrigger;
  trigger_value: number | null;
  primary_color: string | null;
  background_color: string | null;
  text_color: string | null;
  border_radius: number | null;
  custom_css: string | null;
  animation: string | null;
  stripe_subscription_id: string | null;
  price_per_month: number | null;
  created_at: string;
  updated_at: string;
}

export interface WidgetAnalytics {
  id: string;
  widget_id: string;
  event_type: string;
  visitor_id: string | null;
  page_url: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface WidgetWithClient extends Widget {
  client?: Client | null;
}

export interface AnalyticsSummary {
  total_views: number;
  total_clicks: number;
  total_closes: number;
  click_rate: number;
  close_rate: number;
}
