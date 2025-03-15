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
import { Calendar, Clock, CreditCard, Download, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// 模拟交易数据
const mockTransactions = [
  {
    id: "tx1",
    courseId: "1",
    courseTitle: "初级瑜伽入门课程",
    studentName: "王小明",
    studentAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    amount: 99,
    fee: 9.9,
    netAmount: 89.1,
    status: "completed",
    paymentMethod: "wechat",
    date: "2025-03-15",
    time: "14:32"
  },
  {
    id: "tx2",
    courseId: "1",
    courseTitle: "初级瑜伽入门课程",
    studentName: "李小红",
    studentAvatar: "https://randomuser.me/api/portraits/women/67.jpg",
    amount: 99,
    fee: 9.9,
    netAmount: 89.1,
    status: "completed",
    paymentMethod: "alipay",
    date: "2025-03-14",
    time: "10:15"
  },
  {
    id: "tx3",
    courseId: "2",
    courseTitle: "高强度间歇训练",
    studentName: "张小华",
    studentAvatar: "https://randomuser.me/api/portraits/men/44.jpg",
    amount: 120,
    fee: 12,
    netAmount: 108,
    status: "completed",
    paymentMethod: "creditcard",
    date: "2025-03-12",
    time: "16:45"
  },
  {
    id: "tx4",
    courseId: "1",
    courseTitle: "初级瑜伽入门课程",
    studentName: "赵小刚",
    studentAvatar: "https://randomuser.me/api/portraits/men/22.jpg",
    amount: 99,
    fee: 9.9,
    netAmount: 89.1,
    status: "refunded",
    paymentMethod: "wechat",
    date: "2025-03-10",
    time: "09:20"
  }
];

// 模拟结算数据
const mockSettlements = [
  {
    id: "stl1",
    period: "2025-03-01 至 2025-03-15",
    totalAmount: 286.2,
    transactionCount: 3,
    status: "completed",
    paymentDate: "2025-03-16",
    accountNumber: "****6789"
  },
  {
    id: "stl2",
    period: "2025-02-16 至 2025-02-28",
    totalAmount: 520.5,
    transactionCount: 6,
    status: "completed",
    paymentDate: "2025-03-01",
    accountNumber: "****6789"
  }
];

export function TransactionManagement({ userType = "coach" }: { userType?: "coach" | "admin" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  
  // 过滤交易
  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? transaction.status === statusFilter : true;
    const matchesDate = dateFilter ? transaction.date === dateFilter : true;
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">已完成</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">处理中</Badge>;
      case "refunded":
        return <Badge className="bg-blue-100 text-blue-800">已退款</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">失败</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };
  
  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "wechat":
        return "微信支付";
      case "alipay":
        return "支付宝";
      case "creditcard":
        return "信用卡";
      default:
        return method;
    }
  };
  
  // 计算总收入和平台费用
  const totalIncome = filteredTransactions
    .filter(tx => tx.status === "completed")
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const totalFees = filteredTransactions
    .filter(tx => tx.status === "completed")
    .reduce((sum, tx) => sum + tx.fee, 0);
  
  const netIncome = totalIncome - totalFees;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {userType === "coach" ? "交易管理" : "平台交易"}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">总收入</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{totalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">平台费用</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{totalFees.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">净收入</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{netIncome.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="transactions">交易记录</TabsTrigger>
          <TabsTrigger value="settlements">结算记录</TabsTrigger>
          {userType === "admin" && <TabsTrigger value="reports">财务报表</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="transactions" className="mt-0 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="搜索交易、课程或学生"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="交易状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">全部状态</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                  <SelectItem value="pending">处理中</SelectItem>
                  <SelectItem value="refunded">已退款</SelectItem>
                  <SelectItem value="failed">失败</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-[180px]"
              />
              
              <Button variant="outline" size="icon" onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
                setDateFilter("");
              }}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>交易ID</TableHead>
                  <TableHead>课程</TableHead>
                  <TableHead>学生</TableHead>
                  <TableHead>金额</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>支付方式</TableHead>
                  <TableHead>日期</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      没有找到匹配的交易记录
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                      <TableCell>{transaction.courseTitle}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={transaction.studentAvatar} alt={transaction.studentName} />
                            <AvatarFallback>{transaction.studentName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {transaction.studentName}
                        </div>
                      </TableCell>
                      <TableCell>¥{transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>{getPaymentMethodText(transaction.paymentMethod)}</TableCell>
                      <TableCell>
                        <div>{transaction.date}</div>
                        <div className="text-gray-500 text-sm">{transaction.time}</div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          详情
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="settlements" className="mt-0 space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>结算ID</TableHead>
                  <TableHead>结算周期</TableHead>
                  <TableHead>交易数量</TableHead>
                  <TableHead>结算金额</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>支付日期</TableHead>
                  <TableHead>收款账户</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSettlements.map(settlement => (
                  <TableRow key={settlement.id}>
                    <TableCell className="font-mono text-sm">{settlement.id}</TableCell>
                    <TableCell>{settlement.period}</TableCell>
                    <TableCell>{settlement.transactionCount}</TableCell>
                    <TableCell>¥{settlement.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">已完成</Badge>
                    </TableCell>
                    <TableCell>{settlement.paymentDate}</TableCell>
                    <TableCell>{settlement.accountNumber}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        收据
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        {userType === "admin" && (
          <TabsContent value="reports" className="mt-0">
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p>财务报表功能正在开发中</p>
            </div>
          </TabsContent>
        )}
      </Tabs>
      
      {userType === "coach" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">结算设置</CardTitle>
            <CardDescription>
              管理您的结算账户和偏好设置
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 border rounded-md">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 mr-3 text-gray-500" />
                <div>
                  <div className="font-medium">银行卡</div>
                  <div className="text-gray-600">工商银行 (****6789)</div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                修改
              </Button>
            </div>
            
            <div className="flex justify-between items-center p-4 border rounded-md">
              <div>
                <div className="font-medium">结算周期</div>
                <div className="text-gray-600">每半月结算一次</div>
              </div>
              <Button variant="outline" size="sm">
                修改
              </Button>
            </div>
            
            <div className="flex justify-between items-center p-4 border rounded-md">
              <div>
                <div className="font-medium">平台服务费</div>
                <div className="text-gray-600">交易金额的10%</div>
              </div>
              <Button variant="ghost" size="sm" disabled>
                系统设置
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">申请提前结算</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
