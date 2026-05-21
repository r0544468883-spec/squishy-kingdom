'use client'

import { useEffect, useRef } from 'react'

export default function MagicParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const particles: Array<{
      x: number; y: number; size: number; speedX: number; speedY: number
      opacity: number; color: string; life: number; maxLife: number
    }> = []

    const colors = ['#FFD700', '#FFE44D', '#FF6B9D', '#FF1D6C', '#DAA520']

    function resize() {
      canvas!.width = canvas!.offsetWidth
      canvas!.height = canvas!.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function createParticle() {
      const maxLife = 100 + Math.random() * 150
      particles.push({
        x: Math.random() * canvas!.width,
        y: canvas!.height + 10,
        size: 2 + Math.random() * 4,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: -(1 + Math.random() * 2),
        opacity: 0.6 + Math.random() * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife,
      })
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      if (Math.random() < 0.3) createParticle()

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.speedX
        p.y += p.speedY
        p.life++

        const progress = p.life / p.maxLife
        const currentOpacity = p.opacity * (1 - progress)

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size * (1 - progress * 0.5), 0, Math.PI * 2)
        ctx!.fillStyle = p.color
        ctx!.globalAlpha = currentOpacity
        ctx!.fill()

        // Glow
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
        ctx!.fillStyle = p.color
        ctx!.globalAlpha = currentOpacity * 0.2
        ctx!.fill()

        if (p.life >= p.maxLife) particles.splice(i, 1)
      }

      ctx!.globalAlpha = 1
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  )
}
