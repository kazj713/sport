import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CommunityHub } from "@/components/community/community-hub";

export default function StudentCommunityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header userType="student" />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto">
          <CommunityHub userType="student" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
