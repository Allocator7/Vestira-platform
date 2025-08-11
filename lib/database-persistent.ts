import { hash, compare } from 'bcryptjs'
import fs from 'fs'
import path from 'path'

// Use a persistent file path that works in production
const DATA_DIR = process.env.NODE_ENV === 'production' ? '/tmp' : './data'
const USERS_FILE = path.join(DATA_DIR, 'users.json')
const VERIFICATIONS_FILE = path.join(DATA_DIR, 'verifications.json')

// Ensure data directory exists
const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Initialize files if they don't exist
const initializeFiles = () => {
  ensureDataDir()
  
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2))
  }
  
  if (!fs.existsSync(VERIFICATIONS_FILE)) {
    fs.writeFileSync(VERIFICATIONS_FILE, JSON.stringify([], null, 2))
  }
}

// Get users from file
export const getUsers = (): any[] => {
  try {
    initializeFiles()
    const data = fs.readFileSync(USERS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading users file:', error)
    return []
  }
}

// Save users to file
export const saveUsers = (users: any[]) => {
  try {
    initializeFiles()
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error('Error writing users file:', error)
  }
}

// Create new user
export const createUser = async (userData: any) => {
  console.log("=== CREATE USER CALLED (PERSISTENT) ===")
  console.log("User data:", { ...userData, password: "[HIDDEN]" })
  
  const users = getUsers()
  console.log("Current users count:", users.length)
  
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
  
  // Add to database
  users.push(newUser)
  saveUsers(users)
  console.log("User saved to database successfully")
  
  return { ...newUser, password: undefined } // Don't return password
}

// Find user by email
export const findUserByEmail = (email: string) => {
  const users = getUsers()
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
  const users = getUsers()
  const userIndex = users.findIndex(user => user.id === userId)
  
  if (userIndex === -1) {
    throw new Error('User not found')
  }
  
  users[userIndex] = { ...users[userIndex], ...updates, updatedAt: new Date().toISOString() }
  saveUsers(users)
  
  return { ...users[userIndex], password: undefined }
}

// Get verifications from file
export const getVerifications = (): any[] => {
  try {
    initializeFiles()
    const data = fs.readFileSync(VERIFICATIONS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading verifications file:', error)
    return []
  }
}

// Save verification
export const saveVerification = (verificationData: any) => {
  try {
    initializeFiles()
    const verifications = getVerifications()
    verifications.push(verificationData)
    fs.writeFileSync(VERIFICATIONS_FILE, JSON.stringify(verifications, null, 2))
  } catch (error) {
    console.error('Error writing verification file:', error)
  }
}

// Find verification by token
export const findVerificationByToken = (token: string) => {
  const verifications = getVerifications()
  return verifications.find(v => v.token === token)
}

// Remove verification after use
export const removeVerification = (token: string) => {
  try {
    initializeFiles()
    const verifications = getVerifications()
    const filtered = verifications.filter(v => v.token !== token)
    fs.writeFileSync(VERIFICATIONS_FILE, JSON.stringify(filtered, null, 2))
  } catch (error) {
    console.error('Error removing verification:', error)
  }
}