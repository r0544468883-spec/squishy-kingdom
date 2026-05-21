import Link from 'next/link'
import { Crown, MessageCircle } from 'lucide-react'

export default function KingdomFooter() {
  return (
    <footer className="bg-kingdom-charcoal text-white/80 border-t-2 border-kingdom-gold mb-16 md:mb-0">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-6 h-6 text-kingdom-gold" />
              <span className="font-heading text-xl text-kingdom-gold">הממלכה של עדי</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              חנות הטרנדים הסודית של עדי — סקווישים, פידג'טס, נידו ועוד.
              ישר מהארמון אליכם הביתה!
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-heading text-kingdom-gold mb-4">ניווט מהיר</h3>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-white/60 hover:text-kingdom-gold transition-colors text-sm">ראשי</Link>
              <Link href="/products" className="text-white/60 hover:text-kingdom-gold transition-colors text-sm">החנות</Link>
              <Link href="/privacy" className="text-white/60 hover:text-kingdom-gold transition-colors text-sm">מדיניות פרטיות</Link>
              <Link href="/terms" className="text-white/60 hover:text-kingdom-gold transition-colors text-sm">תנאי שימוש</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-kingdom-gold mb-4">צרו קשר</h3>
            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/972XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/60 hover:text-green-400 transition-colors text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                וואטסאפ
              </a>
              <div className="flex gap-3 mt-2">
                <a href="#" className="text-white/60 hover:text-kingdom-gold transition-colors text-sm">TikTok</a>
                <a href="#" className="text-white/60 hover:text-kingdom-gold transition-colors text-sm">Instagram</a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-white/40 text-xs">
          © {new Date().getFullYear()} SquishyAdi — הממלכה של עדי. כל הזכויות שמורות.
        </div>
      </div>
    </footer>
  )
}
