import prisma from '../config/database';
import redisClient from '../config/redis';
import { generateToken } from '../utils/tokenGenerator';
import { encrypt, decrypt } from '../utils/encryption';

const EXPIRATION_DAYS = 7;
const CACHE_TTL = 3600; // 1 hour in seconds

export const createSnippet = async (content: string, userId?: string) => {
  const token = await generateToken();
  const encryptedToken = encrypt(token);
  const encryptedContent = encrypt(content);
  const expiresAt = new Date(Date.now() + EXPIRATION_DAYS * 24 * 60 * 60 * 1000);

  const snippet = await prisma.snippet.create({
    data: {
      token: encryptedToken,
      content: encryptedContent,
      expiresAt,
      userId,
    },
  });

  await redisClient.setex(`snippet:${encryptedToken}`, CACHE_TTL, encryptedContent);

  return { token };
};

export const getSnippet = async (token: string) => {
  const encryptedToken = encrypt(token);
  const cachedContent = await redisClient.get(`snippet:${encryptedToken}`);
  if (cachedContent) {
    return { content: decrypt(cachedContent) };
  }

  const snippet = await prisma.snippet.findUnique({
    where: { token: encryptedToken },
  });

  if (!snippet) {
    throw new Error('Snippet not found');
  }

  if (snippet.expiresAt < new Date()) {
    await prisma.snippet.delete({ where: { token: encryptedToken } });
    throw new Error('Snippet has expired');
  }

  const decryptedContent = decrypt(snippet.content);
  await redisClient.setex(`snippet:${encryptedToken}`, CACHE_TTL, snippet.content);

  return { content: decryptedContent };
};

export const updateSnippet = async (token: string, content: string) => {
  const encryptedToken = encrypt(token);
  const encryptedContent = encrypt(content);

  await prisma.snippet.update({
    where: { token: encryptedToken },
    data: { content: encryptedContent, updatedAt: new Date() },
  });

  await redisClient.setex(`snippet:${encryptedToken}`, CACHE_TTL, encryptedContent);
};

export const deleteExpiredSnippets = async () => {
  const now = new Date();
  await prisma.snippet.deleteMany({
    where: { expiresAt: { lt: now } },
  });
};