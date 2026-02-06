import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        const supabase = createRouteHandlerClient({ cookies })
        const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)

        if (session && !error) {
            // Redirect to CRM with session token
            const crmUrl = process.env.NEXT_PUBLIC_CRM_URL || 'http://localhost:5176'
            const redirectUrl = `${crmUrl}?access_token=${session.access_token}&refresh_token=${session.refresh_token}`
            return NextResponse.redirect(redirectUrl)
        }
    }

    // Fallback to access page if something went wrong
    return NextResponse.redirect(`${requestUrl.origin}/access?error=auth_failed`)
}
