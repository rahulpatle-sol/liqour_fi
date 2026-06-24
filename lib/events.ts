export function emit(event: string, detail?: unknown) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(event, { detail }))
}

export function listen(event: string, handler: (detail: any) => void) {
  const wrapper = (e: Event) => handler((e as CustomEvent).detail)
  window.addEventListener(event, wrapper)
  return () => window.removeEventListener(event, wrapper)
}
