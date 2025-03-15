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
import { Checkbox } from "@/components/ui/checkbox";

// 表单验证模式
const studentProfileSchema = z.object({
  dateOfBirth: z.string().min(1, { message: "请选择出生日期" }),
  fitnessLevel: z.string().min(1, { message: "请选择健身水平" }),
  healthInfo: z.string().max(500, { message: "健康信息最多500个字符" }),
  trainingGoals: z.string().min(10, { message: "训练目标至少需要10个字符" }).max(500, { message: "训练目标最多500个字符" }),
  preferredSports: z.array(z.string()).min(1, { message: "请至少选择一个偏好运动" }),
});

type StudentProfileFormValues = z.infer<typeof studentProfileSchema>;

const sportsOptions = [
  { id: "football", label: "足球" },
  { id: "basketball", label: "篮球" },
  { id: "tennis", label: "网球" },
  { id: "swimming", label: "游泳" },
  { id: "yoga", label: "瑜伽" },
  { id: "fitness", label: "健身" },
  { id: "running", label: "跑步" },
  { id: "martial-arts", label: "武术" },
  { id: "dance", label: "舞蹈" },
  { id: "golf", label: "高尔夫" },
];

export function StudentProfileForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StudentProfileFormValues>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: {
      dateOfBirth: "",
      fitnessLevel: "",
      healthInfo: "",
      trainingGoals: "",
      preferredSports: [],
    },
  });

  const onSubmit = async (values: StudentProfileFormValues) => {
    setIsSubmitting(true);
    
    try {
      // 这里应该有一个API调用来提交学生资料
      console.log("学生资料:", values);
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 提交成功后重定向到学生仪表盘
      router.push("/student/dashboard");
    } catch (error) {
      console.error("提交失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">完善学生资料</CardTitle>
        <CardDescription>
          请提供您的个人资料和训练偏好，帮助我们为您推荐合适的教练和课程
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">基本信息</h3>
              
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>出生日期</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      您的年龄信息将用于推荐适合的训练计划
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fitnessLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>健身水平</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择您的健身水平" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">初学者 - 刚开始运动</SelectItem>
                        <SelectItem value="intermediate">中级 - 有一定运动基础</SelectItem>
                        <SelectItem value="advanced">高级 - 经常锻炼，有较好体能</SelectItem>
                        <SelectItem value="expert">专业 - 有竞技经验或专业训练</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="healthInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>健康信息（可选）</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="请描述任何健康状况、伤病史或需要特别注意的事项" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      这些信息将帮助教练为您制定安全有效的训练计划
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">训练偏好</h3>
              
              <FormField
                control={form.control}
                name="trainingGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>训练目标</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="请描述您的训练目标，例如：增肌、减脂、提高某项运动技能等" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="preferredSports"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">偏好运动</FormLabel>
                      <FormDescription>
                        请选择您感兴趣的运动类型
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {sportsOptions.map((sport) => (
                        <FormField
                          key={sport.id}
                          control={form.control}
                          name="preferredSports"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={sport.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(sport.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, sport.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== sport.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {sport.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full student-theme" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "提交中..." : "保存资料"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
