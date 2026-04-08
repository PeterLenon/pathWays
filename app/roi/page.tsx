import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function ROIPage() {
  const breakEvenData = [
    {
      id: "rn",
      icon: "medical_services",
      name: "Registered Nursing (ADN)",
      years: "3.2 YEARS",
      cost: "$45k",
      fullRoi: "Full ROI Year 4",
      width: "32%",
      color: "bg-primary",
    },
    {
      id: "hvac",
      icon: "hvac",
      name: "HVAC Technician",
      years: "1.1 YEARS",
      cost: "$8k",
      fullRoi: "Full ROI Year 2",
      width: "11%",
      color: "bg-secondary",
    },
    {
      id: "it",
      icon: "terminal",
      name: "IT Security (CompTIA)",
      years: "0.8 YEARS",
      cost: "$3.5k",
      fullRoi: "Full ROI Year 1",
      width: "8%",
      color: "bg-primary",
    },
  ];

  return (
    <>
      <Nav activePage="roi" />

      <main className="pt-24 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
        {/* Page Header */}
        <section className="mb-12 mt-10">
          <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter text-primary mb-4 leading-none">
            ROI Analysis
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl font-medium">
            Deep dive into the financial implications of your potential career
            paths. We calculate training costs, lost wages, and long-term
            earnings to find your true break-even point.
          </p>
        </section>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Income Projection Chart */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <h2 className="font-headline text-2xl font-bold text-primary">
                  Cumulative Income Projection
                </h2>
                <p className="text-on-surface-variant text-sm">
                  10-year forecast comparing initial investment vs. net earnings
                </p>
              </div>
              <div className="flex gap-2 p-1 bg-surface-container-low rounded-lg">
                <button className="px-3 py-1.5 bg-surface-container-lowest shadow-sm rounded-md text-xs font-bold text-primary">
                  10 YEARS
                </button>
                <button className="px-3 py-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary">
                  5 YEARS
                </button>
              </div>
            </div>

            {/* Chart visualization */}
            <div className="h-80 w-full bg-surface-container-highest rounded-xl relative overflow-hidden flex items-end p-6">
              {/* Primary bars */}
              <div className="absolute bottom-0 left-0 w-full h-full p-8 flex items-end gap-1">
                {[20, 35, 45, 60, 75, 82, 88, 92, 96, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-primary/20 rounded-t-lg hover:bg-primary/30 transition-colors"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              {/* Secondary line overlay */}
              <div className="absolute bottom-0 left-0 w-full h-full p-8 flex items-end gap-1 pointer-events-none">
                {[30, 45, 55, 65, 70, 75, 78, 81, 83, 85].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 border-b-4 border-secondary/50"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-6">
              {[
                { color: "bg-primary", label: "Registered Nursing", sub: "(B.S.N)" },
                { color: "bg-secondary", label: "HVAC Technician", sub: "(Certification)" },
                { color: "bg-tertiary-fixed-dim", label: "IT Security", sub: "(CompTIA Pathway)" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${l.color}`} />
                  <span className="text-sm font-semibold text-on-surface">{l.label}</span>
                  <span className="text-xs text-on-surface-variant font-medium">{l.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Insights */}
          <div className="lg:col-span-4 bg-primary text-on-primary rounded-xl p-8 flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-secondary-container">location_on</span>
                <span className="font-label text-xs font-bold tracking-widest uppercase">
                  Regional Pulse
                </span>
              </div>
              <h3 className="font-headline text-3xl font-bold mb-2">
                Hinds County, MS
              </h3>
              <p className="text-on-primary-container text-sm leading-relaxed mb-8">
                Economic context for the Jackson metro area relative to target salaries.
              </p>
              <div className="space-y-4">
                <div className="bg-primary-container rounded-lg p-4">
                  <p className="text-[10px] font-bold text-on-primary-fixed-variant uppercase tracking-tighter mb-1">
                    Median Rent vs. Income
                  </p>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-extrabold">$1,150</span>
                    <span className="text-xs font-bold text-secondary-container flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">trending_down</span>
                      -4% YoY
                    </span>
                  </div>
                </div>
                <div className="bg-primary-container rounded-lg p-4">
                  <p className="text-[10px] font-bold text-on-primary-fixed-variant uppercase tracking-tighter mb-1">
                    Local Job Demand
                  </p>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-extrabold">High</span>
                    <span className="text-xs font-bold text-on-primary-container italic">
                      Healthcare Leads
                    </span>
                  </div>
                </div>
                <div className="bg-primary-container rounded-lg p-4">
                  <p className="text-[10px] font-bold text-on-primary-fixed-variant uppercase tracking-tighter mb-1">
                    Wage Growth (2yr)
                  </p>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-extrabold">+8.2%</span>
                    <span className="text-xs font-bold text-secondary-container">
                      All Sectors
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Break-Even Analysis */}
          <div className="lg:col-span-7 bg-surface-container-low rounded-xl p-8">
            <h3 className="font-headline text-2xl font-bold text-primary mb-8">
              Break-Even Analysis
            </h3>
            <div className="space-y-8">
              {breakEvenData.map((item) => (
                <div key={item.id} className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-surface-container-lowest flex items-center justify-center shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-primary text-3xl">
                      {item.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-bold text-on-surface">
                        {item.name}
                      </span>
                      <span className="text-sm font-black text-primary">
                        {item.years}
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden">
                      <div
                        className={`${item.color} h-full rounded-full`}
                        style={{ width: item.width }}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase">
                        Cost: {item.cost}
                      </span>
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase">
                        {item.fullRoi}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Risk Assessment */}
          <div className="lg:col-span-5 grid grid-rows-2 gap-8">
            <div className="bg-secondary-container text-on-secondary-container rounded-xl p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <span className="material-symbols-outlined mb-2 text-3xl block">
                    psychology
                  </span>
                  <h4 className="font-headline text-xl font-bold leading-tight">
                    AI Confidence Score
                  </h4>
                </div>
                <div className="bg-on-secondary-container text-secondary-container px-3 py-1 rounded-full text-xs font-black">
                  94%
                </div>
              </div>
              <p className="text-sm font-medium leading-relaxed opacity-90">
                Stability for <span className="font-bold underline">Nursing</span>{" "}
                is rated exceptionally high. Minimal automation risk with a 15%
                projected 10-year job growth.
              </p>
            </div>

            <div className="bg-surface-container-highest border-l-4 border-primary rounded-xl p-6 flex flex-col justify-between">
              <div>
                <h4 className="font-headline text-xl font-bold text-primary mb-2">
                  Market Volatility
                </h4>
                <p className="text-xs font-medium text-on-surface-variant mb-4 uppercase tracking-wider">
                  IT Security &amp; Tech
                </p>
              </div>
              <div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Entry-level tech roles in Jackson MSA are competitive, but
                  remote work opportunities significantly expand your salary
                  ceiling beyond local averages.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="lg:col-span-12">
            <div className="bg-surface-container-lowest rounded-full p-4 flex flex-col md:flex-row items-center justify-between shadow-sm">
              <div className="flex items-center gap-4 pl-6 py-2">
                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">rocket_launch</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-primary">
                    Ready to build your roadmap?
                  </h4>
                  <p className="text-xs text-on-surface-variant">
                    Complete the 3-minute intake to get your personalized analysis.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pr-2 mt-4 md:mt-0">
                <Link
                  href="/resources"
                  className="px-8 py-3 rounded-full text-sm font-bold text-primary hover:bg-surface-container-low transition-colors"
                >
                  View Resources
                </Link>
                <Link
                  href="/assess"
                  className="px-8 py-3 editorial-gradient text-on-primary rounded-full text-sm font-bold shadow-lg hover:opacity-90 transition-all"
                >
                  Start Intake
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
