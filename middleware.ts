import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // Protected routes logic
    if (!session && (req.nextUrl.pathname.startsWith('/workspace') || req.nextUrl.pathname.startsWith('/crm'))) {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/access'
        redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
    }

    return res
}

export const config = {
    matcher: ['/workspace/:path*', '/crm/:path*', '/api/:path*'],
}
