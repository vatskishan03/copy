import { selector } from 'recoil';
import { snippetState } from './atoms';

// Selector to get the content of the snippet as plain text
export const snippetContentSelector = selector({
  key: 'snippetContentSelector',
  get: ({ get }) => {
    const snippet = get(snippetState);
    return snippet ? snippet.content.getText('content').toString() : '';
  },
});

// Selector to check if the snippet is editable
export const isSnippetEditableSelector = selector({
  key: 'isSnippetEditableSelector',
  get: ({ get }) => {
    const snippet = get(snippetState);
    return snippet?.canEdit || false;
  },
});

// Add more selectors as needed for other derived or computed values...
