import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import IntakeWizard from "@/components/intake/IntakeWizard";

export default function AssessPage() {
  return (
    <>
      <Nav activePage="optimizer" />
      <main className="pt-24 min-h-screen bg-background">
        <IntakeWizard />
      </main>
      <Footer />
    </>
  );
}
