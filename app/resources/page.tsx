import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const grants = [
  {
    name: "MTAG (Mississippi Tuition Assistance Grant)",
    desc: "Up to $1,000 per year for Mississippi residents with a 2.5 GPA and 15 ACT score.",
    tags: ["Undergraduate", "Merit-Based"],
  },
  {
    name: "Workforce Training Fund (WIOA)",
    desc: "Federal funding for certification programs in high-demand trades like advanced manufacturing, healthcare, and IT. No repayment required.",
    tags: ["Trade Skills", "Direct Grant", "No Repayment"],
  },
  {
    name: "MESG (Mississippi Eminent Scholars Grant)",
    desc: "Up to $2,500 per year for high-achieving Mississippi residents entering freshman year.",
    tags: ["Academic", "Merit-Based"],
  },
  {
    name: "Pell Grant",
    desc: "Federal grant up to $7,395/year for eligible students at accredited institutions. Apply at fafsa.gov. No repayment required.",
    tags: ["Federal", "Need-Based", "No Repayment"],
  },
  {
    name: "Complete 2 Compete (C2C)",
    desc: "For adults with some college credit who didn't finish their degree. Reduces barriers to re-enrollment.",
    tags: ["Adult Learners", "State Program"],
  },
];

const checklist = [
  {
    label: "Complete FAFSA Application",
    sub: "Priority Deadline: April 1st",
    done: false,
  },
  {
    label: "Submit MTAG Application",
    sub: "Requirement: 2.5 GPA / 15 ACT",
    done: false,
  },
  {
    label: "Select Career Path",
    sub: "Completed in AI Optimizer",
    done: true,
  },
  {
    label: "Request Official Transcripts",
    sub: "From current high school/college",
    done: false,
  },
];

const mentors = [
  {
    name: "Marcus Reed",
    role: "Senior Cloud Architect",
    location: "Jackson, MS",
    quote:
      "Happy to mentor young professionals looking to break into the tech scene in Central Mississippi.",
  },
  {
    name: "Sarah Jenkins",
    role: "Clinical Lab Director",
    location: "Clinton, MS",
    quote:
      "The healthcare path is rewarding. I'm here to help you navigate local certification requirements.",
  },
  {
    name: "David Wilson",
    role: "HVAC Project Manager",
    location: "Raymond, MS",
    quote:
      "Trade careers offer amazing ROI. I can guide you through the apprenticeship programs in Hinds County.",
  },
];

const libraryItems = [
  {
    type: "image",
    tag: "Guides",
    title: "Resume Building for Trade Careers",
    span: "md:col-span-2",
  },
  {
    type: "card",
    icon: "record_voice_over",
    title: "How to Interview",
    desc: "Actionable tips for making a great first impression.",
  },
  {
    type: "card",
    icon: "account_balance_wallet",
    title: "Understanding Benefits",
    desc: "401k, health insurance, and local MS tax breaks explained.",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <Nav activePage="resources" />

      <main className="pt-24 pb-16 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
        {/* Header */}
        <header className="mb-12 mt-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-4 font-headline">
                Support &amp; Resources
              </h1>
              <p className="text-on-surface-variant max-w-2xl text-lg">
                Bridging AI-driven career recommendations with actionable local
                support in Mississippi and Hinds County.
              </p>
            </div>
            {/* Search (UI only) */}
            <div className="relative w-full md:w-96">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                search
              </span>
              <input
                className="w-full bg-surface-container-low border-none rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline transition-all"
                placeholder="Search resources or programs…"
                type="text"
                readOnly
              />
            </div>
          </div>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Financial Aid */}
          <section className="md:col-span-8 bg-surface-container-lowest rounded-xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-secondary-container p-2 rounded-lg">
                  <span
                    className="material-symbols-outlined text-secondary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    payments
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight font-headline">
                  Mississippi Financial Aid &amp; Grants
                </h2>
              </div>
              <span className="text-xs font-bold tracking-widest text-secondary uppercase bg-secondary-container/30 px-3 py-1 rounded-full">
                Active Funding
              </span>
            </div>
            <div className="space-y-1">
              {grants.map((grant) => (
                <div
                  key={grant.name}
                  className="group p-6 rounded-xl hover:bg-surface-container-low transition-all cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-primary mb-1 font-headline">
                        {grant.name}
                      </h3>
                      <p className="text-on-surface-variant text-sm mb-3">
                        {grant.desc}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {grant.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-surface-container-high text-on-surface px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center flex-shrink-0">
                      <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                        arrow_forward_ios
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Enrollment Checklist */}
          <aside className="md:col-span-4 bg-primary text-on-primary rounded-xl p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-6 font-headline">
                Enrollment Checklist
              </h2>
              <div className="space-y-5">
                {checklist.map((item) => (
                  <label
                    key={item.label}
                    className="flex items-start gap-4 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={item.done}
                      className="mt-1.5 w-5 h-5 rounded border-white/20 bg-white/10 text-secondary-fixed-dim focus:ring-0 focus:ring-offset-0"
                    />
                    <div>
                      <p
                        className={`font-semibold text-white ${
                          item.done ? "opacity-60 line-through" : ""
                        }`}
                      >
                        {item.label}
                      </p>
                      <p className="text-on-primary-container text-xs mt-0.5">
                        {item.sub}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <Link
              href="/assess"
              className="mt-8 bg-secondary-container text-on-secondary-container py-3 rounded-full font-bold text-center w-full block hover:scale-[1.02] active:scale-95 transition-all text-sm"
            >
              Start Career Optimizer
            </Link>
          </aside>

          {/* Mentorship Hub */}
          <section className="md:col-span-12 bg-surface-container-high rounded-xl p-8 overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight font-headline">
                    Hinds County Mentorship Hub
                  </h2>
                  <p className="text-on-surface-variant">
                    Connect with local professionals in Jackson and surrounding areas.
                  </p>
                </div>
                <button className="flex items-center gap-2 editorial-gradient text-on-primary px-5 py-2.5 rounded-full font-semibold text-sm">
                  <span className="material-symbols-outlined text-sm">filter_list</span>
                  Filter by Industry
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mentors.map((mentor) => (
                  <div
                    key={mentor.name}
                    className="bg-surface-container-lowest p-6 rounded-xl shadow-sm"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      {/* Avatar placeholder */}
                      <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary text-2xl">person</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-primary">{mentor.name}</h4>
                        <p className="text-xs text-on-surface-variant">{mentor.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-secondary mb-4 font-bold tracking-wide">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      {mentor.location.toUpperCase()}
                    </div>
                    <p className="text-sm text-on-surface-variant mb-6 line-clamp-2">
                      &ldquo;{mentor.quote}&rdquo;
                    </p>
                    <button className="w-full border border-primary text-primary py-2.5 rounded-full font-semibold text-sm hover:bg-primary hover:text-on-primary transition-all">
                      Message {mentor.name.split(" ")[0]}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl" />
          </section>

          {/* Resource Library */}
          <section className="md:col-span-12">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-primary font-headline">
                Resource Library
              </h2>
              <button className="text-sm font-semibold text-primary border-b border-primary pb-0.5">
                Browse all articles
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Feature article */}
              <div className="md:col-span-2 group cursor-pointer">
                <div className="relative h-64 rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-primary-container to-primary">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-2 inline-block">
                      Guides
                    </span>
                    <h3 className="text-white text-xl font-bold font-headline">
                      Resume Building for Trade Careers
                    </h3>
                  </div>
                </div>
              </div>

              {/* Card articles */}
              <div className="group cursor-pointer">
                <div className="bg-surface-container-lowest rounded-xl p-6 h-full shadow-sm flex flex-col justify-between hover:bg-primary hover:text-on-primary transition-all">
                  <div>
                    <span className="material-symbols-outlined text-secondary group-hover:text-secondary-fixed mb-4 block">
                      record_voice_over
                    </span>
                    <h3 className="text-lg font-bold mb-2 font-headline">
                      How to Interview
                    </h3>
                    <p className="text-on-surface-variant group-hover:text-on-primary/70 text-sm">
                      Actionable tips for making a great first impression.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center text-xs font-bold gap-2">
                    READ ARTICLE
                    <span className="material-symbols-outlined text-sm">trending_flat</span>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer">
                <div className="bg-surface-container-lowest rounded-xl p-6 h-full shadow-sm flex flex-col justify-between hover:bg-primary hover:text-on-primary transition-all">
                  <div>
                    <span className="material-symbols-outlined text-secondary group-hover:text-secondary-fixed mb-4 block">
                      account_balance_wallet
                    </span>
                    <h3 className="text-lg font-bold mb-2 font-headline">
                      Understanding Benefits
                    </h3>
                    <p className="text-on-surface-variant group-hover:text-on-primary/70 text-sm">
                      401k, health insurance, and local MS tax breaks explained.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center text-xs font-bold gap-2">
                    READ ARTICLE
                    <span className="material-symbols-outlined text-sm">trending_flat</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
