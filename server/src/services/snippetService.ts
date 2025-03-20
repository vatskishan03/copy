import prisma from '../config/database';
import { generateToken } from '../utils/tokenGenerator';

export const createSnippet = async (content: string) => {
  const token = await generateToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const snippet = await prisma.snippet.create({
    data: {
      content,
      token,
      expiresAt,
    },
  });

  return snippet;
};

export const getSnippet = async (token: string) => {
  const snippet = await prisma.snippet.findUnique({
    where: { token }
  });
  
  if (!snippet) return null;
  
  // Check if snippet has expired
  if (snippet.expiresAt < new Date()) {
    await prisma.snippet.delete({
      where: { id: snippet.id }
    });
    return null;
  }

  return snippet;
};

export const snippetService = {
  createSnippet,
  getSnippet,
};