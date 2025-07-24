import { create } from "zustand"
import { persist } from "zustand/middleware"

// Define types for our store - UPDATED to include industry-group
export type UserRole = "allocator" | "manager" | "consultant" | "industry-group" | "admin"

export type ManagerType =
  | "private-equity"
  | "venture-capital"
  | "hedge-fund"
  | "traditional-asset-management"
  | "hybrid-other"
export type AllocatorType =
  | "insurance"
  | "corporation"
  | "corporate-pension"
  | "public-pension"
  | "family-office-hnw"
  | "other"
export type ConsultantType =
  | "investment-consultant"
  | "ocio"
  | "gatekeeper"
  | "placement-agent"
  | "third-party-marketer"
  | "other"
export type IndustryGroupType =
  | "trade-association"
  | "regulatory-body"
  | "professional-organization"
  | "industry-council"
  | "standards-organization"
  | "other"

export interface FirmProfile {
  id: string
  name: string
  type: "manager" | "allocator" | "consultant" | "industry-group"
  subType: ManagerType | AllocatorType | ConsultantType | IndustryGroupType
  aum?: string
  location: string
  founded: string
  website: string
  description: string
  logo: string
  logoColor: string
  verified: boolean
  adminApproved: boolean
  createdAt: string
  updatedAt: string
}

export interface PersonProfile {
  id: string
  firmId: string
  firstName: string
  lastName: string
  email: string
  title: string
  role: UserRole
  avatar?: string
  verified: boolean
  adminApproved: boolean
  lastActive: string
  createdAt: string
}

export interface Manager extends FirmProfile {
  type: "manager"
  subType: ManagerType
  performance?: {
    returns: {
      oneYear: string
      threeYear: string
      fiveYear: string
      tenYear: string
    }
    benchmarks: {
      oneYear: string
      threeYear: string
      fiveYear: string
      tenYear: string
    }
  }
}

export interface Allocator extends FirmProfile {
  type: "allocator"
  subType: AllocatorType
  allocation?: {
    privateEquity: number
    publicEquity: number
    fixedIncome: number
    realEstate: number
    alternatives: number
  }
}

export interface Consultant extends FirmProfile {
  type: "consultant"
  subType: ConsultantType
  specialties?: string[]
  clientTypes?: string[]
  yearsInBusiness?: number
  services?: string[] // Will contain only "Investment Consulting" and "OCIO"
  specializations?: string[]
  regions?: string[]
  aum?: string // Some consultants manage assets directly (OCIO)
}

// NEW: Industry Group interface
export interface IndustryGroup extends FirmProfile {
  type: "industry-group"
  subType: IndustryGroupType
  memberCount?: number
  establishedYear?: string
  regulatoryScope?: string[]
  memberTypes?: string[]
  services?: string[]
  regions?: string[]
  focusAreas?: string[]
}

// NEW: Event and Attendance interfaces for Industry Groups
export interface Event {
  id: string
  title: string
  type: "conference" | "webinar" | "workshop" | "seminar" | "networking"
  description: string
  startDate: string
  endDate: string
  location?: string
  isVirtual: boolean
  maxAttendees?: number
  registrationDeadline: string
  status: "draft" | "published" | "ongoing" | "completed" | "cancelled"
  organizer: string
  speakers?: string[]
  agenda?: {
    time: string
    title: string
    speaker?: string
    description?: string
  }[]
  registrationFee?: number
  tags: string[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface EventAttendance {
  id: string
  eventId: string
  attendeeId: string
  attendeeName: string
  attendeeEmail: string
  attendeeOrganization: string
  attendeeTitle: string
  registrationDate: string
  status: "registered" | "confirmed" | "attended" | "no-show" | "cancelled"
  checkInTime?: string
  checkOutTime?: string
  feedback?: {
    rating: number
    comments: string
  }
  certificateIssued?: boolean
}

// Rest of the existing interfaces remain the same...
export interface Document {
  id: string
  name: string
  type: string
  size: string
  category: string
  tags: string[]
  uploadedBy: string
  uploadDate: string
  starred: boolean
  sharedWith: string[]
  permissionLevel: "view" | "edit" | "admin"
}

export interface DueDiligence {
  id: string
  managerName?: string
  allocatorName?: string
  strategy?: string
  allocatorType?: string
  startDate: string
  dueDate: string
  status: "just-started" | "in-progress" | "overdue" | "completed"
  progress: number
  priority: "high" | "medium" | "low"
  assignedTo: string[]
  lastActivity: string
  pendingItems: number
  completedItems: number
  relationshipStatus: "existing" | "prospective"
  aum?: string
}

export interface Message {
  id: number
  sender: {
    name: string
    avatar: string
    role: UserRole
  }
  subject: string
  preview: string
  date: string
  read: boolean
  starred: boolean
  labels: string[]
}

interface AppState {
  // User state
  userRole: UserRole
  currentPersonProfile: PersonProfile | null
  currentFirmProfile: FirmProfile | null

  // Data collections
  firmProfiles: FirmProfile[]
  personProfiles: PersonProfile[]
  managers: Manager[]
  allocators: Allocator[]
  consultants: Consultant[]
  industryGroups: IndustryGroup[] // NEW
  events: Event[] // NEW
  eventAttendances: EventAttendance[] // NEW
  documents: Document[]
  dueDiligence: DueDiligence[]
  messages: Message[]

  // UI state
  recentlyViewed: {
    type: "manager" | "allocator" | "consultant" | "industry-group" | "document" | "dueDiligence" | "event"
    id: string
    name: string
    timestamp: number
  }[]

  // Actions
  setUserRole: (role: UserRole) => void
  setCurrentPersonProfile: (profile: PersonProfile | null) => void
  setCurrentFirmProfile: (profile: FirmProfile | null) => void
  addRecentlyViewed: (item: {
    type: "manager" | "allocator" | "consultant" | "industry-group" | "document" | "dueDiligence" | "event"
    id: string
    name: string
  }) => void
  starDocument: (id: string) => void
  markMessageAsRead: (id: number) => void
  toggleMessageStar: (id: number) => void
  // NEW: Event management actions
  addEvent: (event: Omit<Event, "id" | "createdAt" | "updatedAt">) => void
  updateEvent: (id: string, updates: Partial<Event>) => void
  deleteEvent: (id: string) => void
  addEventAttendance: (attendance: Omit<EventAttendance, "id">) => void
  updateEventAttendance: (id: string, updates: Partial<EventAttendance>) => void
}

// Create the store
export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      userRole: "allocator",
      currentPersonProfile: null,
      currentFirmProfile: null,

      firmProfiles: [],
      personProfiles: [],
      managers: [],
      allocators: [],
      consultants: [],
      industryGroups: [], // NEW
      events: [], // NEW
      eventAttendances: [], // NEW
      documents: [],
      dueDiligence: [],
      messages: [],

      recentlyViewed: [],

      // Actions
      setUserRole: (role) => set({ userRole: role }),
      setCurrentPersonProfile: (profile) => set({ currentPersonProfile: profile }),
      setCurrentFirmProfile: (profile) => set({ currentFirmProfile: profile }),

      addRecentlyViewed: (item) =>
        set((state) => {
          // Remove if already exists
          const filtered = state.recentlyViewed.filter((i) => !(i.type === item.type && i.id === item.id))

          // Add to beginning of array with timestamp
          return {
            recentlyViewed: [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, 10), // Keep only 10 most recent
          }
        }),

      starDocument: (id) =>
        set((state) => ({
          documents: state.documents.map((doc) => (doc.id === id ? { ...doc, starred: !doc.starred } : doc)),
        })),

      markMessageAsRead: (id) =>
        set((state) => ({
          messages: state.messages.map((message) => (message.id === id ? { ...message, read: true } : message)),
        })),

      toggleMessageStar: (id) =>
        set((state) => ({
          messages: state.messages.map((message) =>
            message.id === id ? { ...message, starred: !message.starred } : message,
          ),
        })),

      // NEW: Event management actions
      addEvent: (eventData) =>
        set((state) => ({
          events: [
            ...state.events,
            {
              ...eventData,
              id: `event-${Date.now()}`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      updateEvent: (id, updates) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...updates, updatedAt: new Date().toISOString() } : event,
          ),
        })),

      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
          eventAttendances: state.eventAttendances.filter((attendance) => attendance.eventId !== id),
        })),

      addEventAttendance: (attendanceData) =>
        set((state) => ({
          eventAttendances: [
            ...state.eventAttendances,
            {
              ...attendanceData,
              id: `attendance-${Date.now()}`,
            },
          ],
        })),

      updateEventAttendance: (id, updates) =>
        set((state) => ({
          eventAttendances: state.eventAttendances.map((attendance) =>
            attendance.id === id ? { ...attendance, ...updates } : attendance,
          ),
        })),
    }),
    {
      name: "vestira-storage",
    },
  ),
)
