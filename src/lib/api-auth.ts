import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { PLAN_FEATURES } from "@/lib/plan-limits";
import { findApiKeyForAuth } from "@/lib/api-keys";

type AuthUser = {
  id: string;
  email: string;
  subscriptionTier: string;
  scanCountMonth: number;
  scanResetAt: Date;
};

export type RequestUserResult = {
  user: AuthUser | null;
  source: "session" | "api-key" | "anonymous";
  error?: string;
};

function extractApiKey(request: NextRequest): string | null {
  const headerKey = request.headers.get("x-api-key")?.trim();
  if (headerKey) return headerKey;

  const auth = request.headers.get("authorization")?.trim();
  if (!auth) return null;

  const bearerPrefix = "Bearer ";
  if (auth.startsWith(bearerPrefix)) {
    const token = auth.slice(bearerPrefix.length).trim();
    if (token.startsWith("ao_")) return token;
  }

  return null;
}

async function getOptionalSessionUser(): Promise<AuthUser | null> {
  try {
    const [{ getServerSession }, { authOptions }] = await Promise.all([
      import("next-auth"),
      import("@/lib/auth"),
    ]);
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;
    return await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        subscriptionTier: true,
        scanCountMonth: true,
        scanResetAt: true,
      },
    });
  } catch {
    return null;
  }
}

export async function getRequestUser(
  request: NextRequest
): Promise<RequestUserResult> {
  const apiKeyValue = extractApiKey(request);

  if (apiKeyValue) {
    const apiKey = await findApiKeyForAuth(apiKeyValue);

    if (!apiKey?.user) {
      return { user: null, source: "api-key", error: "Invalid API key" };
    }

    if (!PLAN_FEATURES.restApi(apiKey.user.subscriptionTier)) {
      return {
        user: null,
        source: "api-key",
        error: "REST API access requires the Scale tier",
      };
    }

    return { user: apiKey.user, source: "api-key" };
  }

  const sessionUser = await getOptionalSessionUser();
  if (sessionUser) {
    return { user: sessionUser, source: "session" };
  }

  return { user: null, source: "anonymous" };
}
