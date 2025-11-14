
import { createRoot } from "react-dom/client";
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  console.warn('Missing Clerk Publishable Key. Admin features will not work.');
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider 
    publishableKey={clerkPubKey || ''}
    afterSignInUrl="/admin/dashboard"
    appearance={{
      variables: {
        colorPrimary: "#5B9A9E",
      }
    }}
  >
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </ClerkProvider>
);  