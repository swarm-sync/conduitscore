import { createHash, randomBytes } from "crypto";
import prisma from "@/lib/prisma";

const API_KEY_PREFIX = "ao_";
const API_KEY_BYTES = 32;

const apiKeyUserSelect = {
  id: true,
  email: true,
  subscriptionTier: true,
  scanCountMonth: true,
  scanResetAt: true,
} as const;

export function generateApiKey(): string {
  return `${API_KEY_PREFIX}${randomBytes(API_KEY_BYTES).toString("hex")}`;
}

export function hashApiKey(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export async function findApiKeyForAuth(apiKeyValue: string) {
  const hashedValue = hashApiKey(apiKeyValue);

  const hashedRecord = await prisma.apiKey.findUnique({
    where: { key: hashedValue },
    include: { user: { select: apiKeyUserSelect } },
  });

  if (hashedRecord) {
    return prisma.apiKey.update({
      where: { id: hashedRecord.id },
      data: { lastUsed: new Date() },
      include: { user: { select: apiKeyUserSelect } },
    });
  }

  const legacyRecord = await prisma.apiKey.findUnique({
    where: { key: apiKeyValue },
    include: { user: { select: apiKeyUserSelect } },
  });

  if (!legacyRecord) {
    return null;
  }

  return prisma.apiKey.update({
    where: { id: legacyRecord.id },
    data: {
      key: hashedValue,
      lastUsed: new Date(),
    },
    include: { user: { select: apiKeyUserSelect } },
  });
}
