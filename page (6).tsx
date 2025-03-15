import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function VerificationPendingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header userType="coach" />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <Card>
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-100">
                <Clock className="h-10 w-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">资质验证审核中</CardTitle>
              <CardDescription className="text-lg">
                您的教练资质信息已提交，正在等待审核
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-blue-800">
                  我们的团队正在审核您提交的资质信息，这通常需要1-3个工作日。审核完成后，我们将通过邮件和短信通知您结果。
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">审核流程</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">资料提交</p>
                      <p className="text-gray-600">您已成功提交教练资质信息</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">资质审核</p>
                      <p className="text-gray-600">我们的团队正在审核您的资质信息</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-500">审核结果</p>
                      <p className="text-gray-500">审核完成后，您将收到结果通知</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">在等待期间，您可以：</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>完善您的个人资料</li>
                  <li>浏览平台上的其他教练</li>
                  <li>了解平台的课程管理功能</li>
                  <li>查看平台使用指南</li>
                </ul>
              </div>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/coach/profile">
                  <Button variant="outline">完善个人资料</Button>
                </Link>
                <Link href="/help/coach-guide">
                  <Button variant="outline">查看使用指南</Button>
                </Link>
                <Link href="/contact-support">
                  <Button variant="outline">联系客服</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
