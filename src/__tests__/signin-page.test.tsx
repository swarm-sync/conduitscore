import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const { signInMock, getSearchParams, setSearchParams } = vi.hoisted(() => {
  let currentSearchParams = new URLSearchParams();
  return {
    signInMock: vi.fn(),
    getSearchParams: () => currentSearchParams,
    setSearchParams: (value: URLSearchParams) => {
      currentSearchParams = value;
    },
  };
});

vi.mock("next-auth/react", () => ({
  signIn: signInMock,
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => getSearchParams(),
}));

import SignInPage from "@/app/(auth)/signin/page";

describe("SignInPage", () => {
  beforeEach(() => {
    setSearchParams(new URLSearchParams());
    signInMock.mockReset();
    signInMock.mockResolvedValue(undefined);
  });

  it("uses the callbackUrl query param for Google sign-in", () => {
    setSearchParams(new URLSearchParams("callbackUrl=%2Fpricing%3Fbilling%3Dyearly"));

    render(<SignInPage />);

    fireEvent.click(screen.getByRole("button", { name: "Sign in with Google" }));

    expect(signInMock).toHaveBeenCalledWith("google", { callbackUrl: "/pricing?billing=yearly" });
  });

  it("uses the callbackUrl query param for magic link sign-in", async () => {
    setSearchParams(new URLSearchParams("callbackUrl=%2Fpricing%3Fbilling%3Dyearly"));

    render(<SignInPage />);

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send Magic Link" }));

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith("email", {
        email: "user@example.com",
        callbackUrl: "/pricing?billing=yearly",
        redirect: false,
      });
    });
  });
});
