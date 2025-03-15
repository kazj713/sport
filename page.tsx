import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RoleSwitch } from "@/components/role-switch";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* 英雄区域 */}
        <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              连接教练与学生的综合性体育平台
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              无论您是专业教练还是热爱运动的学生，我们都能为您提供完美的匹配和卓越的体验
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/role-select">
                <Button size="lg" className="text-lg px-8">
                  立即开始
                </Button>
              </Link>
              <Link href="/features">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 hover:bg-white/20 text-white border-white">
                  了解更多
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 功能特点 */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">平台核心功能</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">用户管理系统</h3>
                <p className="text-gray-600">
                  教练资质验证、学生注册、个人资料管理，确保平台用户的专业性和安全性
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">课程管理系统</h3>
                <p className="text-gray-600">
                  课程发布、预订管理、实时课程日历，让教学安排更加灵活高效
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="bg-purple-100 text-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <path d="M12 16v.01"></path>
                    <path d="M6 12v.01"></path>
                    <path d="M6 8v.01"></path>
                    <path d="M18 8v.01"></path>
                    <path d="M18 12v.01"></path>
                    <path d="M12 12v.01"></path>
                    <path d="M12 8v.01"></path>
                    <path d="M6 16v.01"></path>
                    <path d="M18 16v.01"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">支付系统</h3>
                <p className="text-gray-600">
                  多种支付选项、交易管理、退款政策，确保资金流转安全便捷
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="bg-yellow-100 text-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">评价反馈系统</h3>
                <p className="text-gray-600">
                  多维度评分、评价激励、教练回应机制，提升服务质量和用户体验
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">场地服务系统</h3>
                <p className="text-gray-600">
                  场地资源整合、场地预订、设备配套信息，为训练提供完善的场地保障
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="bg-indigo-100 text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">社区互动系统</h3>
                <p className="text-gray-600">
                  专业内容、用户讨论组、活动管理，打造活跃的运动社区生态
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 角色选择 */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">选择您的身份</h2>
            <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              无论您是专业教练还是热爱运动的学生，我们都为您提供量身定制的功能
            </p>
            
            <RoleSwitch />
          </div>
        </section>

        {/* 统计数据 */}
        <section className="py-16 px-4 bg-blue-600 text-white">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
                <div className="text-lg">专业教练</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">10000+</div>
                <div className="text-lg">活跃学生</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">5000+</div>
                <div className="text-lg">每月课程</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">20+</div>
                <div className="text-lg">运动类别</div>
              </div>
            </div>
          </div>
        </section>

        {/* 号召行动 */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">准备好开始您的运动之旅了吗？</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              立即加入我们的平台，连接优质教练或寻找热爱运动的学生
            </p>
            <Link href="/role-select">
              <Button size="lg" className="text-lg px-8">
                立即注册
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
