"use client"
import Screen from "../../components/Screen"
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
  Settings,
  Building2,
  Filter,
  Clock,
  Eye,
  Download,
  Briefcase,
  BookOpen,
  PlusCircle,
} from "lucide-react"

export default function AllocatorHomePage() {
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
              <Briefcase size={20} />
              <span>My Managers</span>
            </div>
            <div className="nav-item">
              <Search size={20} />
              <span>Manager Search</span>
            </div>
            <div className="nav-item">
              <FileText size={20} />
              <span>Due Diligence</span>
            </div>
            <div className="nav-item">
              <Building2 size={20} />
              <span>Data Rooms</span>
            </div>
            <div className="nav-item">
              <BookOpen size={20} />
              <span>Insights</span>
            </div>
            <div className="nav-item">
              <MessageSquare size={20} />
              <span>Messages</span>
            </div>
            <div className="nav-item">
              <Users size={20} />
              <span>Connections</span>
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
                  <Briefcase size={20} />
                  <span>My Managers</span>
                </div>
                <div className="nav-item">
                  <Search size={20} />
                  <span>Manager Search</span>
                </div>
                <div className="nav-item">
                  <FileText size={20} />
                  <span>Due Diligence</span>
                </div>
                <div className="nav-item">
                  <Building2 size={20} />
                  <span>Data Rooms</span>
                </div>
                <div className="nav-item">
                  <BookOpen size={20} />
                  <span>Insights</span>
                </div>
                <div className="nav-item">
                  <MessageSquare size={20} />
                  <span>Messages</span>
                </div>
                <div className="nav-item">
                  <Users size={20} />
                  <span>Connections</span>
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
            <h2 className="text-xl font-medium text-deepBrand">Allocator Dashboard</h2>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-canvas-bg transition-colors">
                <Search size={20} className="text-baseGray" />
              </button>
              <button className="p-2 rounded-lg hover:bg-canvas-bg transition-colors relative">
                <Bell size={20} className="text-baseGray" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              </button>
              <button className="hidden md:block btn-primary">Launch DDQ</button>
            </div>
          </header>

          {/* Content */}
          <div className="p-4 md:p-6 space-y-6">
            {/* Welcome Card */}
            <div className="vestira-card">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-deepBrand mb-2">Welcome back, John</h3>
                  <p className="text-baseGray mb-4">Your manager relationships and due diligence at a glance</p>
                </div>
                <button className="btn-primary mt-2 md:mt-0">Discover Managers</button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="vestira-card">
                <h4 className="text-baseGray mb-2">Active Managers</h4>
                <p className="text-3xl font-bold text-deepBrand">18</p>
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <span>+2 this month</span>
                </div>
              </div>
              <div className="vestira-card">
                <h4 className="text-baseGray mb-2">Open Due Diligence</h4>
                <p className="text-3xl font-bold text-deepBrand">5</p>
                <div className="flex items-center mt-2 text-sm text-primary">
                  <span>View all</span>
                  <ChevronRight size={16} />
                </div>
              </div>
              <div className="vestira-card">
                <h4 className="text-baseGray mb-2">New Documents</h4>
                <p className="text-3xl font-bold text-deepBrand">12</p>
                <div className="flex items-center mt-2 text-sm text-primary">
                  <span>View documents</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>

            {/* Recent Updates */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-deepBrand">Recent Updates</h3>
                <div className="flex items-center space-x-2">
                  <button className="p-1.5 rounded-md hover:bg-canvas-bg transition-colors">
                    <Filter size={18} className="text-baseGray" />
                  </button>
                  <button className="text-primary text-sm font-medium flex items-center">
                    View All <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  {
                    title: "New Quarterly Report",
                    manager: "Acme Capital",
                    description: "Q2 2023 Performance Report",
                    time: "2 hours ago",
                    icon: <FileText size={16} />,
                    action: "View",
                  },
                  {
                    title: "DDQ Response Received",
                    manager: "Global Investments",
                    description: "Completed all 24 questions",
                    time: "Yesterday",
                    icon: <FileText size={16} />,
                    action: "Review",
                  },
                  {
                    title: "New Market Commentary",
                    manager: "Horizon Partners",
                    description: "2023 Market Outlook",
                    time: "2 days ago",
                    icon: <BookOpen size={16} />,
                    action: "Read",
                  },
                ].map((item, index) => (
                  <div key={index} className="vestira-card">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-deepBrand">{item.title}</h4>
                            <p className="text-sm font-medium text-primary">{item.manager}</p>
                            <p className="text-sm text-baseGray mt-1">{item.description}</p>
                          </div>
                          <button className="btn-secondary text-xs px-3 py-1.5">{item.action}</button>
                        </div>
                        <div className="flex items-center mt-2 text-xs text-baseGray/70">
                          <Clock size={12} className="mr-1" />
                          <span>{item.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Manager Activity */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-deepBrand">Manager Activity</h3>
                <button className="text-primary text-sm font-medium flex items-center">
                  View All <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    manager: "Acme Capital",
                    type: "Private Equity",
                    activity: [
                      { type: "document", count: 3, icon: <FileText size={14} /> },
                      { type: "view", count: 12, icon: <Eye size={14} /> },
                      { type: "download", count: 5, icon: <Download size={14} /> },
                    ],
                  },
                  {
                    manager: "Global Investments",
                    type: "Venture Capital",
                    activity: [
                      { type: "document", count: 1, icon: <FileText size={14} /> },
                      { type: "view", count: 8, icon: <Eye size={14} /> },
                      { type: "download", count: 2, icon: <Download size={14} /> },
                    ],
                  },
                  {
                    manager: "Horizon Partners",
                    type: "Real Estate",
                    activity: [
                      { type: "document", count: 5, icon: <FileText size={14} /> },
                      { type: "view", count: 20, icon: <Eye size={14} /> },
                      { type: "download", count: 7, icon: <Download size={14} /> },
                    ],
                  },
                  {
                    manager: "Summit Funds",
                    type: "Hedge Fund",
                    activity: [
                      { type: "document", count: 2, icon: <FileText size={14} /> },
                      { type: "view", count: 15, icon: <Eye size={14} /> },
                      { type: "download", count: 4, icon: <Download size={14} /> },
                    ],
                  },
                ].map((item, index) => (
                  <div key={index} className="vestira-card">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-deepBrand">{item.manager}</h4>
                        <p className="text-xs text-baseGray">{item.type}</p>
                      </div>
                      <button className="text-primary text-sm">View</button>
                    </div>
                    <div className="flex items-center space-x-4 mt-4">
                      {item.activity.map((activity, i) => (
                        <div key={i} className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2">
                            {activity.icon}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-deepBrand">{activity.count}</p>
                            <p className="text-xs text-baseGray capitalize">{activity.type}s</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Managers */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-deepBrand">Suggested Managers</h3>
                <button className="text-primary text-sm font-medium flex items-center">
                  View More <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    name: "Evergreen Capital",
                    type: "Private Equity",
                    aum: "$2.5B",
                    focus: "Technology, Healthcare",
                  },
                  {
                    name: "Blue Harbor Partners",
                    type: "Venture Capital",
                    aum: "$850M",
                    focus: "Fintech, SaaS",
                  },
                  {
                    name: "Meridian Investments",
                    type: "Real Estate",
                    aum: "$1.2B",
                    focus: "Commercial, Multi-family",
                  },
                ].map((manager, index) => (
                  <div key={index} className="vestira-card">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-deepBrand">{manager.name}</h4>
                        <p className="text-xs text-baseGray mt-1">{manager.type}</p>
                        <div className="mt-3 space-y-1">
                          <p className="text-xs text-baseGray flex items-center">
                            <span className="font-medium mr-2">AUM:</span> {manager.aum}
                          </p>
                          <p className="text-xs text-baseGray flex items-center">
                            <span className="font-medium mr-2">Focus:</span> {manager.focus}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button className="btn-primary text-xs px-3 py-1.5 flex items-center">
                        <PlusCircle size={14} className="mr-1" />
                        Connect
                      </button>
                      <button className="btn-secondary text-xs px-3 py-1.5">View Profile</button>
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
