import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RegisterForm } from "@/components/auth/register-form";

interface RegisterPageProps {
  params: {
    type: "coach" | "student";
  };
}

export default function RegisterPage({ params }: RegisterPageProps) {
  const userType = params.type as "coach" | "student";
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto">
          <RegisterForm userType={userType} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
