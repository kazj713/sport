import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CourseList } from "@/components/course/course-list";

export default function StudentCoursesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header userType="student" />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto">
          <CourseList userType="student" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
