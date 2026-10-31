import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { CollaborateClient } from "@/components/CollaborateClient";

export const revalidate = 0;

export default async function CollaboratePage() {
  const user = await getCurrentUser();

  const briefs = await prisma.collaborationBrief.findMany({
    where: { visibility: "PUBLIC" },
    orderBy: { createdAt: "desc" },
    include: {
      owner: {
        select: {
          id: true,
          displayName: true,
          username: true,
          avatar: true,
          isVerifiedDesigner: true,
        },
      },
      proposals: {
        select: { id: true },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A92735]">
          Creative Network
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#252321] mt-1">
          Creative Collaboration Hub
        </h1>
        <p className="text-xs sm:text-sm text-[#77716D] max-w-xl mt-1 leading-relaxed">
          Connect designers with stylists, pattern makers, photographers, and 3D visualizers.
          Formalize clear ownership and attribution agreements before production.
        </p>
      </div>

      <CollaborateClient initialBriefs={briefs as any} currentUserId={user?.id} />
    </div>
  );
}
