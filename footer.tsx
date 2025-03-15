"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 pt-12 pb-8 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">体育平台</h3>
            <p className="text-gray-600 mb-4">
              连接教练与学生的综合性体育平台，提供专业教学、场地预订和社区互动。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-primary">
                  关于我们
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-gray-600 hover:text-primary">
                  功能介绍
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-600 hover:text-primary">
                  价格方案
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-primary">
                  常见问题
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-primary">
                  博客资讯
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">运动类别</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/football" className="text-gray-600 hover:text-primary">
                  足球
                </Link>
              </li>
              <li>
                <Link href="/categories/basketball" className="text-gray-600 hover:text-primary">
                  篮球
                </Link>
              </li>
              <li>
                <Link href="/categories/swimming" className="text-gray-600 hover:text-primary">
                  游泳
                </Link>
              </li>
              <li>
                <Link href="/categories/yoga" className="text-gray-600 hover:text-primary">
                  瑜伽
                </Link>
              </li>
              <li>
                <Link href="/categories/fitness" className="text-gray-600 hover:text-primary">
                  健身
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-600 hover:text-primary font-medium">
                  查看全部
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">联系我们</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-gray-600">contact@sports-platform.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-gray-600">400-123-4567</span>
              </li>
              <li className="text-gray-600 mt-4">
                工作时间：周一至周日 9:00-21:00
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} 体育平台 版权所有
          </p>
          <div className="flex space-x-6">
            <Link href="/terms" className="text-gray-500 text-sm hover:text-primary">
              服务条款
            </Link>
            <Link href="/privacy" className="text-gray-500 text-sm hover:text-primary">
              隐私政策
            </Link>
            <Link href="/cookies" className="text-gray-500 text-sm hover:text-primary">
              Cookie 政策
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
