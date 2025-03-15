import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RefundManagement } from "@/components/payment/refund-management";

export default function StudentRefundsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header userType="student" />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto">
          <RefundManagement userType="student" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
