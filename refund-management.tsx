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
import { Separator } from "@/components/ui/separator";
import { AlertCircle, ArrowLeft, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";

// 模拟退款政策数据
const refundPolicies = [
  {
    id: "policy1",
    title: "提前24小时取消",
    description: "课程开始前24小时以上取消，可获得全额退款",
    refundPercentage: 100,
    conditions: "必须在课程开始前至少24小时提交取消申请"
  },
  {
    id: "policy2",
    title: "提前12-24小时取消",
    description: "课程开始前12-24小时取消，可获得50%退款",
    refundPercentage: 50,
    conditions: "必须在课程开始前12-24小时内提交取消申请"
  },
  {
    id: "policy3",
    title: "提前不足12小时取消",
    description: "课程开始前不足12小时取消，不予退款",
    refundPercentage: 0,
    conditions: "课程开始前不足12小时取消，将被视为放弃，不予退款"
  },
  {
    id: "policy4",
    title: "教练取消课程",
    description: "如果教练取消课程，学生将获得全额退款",
    refundPercentage: 100,
    conditions: "教练必须通过平台提交取消申请"
  },
  {
    id: "policy5",
    title: "特殊情况",
    description: "因健康原因或不可抗力因素取消，可申请特殊退款",
    refundPercentage: "视情况而定",
    conditions: "需提供相关证明文件，由平台客服审核"
  }
];

// 模拟退款申请数据
const mockRefundRequests = [
  {
    id: "refund1",
    courseId: "1",
    courseTitle: "初级瑜伽入门课程",
    bookingId: "booking1",
    studentName: "王小明",
    amount: 99,
    reason: "个人原因无法参加",
    status: "pending",
    submittedAt: "2025-03-16 09:45",
    policyApplied: "policy1"
  },
  {
    id: "refund2",
    courseId: "2",
    courseTitle: "高强度间歇训练",
    bookingId: "booking3",
    studentName: "张小华",
    amount: 120,
    reason: "临时有事无法参加",
    status: "approved",
    submittedAt: "2025-03-15 14:20",
    approvedAt: "2025-03-15 15:10",
    policyApplied: "policy1"
  },
  {
    id: "refund3",
    courseId: "1",
    courseTitle: "初级瑜伽入门课程",
    bookingId: "booking4",
    studentName: "李小红",
    amount: 99,
    reason: "身体不适",
    status: "rejected",
    submittedAt: "2025-03-14 18:30",
    rejectedAt: "2025-03-14 19:15",
    rejectionReason: "提交时间已超过可退款时限",
    policyApplied: "policy3"
  }
];

export function RefundManagement({ userType = "coach" }: { userType?: "coach" | "student" | "admin" }) {
  const router = useRouter();
  const [activeRequest, setActiveRequest] = useState<string | null>(null);
  
  const handleApproveRefund = (refundId: string) => {
    console.log("批准退款:", refundId);
    // 实际应用中应该调用API批准退款
  };
  
  const handleRejectRefund = (refundId: string) => {
    console.log("拒绝退款:", refundId);
    // 实际应用中应该调用API拒绝退款
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">待处理</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">已批准</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">已拒绝</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">已完成</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };
  
  const filteredRequests = userType === "coach" 
    ? mockRefundRequests 
    : mockRefundRequests.filter(req => req.status === "pending");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {userType === "coach" ? "退款管理" : userType === "admin" ? "平台退款管理" : "申请退款"}
        </h1>
        
        {userType === "student" && (
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
        )}
      </div>
      
      <Tabs defaultValue={userType === "student" ? "policy" : "requests"} className="w-full">
        <TabsList className="mb-4">
          {userType === "student" ? (
            <>
              <TabsTrigger value="policy">退款政策</TabsTrigger>
              <TabsTrigger value="new">申请退款</TabsTrigger>
              <TabsTrigger value="history">申请历史</TabsTrigger>
            </>
          ) : (
            <>
              <TabsTrigger value="requests">退款申请</TabsTrigger>
              <TabsTrigger value="policy">退款政策</TabsTrigger>
              {userType === "admin" && <TabsTrigger value="settings">政策设置</TabsTrigger>}
            </>
          )}
        </TabsList>
        
        <TabsContent value="policy" className="mt-0 space-y-6">
          <div className="bg-blue-50 p-4 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-blue-700">
              以下是平台的退款政策，请在预订课程前仔细阅读。不同的取消时间点对应不同的退款比例。
            </p>
          </div>
          
          <div className="space-y-4">
            {refundPolicies.map(policy => (
              <Card key={policy.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{policy.title}</CardTitle>
                    <Badge className={policy.refundPercentage === 100 ? "bg-green-100 text-green-800" : policy.refundPercentage === 0 ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}>
                      {typeof policy.refundPercentage === "number" ? `${policy.refundPercentage}%退款` : policy.refundPercentage}
                    </Badge>
                  </div>
                  <CardDescription>
                    {policy.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">
                    <strong>条件：</strong> {policy.conditions}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {userType === "student" && (
          <>
            <TabsContent value="new" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>申请退款</CardTitle>
                  <CardDescription>
                    请填写以下信息申请课程退款
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-700 mb-2">您当前没有可退款的课程预订</p>
                    <p className="text-sm text-gray-600">只有已支付且未开始的课程可以申请退款</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="mt-0">
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <p>您没有退款申请历史</p>
              </div>
            </TabsContent>
          </>
        )}
        
        {(userType === "coach" || userType === "admin") && (
          <TabsContent value="requests" className="mt-0 space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <p>没有待处理的退款申请</p>
              </div>
            ) : (
              filteredRequests.map(request => (
                <Card key={request.id} className={activeRequest === request.id ? "border-primary" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <CardTitle className="text-lg mr-3">{request.courseTitle}</CardTitle>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="text-lg font-bold">¥{request.amount.toFixed(2)}</div>
                    </div>
                    <CardDescription>
                      申请ID: {request.id} | 预订ID: {request.bookingId} | 学生: {request.studentName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-500">申请原因: </span>
                        <span>{request.reason}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">申请时间: </span>
                        <span>{request.submittedAt}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">适用政策: </span>
                        <span>{refundPolicies.find(p => p.id === request.policyApplied)?.title || "未知政策"}</span>
                      </div>
                      
                      {request.status === "rejected" && (
                        <div>
                          <span className="text-gray-500">拒绝原因: </span>
                          <span className="text-red-600">{request.rejectionReason}</span>
                        </div>
                      )}
                      
                      {request.status === "approved" && (
                        <div>
                          <span className="text-gray-500">批准时间: </span>
                          <span>{request.approvedAt}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  {request.status === "pending" && userType === "coach" && (
                    <CardFooter className="pt-2">
                      <div className="flex space-x-2 w-full">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleRejectRefund(request.id)}
                        >
                          拒绝
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={() => handleApproveRefund(request.id)}
                        >
                          批准退款
                        </Button>
                      </div>
                    </CardFooter>
                  )}
                </Card>
              ))
            )}
          </TabsContent>
        )}
        
        {userType === "admin" && (
          <TabsContent value="settings" className="mt-0">
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p>退款政策设置功能正在开发中</p>
            </div>
          </TabsContent>
        )}
      </Tabs>
      
      {userType === "coach" && (
        <div className="bg-yellow-50 p-4 rounded-md flex items-start">
          <HelpCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-yellow-700">
            <p className="font-medium mb-1">退款处理说明</p>
            <p className="text-sm">
              当您批准退款申请时，系统将根据适用的退款政策自动计算退款金额。退款金额将从您的下一次结算中扣除。
              如果您对退款有任何疑问，请联系平台客服。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
