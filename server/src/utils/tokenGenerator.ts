import crypto from 'crypto';
import prisma from '../config/database';

const TOKEN_LENGTH = 5;

export const generateToken = async (): Promise<string> => {
  while (true) {
    const token = crypto.randomBytes(TOKEN_LENGTH).toString('hex').slice(0, TOKEN_LENGTH);
    const existingSnippet = await prisma.snippet.findUnique({ where: { token } });
    if (!existingSnippet) {
      return token;
    }
  }
};