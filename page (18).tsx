import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { VenueManagement } from "@/components/venue/venue-management";

export default function CoachVenuesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header userType="coach" />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto">
          <VenueManagement userType="coach" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
