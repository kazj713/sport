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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageCircle } from "lucide-react";

interface ReviewFormProps {
  courseId: string;
  courseTitle: string;
  coachName: string;
  coachAvatar: string;
}

export function ReviewForm({ courseId, courseTitle, coachName, coachAvatar }: ReviewFormProps) {
  const [professionalRating, setProfessionalRating] = useState(0);
  const [communicationRating, setCommunicationRating] = useState(0);
  const [punctualityRating, setPunctualityRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = async () => {
    if (professionalRating === 0 || communicationRating === 0 || punctualityRating === 0) {
      alert("请为所有评分项打分");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 这里应该有一个API调用来提交评价
      console.log("提交评价:", {
        courseId,
        professionalRating,
        communicationRating,
        punctualityRating,
        comment
      });
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 提交成功
      setIsSubmitted(true);
    } catch (error) {
      console.error("提交失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const overallRating = Math.round((professionalRating + communicationRating + punctualityRating) / 3);
  
  const StarRating = ({ rating, setRating, label }: { rating: number, setRating: (rating: number) => void, label: string }) => {
    return (
      <div className="space-y-2">
        <div className="font-medium">{label}</div>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-6 w-6 cursor-pointer ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
      </div>
    );
  };
  
  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-green-100">
            <MessageCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-medium mb-2">评价已提交</h3>
          <p className="text-gray-600 mb-4">
            感谢您的反馈！您的评价将帮助其他学生了解这门课程。
          </p>
          <div className="flex justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-6 w-6 ${star <= overallRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>评价课程</CardTitle>
        <CardDescription>
          请分享您对这门课程的体验和反馈
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center">
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage src={coachAvatar} alt={coachName} />
            <AvatarFallback>{coachName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{coachName}</div>
            <div className="text-sm text-gray-500">{courseTitle}</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <StarRating 
            rating={professionalRating} 
            setRating={setProfessionalRating} 
            label="专业水平" 
          />
          
          <StarRating 
            rating={communicationRating} 
            setRating={setCommunicationRating} 
            label="沟通能力" 
          />
          
          <StarRating 
            rating={punctualityRating} 
            setRating={setPunctualityRating} 
            label="守时程度" 
          />
        </div>
        
        <div className="space-y-2">
          <div className="font-medium">评价内容</div>
          <Textarea
            placeholder="请分享您对这门课程的体验和反馈，包括教练的教学方法、课程内容、场地环境等方面..."
            className="min-h-[120px]"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "提交中..." : "提交评价"}
        </Button>
      </CardFooter>
    </Card>
  );
}
