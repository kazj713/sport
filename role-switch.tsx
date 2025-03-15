"use client";

import { useState } from "react";
import { User, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function RoleSwitch() {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">选择您的身份</h1>
      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        体育平台为教练和学生提供不同的功能和服务。请选择您的身份以获得最佳体验。
      </p>

      <div className="role-switch-container">
        <div 
          className={`role-card coach ${hoveredRole === 'coach' ? 'scale-105' : ''}`}
          onMouseEnter={() => setHoveredRole('coach')}
          onMouseLeave={() => setHoveredRole(null)}
        >
          <div className="role-icon text-blue-500">
            <Dumbbell size={96} strokeWidth={1.5} />
          </div>
          <h2 className="role-title text-blue-700">我是教练</h2>
          <p className="role-description mb-6">
            创建课程、管理学生、接收预订和评价，展示您的专业技能。
          </p>
          <Link href="/coach/register">
            <Button className="w-full coach-theme">以教练身份继续</Button>
          </Link>
        </div>

        <div 
          className={`role-card student ${hoveredRole === 'student' ? 'scale-105' : ''}`}
          onMouseEnter={() => setHoveredRole('student')}
          onMouseLeave={() => setHoveredRole(null)}
        >
          <div className="role-icon text-green-500">
            <User size={96} strokeWidth={1.5} />
          </div>
          <h2 className="role-title text-green-700">我是学生</h2>
          <p className="role-description mb-6">
            寻找教练、预订课程、追踪进度、参与社区，提升您的运动技能。
          </p>
          <Link href="/student/register">
            <Button className="w-full student-theme">以学生身份继续</Button>
          </Link>
        </div>
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-500 mb-4">已有账号？</p>
        <Link href="/login">
          <Button variant="outline">登录账号</Button>
        </Link>
      </div>
    </div>
  );
}
