import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = {
  apiKey: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
};

vi.mock("@/lib/prisma", () => ({
  default: prismaMock,
}));

const { findApiKeyForAuth, generateApiKey, hashApiKey } = await import("@/lib/api-keys");

describe("api key helpers", () => {
  beforeEach(() => {
    prismaMock.apiKey.findUnique.mockReset();
    prismaMock.apiKey.update.mockReset();
  });

  it("generates prefixed API keys", () => {
    const key = generateApiKey();

    expect(key.startsWith("ao_")).toBe(true);
    expect(key).toHaveLength(67);
  });

  it("hashes keys deterministically", () => {
    const key = "ao_example";

    expect(hashApiKey(key)).toBe(hashApiKey(key));
    expect(hashApiKey(key)).not.toBe(key);
  });

  it("authenticates hashed keys and updates lastUsed", async () => {
    const rawKey = "ao_live_123";
    const hashedKey = hashApiKey(rawKey);
    const storedRecord = {
      id: "key_1",
      key: hashedKey,
      user: { id: "user_1", email: "user@example.com", subscriptionTier: "agency", scanCountMonth: 0, scanResetAt: new Date() },
    };
    const updatedRecord = {
      ...storedRecord,
      lastUsed: new Date(),
    };

    prismaMock.apiKey.findUnique.mockResolvedValueOnce(storedRecord);
    prismaMock.apiKey.update.mockResolvedValueOnce(updatedRecord);

    const result = await findApiKeyForAuth(rawKey);

    expect(prismaMock.apiKey.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { key: hashedKey },
      })
    );
    expect(prismaMock.apiKey.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "key_1" },
        data: expect.objectContaining({
          lastUsed: expect.any(Date),
        }),
      })
    );
    expect(result).toBe(updatedRecord);
  });

  it("migrates legacy plaintext keys on first use", async () => {
    const rawKey = "ao_legacy_123";
    const hashedKey = hashApiKey(rawKey);
    const legacyRecord = {
      id: "key_legacy",
      key: rawKey,
      user: { id: "user_1", email: "user@example.com", subscriptionTier: "agency", scanCountMonth: 0, scanResetAt: new Date() },
    };
    const migratedRecord = {
      ...legacyRecord,
      key: hashedKey,
      lastUsed: new Date(),
    };

    prismaMock.apiKey.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(legacyRecord);
    prismaMock.apiKey.update.mockResolvedValueOnce(migratedRecord);

    const result = await findApiKeyForAuth(rawKey);

    expect(prismaMock.apiKey.findUnique).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ where: { key: hashedKey } })
    );
    expect(prismaMock.apiKey.findUnique).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ where: { key: rawKey } })
    );
    expect(prismaMock.apiKey.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "key_legacy" },
        data: expect.objectContaining({
          key: hashedKey,
          lastUsed: expect.any(Date),
        }),
      })
    );
    expect(result).toBe(migratedRecord);
  });

  it("returns null for unknown keys", async () => {
    prismaMock.apiKey.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

    const result = await findApiKeyForAuth("ao_missing");

    expect(result).toBeNull();
    expect(prismaMock.apiKey.update).not.toHaveBeenCalled();
  });
});
