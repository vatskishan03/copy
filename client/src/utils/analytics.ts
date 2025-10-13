import { track } from '@vercel/analytics';

// Custom analytics events for CopyIt application
export const analytics = {
  // User actions
  createToken: (tokenLength: number) => {
    track('create_token', { token_length: tokenLength });
  },
  
  joinSession: (tokenLength: number) => {
    track('join_session', { token_length: tokenLength });
  },
  
  copyToClipboard: (contentLength: number) => {
    track('copy_to_clipboard', { content_length: contentLength });
  },
  
  // Performance events
  websocketConnect: () => {
    track('websocket_connect');
  },
  
  websocketDisconnect: () => {
    track('websocket_disconnect');
  },
  
  // Error tracking
  apiError: (endpoint: string, statusCode: number) => {
    track('api_error', { endpoint, status_code: statusCode });
  },
  
  // Feature usage
  themeToggle: (theme: string) => {
    track('theme_toggle', { theme });
  },
  
  // Collaboration events
  realTimeEdit: (editType: string) => {
    track('realtime_edit', { edit_type: editType });
  },
  
  // Session events
  sessionStart: (sessionType: 'create' | 'join') => {
    track('session_start', { session_type: sessionType });
  },
  
  sessionEnd: (duration: number) => {
    track('session_end', { duration_seconds: duration });
  }
};

export default analytics;
