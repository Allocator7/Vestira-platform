"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface DataRoom {
  id: string
  name: string
  description: string
  strategy: string
  status: "active" | "draft" | "archived" | "completed"
  createdBy: string
  createdDate: string
  lastActivity: string
  dueDate?: string
  participants: number
  documentsCount: number
  totalSize: string
  accessLevel: "public" | "private" | "restricted"
  template: string
  tags: string[]
  allocators: string[]
  managers: string[]
  documentIds: string[]
  folderIds: string[]
  permissions: {
    userId: string
    userEmail: string
    role: "viewer" | "contributor" | "manager" | "admin"
    addedBy: string
    addedDate: string
  }[]
  recentActivity: {
    id: string
    user: string
    action: string
    timestamp: string
    document?: string
  }[]
  analytics: {
    totalViews: number
    uniqueVisitors: number
    documentsDownloaded: number
    averageTimeSpent: string
  }
  settings: {
    allowDownloads: boolean
    allowPrinting: boolean
    requireWatermark: boolean
    expirationDate?: string
    notifyOnAccess: boolean
  }
}

export interface DataRoomStore {
  dataRooms: DataRoom[]
  selectedDataRoom: string | null
  searchQuery: string
  selectedStrategy: string
  selectedStatus: string

  // Data room actions
  addDataRoom: (dataRoom: Omit<DataRoom, "id">) => string
  updateDataRoom: (id: string, updates: Partial<DataRoom>) => void
  deleteDataRoom: (id: string) => void
  addDocumentToDataRoom: (dataRoomId: string, documentId: string) => void
  removeDocumentFromDataRoom: (dataRoomId: string, documentId: string) => void
  addUserToDataRoom: (dataRoomId: string, user: DataRoom["permissions"][0]) => void
  removeUserFromDataRoom: (dataRoomId: string, userId: string) => void
  updateUserRole: (dataRoomId: string, userId: string, role: DataRoom["permissions"][0]["role"]) => void
  addActivity: (dataRoomId: string, activity: Omit<DataRoom["recentActivity"][0], "id">) => void

  // Navigation
  setSelectedDataRoom: (dataRoomId: string | null) => void
  setSearchQuery: (query: string) => void
  setSelectedStrategy: (strategy: string) => void
  setSelectedStatus: (status: string) => void

  // Computed
  getFilteredDataRooms: () => DataRoom[]
  getDataRoom: (id: string) => DataRoom | undefined
}

export const useDataRoomStore = create<DataRoomStore>()(
  persist(
    (set, get) => ({
      dataRooms: [
        {
          id: "dr1",
          name: "Infrastructure Fund IV Due Diligence",
          description:
            "Comprehensive due diligence materials for our latest infrastructure investment fund targeting sustainable energy and transportation projects.",
          strategy: "Infrastructure",
          status: "active",
          createdBy: "John Smith",
          createdDate: "2024-09-15",
          lastActivity: "2 hours ago",
          dueDate: "2024-12-15",
          participants: 12,
          documentsCount: 127,
          totalSize: "2.4 GB",
          accessLevel: "private",
          template: "Infrastructure Fund",
          tags: ["Infrastructure", "ESG", "Sustainable Energy"],
          allocators: ["CalPERS", "OTPP", "State Pension Fund"],
          managers: ["BlackRock Infrastructure", "Brookfield Asset Management"],
          documentIds: ["doc1"],
          folderIds: ["folder1"],
          permissions: [
            {
              userId: "user1",
              userEmail: "john@calpers.com",
              role: "manager",
              addedBy: "John Smith",
              addedDate: "2024-09-15",
            },
            {
              userId: "user2",
              userEmail: "sarah@otpp.com",
              role: "viewer",
              addedBy: "John Smith",
              addedDate: "2024-09-16",
            },
          ],
          recentActivity: [
            {
              id: "act1",
              user: "Sarah Johnson",
              action: "Downloaded",
              timestamp: "2 hours ago",
              document: "Performance Report Q3.pdf",
            },
            {
              id: "act2",
              user: "Michael Chen",
              action: "Viewed",
              timestamp: "4 hours ago",
              document: "Investment Strategy.pptx",
            },
            {
              id: "act3",
              user: "Emily Rodriguez",
              action: "Commented on",
              timestamp: "6 hours ago",
              document: "Risk Assessment.xlsx",
            },
          ],
          analytics: {
            totalViews: 342,
            uniqueVisitors: 28,
            documentsDownloaded: 89,
            averageTimeSpent: "24 minutes",
          },
          settings: {
            allowDownloads: true,
            allowPrinting: false,
            requireWatermark: true,
            notifyOnAccess: true,
          },
        },
      ],
      selectedDataRoom: null,
      searchQuery: "",
      selectedStrategy: "All",
      selectedStatus: "All",

      addDataRoom: (dataRoom) => {
        const id = `dr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        const newDataRoom = {
          ...dataRoom,
          id,
          participants: 0,
          documentsCount: 0,
          totalSize: "0 MB",
          documentIds: [],
          folderIds: [],
          permissions: [],
          recentActivity: [],
          analytics: {
            totalViews: 0,
            uniqueVisitors: 0,
            documentsDownloaded: 0,
            averageTimeSpent: "0 minutes",
          },
          settings: {
            allowDownloads: true,
            allowPrinting: false,
            requireWatermark: true,
            notifyOnAccess: true,
          },
        }
        set((state) => ({
          dataRooms: [newDataRoom, ...state.dataRooms],
        }))
        return id
      },

      updateDataRoom: (id, updates) => {
        set((state) => ({
          dataRooms: state.dataRooms.map((room) =>
            room.id === id ? { ...room, ...updates, lastActivity: "Just now" } : room,
          ),
        }))
      },

      deleteDataRoom: (id) => {
        set((state) => ({
          dataRooms: state.dataRooms.filter((room) => room.id !== id),
        }))
      },

      addDocumentToDataRoom: (dataRoomId, documentId) => {
        set((state) => ({
          dataRooms: state.dataRooms.map((room) =>
            room.id === dataRoomId
              ? {
                  ...room,
                  documentIds: [...room.documentIds, documentId],
                  documentsCount: room.documentsCount + 1,
                  lastActivity: "Just now",
                }
              : room,
          ),
        }))
      },

      removeDocumentFromDataRoom: (dataRoomId, documentId) => {
        set((state) => ({
          dataRooms: state.dataRooms.map((room) =>
            room.id === dataRoomId
              ? {
                  ...room,
                  documentIds: room.documentIds.filter((id) => id !== documentId),
                  documentsCount: Math.max(0, room.documentsCount - 1),
                  lastActivity: "Just now",
                }
              : room,
          ),
        }))
      },

      addUserToDataRoom: (dataRoomId, user) => {
        set((state) => ({
          dataRooms: state.dataRooms.map((room) =>
            room.id === dataRoomId
              ? {
                  ...room,
                  permissions: [...room.permissions, user],
                  participants: room.participants + 1,
                  lastActivity: "Just now",
                }
              : room,
          ),
        }))
      },

      removeUserFromDataRoom: (dataRoomId, userId) => {
        set((state) => ({
          dataRooms: state.dataRooms.map((room) =>
            room.id === dataRoomId
              ? {
                  ...room,
                  permissions: room.permissions.filter((p) => p.userId !== userId),
                  participants: Math.max(0, room.participants - 1),
                  lastActivity: "Just now",
                }
              : room,
          ),
        }))
      },

      updateUserRole: (dataRoomId, userId, role) => {
        set((state) => ({
          dataRooms: state.dataRooms.map((room) =>
            room.id === dataRoomId
              ? {
                  ...room,
                  permissions: room.permissions.map((p) => (p.userId === userId ? { ...p, role } : p)),
                  lastActivity: "Just now",
                }
              : room,
          ),
        }))
      },

      addActivity: (dataRoomId, activity) => {
        const activityWithId = {
          ...activity,
          id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        }
        set((state) => ({
          dataRooms: state.dataRooms.map((room) =>
            room.id === dataRoomId
              ? {
                  ...room,
                  recentActivity: [activityWithId, ...room.recentActivity].slice(0, 10),
                  lastActivity: "Just now",
                }
              : room,
          ),
        }))
      },

      setSelectedDataRoom: (dataRoomId) => {
        set({ selectedDataRoom: dataRoomId })
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query })
      },

      setSelectedStrategy: (strategy) => {
        set({ selectedStrategy: strategy })
      },

      setSelectedStatus: (status) => {
        set({ selectedStatus: status })
      },

      getFilteredDataRooms: () => {
        const state = get()
        return state.dataRooms.filter((room) => {
          const matchesSearch =
            state.searchQuery === "" ||
            room.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            room.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            room.tags.some((tag) => tag.toLowerCase().includes(state.searchQuery.toLowerCase()))
          const matchesStrategy = state.selectedStrategy === "All" || room.strategy === state.selectedStrategy
          const matchesStatus = state.selectedStatus === "All" || room.status === state.selectedStatus
          return matchesSearch && matchesStrategy && matchesStatus
        })
      },

      getDataRoom: (id) => {
        const state = get()
        return state.dataRooms.find((room) => room.id === id)
      },
    }),
    {
      name: "data-room-store",
      partialize: (state) => ({
        dataRooms: state.dataRooms,
      }),
    },
  ),
)
