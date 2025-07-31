// app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
 const [queryClient] = useState(
 () =>
 new QueryClient({
 defaultOptions: {
 queries: {
 // Time in milliseconds
 staleTime: 60 * 1000, // 1 minute
 cacheTime: 10 * 60 * 1000, // 10 minutes
 retry: (failureCount, error: any) => {
 // Don't retry on 401, 403, 404
 if (error?.response?.status === 401 || 
 error?.response?.status === 403 || 
 error?.response?.status === 404) {
 return false;
 }
 // Retry up to 3 times for other errors
 return failureCount < 3;
 },
 refetchOnWindowFocus: false,
 refetchOnReconnect: true,
 },
 mutations: {
 retry: false, // Don't retry mutations by default
 },
 },
 })
 );

 return (
 <QueryClientProvider client={queryClient}>
 {children}
 
 {/* Toast Notifications */}
 <Toaster
 position="top-right"
 toastOptions={{
 duration: 4000,
 style: {
 background: "#363636",
 color: "#fff",
 },
 success: {
 iconTheme: {
 primary: "#4ade80",
 secondary: "#fff",
 },
 },
 error: {
 iconTheme: {
 primary: "#ef4444",
 secondary: "#fff",
 },
 },
 }}
 />
 
 {/* React Query Devtools - فقط در development */}
 {process.env.NODE_ENV === "development" && (
 <ReactQueryDevtools 
 initialIsOpen={false} 
 position="bottom-right" 
 />
 )}
 </QueryClientProvider>
 );
}