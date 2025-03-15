"use client";

import { useState } from "react";
import { CourseCard } from "@/components/course-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Calendar, List } from "lucide-react";
import Link from "next/link";

// 模拟课程数据
const mockCourses = [
  {
    id: "1",
    title: "初级瑜伽入门课程",
    coachName: "张教练",
    category: "瑜伽",
    difficulty: "beginner",
    price: 99,
    rating: 4.8,
    reviewCount: 24,
    date: "2025-03-20",
    time: "18:00",
    duration: 60,
    location: "阳光健身中心",
    maxStudents: 10,
    enrolledStudents: 6,
    imageUrl: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "高强度间歇训练",
    coachName: "李教练",
    category: "健身",
    difficulty: "advanced",
    price: 120,
    rating: 4.5,
    reviewCount: 18,
    date: "2025-03-21",
    time: "19:30",
    duration: 45,
    location: "星河体育馆",
    maxStudents: 8,
    enrolledStudents: 8,
    imageUrl: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=2670&auto=format&fit=crop"
  },
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

export function CourseList({ userType = "student" }: { userType?: "coach" | "student" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");

  // 过滤课程
  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.coachName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? course.category === categoryFilter : true;
    const matchesDifficulty = difficultyFilter ? course.difficulty === difficultyFilter : true;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">
          {userType === "coach" ? "我的课程" : "浏览课程"}
        </h1>
        
        {userType === "coach" && (
          <Link href="/coach/courses/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              创建课程
            </Button>
          </Link>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="搜索课程或教练"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="运动类别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">全部类别</SelectItem>
              <SelectItem value="瑜伽">瑜伽</SelectItem>
              <SelectItem value="健身">健身</SelectItem>
              <SelectItem value="游泳">游泳</SelectItem>
              <SelectItem value="足球">足球</SelectItem>
              <SelectItem value="篮球">篮球</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="难度级别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">全部级别</SelectItem>
              <SelectItem value="beginner">初级</SelectItem>
              <SelectItem value="intermediate">中级</SelectItem>
              <SelectItem value="advanced">高级</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("calendar")}
              className="rounded-none"
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue={userType === "coach" ? "active" : "all"} className="w-full">
        <TabsList className="mb-4">
          {userType === "coach" ? (
            <>
              <TabsTrigger value="active">进行中</TabsTrigger>
              <TabsTrigger value="upcoming">即将开始</TabsTrigger>
              <TabsTrigger value="past">已结束</TabsTrigger>
              <TabsTrigger value="draft">草稿</TabsTrigger>
            </>
          ) : (
            <>
              <TabsTrigger value="all">全部课程</TabsTrigger>
              <TabsTrigger value="booked">已预订</TabsTrigger>
              <TabsTrigger value="recommended">推荐课程</TabsTrigger>
              <TabsTrigger value="favorites">收藏课程</TabsTrigger>
            </>
          )}
        </TabsList>
        
        {userType === "coach" ? (
          <>
            <TabsContent value="active" className="mt-0">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCourses.map(course => (
                    <CourseCard key={course.id} {...course} />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-100 p-6 rounded-lg text-center">
                  <p>日历视图正在开发中</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="upcoming" className="mt-0">
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <p>没有即将开始的课程</p>
              </div>
            </TabsContent>
            <TabsContent value="past" className="mt-0">
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <p>没有已结束的课程</p>
              </div>
            </TabsContent>
            <TabsContent value="draft" className="mt-0">
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <p>没有草稿课程</p>
              </div>
            </TabsContent>
          </>
        ) : (
          <>
            <TabsContent value="all" className="mt-0">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCourses.map(course => (
                    <CourseCard key={course.id} {...course} />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-100 p-6 rounded-lg text-center">
                  <p>日历视图正在开发中</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="booked" className="mt-0">
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <p>您还没有预订任何课程</p>
              </div>
            </TabsContent>
            <TabsContent value="recommended" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCourses.slice(0, 2).map(course => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="favorites" className="mt-0">
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <p>您还没有收藏任何课程</p>
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
