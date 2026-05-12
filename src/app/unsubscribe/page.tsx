import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const hasToken = Boolean((params.token ?? "").trim());

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-4 text-3xl font-bold tracking-tight">You're unsubscribed</h1>
      <p className="mb-6 text-sm text-zinc-500">
        {hasToken
          ? "Your email preferences have been updated for outreach messages."
          : "This unsubscribe link is missing a token, but you can still contact support to opt out."}
      </p>
      <p className="mb-8 text-sm text-zinc-500">
        Need help? Email{" "}
        <a className="underline" href="mailto:benstone@conduitscore.com">
          benstone@conduitscore.com
        </a>
      </p>
      <Link
        href="/"
        className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium hover:bg-zinc-100"
      >
        Back to ConduitScore
      </Link>
    </main>
  );
}
