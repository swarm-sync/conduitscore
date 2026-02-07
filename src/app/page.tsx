import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScanForm } from "@/components/scan/scan-form";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden bg-[#0A1628] py-24 sm:py-32">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-[600px] w-[600px] rounded-full border border-[#4A7DAC]/20 animate-pulse" />
              <div className="absolute inset-4 rounded-full border border-[#4A7DAC]/15" />
              <div className="absolute inset-12 rounded-full border border-[#4A7DAC]/10" />
            </div>
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Your AI Visibility Score in{" "}
                <span className="text-[#00D9FF]">30 Seconds</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-[#4A7DAC]">
                SEO was for Google. AgentOptimize is for the agent economy.
                Check how ChatGPT, Claude, and Perplexity see your website.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <ScanForm variant="hero" />
              </div>
              <p className="mt-4 text-sm text-[#4A7DAC]/60">
                No sign-up required. Get your score instantly.
              </p>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 bg-[#F9FAFB]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[#0A1628] sm:text-4xl">
                7 Categories. One Score.
              </h2>
              <p className="mt-4 text-lg text-[#475569]">
                We analyze everything AI agents look at when crawling your site.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Crawler Access", desc: "Are AI bots allowed to read your content?", pts: "15pts" },
                { title: "Structured Data", desc: "JSON-LD and schema.org markup detection", pts: "20pts" },
                { title: "Content Structure", desc: "Heading hierarchy and answer-ready sections", pts: "15pts" },
                { title: "LLMs.txt", desc: "Machine-readable site summary for AI agents", pts: "10pts" },
              ].map((f) => (
                <div key={f.title} className="rounded-xl border border-[#E5E7EB] bg-white p-6">
                  <div className="inline-flex items-center rounded-full bg-[#2E5C8A]/10 px-3 py-1 text-xs font-medium text-[#2E5C8A]">
                    {f.pts}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[#0A1628]">{f.title}</h3>
                  <p className="mt-2 text-sm text-[#475569]">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[#0A1628] sm:text-4xl">
                How It Works
              </h2>
            </div>
            <div className="mt-16 grid gap-12 md:grid-cols-3">
              {[
                { step: "1", title: "Enter Your URL", desc: "Paste any website URL into our scanner. No sign-up needed." },
                { step: "2", title: "Get Your Score", desc: "Our engine checks 7 categories that AI agents care about." },
                { step: "3", title: "Copy-Paste Fixes", desc: "Get actionable code snippets you can drop right into your site." },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#2E5C8A] text-xl font-bold text-white">
                    {s.step}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[#0A1628]">{s.title}</h3>
                  <p className="mt-2 text-sm text-[#475569]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
