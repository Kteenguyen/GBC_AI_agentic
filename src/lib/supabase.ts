import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jhfxfzxvfgdgoxvpwqac.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_fFv9RG-eR_BJc45VNB983Q_IQjDixSP';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const GCM_EVENTS = {
  PIPELINE_UPDATED: 'gcm_pipeline_updated',
  AGENT_UPDATED: 'gcm_agent_updated',
  QA_UPDATED: 'gcm_qa_updated',
  BATTLE_UPDATED: 'gcm_battle_updated',
  HIRED_UPDATED: 'gcm_hired_updated',
  LOG_ADDED: 'gcm_log_added',
  STAGE_CHANGED: 'gcm_stage_changed',
} as const;

export function emitRealtimeEvent(eventName: string, detail?: any) {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent(eventName, { detail });
    window.dispatchEvent(event);
    try {
      localStorage.setItem('__gcm_last_event__', JSON.stringify({
        event: eventName,
        timestamp: Date.now(),
        detail
      }));
    } catch (e) {
      // ignore
    }
  }
}

export function subscribeRealtimeEvent(eventName: string, handler: (detail: any) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const listener = (event: Event) => {
    const customEvent = event as CustomEvent;
    handler(customEvent.detail);
  };

  const storageListener = (e: StorageEvent) => {
    if (e.key === '__gcm_last_event__' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (parsed.event === eventName) {
          handler(parsed.detail);
        }
      } catch (err) {
        // ignore
      }
    }
  };

  window.addEventListener(eventName, listener);
  window.addEventListener('storage', storageListener);

  return () => {
    window.removeEventListener(eventName, listener);
    window.removeEventListener('storage', storageListener);
  };
}
