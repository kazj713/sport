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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Filter, 
  MessageCircle, 
  ThumbsUp, 
  Calendar, 
  Users, 
  BookOpen,
  Award,
  HelpCircle,
  MapPin
} from "lucide-react";

// 模拟文章数据
const mockArticles = [
  {
    id: "article1",
    title: "初学者瑜伽指南：从零开始的正确姿势",
    author: "张教练",
    authorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    date: "2025-03-10",
    category: "瑜伽",
    tags: ["初学者", "姿势指导", "呼吸技巧"],
    likes: 156,
    comments: 32,
    excerpt: "瑜伽不仅仅是一种锻炼方式，更是一种生活态度。本文将为初学者详细介绍基础姿势和呼吸技巧，帮助你正确开始瑜伽之旅...",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "article2",
    title: "科学增肌：打破健身房常见误区",
    author: "李教练",
    authorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    date: "2025-03-08",
    category: "力量训练",
    tags: ["增肌", "科学训练", "营养补充"],
    likes: 203,
    comments: 45,
    excerpt: "很多健身爱好者在增肌过程中走了不少弯路。本文基于最新运动科学研究，揭示健身房中常见的训练和营养误区，帮助你更高效地增肌...",
    image: "https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "article3",
    title: "马拉松备赛计划：从5公里到42公里",
    author: "王教练",
    authorAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
    date: "2025-03-05",
    category: "跑步",
    tags: ["马拉松", "训练计划", "耐力提升"],
    likes: 178,
    comments: 38,
    excerpt: "完成马拉松是许多跑步爱好者的梦想。本文提供了一个16周的渐进式训练计划，帮助你从轻松跑5公里到成功挑战全程马拉松...",
    image: "https://images.unsplash.com/photo-1530137073265-28247b5df622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

// 模拟讨论话题数据
const mockTopics = [
  {
    id: "topic1",
    title: "如何在工作日抽出时间进行有效训练？",
    author: "小明",
    authorAvatar: "https://randomuser.me/api/portraits/men/22.jpg",
    date: "2025-03-12",
    category: "健身讨论",
    replies: 24,
    views: 342,
    lastReply: "2025-03-13",
    excerpt: "作为一个朝九晚六的上班族，我发现很难在工作日找到时间进行有效的训练。大家有什么好的建议吗？"
  },
  {
    id: "topic2",
    title: "寻找北京朝阳区羽毛球伙伴",
    author: "小红",
    authorAvatar: "https://randomuser.me/api/portraits/women/22.jpg",
    date: "2025-03-11",
    category: "运动伙伴",
    replies: 15,
    views: 187,
    lastReply: "2025-03-13",
    excerpt: "我是一个中级水平的羽毛球爱好者，寻找北京朝阳区的羽毛球伙伴，周末一起打球。"
  },
  {
    id: "topic3",
    title: "分享我的减脂经验：3个月瘦了15公斤",
    author: "小华",
    authorAvatar: "https://randomuser.me/api/portraits/men/42.jpg",
    date: "2025-03-09",
    category: "减脂分享",
    replies: 56,
    views: 892,
    lastReply: "2025-03-13",
    excerpt: "我想分享我的减脂经验，通过科学的饮食和训练计划，3个月成功减掉了15公斤体重，同时保持了肌肉量。"
  }
];

// 模拟活动数据
const mockEvents = [
  {
    id: "event1",
    title: "城市5公里欢乐跑",
    organizer: "健康跑团",
    date: "2025-04-15",
    time: "09:00",
    location: "北京奥林匹克公园",
    participants: 128,
    maxParticipants: 200,
    description: "一场适合所有人参加的欢乐跑活动，没有比赛压力，享受跑步的乐趣。完成后有精美奖牌和健康小食。",
    image: "https://images.unsplash.com/photo-1530137073265-28247b5df622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "event2",
    title: "瑜伽与冥想工作坊",
    organizer: "张教练",
    date: "2025-03-25",
    time: "14:00-16:00",
    location: "阳光健身中心",
    participants: 18,
    maxParticipants: 20,
    description: "这个工作坊将结合瑜伽体式和冥想技巧，帮助参与者释放压力，找到内心平静。适合所有水平的参与者。",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "event3",
    title: "功能性训练挑战赛",
    organizer: "李教练",
    date: "2025-04-05",
    time: "10:00-12:00",
    location: "星光健身房",
    participants: 32,
    maxParticipants: 40,
    description: "一场充满挑战的功能性训练比赛，测试你的力量、耐力和灵活性。有多个难度级别可供选择，适合不同水平的参与者。",
    image: "https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

// 模拟求助问题数据
const mockQuestions = [
  {
    id: "question1",
    title: "如何改善跑步时的膝盖疼痛？",
    author: "跑步新手",
    authorAvatar: "https://randomuser.me/api/portraits/men/52.jpg",
    date: "2025-03-13",
    category: "跑步",
    status: "open",
    replies: 3,
    excerpt: "我最近开始跑步，但经常在跑完后感到膝盖疼痛。有什么方法可以改善这个问题吗？"
  },
  {
    id: "question2",
    title: "瑜伽倒立姿势的正确进入方法",
    author: "瑜伽学习者",
    authorAvatar: "https://randomuser.me/api/portraits/women/52.jpg",
    date: "2025-03-12",
    category: "瑜伽",
    status: "open",
    replies: 5,
    excerpt: "我一直在尝试瑜伽的倒立姿势，但总是无法稳定地保持。有没有教练可以分享一些技巧？"
  },
  {
    id: "question3",
    title: "健身增肌期间的营养摄入建议",
    author: "健身爱好者",
    authorAvatar: "https://randomuser.me/api/portraits/men/62.jpg",
    date: "2025-03-11",
    category: "营养",
    status: "solved",
    replies: 8,
    excerpt: "我正在进行增肌训练，想了解一下每天应该摄入多少蛋白质和碳水化合物？有没有具体的饮食计划推荐？"
  }
];

export function CommunityHub({ userType = "student" }: { userType?: "coach" | "student" | "admin" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      alert("请填写标题和内容");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 这里应该有一个API调用来创建帖子
      console.log("创建帖子:", {
        title: newPostTitle,
        content: newPostContent
      });
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 提交成功，重置表单
      setNewPostTitle("");
      setNewPostContent("");
      
      alert("帖子发布成功");
    } catch (error) {
      console.error("提交失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 过滤文章
  const filteredArticles = mockArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? article.category === categoryFilter : true;
    
    return matchesSearch && matchesCategory;
  });
  
  // 过滤话题
  const filteredTopics = mockTopics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? topic.category === categoryFilter : true;
    
    return matchesSearch && matchesCategory;
  });
  
  // 过滤活动
  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });
  
  // 过滤问题
  const filteredQuestions = mockQuestions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? question.category === categoryFilter : true;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">社区中心</h1>
      
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="搜索文章、话题或活动"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => {
            setSearchTerm("");
            setCategoryFilter("");
          }}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="articles" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="articles">
            <BookOpen className="h-4 w-4 mr-2" />
            专业内容
          </TabsTrigger>
          <TabsTrigger value="discussions">
            <MessageCircle className="h-4 w-4 mr-2" />
            讨论区
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="h-4 w-4 mr-2" />
            活动
          </TabsTrigger>
          <TabsTrigger value="questions">
            <HelpCircle className="h-4 w-4 mr-2" />
            求教广场
          </TabsTrigger>
          {userType === "coach" && (
            <TabsTrigger value="create">
              发布内容
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="articles" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.length === 0 ? (
              <div className="col-span-full bg-gray-100 p-6 rounded-lg text-center">
                <p>没有找到匹配的文章</p>
              </div>
            ) : (
              filteredArticles.map(article => (
                <Card key={article.id} className="overflow-hidden flex flex-col">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge>{article.category}</Badge>
                      <div className="text-sm text-gray-500">{article.date}</div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={article.authorAvatar} alt={article.author} />
                        <AvatarFallback>{article.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {article.author}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 flex-grow">
                    <p className="text-gray-700 line-clamp-3">{article.excerpt}</p>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {article.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-100">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between">
                    <div className="flex items-center text-gray-500 text-sm">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {article.likes}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {article.comments}
                    </div>
                    <Button variant="ghost" size="sm">
                      阅读全文
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="discussions" className="mt-0 space-y-4">
          {filteredTopics.length === 0 ? (
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p>没有找到匹配的讨论话题</p>
            </div>
          ) : (
            filteredTopics.map(topic => (
              <Card key={topic.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{topic.title}</CardTitle>
                    <Badge>{topic.category}</Badge>
                  </div>
                  <CardDescription className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={topic.authorAvatar} alt={topic.author} />
                      <AvatarFallback>{topic.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {topic.author} · {topic.date}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-gray-700">{topic.excerpt}</p>
                </CardContent>
                <CardFooter className="pt-2 flex justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {topic.replies} 回复
                    </div>
                    <div>
                      {topic.views} 浏览
                    </div>
                    <div>
                      最后回复: {topic.lastReply}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    查看讨论
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
          
          <div className="flex justify-center mt-4">
            <Button>
              <MessageCircle className="h-4 w-4 mr-2" />
              发起新讨论
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="events" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.length === 0 ? (
              <div className="col-span-full bg-gray-100 p-6 rounded-lg text-center">
                <p>没有找到匹配的活动</p>
              </div>
            ) : (
              filteredEvents.map(event => (
                <Card key={event.id} className="overflow-hidden flex flex-col">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                    </div>
                    <CardDescription className="flex items-center">
                      主办方: {event.organizer}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 flex-grow">
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        {event.date} {event.time}
                      </div>
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        {event.location}
                      </div>
                 <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>