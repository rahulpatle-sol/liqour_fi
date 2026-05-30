'use client'
import { useEffect, useRef, useCallback } from 'react'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000/ws'

type Handler = (data: any) => void

export function useWebSocket(userId?: string | null) {
  const ws = useRef<WebSocket | null>(null)
  const handlers = useRef<Map<string, Set<Handler>>>(new Map())
  const reconnectTimer = useRef<NodeJS.Timeout>()

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return

    ws.current = new WebSocket(WS_URL)

    ws.current.onopen = () => {
      if (userId) ws.current?.send(JSON.stringify({ type: 'AUTH', userId }))
    }

    ws.current.onmessage = (e) => {
      try {
        const { type, data } = JSON.parse(e.data)
        handlers.current.get(type)?.forEach(h => h(data))
      } catch {}
    }

    ws.current.onclose = () => {
      reconnectTimer.current = setTimeout(connect, 3000)
    }
  }, [userId])

  useEffect(() => {
    connect()
    return () => {
      clearTimeout(reconnectTimer.current)
      ws.current?.close()
    }
  }, [connect])

  const subscribe = useCallback((channel: string) => {
    ws.current?.send(JSON.stringify({ type: 'SUBSCRIBE', channel }))
  }, [])

  const on = useCallback((eventType: string, handler: Handler) => {
    if (!handlers.current.has(eventType)) handlers.current.set(eventType, new Set())
    handlers.current.get(eventType)!.add(handler)
    return () => handlers.current.get(eventType)?.delete(handler)
  }, [])

  return { subscribe, on }
}
