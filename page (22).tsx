import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CourseDetail } from "@/components/course/course-detail";

interface CourseDetailPageProps {
  params: {
    id: string;
  };
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header userType="student" />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto">
          <CourseDetail userType="student" />
        </div>
      </main>
      <Footer />
    </div>
  );
}