"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

// 表单验证模式
const coachVerificationSchema = z.object({
  idNumber: z.string().min(1, { message: "请输入身份证号码" }),
  bio: z.string().min(10, { message: "简介至少需要10个字符" }).max(500, { message: "简介最多500个字符" }),
  yearsOfExperience: z.string().min(1, { message: "请选择经验年限" }),
  hourlyRate: z.string().min(1, { message: "请输入小时收费" }),
  mainSportCategory: z.string().min(1, { message: "请选择主要运动类别" }),
  certifications: z.array(
    z.object({
      name: z.string().min(1, { message: "请输入证书名称" }),
      issuingOrganization: z.string().min(1, { message: "请输入发证机构" }),
      issueDate: z.string().min(1, { message: "请选择发证日期" }),
      expiryDate: z.string().optional(),
    })
  ).min(1, { message: "至少需要添加一个证书" }),
});

type CoachVerificationFormValues = z.infer<typeof coachVerificationSchema>;

export function CoachVerificationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [certCount, setCertCount] = useState(1);

  const form = useForm<CoachVerificationFormValues>({
    resolver: zodResolver(coachVerificationSchema),
    defaultValues: {
      idNumber: "",
      bio: "",
      yearsOfExperience: "",
      hourlyRate: "",
      mainSportCategory: "",
      certifications: [
        {
          name: "",
          issuingOrganization: "",
          issueDate: "",
          expiryDate: "",
        },
      ],
    },
  });

  const onSubmit = async (values: CoachVerificationFormValues) => {
    setIsSubmitting(true);
    
    try {
      // 这里应该有一个API调用来提交教练验证信息
      console.log("教练验证信息:", values);
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 提交成功后重定向到等待审核页面
      router.push("/coach/verification-pending");
    } catch (error) {
      console.error("提交失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCertification = () => {
    const certifications = form.getValues("certifications") || [];
    form.setValue("certifications", [
      ...certifications,
      {
        name: "",
        issuingOrganization: "",
        issueDate: "",
        expiryDate: "",
      },
    ]);
    setCertCount(certCount + 1);
  };

  const removeCertification = (index: number) => {
    const certifications = form.getValues("certifications") || [];
    if (certifications.length > 1) {
      form.setValue(
        "certifications",
        certifications.filter((_, i) => i !== index)
      );
      setCertCount(certCount - 1);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">教练资质验证</CardTitle>
        <CardDescription>
          请提供您的专业资质信息，我们将进行审核以确保平台上教练的专业性
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">基本信息</h3>
              
              <FormField
                control={form.control}
                name="idNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>身份证号码</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入您的身份证号码" {...field} />
                    </FormControl>
                    <FormDescription>
                      您的身份信息将被安全加密存储，仅用于身份验证
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>个人简介</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="请简要介绍您的运动背景、教学经验和专长领域" 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      这将显示在您的教练资料页面，帮助学生了解您
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="yearsOfExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>教学经验年限</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="请选择经验年限" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0-1">不到1年</SelectItem>
                          <SelectItem value="1-3">1-3年</SelectItem>
                          <SelectItem value="3-5">3-5年</SelectItem>
                          <SelectItem value="5-10">5-10年</SelectItem>
                          <SelectItem value="10+">10年以上</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>小时收费（元）</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" placeholder="请输入您的小时收费" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="mainSportCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>主要运动类别</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择主要运动类别" />
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
                    <FormDescription>
                      您可以在资料完成后添加更多运动类别
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">资格证书</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addCertification}
                  size="sm"
                >
                  添加证书
                </Button>
              </div>
              
              {Array.from({ length: certCount }).map((_, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-md">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">证书 {index + 1}</h4>
                    {index > 0 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={() => removeCertification(index)}
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                      >
                        删除
                      </Button>
                    )}
                  </div>
                  
                  <FormField
                    control={form.control}
                    name={`certifications.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>证书名称</FormLabel>
                        <FormControl>
                          <Input placeholder="例如：国家健身教练证" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`certifications.${index}.issuingOrganization`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>发证机构</FormLabel>
                        <FormControl>
                          <Input placeholder="例如：国家体育总局" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`certifications.${index}.issueDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>发证日期</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`certifications.${index}.expiryDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>到期日期（可选）</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "提交中..." : "提交验证信息"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
