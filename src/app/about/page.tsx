import Link from "next/link";
import { ArrowRight, Compass, Sparkles, Shield, Heart, Scissors, Layers, Users } from "lucide-react";

export default function AboutPage() {
  const pillars = [
    {
      title: "Community & Creative Autonomy",
      description:
        "OFFFORM is a creative community with a marketplace, not a commerce platform with comments attached. Expression and dialogue always lead the experience.",
      icon: Users,
    },
    {
      title: "Inspiration Distinct From Commerce",
      description:
        "A post is not automatically an item for sale. Being tagged does not imply endorsement or mass production. Creative references remain sacred.",
      icon: Sparkles,
    },
    {
      title: "Independent Designer Portfolios",
      description:
        "Showcasing avant-garde, alternative streetwear, and artisanal ateliers with transparent verification and authentic storytelling.",
      icon: Scissors,
    },
    {
      title: "Sustainable & Bespoke Customisation",
      description:
        "Supporting ready-made garments, made-to-order sustainable runs, bespoke customisation options, and direct creative commissions.",
      icon: Layers,
    },
    {
      title: "Privacy & Algorithmic Restraint",
      description:
        "No opaque engagement farming or invasive surveillance. You control your recommendation signals, your history, and your creative data.",
      icon: Shield,
    },
    {
      title: "Cross-Disciplinary Collaboration",
      description:
        "Connecting designers with stylists, 3D artists, pattern makers, and photographers through explicit creative briefs and written agreements.",
      icon: Compass,
    },
  ];

  return (
    <div className="space-y-24 pb-24">
      {/* Editorial Manifesto Hero */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32 hero-gradient-overlay border-b border-[#E7E1DB]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-[#FBECEE] text-[#791D29] border border-[#A92735]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A92735]" />
            The OFFFORM Manifesto
          </div>

          <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.02] text-[#252321]">
            Outside the ordinary. <br />
            <span className="font-editorial-italic text-[#A92735]">Beyond the algorithm.</span>
          </h1>

          <p className="text-base sm:text-xl text-[#77716D] leading-relaxed max-w-2xl mx-auto font-normal">
            OFFFORM was founded as an antidote to homogenised fast fashion and algorithmic feed
            monotony. We exist to empower alternative fashion culture, independent ateliers, and
            creators who craft garments with intentional form.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/discover"
              className="px-6 py-3.5 bg-[#252321] text-white hover:bg-[#A92735] transition-all rounded-full text-xs font-semibold tracking-wider uppercase inline-flex items-center gap-2 shadow-sm"
            >
              Explore the Community <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/policies/community"
              className="px-6 py-3.5 bg-white text-[#252321] border border-[#E7E1DB] hover:border-[#252321] transition-all rounded-full text-xs font-semibold tracking-wider uppercase"
            >
              Read Community Guidelines
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial Visual Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#A92735]">
              01. Cultural Genesis
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#252321] leading-snug">
              An independent fashion publication that evolved into an ecosystem.
            </h2>
            <p className="text-sm text-[#77716D] leading-relaxed">
              Fashion has never been merely about purchasing garments; it is about identity, subversion,
              sculptural silhouette, and human expression. When mainstream platforms reduced fashion to
              hyper-fast micro-trends and dropshipped plastics, independent designers lost their voice.
            </p>
            <p className="text-sm text-[#77716D] leading-relaxed">
              OFFFORM restores the tactile dignity of garment making. Here, an outfit post is an
              editorial statement. A member can discover a silhouette, converse with its maker, study its
              provenance, commission a tailored iteration, or assemble a team for an editorial shoot.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=80"
              alt="Editorial deconstructed garment"
              className="w-full h-80 object-cover rounded-2xl border border-[#E7E1DB]"
            />
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80"
              alt="Artisanal knitwear texture"
              className="w-full h-80 object-cover rounded-2xl border border-[#E7E1DB] mt-8"
            />
          </div>
        </div>
      </section>

      {/* The 6 Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#A92735]">
            02. Core Product Principles
          </span>
          <h2 className="font-editorial text-4xl text-[#252321]">Engineered for integrity</h2>
          <p className="text-sm text-[#77716D]">
            Every architectural and design decision on OFFFORM is governed by our foundational principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-8 bg-white border border-[#E7E1DB] rounded-2xl space-y-4 hover:border-[#D1C8BF] transition-all hover:shadow-editorial"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FBECEE] flex items-center justify-center text-[#A92735]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-editorial text-xl font-semibold text-[#252321]">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#77716D] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Curation & Governance Standards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#252321] text-white p-8 sm:p-12 rounded-3xl border border-[#3E3A36] space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#A92735]">
            <Shield className="w-4 h-4" /> Editorial Curation & Safety
          </div>
          <h3 className="font-editorial text-3xl sm:text-4xl">
            Human discretion over automated black boxes.
          </h3>
          <p className="text-sm text-[#D8D1C9] leading-relaxed">
            All seller applications undergo verified human review. We inspect studio capabilities,
            fabric origins, and portfolio legitimacy to prevent counterfeit listings and exploitative
            practices. We do not promise infallible automation; instead, we provide transparent audit
            trails, human-moderated dispute resolution, and clear community accountability.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium">
            <Link
              href="/policies/seller"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              Seller Standards →
            </Link>
            <Link
              href="/policies/ip"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              Anti-Plagiarism Standards →
            </Link>
            <Link
              href="/seller/apply"
              className="px-4 py-2 bg-[#A92735] hover:bg-[#791D29] rounded-full text-white transition-colors"
            >
              Apply as Designer →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

