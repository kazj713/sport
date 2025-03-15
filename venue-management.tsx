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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, MapPin, Users, Filter, Search, Info } from "lucide-react";

// 模拟场地数据
const mockVenues = [
  {
    id: "venue1",
    name: "阳光健身中心",
    address: "北京市朝阳区建国路88号",
    type: "健身房",
    facilities: ["器械区", "有氧区", "瑜伽室", "淋浴间", "更衣室"],
    openHours: "06:00-22:00",
    rating: 4.8,
    reviewCount: 245,
    pricePerHour: 200,
    images: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"],
    capacity: 30,
    description: "位于市中心的现代化健身中心，配备先进的健身器材和专业的训练空间。适合个人训练和小班课程。"
  },
  {
    id: "venue2",
    name: "蓝天游泳馆",
    address: "北京市海淀区中关村大街1号",
    type: "游泳池",
    facilities: ["标准泳道", "儿童池", "SPA区", "淋浴间", "更衣室", "储物柜"],
    openHours: "08:00-21:00",
    rating: 4.5,
    reviewCount: 189,
    pricePerHour: 150,
    images: ["https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"],
    capacity: 50,
    description: "专业标准游泳馆，配备8条25米泳道和恒温水系统。提供游泳培训和水上健身课程。"
  },
  {
    id: "venue3",
    name: "星光篮球馆",
    address: "北京市西城区西直门外大街1号",
    type: "篮球场",
    facilities: ["标准球场", "观众席", "更衣室", "饮水区"],
    openHours: "09:00-22:00",
    rating: 4.7,
    reviewCount: 156,
    pricePerHour: 300,
    images: ["https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"],
    capacity: 20,
    description: "室内标准篮球场，木质地板，配备电子记分牌和专业照明系统。适合比赛和训练。"
  }
];

// 模拟预订数据
const mockBookings = [
  {
    id: "booking1",
    venueId: "venue1",
    venueName: "阳光健身中心",
    date: "2025-03-20",
    startTime: "10:00",
    endTime: "12:00",
    status: "confirmed",
    purpose: "瑜伽课程",
    attendees: 8
  },
  {
    id: "booking2",
    venueId: "venue3",
    venueName: "星光篮球馆",
    date: "2025-03-22",
    startTime: "14:00",
    endTime: "16:00",
    status: "pending",
    purpose: "篮球训练",
    attendees: 12
  }
];

export function VenueManagement({ userType = "coach" }: { userType?: "coach" | "student" | "admin" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingStartTime, setBookingStartTime] = useState("");
  const [bookingEndTime, setBookingEndTime] = useState("");
  const [bookingPurpose, setBookingPurpose] = useState("");
  const [bookingAttendees, setBookingAttendees] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 过滤场地
  const filteredVenues = mockVenues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter ? venue.type === typeFilter : true;
    
    return matchesSearch && matchesType;
  });
  
  const handleBookVenue = async () => {
    if (!selectedVenue || !bookingDate || !bookingStartTime || !bookingEndTime || !bookingPurpose || !bookingAttendees) {
      alert("请填写所有预订信息");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 这里应该有一个API调用来提交场地预订
      console.log("提交场地预订:", {
        venueId: selectedVenue,
        date: bookingDate,
        startTime: bookingStartTime,
        endTime: bookingEndTime,
        purpose: bookingPurpose,
        attendees: bookingAttendees
      });
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 提交成功，重置表单
      setSelectedVenue(null);
      setBookingDate("");
      setBookingStartTime("");
      setBookingEndTime("");
      setBookingPurpose("");
      setBookingAttendees("");
      
      alert("场地预订申请已提交，等待确认");
    } catch (error) {
      console.error("提交失败:", error);
    } finally {
      setIsSubmitting(false);
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
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {userType === "coach" ? "场地管理" : "场地服务"}
      </h1>
      
      <Tabs defaultValue="venues" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="venues">场地列表</TabsTrigger>
          <TabsTrigger value="bookings">我的预订</TabsTrigger>
          {userType === "admin" && <TabsTrigger value="management">场地管理</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="venues" className="mt-0 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="搜索场地名称、地址或描述"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="场地类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">全部类型</SelectItem>
                  <SelectItem value="健身房">健身房</SelectItem>
                  <SelectItem value="游泳池">游泳池</SelectItem>
                  <SelectItem value="篮球场">篮球场</SelectItem>
                  <SelectItem value="足球场">足球场</SelectItem>
                  <SelectItem value="网球场">网球场</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" onClick={() => {
                setSearchTerm("");
                setTypeFilter("");
              }}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVenues.length === 0 ? (
              <div className="col-span-full bg-gray-100 p-6 rounded-lg text-center">
                <p>没有找到匹配的场地</p>
              </div>
            ) : (
              filteredVenues.map(venue => (
                <Card key={venue.id} className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={venue.images[0]} 
                      alt={venue.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{venue.name}</CardTitle>
                      <Badge>{venue.type}</Badge>
                    </div>
                    <CardDescription className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {venue.address}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="text-sm text-gray-600">{venue.openHours}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="text-sm text-gray-600">容量: {venue.capacity}人</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <span className="text-amber-500 font-medium mr-1">{venue.rating}</span>
                        <span className="text-sm text-gray-600">({venue.reviewCount}条评价)</span>
                      </div>
                      <div className="text-sm font-medium">¥{venue.pricePerHour}/小时</div>
                    </div>
                    
                    <div className="text-sm text-gray-700 line-clamp-2 mb-2">
                      {venue.description}
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {venue.facilities.slice(0, 3).map((facility, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-100">
                          {facility}
                        </Badge>
                      ))}
                      {venue.facilities.length > 3 && (
                        <Badge variant="outline" className="bg-gray-100">
                          +{venue.facilities.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => setSelectedVenue(venue.id)}
                    >
                      预订场地
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
          
          {selectedVenue && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>预订场地</CardTitle>
                <CardDescription>
                  {mockVenues.find(v => v.id === selectedVenue)?.name} - 
                  {mockVenues.find(v => v.id === selectedVenue)?.address}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">日期</label>
                    <Input 
                      type="date" 
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">开始时间</label>
                      <Input 
                        type="time" 
                        value={bookingStartTime}
                        onChange={(e) => setBookingStartTime(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">结束时间</label>
                      <Input 
                        type="time" 
                        value={bookingEndTime}
                        onChange={(e) => setBookingEndTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">用途</label>
                  <Input 
                    placeholder="例如：瑜伽课程、篮球训练等" 
                    value={bookingPurpose}
                    onChange={(e) => setBookingPurpose(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">预计人数</label>
                  <Input 
                    type="number" 
                    placeholder="参与人数" 
                    value={bookingAttendees}
                    onChange={(e) => setBookingAttendees(e.target.value)}
                  />
                </div>
                
                <div className="bg-blue-50 p-3 rounded-md flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-blue-700">
                    场地预订需提前至少24小时申请，预订成功后将收到确认通知。
                    如需取消，请至少提前12小时操作，否则可能产生取消费用。
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedVenue(null)}
                >
                  取消
                </Button>
                <Button 
                  onClick={handleBookVenue}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "提交中..." : "确认预订"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="bookings" className="mt-0">
          {mockBookings.length === 0 ? (
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p>您还没有场地预订记录</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mockBookings.map(booking => (
                <Card key={booking.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{booking.venueName}</CardTitle>
                      {getStatusBadge(booking.status)}
                    </div>
                    <CardDescription>
                      预订ID: {booking.id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-gray-700">{booking.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-gray-700">{booking.startTime} - {booking.endTime}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-gray-700">
                          <span className="text-gray-500 mr-2">用途:</span>
                          {booking.purpose}
                        </div>
                        <div className="text-gray-700">
                          <span className="text-gray-500 mr-2">人数:</span>
                          {booking.attendees}人
                        </div>
                      </div>
                    </div>
                  </Card<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>