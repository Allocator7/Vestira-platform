"use client"

import { useState } from "react"
import { Screen } from "../../../../components/Screen"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Label } from "../../../../components/ui/label"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AllocatorAuthPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("login")

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <Screen>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Link href="/screens" className="flex items-center text-sm text-gray-600 hover:text-[#00B2FF]">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Screens
            </Link>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-deepBrand">Vestira for Allocators</CardTitle>
              <CardDescription>Sign in to access your allocator dashboard</CardDescription>
            </CardHeader>

            <Tabs defaultValue="login" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-4 mx-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-0">
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your.email@company.com" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link href="#" className="text-xs text-[#00B2FF] hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input id="password" type={isPasswordVisible ? "text" : "password"} placeholder="••••••••" />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button className="w-full bg-[#00B2FF] hover:bg-[#0090CC]">Sign In</Button>
                  <div className="text-center text-sm text-gray-500">
                    Don&apos;t have an account?{" "}
                    <button onClick={() => setActiveTab("signup")} className="text-[#00B2FF] hover:underline">
                      Sign up
                    </button>
                  </div>
                </CardFooter>
              </TabsContent>

              <TabsContent value="signup" className="mt-0">
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input id="organization" placeholder="Your Company" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signupEmail">Email</Label>
                    <Input id="signupEmail" type="email" placeholder="your.email@company.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signupPassword">Password</Label>
                    <div className="relative">
                      <Input
                        id="signupPassword"
                        type={isPasswordVisible ? "text" : "password"}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button className="w-full bg-[#00B2FF] hover:bg-[#0090CC]">Create Account</Button>
                  <div className="text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <button onClick={() => setActiveTab("login")} className="text-[#00B2FF] hover:underline">
                      Sign in
                    </button>
                  </div>
                </CardFooter>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </Screen>
  )
}
