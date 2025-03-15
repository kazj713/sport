"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, Users, Star, Heart, Share2, AlertCircle } from "lucide-react";
import { Review } from "@/components/review";

// 模拟课程详情数据
const mockCourseDetail = {
  id: "1",
  title: "初级瑜伽入门课程",
  description: "这是一个专为初学者设计的瑜伽课程，将教授基础的瑜伽姿势和呼吸技巧。通过这个课程，您将学习如何正确地进行瑜伽练习，提高身体的柔韧性和力量，同时减轻压力，提升心理健康。",
  coachName: "张教练",
  coachAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
  coachBio: "张教练拥有10年瑜伽教学经验，国际瑜伽联盟认证教练，专注于初学者瑜伽教学。",
  category: "瑜伽",
  difficulty: "beginner",
  price: 99,
  rating: 4.8,
  reviewCount: 24,
  date: "2025-03-20",
  time: "18:00",
  duration: 60,
  location: "阳光健身中心",
  address: "北京市朝阳区阳光里12号",
  maxStudents: 10,
  enrolledStudents: 6,
  imageUrl: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2670&auto=format&fit=crop",
  equipmentRequired: "瑜伽垫、舒适的运动服、水瓶",
  suitableFor: "所有想要开始瑜伽练习的初学者，无需任何瑜伽经验",
  objectives: [
    "学习基础瑜伽姿势和正确的呼吸技巧",
    "提高身体柔韧性和核心力量",
    "学习如何通过瑜伽减轻压力和焦虑",
    "建立日常瑜伽练习的基础"
  ],
  isRecurring: true,
  recurringPattern: "weekly",
  isFavorite: false
};

// 模拟评价数据
const mockReviews = [
  {
    id: "review1",
    studentName: "李明",
    studentAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    date: "2025-02-15",
    professionalRating: 5,
    communicationRating: 5,
    punctualityRating: 4,
    overallRating: 5,
    comment: "张教练的课程非常棒！作为一个完全的瑜伽初学者，我能够轻松跟上课程节奏，教练非常耐心地纠正我的姿势，让我感到很安心。课后我感觉身体放松了很多，已经预订了下一节课。",
    coachResponse: "谢谢您的评价，李明！很高兴能帮助您开始瑜伽之旅，期待在下一节课见到您！"
  },
  {
    id: "review2",
    studentName: "王芳",
    studentAvatar: "https://randomuser.me/api/portraits/women/67.jpg",
    date: "2025-02-10",
    professionalRating: 5,
    communicationRating: 4,
    punctualityRating: 5,
    overallRating: 4,
    comment: "这是我参加的第三节瑜伽课，张教练的教学方法很适合初学者，她会详细解释每个动作的要点和注意事项。课程节奏也很合适，不会太快也不会太慢。唯一的建议是可以增加一些更多的变体动作供选择。",
    coachResponse: ""
  }
];

export function CourseDetail({ userType = "student" }: { userType?: "coach" | "student" }) {
  const router = useRouter();
  const [isBooking, setIsBooking] = useState(false);
  const [isFavorite, setIsFavorite] = useState(mockCourseDetail.isFavorite);
  
  const handleBookCourse = async () => {
    setIsBooking(true);
    
    try {
      // 这里应该有一个API调用来预订课程
      console.log("预订课程:", mockCourseDetail.id);
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 预订成功后重定向到支付页面
      router.push(`/student/payment?courseId=${mockCourseDetail.id}`);
    } catch (error) {
      console.error("预订失败:", error);
      setIsBooking(false);
    }
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // 这里应该有一个API调用来更新收藏状态
  };
  
  const difficultyMap = {
    beginner: { label: "初级", color: "bg-green-100 text-green-800" },
    intermediate: { label: "中级", color: "bg-blue-100 text-blue-800" },
    advanced: { label: "高级", color: "bg-purple-100 text-purple-800" },
    all: { label: "全级别", color: "bg-gray-100 text-gray-800" },
  };
  
  const availableSpots = mockCourseDetail.maxStudents - mockCourseDetail.enrolledStudents;
  const isFullyBooked = availableSpots <= 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
            <img
              src={mockCourseDetail.imageUrl}
              alt={mockCourseDetail.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 flex space-x-2">
              <Badge className={difficultyMap[mockCourseDetail.difficulty as keyof typeof difficultyMap].color}>
                {difficultyMap[mockCourseDetail.difficulty as keyof typeof difficultyMap].label}
              </Badge>
              <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
                {mockCourseDetail.category}
              </Badge>
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-4">{mockCourseDetail.title}</h1>
            <div className="flex items-center mb-6">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={mockCourseDetail.coachAvatar} alt={mockCourseDetail.coachName} />
                <AvatarFallback>{mockCourseDetail.coachName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{mockCourseDetail.coachName}</div>
                <div className="text-sm text-gray-500">专业教练</div>
              </div>
              <div className="ml-auto flex items-center">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">{mockCourseDetail.rating}</span>
                <span className="text-gray-500 ml-1">({mockCourseDetail.reviewCount}条评价)</span>
              </div>
            </div>
            
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">课程详情</TabsTrigger>
                <TabsTrigger value="coach">教练介绍</TabsTrigger>
                <TabsTrigger value="reviews">学员评价</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">课程介绍</h3>
                  <p className="text-gray-700">{mockCourseDetail.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">课程目标</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {mockCourseDetail.objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">适合人群</h3>
                  <p className="text-gray-700">{mockCourseDetail.suitableFor}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">所需装备</h3>
                  <p className="text-gray-700">{mockCourseDetail.equipmentRequired}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="coach" className="space-y-4">
                <div className="flex items-center">
                  <Avatar className="h-16 w-16 mr-4">
                    <AvatarImage src={mockCourseDetail.coachAvatar} alt={mockCourseDetail.coachName} />
                    <AvatarFallback>{mockCourseDetail.coachName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-medium">{mockCourseDetail.coachName}</h3>
                    <div className="flex items-center text-gray-500">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{mockCourseDetail.rating} · {mockCourseDetail.reviewCount}条评价</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700">{mockCourseDetail.coachBio}</p>
                
                <Button variant="outline" className="mt-2">
                  查看教练完整资料
                </Button>
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">学员评价 ({mockReviews.length})</h3>
                  {userType === "student" && (
                    <Button variant="outline" size="sm">
                      写评价
                    </Button>
                  )}
                </div>
                
                {mockReviews.map(review => (
                  <Review
                    key={review.id}
                    id={review.id}
                    studentName={review.studentName}
                    studentAvatar={review.studentAvatar}
                    date={review.date}
                    professionalRating={review.professionalRating}
                    communicationRating={review.communicationRating}
                    punctualityRating={review.punctualityRating}
                    overallRating={review.overallRating}
                    comment={review.comment}
                    coachResponse={review.coachResponse}
                    isCoach={userType === "coach"}
                  />
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">¥{mockCourseDetail.price}</CardTitle>
              <CardDescription>单次课程价格</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <div className="font-medium">日期</div>
                    <div className="text-gray-600">{mockCourseDetail.date}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <div className="font-medium">时间</div>
                    <div className="text-gray-600">{mockCourseDetail.time} ({mockCourseDetail.duration}分钟)</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <div className="font-medium">地点</div>
                    <div className="text-gray-600">{mockCourseDetail.location}</div>
                    <div className="text-sm text-gray-500">{mockCourseDetail.address}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <div className="font-medium">名额</div>
                    <div className="text-gray-600">
                      {isFullyBooked ? (
                        <span className="text-red-500">已满</span>
                      ) : (
                        <span>剩余{availableSpots}个名额</span>
                      )}
                      <span className="text-gray-500 ml-1">({mockCourseDetail.enrolledStudents}/{mockCourseDetail.maxStudents})</span>
                    </div>
                  </div>
                </div>
                
                {mockCourseDetail.isRecurring && (
                  <div className="flex items-start pt-2">
                    <AlertCircle className="h-5 w-5 mr-3 text-blue-500" />
                    <div className="text-sm text-blue-700 bg-blue-50 p-2 rounded-md flex-1">
                      这是一个周期性课程，每{mockCourseDetail.recurringPattern === "weekly" ? "周" : "月"}重复一次
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              {userType === "student" ? (
                <>
                  <Button 
                    className="w-full" 
                    disabled={isBooking || isFullyBooked}
                    onClick={handleBookCourse}
                  >
                    {isBooking ? "预订中..." : isFullyBooked ? "已满" : "立即预订"}
                  </Button>
                  
                  <div className="flex w-full space-x-2">
                    <Button 
                      variant="outline" 
                      className={`flex-1 ${isFavorite ? "text-red-500" : ""}`}
                      onClick={toggleFavorite}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                      {isFavorite ? "已收藏" : "收藏"}
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share2 className="h-4 w-4 mr-2" />
                      分享
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Button className="w-full">
                    编辑课程
                  </Button>
                  <Button variant="outline" className="w-full">
                    管理预订
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
