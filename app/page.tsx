import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Nav activePage={null} />

      <main className="pt-24 min-h-screen">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-8 py-20 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
          {/* Left: Copy */}
          <div className="md:col-span-7 space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full">
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                stars
              </span>
              <span className="text-xs font-bold tracking-widest font-label uppercase">
                Mission Mississippi
              </span>
            </div>

            <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-on-surface leading-[1.1] tracking-tight">
              Bridging the Gap Between{" "}
              <span className="text-primary italic">Prosperity</span> and
              Wellness.
            </h1>

            <p className="text-on-surface-variant text-lg md:text-xl leading-relaxed max-w-2xl font-medium">
              In Mississippi, your zip code shouldn&apos;t determine your
              lifespan. We map the intricate connection between career trajectory
              and health outcomes to empower your future.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
              <Link
                href="/assess"
                className="w-full sm:w-auto editorial-gradient text-on-primary px-10 py-4 rounded-full font-headline font-extrabold text-lg shadow-xl hover:scale-105 transition-transform text-center"
              >
                Explore My Potential
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 rounded-full font-headline font-bold text-primary hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">play_circle</span>
                The Methodology
              </button>
            </div>
          </div>

          {/* Right: Editorial image stack */}
          <div className="md:col-span-5 relative">
            <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl md:translate-x-4">
              {/* Placeholder image area */}
              <div className="w-full h-[500px] bg-gradient-to-br from-primary-container to-primary flex items-end">
                <div className="w-full h-full bg-gradient-to-br from-blue-900/20 via-transparent to-transparent" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-on-primary">
                <p className="font-headline font-bold text-2xl tracking-tight">
                  &ldquo;Stability is the foundation of community health.&rdquo;
                </p>
                <p className="font-label text-sm opacity-90 mt-2">
                  IncomePath Methodology
                </p>
              </div>
            </div>
            {/* Decorative orbs */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-secondary-container/30 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-primary-container/20 rounded-full blur-3xl -z-10" />
          </div>
        </section>

        {/* Bento Grid: The Correlation Landscape */}
        <section className="bg-surface-container-low py-24">
          <div className="max-w-7xl mx-auto px-8">
            <div className="mb-16">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-4">
                The Correlation Landscape
              </h2>
              <p className="text-on-surface-variant font-medium">
                Visualizing data points across the Magnolia State.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Income & Life Expectancy — wide */}
              <div className="md:col-span-2 bg-surface-container-lowest p-10 rounded-xl flex flex-col justify-between shadow-sm border-l-4 border-primary">
                <div>
                  <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center mb-8">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      insights
                    </span>
                  </div>
                  <h3 className="font-headline text-3xl font-bold mb-6">
                    Income Potential &amp; Life Expectancy
                  </h3>
                  <p className="text-on-surface-variant leading-relaxed text-lg">
                    For every $10,000 increase in median household income across
                    Mississippi counties, we observe a direct 1.8-year increase
                    in projected life expectancy. Our data-driven roadmaps help
                    you navigate this vital trajectory.
                  </p>
                </div>
                <div className="mt-12 flex items-baseline gap-4">
                  <span className="text-5xl font-black text-primary font-headline">
                    +15%
                  </span>
                  <span className="text-secondary font-bold font-label uppercase tracking-widest text-xs">
                    Growth Opportunity Index
                  </span>
                </div>
              </div>

              {/* Community Stability */}
              <div className="bg-primary text-on-primary p-10 rounded-xl flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container opacity-90" />
                <div className="relative z-10">
                  <h3 className="font-headline text-2xl font-bold mb-4">
                    Community Stability
                  </h3>
                  <p className="opacity-80 leading-relaxed mb-8">
                    Career growth isn&apos;t just about the individual; it&apos;s
                    about the resilience of the household.
                  </p>
                  <button className="bg-on-primary text-primary px-6 py-2 rounded-full font-bold text-sm hover:bg-primary-fixed transition-colors">
                    View Regional Data
                  </button>
                </div>
              </div>

              {/* ROI Analysis */}
              <div className="bg-secondary text-on-secondary p-10 rounded-xl shadow-lg md:-translate-y-8">
                <span className="material-symbols-outlined text-4xl mb-6 block">
                  health_metrics
                </span>
                <h3 className="font-headline text-2xl font-bold mb-4">
                  ROI Analysis
                </h3>
                <p className="opacity-90 leading-relaxed text-sm mb-6">
                  Analyze the Return on Investment for certifications and degrees
                  based on current Mississippi demand.
                </p>
                <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-fixed w-3/4" />
                </div>
                <p className="text-[10px] mt-2 font-bold tracking-tighter opacity-70 uppercase">
                  Certification Value Score: 84%
                </p>
              </div>

              {/* Roadmap Preview — wide */}
              <div className="md:col-span-2 bg-surface-container-highest p-10 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-tertiary text-on-tertiary rounded-lg font-label text-[10px] font-bold tracking-widest uppercase">
                    Top Pathway
                  </div>
                  <h3 className="font-headline text-2xl font-bold">
                    Nursing &amp; Allied Health Path
                  </h3>
                  <p className="text-on-surface-variant text-sm">
                    Targeted growth strategies for Jackson and Gulfport healthcare
                    corridors.
                  </p>
                  <Link
                    href="/assess"
                    className="text-primary font-bold text-sm inline-flex items-center gap-2 group"
                  >
                    Start your path
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </Link>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm rotate-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    <div className="text-xs font-bold text-on-surface">
                      Career Milestone 1
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-surface-container w-full rounded-full" />
                    <div className="h-2 bg-surface-container w-5/6 rounded-full" />
                    <div className="h-2 bg-secondary/30 w-4/6 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-7xl mx-auto px-8 py-24">
          <div className="mb-16 text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-4">
              How It Works
            </h2>
            <p className="text-on-surface-variant font-medium max-w-xl mx-auto">
              Three steps from where you are to where you want to be.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: "person",
                title: "Tell us about yourself",
                desc: "Share your background, current situation, and what matters most to you. Takes about 3 minutes.",
              },
              {
                step: "02",
                icon: "psychology",
                title: "AI analyzes your options",
                desc: "Our engine matches your profile against local job market data, wage statistics, and available training programs.",
              },
              {
                step: "03",
                icon: "route",
                title: "Get your personalized pathways",
                desc: "See realistic career paths with salary ranges, training costs, and step-by-step next actions.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border-t-4 border-primary-fixed"
              >
                <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary">
                    {item.icon}
                  </span>
                </div>
                <span className="text-xs font-bold text-on-surface-variant font-label tracking-widest uppercase mb-3 block">
                  Step {item.step}
                </span>
                <h3 className="font-headline text-xl font-bold mb-3">
                  {item.title}
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-7xl mx-auto px-8 py-32 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface mb-8">
              Ready to architect your professional narrative?
            </h2>
            <p className="text-on-surface-variant text-lg mb-12">
              Join thousands of Mississippians using IncomePath to secure their
              future and their health.
            </p>
            <Link
              href="/assess"
              className="editorial-gradient text-on-primary px-12 py-5 rounded-full font-headline font-extrabold text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all inline-block"
            >
              Start Your Journey
            </Link>
            <p className="text-on-surface-variant text-xs mt-6">
              Free · Confidential · Advisory only · No account required
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
