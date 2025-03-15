"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, CreditCard, Smartphone, AlertCircle } from "lucide-react";

// 表单验证模式
const paymentSchema = z.object({
  paymentMethod: z.string().min(1, { message: "请选择支付方式" }),
  cardNumber: z.string().optional(),
  cardHolder: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  agreeToTerms: z.boolean().refine(value => value === true, {
    message: "请同意支付条款和条件",
  }),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

// 模拟课程数据
const mockCourseData = {
  id: "1",
  title: "初级瑜伽入门课程",
  coachName: "张教练",
  date: "2025-03-20",
  time: "18:00",
  duration: 60,
  location: "阳光健身中心",
  price: 99,
};

export function PaymentForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "",
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
      agreeToTerms: false,
    },
  });
  
  const selectedPaymentMethod = form.watch("paymentMethod");
  
  const onSubmit = async (values: PaymentFormValues) => {
    setIsSubmitting(true);
    
    try {
      // 这里应该有一个API调用来处理支付
      console.log("支付信息:", values);
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 假设支付成功
      setPaymentSuccess(true);
      
      // 支付成功后3秒重定向到预订确认页面
      setTimeout(() => {
        router.push("/student/bookings");
      }, 3000);
    } catch (error) {
      console.error("支付失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (paymentSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6 pb-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl mb-2">支付成功</CardTitle>
          <CardDescription className="text-base mb-6">
            您已成功支付 ¥{mockCourseData.price} 预订课程
          </CardDescription>
          <div className="bg-gray-50 p-4 rounded-md text-left mb-6">
            <h3 className="font-medium mb-2">预订详情</h3>
            <p className="text-gray-700 mb-1">{mockCourseData.title}</p>
            <p className="text-gray-700 mb-1">教练: {mockCourseData.coachName}</p>
            <p className="text-gray-700 mb-1">日期: {mockCourseData.date}</p>
            <p className="text-gray-700 mb-1">时间: {mockCourseData.time}</p>
            <p className="text-gray-700">地点: {mockCourseData.location}</p>
          </div>
          <p className="text-gray-500 text-sm">
            正在跳转到我的预订页面...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">支付预订</CardTitle>
        <CardDescription>
          请选择支付方式完成课程预订
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="font-medium mb-2">预订详情</h3>
          <p className="text-gray-700 mb-1">{mockCourseData.title}</p>
          <p className="text-gray-700 mb-1">教练: {mockCourseData.coachName}</p>
          <p className="text-gray-700 mb-1">日期: {mockCourseData.date}</p>
          <p className="text-gray-700 mb-1">时间: {mockCourseData.time}</p>
          <p className="text-gray-700 mb-1">地点: {mockCourseData.location}</p>
          <Separator className="my-2" />
          <div className="flex justify-between items-center font-medium">
            <span>总计</span>
            <span>¥{mockCourseData.price}</span>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>支付方式</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0 border rounded-md p-4">
                        <FormControl>
                          <RadioGroupItem value="wechat" />
                        </FormControl>
                        <FormLabel className="font-normal flex items-center">
                          <Smartphone className="h-5 w-5 mr-2 text-green-600" />
                          微信支付
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0 border rounded-md p-4">
                        <FormControl>
                          <RadioGroupItem value="alipay" />
                        </FormControl>
                        <FormLabel className="font-normal flex items-center">
                          <Smartphone className="h-5 w-5 mr-2 text-blue-600" />
                          支付宝
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0 border rounded-md p-4">
                        <FormControl>
                          <RadioGroupItem value="creditcard" />
                        </FormControl>
                        <FormLabel className="font-normal flex items-center">
                          <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
                          信用卡
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {selectedPaymentMethod === "creditcard" && (
              <div className="space-y-4 border rounded-md p-4">
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>卡号</FormLabel>
                      <FormControl>
                        <Input placeholder="1234 5678 9012 3456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cardHolder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>持卡人姓名</FormLabel>
                      <FormControl>
                        <Input placeholder="张三" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>有效期</FormLabel>
                        <FormControl>
                          <Input placeholder="MM/YY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>安全码</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
            
            {(selectedPaymentMethod === "wechat" || selectedPaymentMethod === "alipay") && (
              <div className="border rounded-md p-4 text-center">
                <div className="bg-gray-100 p-6 mb-4 mx-auto w-48 h-48 flex items-center justify-center">
                  <p className="text-gray-500">二维码加载中...</p>
                </div>
                <p className="text-sm text-gray-600">请使用{selectedPaymentMethod === "wechat" ? "微信" : "支付宝"}扫描二维码完成支付</p>
              </div>
            )}
            
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <p className="text-sm text-gray-600">
                预订成功后，如需取消，请至少提前24小时操作，否则将收取50%的取消费用。
              </p>
            </div>
            
            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      我同意支付条款和条件
                    </FormLabel>
                    <FormDescription>
                      点击"确认支付"，即表示您同意我们的<a href="#" className="text-primary hover:underline">服务条款</a>和<a href="#" className="text-primary hover:underline">隐私政策</a>。
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "处理中..." : `确认支付 ¥${mockCourseData.price}`}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
