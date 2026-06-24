'use client'
import { useEffect, useRef, useCallback } from 'react'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000/ws'

type Handler = (data: any) => void

let globalWs: WebSocket | null = null
let globalHandlers: Map<string, Set<Handler>> = new Map()
let globalSubs: Set<string> = new Set()
let reconnectTimer: NodeJS.Timeout | null = null
let isConnecting = false
let currentUserId: string | null = null

function connectGlobal(userId?: string | null) {
  if (userId) currentUserId = userId
  if (isConnecting) return
  if (globalWs?.readyState === WebSocket.OPEN) {
    if (currentUserId) globalWs.send(JSON.stringify({ type: 'AUTH', userId: currentUserId }))
    return
  }

  isConnecting = true
  globalWs = new WebSocket(WS_URL)

  globalWs.onopen = () => {
    isConnecting = false
    if (currentUserId) globalWs?.send(JSON.stringify({ type: 'AUTH', userId: currentUserId }))
    globalSubs.forEach(channel => {
      globalWs?.send(JSON.stringify({ type: 'SUBSCRIBE', channel }))
    })
  }

  globalWs.onmessage = (e) => {
    try {
      const { type, data } = JSON.parse(e.data)
      // Server sends nested data: { type, data: { type, data: { actual fields } } }
      const payload = data?.data ?? data
      globalHandlers.get(type)?.forEach(h => h(payload))
    } catch {}
  }

  globalWs.onclose = () => {
    isConnecting = false
    reconnectTimer = setTimeout(() => connectGlobal(currentUserId), 3000)
  }

  globalWs.onerror = () => {
    isConnecting = false
    globalWs?.close()
  }
}

export function useWebSocket(userId?: string | null) {
  const userIdRef = useRef(userId)

  useEffect(() => {
    userIdRef.current = userId
    if (userId) currentUserId = userId
    if (userId && globalWs?.readyState === WebSocket.OPEN) {
      globalWs.send(JSON.stringify({ type: 'AUTH', userId }))
    }
  }, [userId])

  useEffect(() => {
    connectGlobal(userIdRef.current)
  }, [])

  const subscribe = useCallback((channel: string) => {
    globalSubs.add(channel)
    if (globalWs?.readyState === WebSocket.OPEN) {
      globalWs.send(JSON.stringify({ type: 'SUBSCRIBE', channel }))
    }
  }, [])

  const on = useCallback((eventType: string, handler: Handler) => {
    if (!globalHandlers.has(eventType)) globalHandlers.set(eventType, new Set())
    globalHandlers.get(eventType)!.add(handler)
    return () => globalHandlers.get(eventType)?.delete(handler)
  }, [])

  return { subscribe, on }
}