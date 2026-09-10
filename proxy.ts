import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  // Allow all authorized parties by default; adjust for production as needed
  authorizedParties: ['*'],
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Clerk's auto-proxy path
    '/__clerk/:path*',
    // API routes
    '/(api|trpc)(.*)',
  ],
};
