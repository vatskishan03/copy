// import { prisma } from '../config/database';

// interface TokenPattern {
//   digits: string;
//   lowercase: string;
//   uppercase: string;
//   special: string;
// }

// const charSets: TokenPattern = {
//   digits: '0123456789',
//   lowercase: 'abcdefghijklmnopqrstuvwxyz',
//   uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
//   special: '!@$&*()',
// };

// export const generateToken = async (length: number = 5): Promise<string> => {
//   // Pre-generate character set for faster access
//   const allChars = charSets.digits + charSets.lowercase + charSets.uppercase + charSets.special;
  
//   // Batch generate multiple tokens for efficiency
//   const batchSize = 5;
//   const tokens: string[] = [];
  
//   for (let i = 0; i < batchSize; i++) {
//     let token = '';
//     for (let j = 0; j < length; j++) {
//       const randomIndex = Math.floor(Math.random() * allChars.length);
//       token += allChars.charAt(randomIndex);
//     }
//     tokens.push(token);
//   }

//   // Check all tokens at once
//   const existingTokens = await prisma.snippet.findMany({
//     where: { token: { in: tokens } },
//     select: { token: true }
//   });

//   const existingSet = new Set(existingTokens.map(t => t.token));
//   const availableToken = tokens.find(t => !existingSet.has(t));
  
//   // If all tokens in batch are used (extremely unlikely), recursively try again
//   return availableToken || generateToken(length);
// };









// import { prisma } from '../config/database';

// interface TokenPattern {
//   digits: string;
//   lowercase: string;
//   uppercase: string;
//   special: string;
// }

// const charSets: TokenPattern = {
//   digits: '0123456789',
//   lowercase: 'abcdefghijklmnopqrstuvwxyz',
//   uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
//   special: '!@$&*()',
// };

// /**
//  * Fisher-Yates shuffle algorithm to randomize token characters
//  */
// function shuffleString(str: string): string {
//   const array = str.split('');
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]]; // Swap elements
//   }
//   return array.join('');
// }

// /**
//  * Generates a token with guaranteed character diversity
//  */
// export const generateToken = async (length: number = 5): Promise<string> => {
//   // Ensure length is at least 4 to accommodate one of each character type
//   if (length < 4) length = 4;
  
//   // Batch generate multiple tokens for efficiency
//   const batchSize = 5;
//   const tokens: string[] = [];
  
//   for (let i = 0; i < batchSize; i++) {
//     // Ensure at least one character from each set
//     const digit = charSets.digits.charAt(Math.floor(Math.random() * charSets.digits.length));
//     const lower = charSets.lowercase.charAt(Math.floor(Math.random() * charSets.lowercase.length));
//     const upper = charSets.uppercase.charAt(Math.floor(Math.random() * charSets.uppercase.length));
//     const special = charSets.special.charAt(Math.floor(Math.random() * charSets.special.length));
    
//     // Combine guaranteed characters
//     let token = digit + lower + upper + special;
    
//     // For longer tokens, fill remaining positions with random characters
//     const allChars = charSets.digits + charSets.lowercase + charSets.uppercase + charSets.special;
//     for (let j = 4; j < length; j++) {
//       const randomIndex = Math.floor(Math.random() * allChars.length);
//       token += allChars.charAt(randomIndex);
//     }
    
//     // Shuffle the characters to avoid predictable patterns
//     token = shuffleString(token);
    
//     tokens.push(token);
//   }
  
//   // Check all tokens at once
//   const existingTokens = await prisma.snippet.findMany({
//     where: { token: { in: tokens } },
//     select: { token: true }
//   });

//   const existingSet = new Set(existingTokens.map(t => t.token));
//   const availableToken = tokens.find(t => !existingSet.has(t));
  
//   // If all tokens in batch are used (extremely unlikely), recursively try again
//   return availableToken || generateToken(length);
// };



import { prisma } from '../config/database';

/**
 * Generates a simple 4-digit numeric token that's easier for users to remember and share
 */
export const generateToken = async (): Promise<string> => {
  // Batch generate multiple tokens for efficiency
  const batchSize = 10; // Increased batch size since the token space is smaller
  const tokens: string[] = [];
  
  for (let i = 0; i < batchSize; i++) {
    // Generate a random 4-digit number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    tokens.push(randomNum.toString());
  }

  // Check all tokens at once
  const existingTokens = await prisma.snippet.findMany({
    where: { token: { in: tokens } },
    select: { token: true }
  });

  const existingSet = new Set(existingTokens.map(t => t.token));
  const availableToken = tokens.find(t => !existingSet.has(t));
  
  // If all tokens in batch are used, recursively try again
  return availableToken || generateToken();
};