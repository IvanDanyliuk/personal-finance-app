// export { auth as middleware } from "@/auth"

import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';


const notProtectedRoutes = ['/sign-in', '/sign-up'];

export default async function middleware(request: NextRequest) {
  const session = await auth();

  const notProtected = notProtectedRoutes.some(route => notProtectedRoutes.includes(request.nextUrl.pathname));

  if(!session && !notProtected) {
    const absoluteUrl = new URL('/sign-in', request.nextUrl.origin);
    console.log('ABSOLUTE URL', absoluteUrl)
    return NextResponse.redirect(absoluteUrl.toString())
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ]
}