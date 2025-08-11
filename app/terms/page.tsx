"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
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

          {/* Terms Content */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-deep-brand mb-6">Terms of Service</h1>
            
            <div className="prose max-w-none">
              <p className="text-sm text-muted-foreground mb-6">Last updated: April 15, 2025</p>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-base-gray mb-4">
                  By accessing and using the Vestira platform, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">2. Use License</h2>
                <p className="text-base-gray mb-4">
                  Permission is granted to temporarily download one copy of the materials (information or software) on Vestira's website for personal, non-commercial transitory viewing only.
                </p>
                <p className="text-base-gray mb-4">This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <ul className="list-disc pl-6 text-base-gray mb-4">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display</li>
                  <li>attempt to reverse engineer any software contained on Vestira's website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">3. Disclaimer</h2>
                <p className="text-base-gray mb-4">
                  The materials on Vestira's website are provided on an 'as is' basis. Vestira makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">4. Limitations</h2>
                <p className="text-base-gray mb-4">
                  In no event shall Vestira or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Vestira's website, even if Vestira or a Vestira authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">5. Accuracy of Materials</h2>
                <p className="text-base-gray mb-4">
                  The materials appearing on Vestira's website could include technical, typographical, or photographic errors. Vestira does not warrant that any of the materials on its website are accurate, complete or current. Vestira may make changes to the materials contained on its website at any time without notice.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">6. Links</h2>
                <p className="text-base-gray mb-4">
                  Vestira has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Vestira of the site. Use of any such linked website is at the user's own risk.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">7. Modifications</h2>
                <p className="text-base-gray mb-4">
                  Vestira may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms of Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">8. Governing Law</h2>
                <p className="text-base-gray mb-4">
                  These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}