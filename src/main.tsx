
import './lib/disableConsoleInProd';
import { warn } from './lib/logger';
import { createRoot } from "react-dom/client";
import { ClerkProvider } from './lib/clerkWrapper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  warn('Missing Clerk Publishable Key. Admin features will not work.');
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider 
    publishableKey={clerkPubKey || ''}
    fallbackRedirectUrl="/admin/dashboard"
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