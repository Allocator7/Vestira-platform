"use client"
import Screen from "@/components/Screen"
import { useState } from "react"
import {
  Home,
  Users,
  FileText,
  MessageSquare,
  Search,
  Bell,
  Menu,
  X,
  ChevronRight,
  BarChart3,
  Calendar,
  Settings,
} from "lucide-react"

export default function GeneralHomePage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <Screen>
      <div className="flex h-screen">
        {/* Left Sidebar Navigation */}
        <aside className="hidden md:flex flex-col w-64 bg-white shadow-sm">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-deepBrand">Vestira</h1>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            <div className="nav-item active">
              <Home size={20} />
              <span>Dashboard</span>
            </div>
            <div className="nav-item">
              <FileText size={20} />
              <span>Documents</span>
            </div>
            <div className="nav-item">
              <Users size={20} />
              <span>Connections</span>
            </div>
            <div className="nav-item">
              <MessageSquare size={20} />
              <span>Messages</span>
            </div>
            <div className="nav-item">
              <BarChart3 size={20} />
              <span>Analytics</span>
            </div>
            <div className="nav-item">
              <Calendar size={20} />
              <span>Calendar</span>
            </div>
            <div className="nav-item">
              <Settings size={20} />
              <span>Settings</span>
            </div>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-deepBrand/10 flex items-center justify-center text-deepBrand font-medium">
                JD
              </div>
              <div>
                <p className="font-medium text-sm">John Doe</p>
                <p className="text-xs text-baseGray">Allocator</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Menu Button */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-10 flex items-center justify-between p-4 shadow-sm">
          <h1 className="text-xl font-bold text-deepBrand">Vestira</h1>
          <button onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden fixed inset-0 bg-black/50 z-20">
            <div className="bg-white w-64 h-full p-4">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-deepBrand">Vestira</h1>
                <button onClick={() => setMenuOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <nav className="space-y-1">
                <div className="nav-item active">
                  <Home size={20} />
                  <span>Dashboard</span>
                </div>
                <div className="nav-item">
                  <FileText size={20} />
                  <span>Documents</span>
                </div>
                <div className="nav-item">
                  <Users size={20} />
                  <span>Connections</span>
                </div>
                <div className="nav-item">
                  <MessageSquare size={20} />
                  <span>Messages</span>
                </div>
                <div className="nav-item">
                  <BarChart3 size={20} />
                  <span>Analytics</span>
                </div>
                <div className="nav-item">
                  <Calendar size={20} />
                  <span>Calendar</span>
                </div>
                <div className="nav-item">
                  <Settings size={20} />
                  <span>Settings</span>
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto pt-16 md:pt-0">
          {/* Header */}
          <header className="bg-white p-4 md:p-6 shadow-sm flex justify-between items-center sticky top-0">
            <h2 className="text-xl font-medium text-deepBrand">Dashboard</h2>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-canvas-bg transition-colors">
                <Search size={20} className="text-baseGray" />
              </button>
              <button className="p-2 rounded-lg hover:bg-canvas-bg transition-colors relative">
                <Bell size={20} className="text-baseGray" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              </button>
              <button className="hidden md:block btn-primary">New Document</button>
            </div>
          </header>

          {/* Content */}
          <div className="p-4 md:p-6 space-y-6">
            {/* Welcome Card */}
            <div className="vestira-card">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-deepBrand mb-2">Welcome back, John</h3>
                  <p className="text-baseGray mb-4">Your portfolio overview and recent activities</p>
                </div>
                <button className="btn-primary mt-2 md:mt-0">View Analytics</button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="vestira-card">
                <h4 className="text-baseGray mb-2">Active Connections</h4>
                <p className="text-3xl font-bold text-deepBrand">24</p>
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <span>+3 this month</span>
                </div>
              </div>
              <div className="vestira-card">
                <h4 className="text-baseGray mb-2">Documents Shared</h4>
                <p className="text-3xl font-bold text-deepBrand">156</p>
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <span>+12 this week</span>
                </div>
              </div>
              <div className="vestira-card">
                <h4 className="text-baseGray mb-2">Unread Messages</h4>
                <p className="text-3xl font-bold text-deepBrand">7</p>
                <div className="flex items-center mt-2 text-sm text-primary">
                  <span>View inbox</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-deepBrand">Recent Activity</h3>
                <button className="text-primary text-sm font-medium flex items-center">
                  View All <ChevronRight size={16} />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  {
                    title: "Quarterly Report Shared",
                    description: "You shared Q2 Performance Report with Acme Capital",
                    time: "2 hours ago",
                    icon: <FileText size={16} />,
                  },
                  {
                    title: "New Connection Request",
                    description: "Jane Smith from Global Investments wants to connect",
                    time: "Yesterday",
                    icon: <Users size={16} />,
                  },
                  {
                    title: "Message from Robert Chen",
                    description: "RE: Due Diligence Questions for Fund III",
                    time: "Yesterday",
                    icon: <MessageSquare size={16} />,
                  },
                ].map((item, index) => (
                  <div key={index} className="vestira-card flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-deepBrand">{item.title}</h4>
                      <p className="text-sm text-baseGray">{item.description}</p>
                      <p className="text-xs text-baseGray/70 mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </Screen>
  )
}
