export interface Message {
  id: string
  sender: {
    name: string
    email: string
    image?: string
  }
  content: string
  createdAt: string
  read: boolean
  archived: boolean
}

export interface User {
  id: string
  name: string
  email: string
  image?: string
}
