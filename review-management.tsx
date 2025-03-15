"use client";

import { useState } from "react";
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
import { Star, Search, Filter, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 模拟评价数据
const mockReviews = [
  {
    id: "review1",
    courseId: "1",
    courseTitle: "初级瑜伽入门课程",
    studentName: "王小明",
    studentAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    date: "2025-03-15",
    professionalRating: 5,
    communicationRating: 5,
    punctualityRating: 4,
    overallRating: 5,
    comment: "张教练的课程非常棒！作为一个完全的瑜伽初学者，我能够轻松跟上课程节奏，教练非常耐心地纠正我的姿势，让我感到很安心。课后我感觉身体放松了很多，已经预订了下一节课。",
    coachResponse: "谢谢您的评价，王小明！很高兴能帮助您开始瑜伽之旅，期待在下一节课见到您！",
    hasResponse: true
  },
  {
    id: "review2",
    courseId: "1",
    courseTitle: "初级瑜伽入门课程",
    studentName: "李小红",
    studentAvatar: "https://randomuser.me/api/portraits/women/67.jpg",
    date: "2025-03-10",
    professionalRating: 5,
    communicationRating: 4,
    punctualityRating: 5,
    overallRating: 4,
    comment: "这是我参加的第三节瑜伽课，张教练的教学方法很适合初学者，她会详细解释每个动作的要点和注意事项。课程节奏也很合适，不会太快也不会太慢。唯一的建议是可以增加一些更多的变体动作供选择。",
    coachResponse: "",
    hasResponse: false
  },
  {
    id: "review3",
    courseId: "2",
    courseTitle: "高强度间歇训练",
    studentName: "张小华",
    studentAvatar: "https://randomuser.me/api/portraits/men/44.jpg",
    date: "2025-03-12",
    professionalRating: 4,
    communicationRating: 5,
    punctualityRating: 5,
    overallRating: 5,
    comment: "李教练的高强度训练课程非常有挑战性，但也很有成就感。每次课后都能感觉到明显的进步。教练会根据每个人的情况调整难度，非常专业。场地设备也很齐全，推荐给想要提高体能的朋友。",
    coachResponse: "感谢您的评价，张小华！很高兴看到您在训练中取得进步，我们会继续努力提供高质量的课程体验。",
    hasResponse: true
  }
];

export function ReviewManagement({ userType = "coach" }: { userType?: "coach" | "student" | "admin" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [responseFilter, setResponseFilter] = useState("");
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 过滤评价
  const filteredReviews = mockReviews.filter(review => {
    const matchesSearch = review.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter ? review.overallRating.toString() === ratingFilter : true;
    const matchesResponse = responseFilter === "" ? true : 
                           responseFilter === "responded" ? review.hasResponse : 
                           responseFilter === "pending" ? !review.hasResponse : true;
    
    return matchesSearch && matchesRating && matchesResponse;
  });
  
  const handleSubmitResponse = async (reviewId: string) => {
    if (!responseText.trim()) {
      alert("请输入回复内容");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 这里应该有一个API调用来提交回复
      console.log("提交回复:", {
        reviewId,
        response: responseText
      });
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 提交成功，重置状态
      setResponseText("");
      setActiveReviewId(null);
      
      // 实际应用中应该重新获取评价列表
    } catch (error) {
      console.error("提交失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {userType === "coach" ? "学员评价管理" : "课程评价"}
      </h1>
      
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="搜索评价、课程或学生"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="评分" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">全部评分</SelectItem>
              <SelectItem value="5">5星</SelectItem>
              <SelectItem value="4">4星</SelectItem>
              <SelectItem value="3">3星</SelectItem>
              <SelectItem value="2">2星</SelectItem>
              <SelectItem value="1">1星</SelectItem>
            </SelectContent>
          </Select>
          
          {userType === "coach" && (
            <Select value={responseFilter} onValueChange={setResponseFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="回复状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部状态</SelectItem>
                <SelectItem value="responded">已回复</SelectItem>
                <SelectItem value="pending">待回复</SelectItem>
              </SelectContent>
            </Select>
          )}
          
          <Button variant="outline" size="icon" onClick={() => {
            setSearchTerm("");
            setRatingFilter("");
            setResponseFilter("");
          }}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <p>没有找到匹配的评价</p>
          </div>
        ) : (
          filteredReviews.map(review => (
            <Card key={review.id} className={activeReviewId === review.id ? "border-primary" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={review.studentAvatar} alt={review.studentName} />
                      <AvatarFallback>{review.studentName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{review.studentName}</div>
                      <div className="text-sm text-gray-500">{review.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2">{review.overallRating}.0</div>
                    {renderStars(review.overallRating)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">课程: {review.courseTitle}</div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-sm">
                    <div className="text-gray-500">专业水平</div>
                    {renderStars(review.professionalRating)}
                  </div>
                  <div className="text-sm">
                    <div className="text-gray-500">沟通能力</div>
                    {renderStars(review.communicationRating)}
                  </div>
                  <div className="text-sm">
                    <div className="text-gray-500">守时程度</div>
                    {renderStars(review.punctualityRating)}
                  </div>
                </div>
                
                {review.hasResponse && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center mb-2">
                      <MessageCircle className="h-4 w-4 mr-2 text-primary" />
                      <div className="text-sm font-medium">教练回复</div>
                    </div>
                    <p className="text-sm text-gray-700">{review.coachResponse}</p>
                  </div>
                )}
              </CardContent>
              
              {userType === "coach" && !review.hasResponse && (
                <CardFooter className="pt-2">
                  {activeReviewId === review.id ? (
                    <div className="w-full space-y-3">
                      <Textarea
                        placeholder="输入您的回复..."
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setActiveReviewId(null);
                            setResponseText("");
                          }}
                        >
                          取消
                        </Button>
                        <Button 
                          onClick={() => handleSubmitResponse(review.id)}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "提交中..." : "提交回复"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setActiveReviewId(review.id)}
                    >
                      回复评价
                    </Button>
                  )}
                </CardFooter>
              )}
            </Card>
          ))
        )}
      </div>
      
      {userType === "coach" && (
        <div className="bg-blue-50 p-4 rounded-md flex items-start">
          <MessageCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-blue-700">
            <p className="font-medium mb-1">评价回复提示</p>
            <p className="text-sm">
              积极回应学员的评价可以提高您的专业形象和信誉度。即使是负面评价，也请保持专业和礼貌，
              解释情况并提出改进方案。您的回复将对其他潜在学员产生重要影响。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
