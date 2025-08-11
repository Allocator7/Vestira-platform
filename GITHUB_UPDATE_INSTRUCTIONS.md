# GitHub Update Instructions

## 🚨 **The Issue**
The 404 error is caused by the root page being a client-side component that uses browser APIs. This doesn't work with SSR on Amplify.

## ✅ **The Fix**
I've updated the root page (`app/page.tsx`) to be a static server component that will work properly with Amplify.

## 📋 **What You Need to Do**

### **Step 1: Update the File in GitHub**
1. **Go to your GitHub repository**
2. **Navigate to** `app/page.tsx`
3. **Click the pencil icon** (Edit)
4. **Replace the entire content** with this:

```typescript
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-canvas-bg to-white">
      <div className="text-center">
        <div className="h-12 w-12 rounded-xl bg-deep-brand flex items-center justify-center text-white font-bold text-xl shadow-vestira mx-auto mb-4">
          V
        </div>
        <h1 className="text-2xl font-bold text-deep-brand mb-4">Welcome to Vestira</h1>
        <p className="text-base-gray mb-6">Your platform is ready</p>
        <div className="space-y-2">
          <Link 
            href="/login" 
            className="block px-6 py-2 bg-deep-brand text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/screens/allocator/home" 
            className="block px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Allocator Dashboard
          </Link>
          <Link 
            href="/screens/manager/home" 
            className="block px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Manager Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
```

### **Step 2: Commit the Changes**
1. **Add a commit message**: `"Fix root page for SSR compatibility"`
2. **Click "Commit changes"**

### **Step 3: Redeploy**
1. **Wait 2-3 minutes** for changes to reach Amplify
2. **Go to AWS Amplify Console**
3. **Click "Redeploy this version"**

## 🎯 **What This Will Do**

- ✅ **Fix the 404 error** at vestira.co
- ✅ **Create a static landing page** that works with SSR
- ✅ **Provide navigation links** to different parts of the app
- ✅ **Maintain the existing UI/functionality** for the rest of the app

**This should finally get vestira.co working properly!**