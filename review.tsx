"use client";

import { useState } from "react";
import { Star, ThumbsUp, MessageCircle, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReviewProps {
  id: string;
  studentName: string;
  studentAvatar?: string;
  date: string;
  professionalRating: number;
  communicationRating: number;
  punctualityRating: number;
  overallRating: number;
  comment: string;
  coachResponse?: string;
  isCoach?: boolean;
}

export function Review({
  id,
  studentName,
  studentAvatar,
  date,
  professionalRating,
  communicationRating,
  punctualityRating,
  overallRating,
  comment,
  coachResponse,
  isCoach = false,
}: ReviewProps) {
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [response, setResponse] = useState(coachResponse || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitResponse = () => {
    if (!response.trim()) return;
    
    setIsSubmitting(true);
    // 这里应该有一个API调用来保存教练回应
    setTimeout(() => {
      setIsSubmitting(false);
      setShowResponseForm(false);
      // 假设API调用成功，更新coachResponse
      coachResponse = response;
    }, 1000);
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ));
  };

  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={studentAvatar} alt={studentName} />
            <AvatarFallback>{studentName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{studentName}</div>
            <div className="text-sm text-gray-500">{date}</div>
          </div>
        </div>
        <div className="flex items-center">
          {renderStars(overallRating)}
          <span className="ml-2 font-medium">{overallRating.toFixed(1)}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-sm">
          <div className="text-gray-500 mb-1">专业水平</div>
          <div className="flex">{renderStars(professionalRating)}</div>
        </div>
        <div className="text-sm">
          <div className="text-gray-500 mb-1">沟通能力</div>
          <div className="flex">{renderStars(communicationRating)}</div>
        </div>
        <div className="text-sm">
          <div className="text-gray-500 mb-1">守时程度</div>
          <div className="flex">{renderStars(punctualityRating)}</div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-800">{comment}</p>
      </div>

      {coachResponse && !showResponseForm && (
        <div className="bg-gray-50 p-3 rounded-md mb-4">
          <div className="text-sm font-medium mb-2">教练回应：</div>
          <p className="text-gray-700">{coachResponse}</p>
        </div>
      )}

      {isCoach && !coachResponse && !showResponseForm && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowResponseForm(true)}
        >
          回应评价
        </Button>
      )}

      {isCoach && showResponseForm && (
        <div className="mt-4">
          <div className="text-sm font-medium mb-2">回应此评价：</div>
          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="感谢您的评价，我会继续努力提升..."
            className="mb-3"
          />
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={handleSubmitResponse}
              disabled={isSubmitting || !response.trim()}
            >
              {isSubmitting ? "提交中..." : "提交回应"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResponseForm(false)}
            >
              取消
            </Button>
          </div>
        </div>
      )}

      {!isCoach && (
        <div className="flex space-x-4 mt-4">
          <Button variant="ghost" size="sm" className="text-gray-500">
            <ThumbsUp className="h-4 w-4 mr-1" />
            有帮助
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-500">
            <Flag className="h-4 w-4 mr-1" />
            举报
          </Button>
        </div>
      )}
    </div>
  );
}
