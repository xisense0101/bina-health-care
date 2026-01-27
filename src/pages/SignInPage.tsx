import { SignIn } from '../lib/clerkWrapper';
import { SEO } from '../components/SEO';

export function SignInPage() {
  return (
    <>
      <SEO
        title="Admin Sign In"
        description="Sign in to access the Bina Adult Care admin panel."
      />
      
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#5B9A9E]/10 to-[#E5D4C1]/20">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Admin Panel
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to manage your website content
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <SignIn 
              routing="virtual"
              signUpUrl={undefined}
              forceRedirectUrl="/admin/dashboard"
              afterSignInUrl="/admin/dashboard"
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-none",
                  formButtonPrimary: "bg-primary hover:bg-primary/90",
                  headerTitle: { display: "none" },
                  headerSubtitle: { display: "none" },
                  footerAction: { display: "none" },
                  footerActionLink: { display: "none" },
                },
                layout: {
                  socialButtonsPlacement: "bottom",
                  socialButtonsVariant: "iconButton",
                  termsPageUrl: undefined,
                  privacyPageUrl: undefined,
                  showOptionalFields: false,
                },
                variables: {
                  colorPrimary: "#5B9A9E",
                }
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
