import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TransactionManagement } from "@/components/payment/transaction-management";

export default function CoachTransactionsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header userType="coach" />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto">
          <TransactionManagement userType="coach" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
