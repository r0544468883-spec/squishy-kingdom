'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PRIZES = [
  { label: 'משלוח חינם', color: '#E0115F', code: 'FREESHIP' },
  { label: '10% הנחה', color: '#FFD700', code: 'SPIN10' },
  { label: 'נסו שוב', color: '#581C87', code: '' },
  { label: '5% הנחה', color: '#059669', code: 'SPIN5' },
  { label: 'מתנה!', color: '#FF6B9D', code: 'GIFT' },
  { label: '15% הנחה', color: '#C70039', code: 'SPIN15' },
  { label: 'נסו שוב', color: '#DAA520', code: '' },
  { label: 'משלוח חינם', color: '#900C3F', code: 'FREESHIP2' },
]

const STORAGE_KEY = 'squishy-wheel-played'

export default function SpinWheelPopup() {
  const [show, setShow] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<typeof PRIZES[0] | null>(null)

  useEffect(() => {
    const played = sessionStorage.getItem(STORAGE_KEY)
    if (played) return

    const timer = setTimeout(() => {
      setShow(true)
    }, 30000) // Show after 30 seconds

    return () => clearTimeout(timer)
  }, [])

  const spin = () => {
    if (spinning) return
    setSpinning(true)
    setResult(null)

    const prizeIndex = Math.floor(Math.random() * PRIZES.length)
    const segmentAngle = 360 / PRIZES.length
    const targetAngle = 360 * 5 + (360 - prizeIndex * segmentAngle - segmentAngle / 2)

    setRotation(targetAngle)

    setTimeout(() => {
      setSpinning(false)
      setResult(PRIZES[prizeIndex])
      sessionStorage.setItem(STORAGE_KEY, 'true')
    }, 4000)
  }

  const close = () => {
    setShow(false)
    sessionStorage.setItem(STORAGE_KEY, 'true')
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-background rounded-2xl p-6 max-w-sm w-full text-center relative"
          >
            <button onClick={close} className="absolute top-3 left-3 text-muted-foreground hover:text-foreground cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <Gift className="w-10 h-10 text-kingdom-red mx-auto mb-3" />
            <h2 className="font-heading text-xl mb-1">גלגל ההפתעות!</h2>
            <p className="text-sm text-muted-foreground mb-5">סובבו את הגלגל וזכו בפרס</p>

            {/* Wheel */}
            <div className="relative w-64 h-64 mx-auto mb-5">
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-kingdom-red" />

              {/* Wheel */}
              <motion.div
                className="w-full h-full rounded-full overflow-hidden border-4 border-kingdom-gold shadow-xl"
                animate={{ rotate: rotation }}
                transition={{ duration: 4, ease: [0.17, 0.67, 0.12, 0.99] }}
                style={{ transformOrigin: 'center center' }}
              >
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {PRIZES.map((prize, i) => {
                    const angle = (360 / PRIZES.length) * i
                    const rad = (angle * Math.PI) / 180
                    const endRad = ((angle + 360 / PRIZES.length) * Math.PI) / 180
                    const x1 = 100 + 100 * Math.cos(rad)
                    const y1 = 100 + 100 * Math.sin(rad)
                    const x2 = 100 + 100 * Math.cos(endRad)
                    const y2 = 100 + 100 * Math.sin(endRad)
                    const textAngle = angle + 360 / PRIZES.length / 2
                    const textRad = (textAngle * Math.PI) / 180
                    const tx = 100 + 60 * Math.cos(textRad)
                    const ty = 100 + 60 * Math.sin(textRad)

                    return (
                      <g key={i}>
                        <path
                          d={`M100,100 L${x1},${y1} A100,100 0 0,1 ${x2},${y2} Z`}
                          fill={prize.color}
                        />
                        <text
                          x={tx}
                          y={ty}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize="8"
                          fontWeight="bold"
                          transform={`rotate(${textAngle}, ${tx}, ${ty})`}
                        >
                          {prize.label}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </motion.div>
            </div>

            {/* Result or Spin button */}
            {result ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="space-y-3">
                {result.code ? (
                  <>
                    <p className="text-lg font-heading text-kingdom-red">זכיתם! {result.label}</p>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">קוד קופון:</p>
                      <p className="text-lg font-mono font-bold text-foreground">{result.code}</p>
                    </div>
                    <Button onClick={close} className="w-full bg-kingdom-red hover:bg-kingdom-red-hover text-white">
                      המשיכו לקנות
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-lg text-muted-foreground">לא הפעם... נסו שוב בפעם הבאה!</p>
                    <Button onClick={close} variant="outline" className="w-full">סגירה</Button>
                  </>
                )}
              </motion.div>
            ) : (
              <Button
                onClick={spin}
                disabled={spinning}
                className="w-full h-12 bg-kingdom-red hover:bg-kingdom-red-hover text-white text-base"
              >
                {spinning ? 'מסתובב...' : 'סובבו את הגלגל!'}
              </Button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
