import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ReviewManagement } from "@/components/review/review-management";

export default function CoachReviewsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header userType="coach" />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto">
          <ReviewManagement userType="coach" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
