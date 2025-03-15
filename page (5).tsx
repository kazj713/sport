import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StudentProfileForm } from "@/components/auth/student-profile-form";

export default function StudentProfilePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header userType="student" />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto">
          <StudentProfileForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
