import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#252321] text-[#E7E1DB] border-t border-[#3E3A36] pt-16 pb-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-[#3E3A36]">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-editorial text-3xl font-bold tracking-tight text-white leading-none">
                OFFFORM<span className="text-[#A92735]">.</span>
              </span>
              <span className="block text-[10px] tracking-[0.25em] uppercase text-[#A49E99] font-medium mt-1">
                Outside the ordinary
              </span>
            </Link>
            <p className="text-xs text-[#A49E99] leading-relaxed max-w-sm">
              An independent creative fashion community with an integrated marketplace. Celebrating
              subversive design, experimental silhouettes, upcycled tailoring, and authentic
              artistic collaborations.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center text-[11px] text-[#D8D1C9] border border-[#44403C] px-3 py-1 rounded-full bg-[#2E2B28]">
                Curated in Tokyo · Antwerp · Berlin · Portland
              </span>
            </div>
          </div>

          {/* Navigation: Exploration */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A49E99]">
              <li>
                <Link href="/discover" className="hover:text-white transition-colors">
                  Community Feed & Looks
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="hover:text-white transition-colors">
                  Independent Marketplace
                </Link>
              </li>
              <li>
                <Link href="/designers" className="hover:text-white transition-colors">
                  Searchable Designers
                </Link>
              </li>
              <li>
                <Link href="/collaborate" className="hover:text-white transition-colors">
                  Collaboration Briefs
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  Events & Challenges
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation: Creators */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Creators & Sellers
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A49E99]">
              <li>
                <Link href="/seller/apply" className="hover:text-white transition-colors">
                  Apply for Seller Verification
                </Link>
              </li>
              <li>
                <Link href="/seller" className="hover:text-white transition-colors">
                  Seller Studio Workspace
                </Link>
              </li>
              <li>
                <Link href="/collaborate" className="hover:text-white transition-colors">
                  Post a Project Brief
                </Link>
              </li>
              <li>
                <Link href="/policies/seller" className="hover:text-white transition-colors">
                  Production & Lead Time Standards
                </Link>
              </li>
              <li>
                <Link href="/policies/collab" className="hover:text-white transition-colors">
                  Collaboration Agreement Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation: Governance & Legal */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Governance & Policies
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A49E99]">
              <li>
                <Link href="/policies/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-white transition-colors">
                  Privacy & Data Protection
                </Link>
              </li>
              <li>
                <Link href="/policies/community" className="hover:text-white transition-colors">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="/policies/refund" className="hover:text-white transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/ip" className="hover:text-white transition-colors">
                  IP & Anti-Plagiarism Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/moderation" className="hover:text-white transition-colors">
                  Moderation & Appeals Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#77716D] gap-4">
          <p>© {new Date().getFullYear()} OFFFORM Platform Inc. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Inspiration remains distinct from commerce. Creator copyrights protected.
          </p>
        </div>
      </div>
    </footer>
  );
}
