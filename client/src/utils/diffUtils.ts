/**
 * Creates a simple diff between two strings
 * @param oldText Previous text version
 * @param newText Current text version
 * @returns Diff object containing only the changes
 */
export interface TextDiff {
    oldText: string;
    newText: string;
    startIndex: number;
    endIndex: number;
    replacement: string;
  }
  
  export function createDiff(oldText: string, newText: string): TextDiff {
    // Find the first character that differs
    let startIndex = 0;
    const minLength = Math.min(oldText.length, newText.length);
    
    while (startIndex < minLength && oldText[startIndex] === newText[startIndex]) {
      startIndex++;
    }
    
    // Find the last character that differs (searching from the end)
    let oldEndIndex = oldText.length - 1;
    let newEndIndex = newText.length - 1;
    
    while (oldEndIndex >= startIndex && newEndIndex >= startIndex && 
           oldText[oldEndIndex] === newText[newEndIndex]) {
      oldEndIndex--;
      newEndIndex--;
    }
    
    // The replacement is the substring in the new text
    const replacement = newText.substring(startIndex, newEndIndex + 1);
    
    return {
      oldText,
      newText,
      startIndex,
      endIndex: oldEndIndex + 1,
      replacement
    };
  }