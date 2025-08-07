import fs from 'fs'
import path from 'path'
import { hash, compare } from 'bcryptjs'

// Database file path
const DB_PATH = path.join(process.cwd(), 'data', 'users.json')
const VERIFICATIONS_PATH = path.join(process.cwd(), 'data', 'verifications.json')

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(DB_PATH)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Initialize database files
const initializeDB = () => {
  ensureDataDir()
  
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2))
  }
  
  if (!fs.existsSync(VERIFICATIONS_PATH)) {
    fs.writeFileSync(VERIFICATIONS_PATH, JSON.stringify([], null, 2))
  }
}

// Read users from database
export const getUsers = (): any[] => {
  try {
    initializeDB()
    const data = fs.readFileSync(DB_PATH, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading users database:', error)
    return []
  }
}

// Write users to database
export const saveUsers = (users: any[]) => {
  try {
    initializeDB()
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error('Error writing users database:', error)
    throw error
  }
}

// Create new user
export const createUser = async (userData: any) => {
  const users = getUsers()
  
  // Check if user already exists
  const existingUser = users.find(user => user.email.toLowerCase() === userData.email.toLowerCase())
  if (existingUser) {
    throw new Error('User with this email already exists')
  }
  
  // Hash password
  const hashedPassword = await hash(userData.password, 12)
  
  // Create user object
  const newUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...userData,
    password: hashedPassword,
    emailVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  // Add to database
  users.push(newUser)
  saveUsers(users)
  
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

// Read verifications from database
export const getVerifications = (): any[] => {
  try {
    initializeDB()
    const data = fs.readFileSync(VERIFICATIONS_PATH, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading verifications database:', error)
    return []
  }
}

// Save verification
export const saveVerification = (verificationData: any) => {
  try {
    initializeDB()
    const verifications = getVerifications()
    verifications.push(verificationData)
    fs.writeFileSync(VERIFICATIONS_PATH, JSON.stringify(verifications, null, 2))
  } catch (error) {
    console.error('Error writing verifications database:', error)
    throw error
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
    const verifications = getVerifications()
    const filtered = verifications.filter(v => v.token !== token)
    fs.writeFileSync(VERIFICATIONS_PATH, JSON.stringify(filtered, null, 2))
  } catch (error) {
    console.error('Error removing verification:', error)
  }
}