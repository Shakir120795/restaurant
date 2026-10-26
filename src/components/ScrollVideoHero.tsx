import { useEffect, useRef, useState } from 'react'
import { BRAND } from '../config'

/**
 * Scroll-scrub walkthrough hero.
 *
 * The video is pinned (sticky) inside a tall scroll section, and the page
 * scroll position drives the video frame-by-frame: scrolling down walks
 * forward into the restaurant, scrolling up walks back.
 *
 * Why the priming / watchdog exists (learned from a real failure on the
 * preview build): several mobile webviews refuse to paint seeked frames
 * for a video that has never been played, so a pure currentTime scrub
 * shows only the poster image forever. So this component:
 * 1. primes the decoder with one real muted play()/pause() once metadata
 *    is ready, retried on the first touch if the webview refuses it, and
 * 2. watches seeks — if a seek's frame does not land within 400ms three
 *    times in a row, it falls back to Play Mode, where the walkthrough
 *    plays muted and looping while the hero is on screen (paused when
 *    scrolled away or the tab is hidden).
 *
 * Sharpness notes:
 * - The source is re-encoded with a keyframe every 12 frames (0.5s) and
 *   faststart, so a seek lands on a real frame — no blur, no long seek lag.
 * - Seeks run through a requestAnimationFrame loop with lerp smoothing.
 * - Seeks smaller than 0.04s are skipped to keep mobile browsers from
 *   thrashing on tiny scroll deltas. No CSS filter/blur on the video.
 * - Scrub starts at 2s, not 0s: the first ~2s show another restaurant's
 *   exterior signage, so that part is skipped and the hero shows only the
 *   interior walkthrough.
 */
const START_TIME = 2

export default function ScrollVideoHero({ onBook }: { onBook: () => void }) {
  const wrapRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const targetRef = useRef(0)
  const currentRef = useRef(0)
  const modeRef = useRef<'scrub' | 'play'>('scrub')
  const [progress, setProgress] = useState(0)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const wrap = wrapRef.current
    if (!video || !wrap) return
    // Reduced-motion must NOT freeze the hero: the artifact's freeze was
    // traced to exactly this early return (frozen on frame f21, no scrub,
    // no auto-advance). Here the flag only removes lerp smoothing — the
    // frame follows scroll directly instead of easing toward it.

    let raf = 0
    let running = true
    let primed = false
    let stuck = 0
    let pendingSeek: { t: number; at: number } | null = null
    // Auto-advance fallback: in an embedded viewer the parent page may
    // scroll instead of this page's window, so window scroll may never
    // move. If the hero is visible but the scroll target has not changed
    // for 3s, fall back to Play Mode so the walkthrough still moves.
    let lastTarget = -1
    let lastScrollChange = performance.now()
    let lastLoopTime = performance.now()
    let lastTick = performance.now()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const prime = () => {
      if (primed) return
      video.muted = true
      video.defaultMuted = true
      const p = video.play()
      if (p && typeof p.then === 'function') {
        p.then(() => { video.pause(); primed = true }).catch(() => { /* retry on first touch */ })
      } else {
        video.pause()
        primed = true
      }
    }

    const updateTarget = () => {
      const rect = wrap.getBoundingClientRect()
      const total = wrap.offsetHeight - window.innerHeight
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0
      if (p !== lastTarget) { lastTarget = p; lastScrollChange = performance.now() }
      targetRef.current = p
    }

    const loop = () => {
      if (!running) return
      const now = performance.now()
      const dt = Math.min(0.05, (now - lastTick) / 1000)
      lastTick = now
      lastLoopTime = now
      const v = videoRef.current
      const w = wrapRef.current
      if (v && w && v.readyState >= 2 && !Number.isNaN(v.duration) && v.duration > START_TIME) {
        if (modeRef.current === 'play') {
          // A fresh scroll takes scrub control back from Play Mode.
          if (performance.now() - lastScrollChange < 500 && Math.abs(targetRef.current - currentRef.current) > 0.05) {
            modeRef.current = 'scrub'
            currentRef.current = targetRef.current
            v.pause()
          } else {
            const rect = w.getBoundingClientRect()
            const visible = rect.bottom > 0 && rect.top < window.innerHeight && document.visibilityState === 'visible'
            if (visible && v.paused) {
              v.play().catch(() => { /* webview still refusing; retry next frame */ })
            } else if (!visible && !v.paused) {
              v.pause()
            }
            // Manual loop that never replays the 0-2s board segment.
            if (!v.paused && v.currentTime >= v.duration - 0.1) {
              try { v.currentTime = START_TIME } catch { /* ignore */ }
            }
            setProgress(Math.min(1, Math.max(0, (v.currentTime - START_TIME) / (v.duration - START_TIME))))
          }
        } else {
          // No scroll movement while the hero is visible for 3s means
          // this viewer is not delivering window scroll (e.g. embedded
          // in a parent page) — switch to Play Mode so it still moves.
          const rect0 = w.getBoundingClientRect()
          const visible0 = rect0.bottom > 0 && rect0.top < window.innerHeight
          if (!reducedMotion && visible0 && performance.now() - lastScrollChange > 3000 && currentRef.current < 0.99) {
            modeRef.current = 'play'
          }
          // Ease toward the scroll target for smooth frame changes —
          // except under reduced-motion, where the frame follows scroll
          // directly (no easing, but movement is never blocked).
          if (reducedMotion) currentRef.current = targetRef.current
          else currentRef.current += (targetRef.current - currentRef.current) * (1 - Math.exp(-dt * 9))
          const t = START_TIME + currentRef.current * (v.duration - START_TIME)
          if (Math.abs(t - v.currentTime) >= 0.04) {
            try { v.currentTime = t; pendingSeek = { t, at: performance.now() } } catch { /* seek not ready yet */ }
          }
          // Watchdog: a seek whose frame never lands means this webview
          // will not scrub — fall back to Play Mode after 3 stuck seeks.
          if (pendingSeek) {
            if (Math.abs(v.currentTime - pendingSeek.t) <= 0.1) {
              pendingSeek = null
              stuck = 0
            } else if (performance.now() - pendingSeek.at > 400) {
              stuck += 1
              if (stuck >= 3) {
                modeRef.current = 'play'
                pendingSeek = null
              } else {
                try { v.currentTime = pendingSeek.t; pendingSeek.at = performance.now() } catch { /* ignore */ }
              }
            }
          }
          setProgress(currentRef.current)
        }
      }
      raf = requestAnimationFrame(loop)
    }

    const watchdog = window.setInterval(() => {
      if (!running || modeRef.current !== 'scrub') return
      if (performance.now() - lastLoopTime <= 500) return
      const v = videoRef.current
      if (!v || v.readyState < 2 || Number.isNaN(v.duration) || v.duration <= START_TIME) return
      updateTarget()
      currentRef.current = targetRef.current
      const tt = START_TIME + currentRef.current * (v.duration - START_TIME)
      if (Math.abs(tt - v.currentTime) >= 0.04) {
        try { v.currentTime = tt } catch { /* ignore */ }
      }
    }, 300)

    const onScroll = () => updateTarget()
    updateTarget()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    raf = requestAnimationFrame(loop)

    const onMeta = () => {
      try { video.currentTime = START_TIME } catch { /* ignore */ }
      prime()
    }
    const onCanPlay = () => prime()
    const onGesture = () => prime()
    video.addEventListener('loadedmetadata', onMeta)
    video.addEventListener('canplay', onCanPlay)
    window.addEventListener('pointerdown', onGesture, { once: true, passive: true })
    window.addEventListener('touchstart', onGesture, { once: true, passive: true })

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.clearInterval(watchdog)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('canplay', onCanPlay)
      window.removeEventListener('pointerdown', onGesture)
      window.removeEventListener('touchstart', onGesture)
    }
  }, [])

  return (
    <section ref={wrapRef} id="top" className="relative" style={{ height: '300vh' }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-black">
        {failed ? (
          <img src="/hero-walk-poster.jpg" alt="Restaurant interior" className="w-full h-full object-cover" />
        ) : (
          <video
            ref={videoRef}
            src="/hero-walk.mp4"
            poster="/hero-walk-poster.jpg"
            preload="auto"
            muted
            playsInline
            disablePictureInPicture
            onError={() => setFailed(true)}
            className="w-full h-full object-cover"
            style={{ willChange: 'contents' }}
          />
        )}
        {/* Bottom gradient only for text legibility — no blur on the video itself. */}
        <div aria-hidden className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 pointer-events-none">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow" style={{ fontFamily: 'Georgia, serif' }}>{BRAND.name}</h1>
            <p className="text-white/80 text-sm mt-1">Pure Veg • 8 AM – 11 PM</p>
            <div className="mt-4 flex flex-wrap gap-3 pointer-events-auto">
              <a href="#menu" className="bg-saffron text-white px-6 py-3 rounded-full font-semibold shadow-lg min-h-11">Explore Our Menu</a>
              <a href="#menu" className="bg-white text-ink px-6 py-3 rounded-full font-semibold min-h-11">Order Now</a>
              <button onClick={onBook} className="bg-white/90 text-ink px-6 py-3 rounded-full font-semibold min-h-11">Book Table</button>
            </div>
            <p className="text-white/70 text-xs mt-4 transition-opacity" style={{ opacity: Math.max(0, 1 - progress * 4) }}>
              Scroll ↓ Walk inside
            </p>
          </div>
        </div>
        {/* Walk progress — thin, no text. */}
        <div aria-hidden className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/20">
          <div className="h-full bg-saffron" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </section>
  )
}
