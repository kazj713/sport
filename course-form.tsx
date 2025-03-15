"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

// 表单验证模式
const courseSchema = z.object({
  title: z.string().min(2, { message: "课程标题至少需要2个字符" }).max(100, { message: "课程标题最多100个字符" }),
  description: z.string().min(10, { message: "课程描述至少需要10个字符" }).max(1000, { message: "课程描述最多1000个字符" }),
  category: z.string().min(1, { message: "请选择运动类别" }),
  difficultyLevel: z.string().min(1, { message: "请选择难度级别" }),
  maxStudents: z.string().min(1, { message: "请输入最大学生数" }),
  durationMinutes: z.string().min(1, { message: "请输入课程时长" }),
  price: z.string().min(1, { message: "请输入课程价格" }),
  isRecurring: z.boolean().default(false),
  recurringPattern: z.string().optional(),
  venueId: z.string().optional(),
  equipmentRequired: z.string().max(500, { message: "所需装备描述最多500个字符" }),
  startDate: z.string().min(1, { message: "请选择开始日期" }),
  startTime: z.string().min(1, { message: "请选择开始时间" }),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export function CourseForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      difficultyLevel: "",
      maxStudents: "",
      durationMinutes: "",
      price: "",
      isRecurring: false,
      recurringPattern: "",
      venueId: "",
      equipmentRequired: "",
      startDate: "",
      startTime: "",
    },
  });

  const isRecurring = form.watch("isRecurring");

  const onSubmit = async (values: CourseFormValues) => {
    setIsSubmitting(true);
    
    try {
      // 这里应该有一个API调用来创建课程
      console.log("课程信息:", values);
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 创建成功后重定向到课程列表页面
      router.push("/coach/courses");
    } catch (error) {
      console.error("创建失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">创建新课程</CardTitle>
        <CardDescription>
          填写以下信息创建新的课程，学生将能够浏览和预订您的课程
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">基本信息</h3>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>课程标题</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：初级瑜伽入门课程" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>课程描述</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="详细描述课程内容、适合人群、预期效果等" 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>运动类别</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="请选择运动类别" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="football">足球</SelectItem>
                          <SelectItem value="basketball">篮球</SelectItem>
                          <SelectItem value="tennis">网球</SelectItem>
                          <SelectItem value="swimming">游泳</SelectItem>
                          <SelectItem value="yoga">瑜伽</SelectItem>
                          <SelectItem value="fitness">健身</SelectItem>
                          <SelectItem value="running">跑步</SelectItem>
                          <SelectItem value="martial-arts">武术</SelectItem>
                          <SelectItem value="dance">舞蹈</SelectItem>
                          <SelectItem value="golf">高尔夫</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="difficultyLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>难度级别</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="请选择难度级别" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">初级</SelectItem>
                          <SelectItem value="intermediate">中级</SelectItem>
                          <SelectItem value="advanced">高级</SelectItem>
                          <SelectItem value="all">全级别</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="maxStudents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>最大学生数</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" placeholder="例如：10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="durationMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>课程时长（分钟）</FormLabel>
                      <FormControl>
                        <Input type="number" min="15" step="15" placeholder="例如：60" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>课程价格（元）</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" placeholder="例如：199.99" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">时间和地点</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>开始日期</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>开始时间</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="isRecurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">周期性课程</FormLabel>
                      <FormDescription>
                        设置为周期性课程将按照固定模式重复
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {isRecurring && (
                <FormField
                  control={form.control}
                  name="recurringPattern"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>重复模式</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="请选择重复模式" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">每天</SelectItem>
                          <SelectItem value="weekly">每周</SelectItem>
                          <SelectItem value="biweekly">每两周</SelectItem>
                          <SelectItem value="monthly">每月</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        系统将根据重复模式自动创建多个课程实例
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="venueId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>训练场地</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择训练场地" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="venue1">阳光健身中心</SelectItem>
                        <SelectItem value="venue2">星河体育馆</SelectItem>
                        <SelectItem value="venue3">城市游泳馆</SelectItem>
                        <SelectItem value="venue4">中央公园</SelectItem>
                        <SelectItem value="venue5">瑜伽生活馆</SelectItem>
                        <SelectItem value="custom">自定义场地</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      选择已有场地或添加自定义场地
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">其他信息</h3>
              
              <FormField
                control={form.control}
                name="equipmentRequired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>所需装备</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="描述学生需要准备的装备，如运动服、瑜伽垫等" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "创建中..." : "创建课程"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
