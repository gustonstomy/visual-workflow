import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

// export default async function middleware(req: any) {
//     console.log("Middleware called:", req.nextUrl.pathname);
//     return NextAuth(authConfig).auth(req);
// }

export const config = {
  // Match all routes except static files and Next.js internals
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
