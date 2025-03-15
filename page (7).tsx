import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CourseForm } from "@/components/course/course-form";

export default function CreateCoursePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header userType="coach" />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto">
          <CourseForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
