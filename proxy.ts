import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return response

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  const { data } = await supabase.auth.getClaims()
  const email = data?.claims?.email
  const path = request.nextUrl.pathname
  if (path.startsWith('/admin') && path !== '/admin/login' && email !== 'a.g.b.morphzy@gmail.com') {
    const redirect = request.nextUrl.clone()
    redirect.pathname = '/admin/login'
    return NextResponse.redirect(redirect)
  }
  return response
}

export const config = { matcher: ['/admin/:path*'] }
