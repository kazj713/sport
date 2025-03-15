import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BookingManagement } from "@/components/course/booking-management";

export default function StudentBookingsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header userType="student" />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto">
          <BookingManagement userType="student" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
