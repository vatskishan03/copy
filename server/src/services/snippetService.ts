import prisma from '../config/database';
import { encrypt, decrypt } from '../utils/encryption';
import { generateToken } from '../utils/tokenGenerator';
import { webSocketService } from '../app';

export const createSnippet = async (content: string, userId: string) => {
  const encryptedContent = encrypt(content);
  const token = await generateToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Expires in 7 days

  const snippet = await prisma.snippet.create({
    data: {
      content: encryptedContent,
      userId,
      token,
      expiresAt,
    },
  });

  await webSocketService.updateContent(snippet.id, content);
  return { ...snippet, content }; // Includes decrypted content
};

export const getSnippet = async (token: string) => {
  const snippet = await prisma.snippet.findUnique({ where: { token } });
  if (!snippet) return null;
  const decryptedContent = decrypt(snippet.content);
  return { ...snippet, content: decryptedContent };
};

export const snippetService = {
  createSnippet,
  getSnippet
};