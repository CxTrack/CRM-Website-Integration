import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

/**
 * Shared Auth Utilities for CxTrack Core
 */
export const auth = {
  async getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  async signOut() {
    await supabase.auth.signOut()
    window.location.href = '/access'
  },

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, organizations(*)')
      .eq('id', userId)
      .single()
    return { data, error }
  }
}
