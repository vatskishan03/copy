import { atom } from 'recoil';
import * as Y from 'yjs';
export interface SnippetWithYDoc {
    id: string;
    content: Y.Doc; 
    token: string;
    canEdit: boolean;
    createdAt: Date;
    expiresAt?: Date;
  }
export const snippetState = atom<SnippetWithYDoc | null>({
  key: 'snippetState',
  default: null,
});
