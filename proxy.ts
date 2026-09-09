import { clerkMiddleware } from "@clerk/nextjs/server"

export default clerkMiddleware(async (auth, req) => {
  // Important: This is not an auth guarantee, only
  // a performance optimization for signed-out users.
  // const pathname = req.nextUrl.pathname
  // const publicRoutes = ["/", "/sign-in", "sign-up"]
  // if (!publicRoutes.includes(pathname)) {
  //   const { isAuthenticated, redirectToSignIn } = await auth()
  //   if (!isAuthenticated) return redirectToSignIn()
  // }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
