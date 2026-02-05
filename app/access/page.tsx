'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase-auth'
import './access.css'

export default function AccessPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/api/auth/callback`,
            },
        })

        if (error) {
            setMessage(`Error: ${error.message}`)
        } else {
            setMessage('Check your email for the magic link!')
        }
        setLoading(false)
    }

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/api/auth/callback`,
            },
        })
    }

    return (
        <div className="access-container">
            <div className="access-card">
                <div className="logo-section">
                    <h1 className="logo-text">CxTrack <span>Core</span></h1>
                    <p className="logo-sub">Unified Access Portal</p>
                </div>

                <div className="auth-content">
                    <form onSubmit={handleLogin} className="auth-form">
                        <div className="input-group">
                            <label htmlFor="email">Work Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Processing...' : 'Access Workspace'}
                        </button>
                    </form>

                    <div className="divider">
                        <span>or continue with</span>
                    </div>

                    <button onClick={handleGoogleLogin} className="btn-secondary">
                        <img src="https://www.google.com/favicon.ico" alt="Google" />
                        Google OAuth
                    </button>

                    {message && <p className={`message ${message.startsWith('Error') ? 'error' : 'success'}`}>{message}</p>}
                </div>

                <div className="footer-links">
                    <a href="#">Privacy Policy</a>
                    <span className="dot"></span>
                    <a href="#">Terms of Service</a>
                </div>
            </div>
        </div>
    )
}
