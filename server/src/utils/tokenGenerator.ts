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
  const pattern = [
    charSets.digits, 
    charSets.digits,
    charSets.lowercase, 
    charSets.uppercase,
    charSets.special
  ];

  while (true) {
    let token = '';
    for (const charSet of pattern) {
      const randomIndex = Math.floor(Math.random() * charSet.length);
      token += charSet.charAt(randomIndex);
    }

    const existingSnippet = await prisma.snippet.findUnique({
      where: { token }
    });

    if (!existingSnippet) {
      return token;
    }
  }
};