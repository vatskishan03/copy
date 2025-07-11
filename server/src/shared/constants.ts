export const WEBSOCKET_EVENTS = {
    CONTENT_CHANGE: 'content-change',
    CONTENT_UPDATE: 'content-updated',
    JOIN_ROOM: 'join-room',
    USER_JOINED: 'user-joined',
    USER_LEFT: 'user-left',
    ERROR: 'error'
  } as const;
  
  export const API_ENDPOINTS = {
    CREATE_SNIPPET: '/api/snippets',
    GET_SNIPPET: (token: string) => `/api/snippets/${token}`,
    UPDATE_SNIPPET: (token: string) => `/api/snippets/${token}`
  } as const;
  
 export const CONFIG = {
  SNIPPET_EXPIRY: 31536000, // 1 year 
  MAX_CONTENT_LENGTH: 10000,
  TOKEN_LENGTH: 4
} as const;