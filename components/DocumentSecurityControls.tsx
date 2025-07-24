"use client"

import { useState } from "react"
import { Shield, Lock, Eye, Copy, Clock, AlertCircle, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

interface SecuritySettings {
  watermarkEnabled: boolean
  watermarkText: string
  downloadDisabled: boolean
  printDisabled: boolean
  copyDisabled: boolean
  expirationEnabled: boolean
  expirationDate: string | null
  passwordProtected: boolean
  password: string | null
  trackViews: boolean
  trackDownloads: boolean
}

interface DocumentSecurityControlsProps {
  documentId: string
  documentName: string
  initialSettings: SecuritySettings
  onSaveSettings?: (settings: SecuritySettings) => Promise<void>
  className?: string
}

export function DocumentSecurityControls({
  documentId,
  documentName,
  initialSettings,
  onSaveSettings,
  className,
}: DocumentSecurityControlsProps) {
  const [settings, setSettings] = useState<SecuritySettings>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false)
  const { toast } = useToast()

  const handleSaveSettings = async () => {
    if (!onSaveSettings) return

    try {
      setIsSaving(true)
      await onSaveSettings(settings)

      toast({
        title: "Security settings saved",
        description: `Security controls for "${documentName}" have been updated.`,
        variant: "success",
      })
    } catch (error) {
      console.error("Failed to save security settings:", error)
      toast({
        title: "Failed to save settings",
        description: "There was an error updating the security settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()"
    let password = ""

    setIsGeneratingPassword(true)

    // Simulate API call for password generation
    setTimeout(() => {
      for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length))
      }

      setSettings({
        ...settings,
        password,
        passwordProtected: true,
      })

      setIsGeneratingPassword(false)

      toast({
        title: "Password generated",
        description: "A secure password has been generated for this document.",
        variant: "success",
      })
    }, 800)
  }

  const copyPasswordToClipboard = () => {
    if (!settings.password) return

    navigator.clipboard.writeText(settings.password)

    toast({
      title: "Password copied",
      description: "The password has been copied to your clipboard.",
      variant: "success",
    })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Document Security Controls
        </CardTitle>
        <CardDescription>Configure security settings for "{documentName}"</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Access Controls */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-deep-brand flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Access Controls
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="password-protection">Password Protection</Label>
                <p className="text-xs text-base-gray">Require a password to access this document</p>
              </div>
              <Switch
                id="password-protection"
                checked={settings.passwordProtected}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    passwordProtected: checked,
                    password: checked ? settings.password : null,
                  })
                }
              />
            </div>

            {settings.passwordProtected && (
              <div className="space-y-2 pl-4 border-l-2 border-electric-blue">
                <Label htmlFor="password">Document Password</Label>
                <div className="flex gap-2">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={settings.password || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        password: e.target.value,
                      })
                    }
                  />
                  <Button variant="outline" size="sm" onClick={generateRandomPassword} disabled={isGeneratingPassword}>
                    {isGeneratingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
                  </Button>
                  {settings.password && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" onClick={copyPasswordToClipboard}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy password to clipboard</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="expiration">Document Expiration</Label>
                <p className="text-xs text-base-gray">Set an expiration date for document access</p>
              </div>
              <Switch
                id="expiration"
                checked={settings.expirationEnabled}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    expirationEnabled: checked,
                    expirationDate: checked ? settings.expirationDate : null,
                  })
                }
              />
            </div>

            {settings.expirationEnabled && (
              <div className="space-y-2 pl-4 border-l-2 border-electric-blue">
                <Label htmlFor="expiration-date">Expiration Date</Label>
                <Input
                  id="expiration-date"
                  type="datetime-local"
                  value={settings.expirationDate || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      expirationDate: e.target.value,
                    })
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* Document Protection */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-deep-brand flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Document Protection
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="watermark">Watermark</Label>
                <p className="text-xs text-base-gray">Add a watermark to the document</p>
              </div>
              <Switch
                id="watermark"
                checked={settings.watermarkEnabled}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    watermarkEnabled: checked,
                  })
                }
              />
            </div>

            {settings.watermarkEnabled && (
              <div className="space-y-2 pl-4 border-l-2 border-electric-blue">
                <Label htmlFor="watermark-text">Watermark Text</Label>
                <Input
                  id="watermark-text"
                  placeholder="Enter watermark text"
                  value={settings.watermarkText}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      watermarkText: e.target.value,
                    })
                  }
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="disable-download">Disable Downloads</Label>
                <p className="text-xs text-base-gray">Prevent users from downloading this document</p>
              </div>
              <Switch
                id="disable-download"
                checked={settings.downloadDisabled}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    downloadDisabled: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="disable-print">Disable Printing</Label>
                <p className="text-xs text-base-gray">Prevent users from printing this document</p>
              </div>
              <Switch
                id="disable-print"
                checked={settings.printDisabled}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    printDisabled: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="disable-copy">Disable Copy/Paste</Label>
                <p className="text-xs text-base-gray">Prevent users from copying text from this document</p>
              </div>
              <Switch
                id="disable-copy"
                checked={settings.copyDisabled}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    copyDisabled: checked,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Activity Tracking */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-deep-brand flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Activity Tracking
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="track-views">Track Views</Label>
                <p className="text-xs text-base-gray">Monitor when users view this document</p>
              </div>
              <Switch
                id="track-views"
                checked={settings.trackViews}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    trackViews: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="track-downloads">Track Downloads</Label>
                <p className="text-xs text-base-gray">Monitor when users download this document</p>
              </div>
              <Switch
                id="track-downloads"
                checked={settings.trackDownloads}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    trackDownloads: checked,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Security Level Indicator */}
        <div className="p-3 bg-gray-50 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Security Level:</span>
            </div>
            <Badge
              variant="outline"
              className={
                [
                  settings.passwordProtected,
                  settings.watermarkEnabled,
                  settings.downloadDisabled,
                  settings.printDisabled,
                  settings.copyDisabled,
                ].filter(Boolean).length >= 3
                  ? "bg-green-50 text-green-700 border-green-200"
                  : [
                        settings.passwordProtected,
                        settings.watermarkEnabled,
                        settings.downloadDisabled,
                        settings.printDisabled,
                        settings.copyDisabled,
                      ].filter(Boolean).length >= 1
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : "bg-red-50 text-red-700 border-red-200"
              }
            >
              {[
                settings.passwordProtected,
                settings.watermarkEnabled,
                settings.downloadDisabled,
                settings.printDisabled,
                settings.copyDisabled,
              ].filter(Boolean).length >= 3
                ? "High"
                : [
                      settings.passwordProtected,
                      settings.watermarkEnabled,
                      settings.downloadDisabled,
                      settings.printDisabled,
                      settings.copyDisabled,
                    ].filter(Boolean).length >= 1
                  ? "Medium"
                  : "Low"}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex items-center text-sm text-base-gray">
          <AlertCircle className="h-4 w-4 mr-1" />
          Changes will apply immediately after saving
        </div>

        <Button
          className="bg-electric-blue text-white hover:bg-royal-blue"
          onClick={handleSaveSettings}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default DocumentSecurityControls
