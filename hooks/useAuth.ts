'use client'
import { useState, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import bs58 from 'bs58'
import { getNonce, login } from '@/lib/api'

export type AuthState = {
  userId: string | null
  walletAddress: string | null
  username: string | null
  token: string | null
}

export function useAuth() {
  const { publicKey, signMessage, connected } = useWallet()
  const [auth, setAuth] = useState<AuthState>(() => {
    if (typeof window === 'undefined') return { userId: null, walletAddress: null, username: null, token: null }
    const token = localStorage.getItem('liqour_token')
    const userId = localStorage.getItem('liqour_user_id')
    const walletAddress = localStorage.getItem('liqour_wallet')
    const username = localStorage.getItem('liqour_username')
    return { token, userId, walletAddress, username }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const authenticate = useCallback(async () => {
    if (!publicKey || !signMessage) return
    setLoading(true)
    setError(null)
    try {
      const wallet = publicKey.toBase58()
      const { nonce, message } = await getNonce(wallet)
      const msgBytes = new TextEncoder().encode(message)
      const sigBytes = await signMessage(msgBytes)
      const signature = bs58.encode(sigBytes)
      const data = await login({ wallet_address: wallet, signature, nonce })

      localStorage.setItem('liqour_token', data.token)
      localStorage.setItem('liqour_user_id', data.user_id)
      localStorage.setItem('liqour_wallet', data.wallet_address)
      localStorage.setItem('liqour_username', data.username || '')

      setAuth({ token: data.token, userId: data.user_id, walletAddress: data.wallet_address, username: data.username })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [publicKey, signMessage])

  const logout = useCallback(() => {
    localStorage.removeItem('liqour_token')
    localStorage.removeItem('liqour_user_id')
    localStorage.removeItem('liqour_wallet')
    localStorage.removeItem('liqour_username')
    setAuth({ token: null, userId: null, walletAddress: null, username: null })
  }, [])

  return { auth, loading, error, authenticate, logout, connected, isAuthenticated: !!auth.token }
}
