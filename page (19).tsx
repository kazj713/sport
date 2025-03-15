import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { VenueManagement } from "@/components/venue/venue-management";

export default function StudentVenuesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header userType="student" />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto">
          <VenueManagement userType="student" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
