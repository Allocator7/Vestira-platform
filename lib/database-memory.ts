import { hash, compare } from 'bcryptjs'

// In-memory storage for immediate testing
let users: any[] = []
let verifications: any[] = []

// Initialize with some test data
if (users.length === 0) {
  users = [
    {
      id: "user_test_1",
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "$2b$12$UmXNNNgqB2Bvq54kORYWGewr3Aw6qUfg3Fmy/AUea43anUE8k9C8q",
      organizationType: "allocator",
      organizationName: "Test Org",
      jobTitle: "Test Job",
      emailVerified: false,
      createdAt: "2025-08-07T16:34:58.363Z",
      updatedAt: "2025-08-07T16:34:58.363Z"
    }
  ]
}

// Get users from memory
export const getUsers = (): any[] => {
  return users
}

// Save users to memory
export const saveUsers = (newUsers: any[]) => {
  users = newUsers
}

// Create new user
export const createUser = async (userData: any) => {
  console.log("=== CREATE USER CALLED (MEMORY) ===")
  console.log("User data:", { ...userData, password: "[HIDDEN]" })
  
  // Check if user already exists
  const existingUser = users.find(user => user.email.toLowerCase() === userData.email.toLowerCase())
  if (existingUser) {
    console.log("User already exists:", existingUser.email)
    throw new Error('User with this email already exists')
  }
  
  console.log("User does not exist, creating new user...")
  
  // Hash password
  const hashedPassword = await hash(userData.password, 12)
  console.log("Password hashed successfully")
  
  // Create user object
  const newUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...userData,
    password: hashedPassword,
    emailVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  console.log("New user object created:", { ...newUser, password: "[HIDDEN]" })
  
  // Add to memory
  users.push(newUser)
  console.log("User saved to memory successfully")
  
  return { ...newUser, password: undefined } // Don't return password
}

// Find user by email
export const findUserByEmail = (email: string) => {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase())
}

// Verify user password
export const verifyPassword = async (email: string, password: string) => {
  const user = findUserByEmail(email)
  if (!user) return null
  
  const isValid = await compare(password, user.password)
  return isValid ? user : null
}

// Update user
export const updateUser = (userId: string, updates: any) => {
  const userIndex = users.findIndex(user => user.id === userId)
  
  if (userIndex === -1) {
    throw new Error('User not found')
  }
  
  users[userIndex] = { ...users[userIndex], ...updates, updatedAt: new Date().toISOString() }
  
  return { ...users[userIndex], password: undefined }
}

// Get verifications from memory
export const getVerifications = (): any[] => {
  return verifications
}

// Save verification
export const saveVerification = (verificationData: any) => {
  verifications.push(verificationData)
}

// Find verification by token
export const findVerificationByToken = (token: string) => {
  return verifications.find(v => v.token === token)
}

// Remove verification after use
export const removeVerification = (token: string) => {
  verifications = verifications.filter(v => v.token !== token)
}