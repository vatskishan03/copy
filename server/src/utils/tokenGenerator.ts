import { prisma } from '../config/database';

interface TokenPattern {
  digits: string;
  lowercase: string;
  uppercase: string;
  special: string;
}

const charSets: TokenPattern = {
  digits: '0123456789',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  special: '!@$&*()',
};

export const generateToken = async (length: number = 5): Promise<string> => {
  // Pre-generate character set for faster access
  const allChars = charSets.digits + charSets.lowercase + charSets.uppercase + charSets.special;
  
  // Batch generate multiple tokens for efficiency
  const batchSize = 5;
  const tokens: string[] = [];
  
  for (let i = 0; i < batchSize; i++) {
    let token = '';
    for (let j = 0; j < length; j++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      token += allChars.charAt(randomIndex);
    }
    tokens.push(token);
  }

  // Check all tokens at once
  const existingTokens = await prisma.snippet.findMany({
    where: { token: { in: tokens } },
    select: { token: true }
  });

  const existingSet = new Set(existingTokens.map(t => t.token));
  const availableToken = tokens.find(t => !existingSet.has(t));
  
  // If all tokens in batch are used (extremely unlikely), recursively try again
  return availableToken || generateToken(length);
};