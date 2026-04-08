import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-slate-200/50 bg-slate-100">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 max-w-7xl mx-auto">
        <div className="mb-8 md:mb-0">
          <div className="font-headline font-bold text-blue-950 text-xl mb-2">
            IncomePath AI
          </div>
          <p className="font-body text-sm tracking-wide text-slate-500">
            © 2025 IncomePath AI. The Editorial Architect.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 font-body text-sm tracking-wide">
          {[
            { label: "Methodology", href: "#" },
            { label: "Salary Data", href: "#" },
            { label: "Privacy", href: "#" },
            { label: "Support", href: "#" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-slate-500 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
