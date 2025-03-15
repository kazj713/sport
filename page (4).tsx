import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CoachVerificationForm } from "@/components/auth/coach-verification-form";

export default function CoachVerificationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header userType="coach" />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto">
          <CoachVerificationForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
