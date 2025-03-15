"use client";

import { useState } from "react";
import Link from "next/link";
import { UserCircle, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  userType?: "coach" | "student";
  userName?: string;
  isLoggedIn?: boolean;
}

export function Header({ userType, userName, isLoggedIn = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`w-full py-4 px-6 border-b ${userType === "coach" ? "coach-theme" : userType === "student" ? "student-theme" : ""}`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold">
            体育平台
          </Link>
          {userType && (
            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${userType === "coach" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
              {userType === "coach" ? "教练" : "学生"}
            </span>
          )}
        </div>

        {/* 桌面导航 */}
        <nav className="hidden md:flex items-center space-x-6">
          {userType === "coach" && (
            <>
              <Link href="/coach/dashboard" className="text-gray-700 hover:text-primary">
                控制台
              </Link>
              <Link href="/coach/courses" className="text-gray-700 hover:text-primary">
                我的课程
              </Link>
              <Link href="/coach/schedule" className="text-gray-700 hover:text-primary">
                日程安排
              </Link>
              <Link href="/coach/students" className="text-gray-700 hover:text-primary">
                我的学生
              </Link>
            </>
          )}

          {userType === "student" && (
            <>
              <Link href="/student/dashboard" className="text-gray-700 hover:text-primary">
                控制台
              </Link>
              <Link href="/student/courses" className="text-gray-700 hover:text-primary">
                我的课程
              </Link>
              <Link href="/student/coaches" className="text-gray-700 hover:text-primary">
                寻找教练
              </Link>
              <Link href="/student/schedule" className="text-gray-700 hover:text-primary">
                日程安排
              </Link>
            </>
          )}

          {!userType && (
            <>
              <Link href="/about" className="text-gray-700 hover:text-primary">
                关于我们
              </Link>
              <Link href="/features" className="text-gray-700 hover:text-primary">
                功能介绍
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-primary">
                价格方案
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary">
                联系我们
              </Link>
            </>
          )}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <UserCircle className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{userName || "用户"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile" className="w-full">个人资料</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings" className="w-full">设置</Link>
                </DropdownMenuItem>
                {userType && (
                  <DropdownMenuItem>
                    <Link href="/switch-role" className="w-full">切换身份</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/logout" className="w-full flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>退出登录</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">登录</Button>
              </Link>
              <Link href="/register">
                <Button>注册</Button>
              </Link>
            </>
          )}
        </div>

        {/* 移动端菜单按钮 */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* 移动端导航菜单 */}
      {isMenuOpen && (
        <div className="md:hidden pt-4 pb-6 px-6 space-y-4">
          {userType === "coach" && (
            <>
              <Link href="/coach/dashboard" className="block py-2 text-gray-700 hover:text-primary">
                控制台
              </Link>
              <Link href="/coach/courses" className="block py-2 text-gray-700 hover:text-primary">
                我的课程
              </Link>
              <Link href="/coach/schedule" className="block py-2 text-gray-700 hover:text-primary">
                日程安排
              </Link>
              <Link href="/coach/students" className="block py-2 text-gray-700 hover:text-primary">
                我的学生
              </Link>
            </>
          )}

          {userType === "student" && (
            <>
              <Link href="/student/dashboard" className="block py-2 text-gray-700 hover:text-primary">
                控制台
              </Link>
              <Link href="/student/courses" className="block py-2 text-gray-700 hover:text-primary">
                我的课程
              </Link>
              <Link href="/student/coaches" className="block py-2 text-gray-700 hover:text-primary">
                寻找教练
              </Link>
              <Link href="/student/schedule" className="block py-2 text-gray-700 hover:text-primary">
                日程安排
              </Link>
            </>
          )}

          {!userType && (
            <>
              <Link href="/about" className="block py-2 text-gray-700 hover:text-primary">
                关于我们
              </Link>
              <Link href="/features" className="block py-2 text-gray-700 hover:text-primary">
                功能介绍
              </Link>
              <Link href="/pricing" className="block py-2 text-gray-700 hover:text-primary">
                价格方案
              </Link>
              <Link href="/contact" className="block py-2 text-gray-700 hover:text-primary">
                联系我们
              </Link>
            </>
          )}

          {isLoggedIn ? (
            <div className="pt-4 border-t">
              <div className="py-2 font-medium">{userName || "用户"}</div>
              <Link href="/profile" className="block py-2 text-gray-700 hover:text-primary">
                个人资料
              </Link>
              <Link href="/settings" className="block py-2 text-gray-700 hover:text-primary">
                设置
              </Link>
              {userType && (
                <Link href="/switch-role" className="block py-2 text-gray-700 hover:text-primary">
                  切换身份
                </Link>
              )}
              <Link href="/logout" className="block py-2 text-gray-700 hover:text-primary flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                <span>退出登录</span>
              </Link>
            </div>
          ) : (
            <div className="pt-4 border-t flex flex-col space-y-2">
              <Link href="/login">
                <Button variant="ghost" className="w-full">登录</Button>
              </Link>
              <Link href="/register">
                <Button className="w-full">注册</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
