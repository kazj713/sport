import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ReviewForm } from "@/components/review/review-form";

interface ReviewPageProps {
  params: {
    id: string;
  };
}

// 模拟课程数据
const mockCourseData = {
  id: "1",
  title: "初级瑜伽入门课程",
  coachName: "张教练",
  coachAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
};

export default function ReviewPage({ params }: ReviewPageProps) {
  const courseId = params.id;
  
  // 实际应用中应该根据courseId获取课程信息
  const courseData = mockCourseData;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header userType="student" />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto max-w-md">
          <ReviewForm 
            courseId={courseId}
            courseTitle={courseData.title}
            coachName={courseData.coachName}
            coachAvatar={courseData.coachAvatar}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
