"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Share2, Copy, Mail, Check } from "lucide-react"

interface ShareProfileModalProps {
  isOpen: boolean
  onClose: () => void
  profileName: string
  profileUrl: string
}

export function ShareProfileModal({ isOpen, onClose, profileName, profileUrl }: ShareProfileModalProps) {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState(`I wanted to share ${profileName}'s profile with you.`)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      toast({
        title: "Link Copied",
        description: "Profile link has been copied to clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleEmailShare = async () => {
    if (!email.trim()) {
      toast({
        title: "Missing Email",
        description: "Please enter an email address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Profile Shared",
      description: `${profileName}'s profile has been shared with ${email}.`,
    })

    setIsLoading(false)
    setEmail("")
    setMessage(`I wanted to share ${profileName}'s profile with you.`)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Profile
          </DialogTitle>
          <DialogDescription>Share {profileName}'s profile with others</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Copy Link Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Profile Link</Label>
            <div className="flex gap-2">
              <Input value={profileUrl} readOnly className="flex-1" />
              <Button variant="outline" onClick={handleCopyLink} className="shrink-0">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Email Share Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Share via Email</Label>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a personal message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleEmailShare} disabled={isLoading}>
            {isLoading ? (
              "Sharing..."
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Share via Email
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
