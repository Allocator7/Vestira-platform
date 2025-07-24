"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, Menu, X } from "lucide-react"

export default function ScreenNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center text-deepBrand hover:text-primary transition-colors mr-4">
            <ChevronLeft size={20} />
            <span className="font-medium">All Screens</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/screens/general"
              className={`text-sm ${isActive("/screens/general") ? "text-primary font-medium" : "text-baseGray"}`}
            >
              General
            </Link>
            <Link
              href="/screens/allocator/home"
              className={`text-sm ${isActive("/screens/allocator/home") ? "text-primary font-medium" : "text-baseGray"}`}
            >
              Allocator Home
            </Link>
            <Link
              href="/screens/manager/home"
              className={`text-sm ${isActive("/screens/manager/home") ? "text-primary font-medium" : "text-baseGray"}`}
            >
              Manager Home
            </Link>
            <Link
              href="/screens/allocator/managers"
              className={`text-sm ${isActive("/screens/allocator/managers") ? "text-primary font-medium" : "text-baseGray"}`}
            >
              Allocator: My Managers
            </Link>
            <Link
              href="/screens/manager/clients"
              className={`text-sm ${isActive("/screens/manager/clients") ? "text-primary font-medium" : "text-baseGray"}`}
            >
              Manager: My Clients
            </Link>
            <Link
              href="/screens/allocator/manager-search"
              className={`text-sm ${isActive("/screens/allocator/manager-search") ? "text-primary font-medium" : "text-baseGray"}`}
            >
              Manager Search
            </Link>
            <Link
              href="/screens/manager/allocator-search"
              className={`text-sm ${isActive("/screens/manager/allocator-search") ? "text-primary font-medium" : "text-baseGray"}`}
            >
              Allocator Search
            </Link>
          </div>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-canvas-bg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4">
          <div className="flex flex-col space-y-4">
            <Link
              href="/screens/general"
              className={`text-sm ${isActive("/screens/general") ? "text-primary font-medium" : "text-baseGray"}`}
              onClick={() => setIsOpen(false)}
            >
              General Homescreen
            </Link>
            <Link
              href="/screens/allocator/home"
              className={`text-sm ${isActive("/screens/allocator/home") ? "text-primary font-medium" : "text-baseGray"}`}
              onClick={() => setIsOpen(false)}
            >
              Allocators: Homescreen
            </Link>
            <Link
              href="/screens/manager/home"
              className={`text-sm ${isActive("/screens/manager/home") ? "text-primary font-medium" : "text-baseGray"}`}
              onClick={() => setIsOpen(false)}
            >
              Managers: Homescreen
            </Link>
            <Link
              href="/screens/allocator/managers"
              className={`text-sm ${isActive("/screens/allocator/managers") ? "text-primary font-medium" : "text-baseGray"}`}
              onClick={() => setIsOpen(false)}
            >
              Allocators: My Managers
            </Link>
            <Link
              href="/screens/manager/clients"
              className={`text-sm ${isActive("/screens/manager/clients") ? "text-primary font-medium" : "text-baseGray"}`}
              onClick={() => setIsOpen(false)}
            >
              Managers: My Clients
            </Link>
            <Link
              href="/screens/allocator/manager-search"
              className={`text-sm ${isActive("/screens/allocator/manager-search") ? "text-primary font-medium" : "text-baseGray"}`}
              onClick={() => setIsOpen(false)}
            >
              Allocators: Manager Search
            </Link>
            <Link
              href="/screens/manager/allocator-search"
              className={`text-sm ${isActive("/screens/manager/allocator-search") ? "text-primary font-medium" : "text-baseGray"}`}
              onClick={() => setIsOpen(false)}
            >
              Managers: Allocator Search
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
