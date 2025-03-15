import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PaymentForm } from "@/components/payment/payment-form";

interface PaymentPageProps {
  searchParams: {
    courseId?: string;
  };
}

export default function PaymentPage({ searchParams }: PaymentPageProps) {
  const courseId = searchParams.courseId || "1"; // 默认使用ID 1，实际应用中应该验证
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header userType="student" />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto">
          <PaymentForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
