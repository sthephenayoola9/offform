import Link from "next/link";
import { prisma } from "@/lib/db";
import { Flame, Calendar, MapPin, Award, CheckCircle2, ArrowRight } from "lucide-react";

export const revalidate = 0;

export default async function EventsPage() {
  const [challenges, events] = await Promise.all([
    prisma.challenge.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        submissions: {
          include: {
            author: true,
            post: true,
          },
        },
      },
    }),
    prisma.event.findMany({
      orderBy: { date: "asc" },
      include: {
        organizer: true,
      },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A92735]">
          Community Gatherings & Contests
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#252321] mt-1">
          Events & Fashion Challenges
        </h1>
        <p className="text-xs sm:text-sm text-[#77716D] max-w-xl mt-1 leading-relaxed">
          Platform-run design challenges with transparent judging criteria, alongside physical
          underground showrooms and digital runway presentations.
        </p>
      </div>

      {/* Challenges Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#A92735]" />
          <h2 className="font-editorial text-3xl font-bold text-[#252321]">
            Active Creative Challenges
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-white rounded-3xl border border-[#E7E1DB] overflow-hidden shadow-card flex flex-col justify-between"
            >
              {challenge.bannerUrl && (
                <div className="relative aspect-[21/9] bg-[#252321] overflow-hidden">
                  <img
                    src={challenge.bannerUrl}
                    alt={challenge.title}
                    className="w-full h-full object-cover opacity-85"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#A92735] text-white">
                    {challenge.status}
                  </span>
                </div>
              )}

              <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-editorial text-2xl font-bold text-[#252321]">
                    {challenge.title}
                  </h3>
                  <p className="text-xs text-[#77716D] leading-relaxed">{challenge.prompt}</p>

                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E7E1DB] text-xs space-y-1">
                    <span className="font-bold text-[#252321] block">Judging Criteria:</span>
                    <p className="text-[#77716D]">{challenge.judgingCriteria}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F4F1EC] flex items-center justify-between text-xs">
                  <span className="text-[#77716D]">
                    <strong className="text-[#252321]">{challenge.submissions.length}</strong>{" "}
                    Submissions
                  </span>
                  <Link
                    href="/discover"
                    className="px-4 py-2 bg-[#252321] text-white hover:bg-[#A92735] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1"
                  >
                    Submit Entry <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Events Calendar Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#A92735]" />
          <h2 className="font-editorial text-3xl font-bold text-[#252321]">
            Upcoming Independent Showrooms & Gatherings
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-2xl border border-[#E7E1DB] p-6 shadow-card space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FBECEE] text-[#791D29]">
                  {ev.category}
                </span>
                <h3 className="font-editorial text-xl font-bold text-[#252321]">{ev.title}</h3>
                <p className="text-xs text-[#77716D] leading-relaxed">{ev.description}</p>
              </div>

              <div className="space-y-2 pt-3 border-t border-[#F4F1EC] text-xs">
                <div className="flex items-center gap-2 text-[#252321]">
                  <Calendar className="w-3.5 h-3.5 text-[#A92735]" />
                  <span className="font-semibold">
                    {new Date(ev.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#77716D]">
                  <MapPin className="w-3.5 h-3.5 text-[#A92735]" />
                  <span>{ev.locationOrUrl}</span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => alert(`RSVP registered for ${ev.title}. We have sent confirmation to your account.`)}
                    className="w-full py-2 bg-[#F8F5F0] hover:bg-[#252321] hover:text-white text-[#252321] rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors border border-[#E7E1DB]"
                  >
                    RSVP to Attend
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
