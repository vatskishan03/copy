// frontend/src/state/atoms.ts
import { atom } from 'recoil';
import { Snippet } from 'shared/types';

export const snippetState = atom<Snippet | null>({
  key: 'snippetState',
  default: null,
});

export const errorState = atom<string | null>({
  key: 'errorState',
  default: null,
});
