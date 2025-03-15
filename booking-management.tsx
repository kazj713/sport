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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, User, CheckCircle, XCircle } from "lucide-react";
import { CourseCard } from "@/components/course-card";

// 模拟预订数据
const mockBookings = [
  {
    id: "booking1",
    courseId: "1",
    title: "初级瑜伽入门课程",
    coachName: "张教练",
    coachAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    date: "2025-03-20",
    time: "18:00",
    duration: 60,
    location: "阳光健身中心",
    status: "confirmed",
    paymentStatus: "paid",
    price: 99,
    bookingDate: "2025-03-10"
  },
  {
    id: "booking2",
    courseId: "2",
    title: "高强度间歇训练",
    coachName: "李教练",
    coachAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    date: "2025-03-25",
    time: "19:30",
    duration: 45,
    location: "星河体育馆",
    status: "confirmed",
    paymentStatus: "paid",
    price: 120,
    bookingDate: "2025-03-12"
  }
];

// 模拟学生数据
const mockStudents = [
  {
    id: "student1",
    name: "王小明",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    bookingId: "booking3",
    courseId: "1",
    date: "2025-03-20",
    time: "18:00",
    status: "confirmed",
    paymentStatus: "paid",
    bookingDate: "2025-03-15"
  },
  {
    id: "student2",
    name: "李小红",
    avatar: "https://randomuser.me/api/portraits/women/67.jpg",
    bookingId: "booking4",
    courseId: "1",
    date: "2025-03-20",
    time: "18:00",
    status: "confirmed",
    paymentStatus: "paid",
    bookingDate: "2025-03-14"
  },
  {
    id: "student3",
    name: "张小华",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    bookingId: "booking5",
    courseId: "1",
    date: "2025-03-20",
    time: "18:00",
    status: "pending",
    paymentStatus: "pending",
    bookingDate: "2025-03-16"
  }
];

// 模拟推荐课程
const mockRecommendedCourses = [
  {
    id: "3",
    title: "游泳技巧提升班",
    coachName: "王教练",
    category: "游泳",
    difficulty: "intermediate",
    price: 150,
    rating: 4.9,
    reviewCount: 32,
    date: "2025-03-22",
    time: "10:00",
    duration: 90,
    location: "城市游泳馆",
    maxStudents: 6,
    enrolledStudents: 3,
    imageUrl: "https://images.unsplash.com/photo-1560090995-01632a28895b?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: "4",
    title: "足球基础训练",
    coachName: "刘教练",
    category: "足球",
    difficulty: "beginner",
    price: 80,
    rating: 4.7,
    reviewCount: 15,
    date: "2025-03-23",
    time: "16:00",
    duration: 120,
    location: "中央公园",
    maxStudents: 15,
    enrolledStudents: 10,
    imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2670&auto=format&fit=crop"
  }
];

export function BookingManagement({ userType = "student" }: { userType?: "coach" | "student" }) {
  const router = useRouter();
  const [cancelingBookingId, setCancelingBookingId] = useState<string | null>(null);
  
  const handleCancelBooking = async (bookingId: string) => {
    setCancelingBookingId(bookingId);
    
    try {
      // 这里应该有一个API调用来取消预订
      console.log("取消预订:", bookingId);
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 假设取消成功，这里应该更新UI
      // 实际应用中应该重新获取预订列表
    } catch (error) {
      console.error("取消失败:", error);
    } finally {
      setCancelingBookingId(null);
    }
  };
  
  const handleApproveBooking = async (bookingId: string) => {
    try {
      // 这里应该有一个API调用来批准预订
      console.log("批准预订:", bookingId);
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 假设批准成功，这里应该更新UI
      // 实际应用中应该重新获取学生列表
    } catch (error) {
      console.error("批准失败:", error);
    }
  };
  
  const handleRejectBooking = async (bookingId: string) => {
    try {
      // 这里应该有一个API调用来拒绝预订
      console.log("拒绝预订:", bookingId);
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 假设拒绝成功，这里应该更新UI
      // 实际应用中应该重新获取学生列表
    } catch (error) {
      console.error("拒绝失败:", error);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">已确认</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">待确认</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">已取消</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">已完成</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };
  
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">已支付</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">待支付</Badge>;
      case "refunded":
        return <Badge className="bg-blue-100 text-blue-800">已退款</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {userType === "coach" ? "学生预订管理" : "我的预订"}
      </h1>
      
      <Tabs defaultValue={userType === "coach" ? "students" : "upcoming"} className="w-full">
        <TabsList className="mb-4">
          {userType === "coach" ? (
            <>
              <TabsTrigger value="students">学生预订</TabsTrigger>
              <TabsTrigger value="calendar">课程日历</TabsTrigger>
            </>
          ) : (
            <>
              <TabsTrigger value="upcoming">即将到来</TabsTrigger>
              <TabsTrigger value="past">历史预订</TabsTrigger>
              <TabsTrigger value="cancelled">已取消</TabsTrigger>
            </>
          )}
        </TabsList>
        
        {userType === "coach" ? (
          <>
            <TabsContent value="students" className="mt-0 space-y-4">
              {mockStudents.map(student => (
                <Card key={student.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-6 flex-grow">
                        <div className="flex items-center mb-4">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-gray-500">预订于 {student.bookingDate}</div>
                          </div>
                          <div className="ml-auto flex space-x-2">
                            {getStatusBadge(student.status)}
                            {getPaymentStatusBadge(student.paymentStatus)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{student.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{student.time}</span>
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-500" />
                            <span>预订ID: {student.bookingId}</span>
                          </div>
                        </div>
                      </div>
                      
                      {student.status === "pending" && (
                        <div className="bg-gray-50 p-4 flex flex-row md:flex-col justify-center items-center space-y-0 space-x-2 md:space-y-2 md:space-x-0">
                          <Button 
                            variant="outline" 
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleApproveBooking(student.bookingId)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            批准
                          </Button>
                          <Button 
                            variant="outline" 
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleRejectBooking(student.bookingId)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            拒绝
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="calendar" className="mt-0">
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <p>课程日历视图正在开发中</p>
              </div>
            </TabsContent>
          </>
        ) : (
          <>
            <TabsContent value="upcoming" className="mt-0 space-y-4">
              {mockBookings.map(booking => (
                <Card key={booking.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-6 flex-grow">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-medium">{booking.title}</h3>
                          <div className="flex space-x-2">
                            {getStatusBadge(booking.status)}
                            {getPaymentStatusBadge(booking.paymentStatus)}
                          </div>
                        </div>
                        
                        <div className="flex items-center mb-4">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={booking.coachAvatar} alt={booking.coachName} />
                            <AvatarFallback>{booking.coachName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">{booking.coachName}</div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{booking.time} ({booking.duration}分钟)</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">¥{booking.price}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 flex flex-row md:flex-col justify-center items-center space-y-0 space-x-2 md:space-y-2 md:space-x-0">
                        <Button 
                          variant="outline"
                          onClick={() => router.push(`/courses/${booking.courseId}`)}
                        >
                          查看详情
                        </Button>
                        <Button 
                          variant="outline" 
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          disabled={cancelingBookingId === booking.id}
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          {cancelingBookingId === booking.id ? "取消中..." : "取消预订"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="past" className="mt-0">
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <p>您没有历史预订记录</p>
              </div>
            </TabsContent>
            
            <TabsContent value="cancelled" className="mt-0">
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <p>您没有已取消的预订</p>
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
      
      {userType === "student" && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">推荐课程</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockRecommendedCourses.map(course => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
