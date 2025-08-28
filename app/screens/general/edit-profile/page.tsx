"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Upload, X, Plus } from "lucide-react"

// Define form schema
const profileFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  title: z.string().min(2, { message: "Job title is required." }),
  organization: z.string().min(2, { message: "Organization is required." }),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(500, { message: "Bio must not exceed 500 characters." }).optional(),
  linkedin: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  yearsExperience: z.coerce.number().min(0).max(100).optional(),
  aum: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function EditProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("personal")
  
  // Extract URL parameters
  const profileId = searchParams.get("id") || "current-user"
  const profileName = searchParams.get("name") || "Current User"
  const profileType = searchParams.get("type") || "user"

  // Default values for the form
  const defaultValues: Partial<ProfileFormValues> = {
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@stpension.gov",
    title: "Investment Director",
    organization: "State Teachers Pension",
    phone: "+1 (617) 555-0123",
    location: "Boston, MA",
    bio: "Investment Director at State Teachers Pension with over 15 years of experience in institutional investment management. Specializes in alternative investments with a focus on private equity and real assets.",
    linkedin: "https://linkedin.com/in/sarahjohnson",
    yearsExperience: 15,
    aum: "$45B",
  }

  // Initialize form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  // Handle form submission
  function onSubmit(data: ProfileFormValues) {
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    })

    // In a real app, this would save to an API
    console.log("Form submitted:", data)

    // Navigate back to profile page
    router.push("/screens/general/person-profile")
  }

  // Handle cancel
  function handleCancel() {
    router.push("/screens/general/person-profile")
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={handleCancel} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="professional">Professional Details</TabsTrigger>
              <TabsTrigger value="preferences">Preferences & Privacy</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>Upload a professional photo for your profile.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl font-semibold relative">
                      {form.watch("firstName")?.[0] || "S"}
                      <div className="absolute -bottom-2 -right-2">
                        <Button size="sm" variant="outline" className="rounded-full h-8 w-8 p-0 bg-transparent">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Recommended: Square JPG or PNG, at least 400x400 pixels.</p>
                      <p>Maximum file size: 5MB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="City, State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="professional" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>Update your professional details and experience.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your job title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your organization" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="yearsExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Experience</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="aum"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assets Under Management (AUM)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. $45B" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Bio</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Write a brief professional bio" className="min-h-[120px]" {...field} />
                        </FormControl>
                        <FormDescription>{field.value?.length || 0}/500 characters</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn Profile URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <Label>Areas of Expertise</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                        <span className="text-sm">Private Equity</span>
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                        <span className="text-sm">Real Assets</span>
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                        <span className="text-sm">ESG Integration</span>
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label>Education</Label>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">MBA, Finance</p>
                              <p className="text-sm text-gray-600">Harvard Business School, 2008</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">BS, Economics</p>
                              <p className="text-sm text-gray-600">University of Pennsylvania, 2003</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label>Work Experience</Label>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Experience
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Investment Director</p>
                              <p className="text-sm text-gray-600">State Teachers Pension</p>
                              <p className="text-sm text-gray-500">2015 - Present</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Senior Investment Manager</p>
                              <p className="text-sm text-gray-600">Global Investments Ltd</p>
                              <p className="text-sm text-gray-500">2010 - 2015</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control what information is visible to others.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Address</p>
                        <p className="text-sm text-gray-500">Who can see your email address</p>
                      </div>
                      <Select defaultValue="connections">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="everyone">Everyone</SelectItem>
                          <SelectItem value="connections">Connections only</SelectItem>
                          <SelectItem value="nobody">Nobody</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Phone Number</p>
                        <p className="text-sm text-gray-500">Who can see your phone number</p>
                      </div>
                      <Select defaultValue="nobody">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="everyone">Everyone</SelectItem>
                          <SelectItem value="connections">Connections only</SelectItem>
                          <SelectItem value="nobody">Nobody</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Profile Visibility</p>
                        <p className="text-sm text-gray-500">Who can view your full profile</p>
                      </div>
                      <Select defaultValue="everyone">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="everyone">Everyone</SelectItem>
                          <SelectItem value="connections">Connections only</SelectItem>
                          <SelectItem value="nobody">Nobody</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <Select defaultValue="important">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All notifications</SelectItem>
                          <SelectItem value="important">Important only</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">In-App Notifications</p>
                        <p className="text-sm text-gray-500">Receive notifications within the app</p>
                      </div>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All notifications</SelectItem>
                          <SelectItem value="important">Important only</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
