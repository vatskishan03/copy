import { atom } from 'recoil';

export interface ClipboardItem {
  id: string;
  content: string;
  timestamp: Date;
  token?: string;
  encrypted?: boolean;
}

export const clipboardItemsState = atom<ClipboardItem[]>({
  key: 'clipboardItemsState',
  default: [],
});

export const currentClipboardItemState = atom<ClipboardItem | null>({
  key: 'currentClipboardItemState',
  default: null,
});

export const loadingState = atom<boolean>({
  key: 'loadingState',
  default: false,
});

export const errorState = atom<string | null>({
  key: 'errorState',
  default: null,
});