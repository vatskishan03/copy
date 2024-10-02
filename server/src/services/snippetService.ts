import { PrismaClient } from '@prisma/client';
import { encrypt, decrypt } from '../utils/encryption';
import { generateToken } from '../utils/tokenGenerator';

const prisma = new PrismaClient();

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

  return { ...snippet, content }; // Includes decrypted content
};
export const getSnippet = async (id: string) => {
  const snippet = await prisma.snippet.findUnique({ where: { id } });
  if (!snippet) return null;
  const decryptedContent = decrypt(snippet.content);
  return { ...snippet, content: decryptedContent };
};

export const updateSnippet = async (id: string, content: string) => {
  const encryptedContent = encrypt(content);
  const updatedSnippet = await prisma.snippet.update({
    where: { id },
    data: { content: encryptedContent },
  });
  return { ...updatedSnippet, content };
};

export const deleteSnippet = async (id: string) => {
  return prisma.snippet.delete({ where: { id } });
};

export const snippetService = {
  createSnippet,
  getSnippet,
  updateSnippet,
  deleteSnippet
};