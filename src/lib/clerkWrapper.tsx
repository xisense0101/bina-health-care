import type { ReactNode } from 'react';

// Lightweight wrapper to prevent Clerk from loading if no publishable key is set.
// If VITE_CLERK_PUBLISHABLE_KEY is present, we dynamically import Clerk and replace
// the placeholders. Otherwise the app uses no-op/stub implementations.

const hasKey = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

let ClerkProvider: any = ({ children }: { children?: ReactNode }) => <>{children}</>;
let SignIn: any = () => null;
let useAuth: any = () => ({ isSignedIn: false, userId: null });
let useClerk: any = () => ({ signOut: async () => {} });
let UserButton: any = () => null;

if (hasKey) {
  // Dynamically load Clerk (only when key exists) and override stubs.
  // This keeps dev behaviour when a key is explicitly provided, but prevents
  // Clerk from loading and printing warnings when keys are absent.
  import('@clerk/clerk-react')
    .then((mod) => {
      ClerkProvider = mod.ClerkProvider;
      SignIn = mod.SignIn;
      useAuth = mod.useAuth;
      useClerk = mod.useClerk;
      UserButton = mod.UserButton;
    })
    .catch(() => {
      // If dynamic import fails, keep using stubs silently.
    });
}

export { ClerkProvider, SignIn, useAuth, useClerk, UserButton };
export default { ClerkProvider, SignIn, useAuth, useClerk, UserButton };