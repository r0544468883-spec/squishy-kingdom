import Link from 'next/link'
import { Crown, MessageCircle } from 'lucide-react'
import ContentContainer from '@/modules/common/components/content-container'
import { Separator } from '@/components/ui/separator'

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/80 mb-16 md:mb-0">
      <ContentContainer>
        <div className="py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-kingdom-gold" />
                <span className="font-bubble text-lg text-kingdom-gold">הממלכה של עדי</span>
              </div>
              <p className="text-background/50 text-sm leading-relaxed max-w-xs">
                חנות הטרנדים הסודית של עדי — סקווישים, פידג'טס, נידו ועוד.
                ישר מהארמון אליכם הביתה!
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-heading text-sm font-semibold text-background mb-4 uppercase tracking-wider">ניווט</h3>
              <div className="flex flex-col gap-3">
                <Link href="/" className="text-background/50 hover:text-background transition-colors text-sm">ראשי</Link>
                <Link href="/products" className="text-background/50 hover:text-background transition-colors text-sm">החנות</Link>
                <Link href="/games" className="text-background/50 hover:text-background transition-colors text-sm">משחקים</Link>
                <Link href="/privacy" className="text-background/50 hover:text-background transition-colors text-sm">מדיניות פרטיות</Link>
                <Link href="/terms" className="text-background/50 hover:text-background transition-colors text-sm">תנאי שימוש</Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-heading text-sm font-semibold text-background mb-4 uppercase tracking-wider">צרו קשר</h3>
              <div className="flex flex-col gap-3">
                <a
                  href="https://wa.me/972XXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-background/50 hover:text-green-400 transition-colors text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  וואטסאפ
                </a>
                <div className="flex gap-4 mt-2">
                  <a href="#" className="text-background/50 hover:text-background transition-colors text-sm">TikTok</a>
                  <a href="#" className="text-background/50 hover:text-background transition-colors text-sm">Instagram</a>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-background/10" />

          <div className="text-center text-background/30 text-xs">
            © {new Date().getFullYear()} SquishyAdi — הממלכה של עדי. כל הזכויות שמורות.
          </div>
        </div>
      </ContentContainer>
    </footer>
  )
}
