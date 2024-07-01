// shared/types.ts
import * as Y from 'yjs';
export interface Snippet {
  _id: string; 
  content: any;
  token: string;
  canEdit: boolean;
  createdAt: Date;
  expiresAt?: Date;
}
