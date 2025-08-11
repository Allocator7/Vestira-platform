"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  const router = useRouter()

  const handleBack = () => {
    // Check if we came from signup process
    if (typeof window !== 'undefined') {
      const signupState = sessionStorage.getItem('signup-state')
      if (signupState) {
        // Return to signup with preserved state
        router.push('/signup')
        return
      }
    }
    
    // Check if there's a previous page in history
    if (window.history.length > 1) {
      router.back()
    } else {
      // Fallback to signup page if no history
      router.push('/signup')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-canvas-bg to-white">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 text-base-gray hover:text-deep-brand"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {/* Privacy Content */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-deep-brand mb-6">Privacy Policy</h1>
            
            <div className="prose max-w-none">
              <p className="text-sm text-muted-foreground mb-6">Last updated: April 15, 2025</p>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
                <p className="text-base-gray mb-4">
                  We collect information you provide directly to us, such as when you create an account, complete a profile, or communicate with us. This may include:
                </p>
                <ul className="list-disc pl-6 text-base-gray mb-4">
                  <li>Name, email address, and contact information</li>
                  <li>Professional information and credentials</li>
                  <li>Organization details and role information</li>
                  <li>Communication preferences and settings</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
                <p className="text-base-gray mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-base-gray mb-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices, updates, and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Communicate with you about products, services, and events</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">3. Information Sharing</h2>
                <p className="text-base-gray mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with:
                </p>
                <ul className="list-disc pl-6 text-base-gray mb-4">
                  <li>Service providers who assist in our operations</li>
                  <li>Legal authorities when required by law</li>
                  <li>Other users as part of the platform's functionality</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
                <p className="text-base-gray mb-4">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
                <p className="text-base-gray mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-base-gray mb-4">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt out of marketing communications</li>
                  <li>Request a copy of your data</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">6. Cookies and Tracking</h2>
                <p className="text-base-gray mb-4">
                  We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">7. Third-Party Services</h2>
                <p className="text-base-gray mb-4">
                  Our platform may integrate with third-party services. These services have their own privacy policies, and we encourage you to review them.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">8. Children's Privacy</h2>
                <p className="text-base-gray mb-4">
                  Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">9. International Transfers</h2>
                <p className="text-base-gray mb-4">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">10. Changes to This Policy</h2>
                <p className="text-base-gray mb-4">
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">11. Contact Us</h2>
                <p className="text-base-gray mb-4">
                  If you have any questions about this privacy policy, please contact us at privacy@vestira.com.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}