"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Star } from "lucide-react";
import Link from "next/link";

interface CourseCardProps {
  id: string;
  title: string;
  coachName: string;
  coachAvatar?: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "all";
  price: number;
  rating?: number;
  reviewCount?: number;
  date: string;
  time: string;
  duration: number;
  location: string;
  maxStudents: number;
  enrolledStudents: number;
  imageUrl?: string;
}

export function CourseCard({
  id,
  title,
  coachName,
  coachAvatar,
  category,
  difficulty,
  price,
  rating,
  reviewCount,
  date,
  time,
  duration,
  location,
  maxStudents,
  enrolledStudents,
  imageUrl,
}: CourseCardProps) {
  const difficultyMap = {
    beginner: { label: "初级", color: "bg-green-100 text-green-800" },
    intermediate: { label: "中级", color: "bg-blue-100 text-blue-800" },
    advanced: { label: "高级", color: "bg-purple-100 text-purple-800" },
    all: { label: "全级别", color: "bg-gray-100 text-gray-800" },
  };

  const availableSpots = maxStudents - enrolledStudents;
  const isFullyBooked = availableSpots <= 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">{category}</span>
          </div>
        )}
        <Badge className={`absolute top-3 right-3 ${difficultyMap[difficulty].color}`}>
          {difficultyMap[difficulty].label}
        </Badge>
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="mb-2">
            {category}
          </Badge>
          {rating && (
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              {reviewCount && (
                <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>
              )}
            </div>
          )}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="flex items-center mt-1">
          <div className="w-6 h-6 rounded-full bg-gray-200 mr-2 overflow-hidden">
            {coachAvatar ? (
              <img src={coachAvatar} alt={coachName} className="w-full h-full object-cover" />
            ) : null}
          </div>
          {coachName}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span>{time} ({duration}分钟)</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-gray-500" />
            <span>
              {isFullyBooked ? "已满" : `剩余${availableSpots}个名额`} ({enrolledStudents}/{maxStudents})
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-0">
        <div className="text-lg font-bold">¥{price}</div>
        <Link href={`/courses/${id}`}>
          <Button disabled={isFullyBooked}>
            {isFullyBooked ? "已满" : "预订"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
