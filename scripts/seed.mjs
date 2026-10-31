import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding OFFFORM database with authentic fashion community data...');

  // Clean existing records if any
  try {
    await prisma.review.deleteMany();
    await prisma.orderStatusHistory.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.customizationOption.deleteMany();
    await prisma.product.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.postLike.deleteMany();
    await prisma.post.deleteMany();
    await prisma.follow.deleteMany();
    await prisma.save.deleteMany();
    await prisma.sellerApplication.deleteMany();
    await prisma.moderationReport.deleteMany();
    await prisma.collaborationProposal.deleteMany();
    await prisma.collaborationBrief.deleteMany();
    await prisma.commissionRequest.deleteMany();
    await prisma.message.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.challengeSubmission.deleteMany();
    await prisma.challenge.deleteMany();
    await prisma.event.deleteMany();
    await prisma.policyAcceptance.deleteMany();
    await prisma.policyVersion.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.user.deleteMany();
  } catch (e) {
    console.log('Clean table step note:', e.message);
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(randomBytes(32).toString('hex'), salt);

  // 1. Users
  const admin = await prisma.user.create({
    data: {
      email: 'curator@offform.art',
      passwordHash,
      username: 'offform_curator',
      displayName: 'OFFFORM Editorial & Moderation',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
      role: 'ADMIN',
      age: 29,
      bio: 'Head of editorial curation and platform integrity at OFFFORM. Championing independent fashion culture beyond the algorithm.',
      location: 'Berlin / London',
      aestheticTags: 'Editorial, Archive, Modernism',
      isVerifiedDesigner: true,
      isApprovedSeller: false,
    },
  });

  const designerKairos = await prisma.user.create({
    data: {
      email: 'kairos@offform.art',
      passwordHash,
      username: 'kairos_atelier',
      displayName: 'KAIROS Studio',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
      role: 'SELLER',
      age: 27,
      bio: 'Modular urban garments, utilitarian hardware, and architectural silhouettes engineered for modern nomads.',
      location: 'Tokyo, Japan',
      aestheticTags: 'Cyberpunk, Modular, Technical, Streetwear',
      isVerifiedDesigner: true,
      isApprovedSeller: true,
    },
  });

  const designerNullform = await prisma.user.create({
    data: {
      email: 'nullform@offform.art',
      passwordHash,
      username: 'nullform',
      displayName: 'Nullform Archive',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
      role: 'SELLER',
      age: 24,
      bio: 'Deconstructed knitwear, distressed organic yarns, and raw-edge garments. Every stitch embraces intentional imperfection.',
      location: 'Antwerp, Belgium',
      aestheticTags: 'Avant-Garde, Deconstructed, Upcycled, Grunge',
      isVerifiedDesigner: true,
      isApprovedSeller: true,
    },
  });

  const designerSable = await prisma.user.create({
    data: {
      email: 'sable@offform.art',
      passwordHash,
      username: 'sable_rust',
      displayName: 'Sable & Rust',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&q=80',
      role: 'SELLER',
      age: 32,
      bio: 'Artisanal outerwear constructed from botanical-dyed organic canvas, deadstock corduroy, and hammered copper fixtures.',
      location: 'Portland, USA',
      aestheticTags: 'Artisanal, Waxed, Upcycled, Workwear',
      isVerifiedDesigner: true,
      isApprovedSeller: true,
    },
  });

  const memberElena = await prisma.user.create({
    data: {
      email: 'elena@offform.art',
      passwordHash,
      username: 'elenavance',
      displayName: 'Elena Vance',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80',
      role: 'MEMBER',
      age: 22,
      bio: 'Alternative fashion researcher & digital archivist. Styling dystopian minimalism and raw textile art.',
      location: 'New York, USA',
      aestheticTags: 'Minimalism, Dystopian, Streetwear',
      isVerifiedDesigner: false,
      isApprovedSeller: false,
    },
  });

  const applicantKumo = await prisma.user.create({
    data: {
      email: 'kumo@offform.art',
      passwordHash,
      username: 'atelier_kumo',
      displayName: 'Atelier Kumo',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=500&q=80',
      role: 'MEMBER',
      age: 26,
      bio: 'Zero-waste sculptural drapery and pleated organic poplin. Seeking seller verification for upcoming Spring drop.',
      location: 'Kyoto, Japan',
      aestheticTags: 'Minimalism, Zero-Waste, Sculptural',
      isVerifiedDesigner: false,
      isApprovedSeller: false,
    },
  });

  console.log('Users created.');

  // 2. Products
  const prodKairosVest = await prisma.product.create({
    data: {
      sellerId: designerKairos.id,
      title: 'V-04 Modular Tactical Harness Vest',
      description: 'Engineered from water-repellent Cordura 500D with magnetic Fidlock buckles, detachable pouch modules, and dual rear webbing channels. Designed to layer seamlessly over oversized parkas or bare shoulders.',
      category: 'Outerwear',
      productType: 'READY_MADE',
      price: 245.0,
      currency: 'USD',
      stock: 8,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80',
      ]),
      materials: '500D Cordura Nylon, Aircraft Aluminum Hardware, Fidlock V-Buckles',
      measurements: 'One size adjustable: Chest 88cm - 124cm, Length 48cm',
      productionOrigin: 'Tokyo, Japan',
      leadTimeDays: 2,
      status: 'ACTIVE',
    },
  });

  const prodNullformKnit = await prisma.product.create({
    data: {
      sellerId: designerNullform.id,
      title: 'Distressed Zero-Gauge Mohair Sweater',
      description: 'Hand-knitted using Italian deadstock brushed mohair and recycled cotton slub. Features hand-worked laddering, asymmetrical drop hem, and elongated sleeves with thumb loops.',
      category: 'Tops',
      productType: 'CUSTOMISABLE',
      price: 310.0,
      currency: 'USD',
      stock: 5,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
      ]),
      materials: '70% Kid Mohair, 30% Deadstock Organic Cotton',
      measurements: 'Oversized boxy fit. S: Chest 116cm | M: Chest 124cm | L: Chest 132cm',
      productionOrigin: 'Antwerp, Belgium',
      leadTimeDays: 7,
      status: 'ACTIVE',
      customizationOptions: {
        create: [
          {
            name: 'Distressing Level',
            type: 'SELECT',
            values: JSON.stringify([
              { label: 'Moderate Editorial Laddering', extra: 0 },
              { label: 'Heavy Asymmetrical Shredding', extra: 25 },
              { label: 'Raw Unfinished Distressed Hem Only', extra: 0 },
            ]),
            extraPrice: 0,
          },
          {
            name: 'Colorway Wash',
            type: 'SELECT',
            values: JSON.stringify([
              { label: 'Ashen Charcoal / Bone', extra: 0 },
              { label: 'Oxidized Crimson & Rust (+ Hand Overdye)', extra: 40 },
              { label: 'Raw Unbleached Ecru', extra: 0 },
            ]),
            extraPrice: 0,
          },
        ],
      },
    },
  });

  const prodSableParka = await prisma.product.create({
    data: {
      sellerId: designerSable.id,
      title: 'Botanical Indigo Waxed Field Parka',
      description: 'Crafted to order from heavy organic duck canvas, hand-steeped in natural fermented indigo and hot-waxed with local beeswax. Complete with hand-forged copper button closures.',
      category: 'Outerwear',
      productType: 'MADE_TO_ORDER',
      price: 490.0,
      currency: 'USD',
      stock: 12,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=900&q=80',
      ]),
      materials: '100% Organic Duck Canvas, Natural Indigo, Beeswax, Solid Copper',
      measurements: 'Tailored to buyer chest and arm specs upon checkout.',
      productionOrigin: 'Portland, Oregon',
      leadTimeDays: 14,
      status: 'ACTIVE',
    },
  });

  const prodBespokeCommission = await prisma.product.create({
    data: {
      sellerId: designerNullform.id,
      title: 'Bespoke Deconstructed Runway Ensemble (Commission Slot)',
      description: 'Direct commission slot for a one-of-a-kind full silhouette designed in collaboration with Nullform Archive. Includes concept sketches, fabric swatches, 3 fitting checkpoints, and final garment construction.',
      category: 'Outerwear',
      productType: 'COMMISSION',
      price: 1200.0,
      currency: 'USD',
      stock: 2,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
      ]),
      materials: 'Custom selected with client (Deadstock wool, raw silks, repurposed military gear)',
      productionOrigin: 'Antwerp, Belgium',
      leadTimeDays: 30,
      status: 'ACTIVE',
    },
  });

  console.log('Products created.');

  // 3. Community Posts
  const post1 = await prisma.post.create({
    data: {
      authorId: designerKairos.id,
      caption: 'Field testing the V-04 harness in Shibuya rain. Balancing strict geometric utility with fluid layering. How do you integrate tactical gear into everyday tailored silhouettes?',
      postType: 'OUTFIT',
      mediaUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1000&q=80',
      ]),
      tags: '#tactical, #streetwear, #cyberpunk, #modularfashion',
      linkedProductId: prodKairosVest.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      authorId: designerNullform.id,
      caption: 'Work in progress: experimenting with boiling deadstock mohair before shredding the gauge. The texture behaves unpredictably, creating organic rips that cannot be replicated by factory machines.',
      postType: 'CONCEPT',
      mediaUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
      ]),
      tags: '#avantgarde, #deconstruction, #handknit, #textileart',
      linkedProductId: prodNullformKnit.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      authorId: memberElena.id,
      caption: 'Archive study: 1990s Belgian minimalism meets dystopian industrial hardware. Styling the Nullform raw knit with vintage pleated trousers.',
      postType: 'INSPIRATION',
      mediaUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80',
      ]),
      tags: '#archivefashion, #belgianfashion, #subtleminimalism',
    },
  });

  // Likes & Comments
  await prisma.postLike.create({
    data: {
      postId: post1.id,
      userId: memberElena.id,
    },
  });
  await prisma.postLike.create({
    data: {
      postId: post1.id,
      userId: designerNullform.id,
    },
  });

  await prisma.comment.create({
    data: {
      postId: post1.id,
      authorId: memberElena.id,
      content: 'The buckle placement across the chest solves the slouch issue on heavy overcoats. Masterclass in hardware integration.',
    },
  });

  await prisma.comment.create({
    data: {
      postId: post2.id,
      authorId: designerSable.id,
      content: 'That brushed mohair reaction is stunning. Have you tried combining it with raw tannin overdye?',
    },
  });

  // 4. Follows & Saves
  await prisma.follow.create({
    data: {
      followerId: memberElena.id,
      followingId: designerKairos.id,
    },
  });
  await prisma.follow.create({
    data: {
      followerId: memberElena.id,
      followingId: designerNullform.id,
    },
  });
  await prisma.save.create({
    data: {
      userId: memberElena.id,
      targetType: 'PRODUCT',
      targetId: prodKairosVest.id,
    },
  });

  // 5. Pre-seeded Seller Application (for Admin Review)
  await prisma.sellerApplication.create({
    data: {
      applicantId: applicantKumo.id,
      businessName: 'Atelier Kumo Studio',
      bio: 'Zero-waste garment studio focusing on sculptural pleated tunics and artisanal linen drapes.',
      portfolioUrl: 'https://atelier-kumo.example.com',
      productionCapabilities: 'In-house small batch studio in Kyoto. Current throughput: 25 garments per month. Organic GOTS-certified fabrics sourced locally.',
      idDocumentUrl: 'PRIVATE_DOC_STORE/kyc/kumo_passport_id_verification_ref.pdf',
      addressDocumentUrl: 'PRIVATE_DOC_STORE/kyc/kumo_utility_bill_kyoto_ref.pdf',
      status: 'PENDING',
    },
  });

  // 6. Pre-seeded Moderation Report (for Admin Review)
  await prisma.moderationReport.create({
    data: {
      reporterId: memberElena.id,
      targetType: 'POST',
      targetId: post1.id,
      category: 'MISLEADING',
      reason: 'Testing report flow: verifying moderation triage and evidence logging interface.',
      status: 'PENDING',
    },
  });

  // 7. Collaboration Brief
  const brief1 = await prisma.collaborationBrief.create({
    data: {
      ownerId: designerKairos.id,
      title: 'Editorial Lookbook Stylist & 3D Garment Visualizer for SS27',
      description: 'Looking for a creative stylist and 3D fashion artist to collaborate on our upcoming virtual and print lookbook for the Shibuya Underground drop. Must have a strong portfolio in cyberpunk/tactical aesthetic.',
      skillsRequired: 'Stylist, 3D Artist, Creative Director',
      budgetRange: '$1,500 - $3,000 USD',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      visibility: 'PUBLIC',
      status: 'OPEN',
    },
  });

  await prisma.collaborationProposal.create({
    data: {
      briefId: brief1.id,
      designerId: designerNullform.id,
      message: 'Excited by this concept. Our studio can handle physical styling and texture translation for the tactile garments.',
      quoteAmount: 1800,
      estimatedDays: 14,
      status: 'PENDING',
    },
  });

  // 8. Fashion Challenge & Events
  const challenge1 = await prisma.challenge.create({
    data: {
      title: 'The Deconstructed Silhouette Challenge',
      prompt: 'Reconstruct a garment using only upcycled scraps, negative space, and exposed seams. Showcase how absence of structure can communicate raw presence.',
      bannerUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'ACTIVE',
      judgingCriteria: 'Originality of form (40%), Textile integrity and craft (30%), Community impact (30%).',
    },
  });

  await prisma.challengeSubmission.create({
    data: {
      challengeId: challenge1.id,
      authorId: designerNullform.id,
      postId: post2.id,
      votesCount: 42,
    },
  });

  await prisma.event.create({
    data: {
      title: 'OFFFORM Paris Underground Showroom 2026',
      description: 'An intimate 3-day showcase of 12 emerging international designers presenting capsule collections outside the commercial fashion calendar.',
      category: 'EXHIBITION',
      date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      locationOrUrl: 'Le Marais, Rue de Turenne, Paris / Live Stream for global members',
      isOnline: false,
      organizerId: admin.id,
    },
  });

  // 9. Versioned Platform Policies
  const policies = [
    {
      type: 'TERMS',
      version: '1.0.0',
      title: 'OFFFORM Terms of Service',
      summary: 'Governs platform membership, account responsibilities, intellectual property ownership, and acceptable conduct.',
      content: 'OFFFORM is a creative community and marketplace. Creators retain full ownership of their original work. By posting content, you grant OFFFORM a non-exclusive license to host and display your work within the platform. Minimum age requirement is 16. Commercial selling requires seller verification and adherence to our Seller Terms.',
    },
    {
      type: 'PRIVACY',
      version: '1.0.0',
      title: 'OFFFORM Privacy & Data Protection Policy',
      summary: 'Outlines data collection limits, identity verification document security, recommendation privacy, and account deletion rights.',
      content: 'We adhere to privacy-by-design. We never sell your personal data. Verification documents (passports, utility bills) are encrypted in restricted private storage and accessed exclusively by authorized personnel for KYC compliance. You may request full account deactivation and data deletion at any time.',
    },
    {
      type: 'COMMUNITY',
      version: '1.0.0',
      title: 'Community Guidelines',
      summary: 'Principles of respectful participation, anti-harassment, authentic representation, and creative attribution.',
      content: 'Bullying, hate speech, plagiarism, and fake engagement are strictly prohibited. Respect fellow creators, give proper attribution when sharing inspiration, and engage constructively.',
    },
    {
      type: 'SELLER',
      version: '1.0.0',
      title: 'Seller Terms & Fulfillment Standards',
      summary: 'Sets forth designer eligibility, production timeframes, customisation limits, commission payout terms, and cancellation obligations.',
      content: 'Sellers must undergo human review and identity verification before listing items. Made-to-order and customisable listings must clearly disclose lead times. Sellers are responsible for timely fulfillment and transparent customer communication.',
    },
    {
      type: 'REFUND',
      version: '1.0.0',
      title: 'Marketplace, Refund & Cancellation Policy',
      summary: 'Rules for order cancellations, defects, made-to-order garments, and dispute resolution.',
      content: 'Ready-made products may be returned within 14 days of delivery if unworn with tags attached. Made-to-order and custom items are non-refundable once production has commenced, except in cases of manufacturing defects or material misrepresentation.',
    },
    {
      type: 'IP',
      version: '1.0.0',
      title: 'Intellectual Property & Anti-Plagiarism Policy',
      summary: 'Protections for original designs, reporting mechanisms for infringement, and fair review processes.',
      content: 'OFFFORM champions originality. Stolen designs or counterfeit goods are subject to immediate suspension upon evidence review. Similarity alone does not constitute infringement; our moderation team reviews authentic design history before taking disciplinary action.',
    },
    {
      type: 'COLLAB',
      version: '1.0.0',
      title: 'Collaboration & Commission Agreement Standards',
      summary: 'Framework for creative briefs, revenue sharing, milestone approvals, and scope management.',
      content: 'Collaborations initiated through OFFFORM should establish explicit written terms regarding ownership of resulting designs, licensing rights, and commercial exploitation. The platform records mutual agreement acceptance for accountability.',
    },
    {
      type: 'MODERATION',
      version: '1.0.0',
      title: 'Moderation, Enforcement & Appeals Policy',
      summary: 'Detailed explanation of reporting queues, human review procedures, proportionate sanctions, and appeal avenues.',
      content: 'We employ a hybrid moderation system combining automated safety signals with human discretion. Sanctions range from guidance notes and temporary listing pauses to account suspension. All decisions may be appealed through the Moderation Console.',
    },
  ];

  for (const pol of policies) {
    await prisma.policyVersion.create({
      data: pol,
    });
  }

  console.log('OFFFORM seed successfully completed with rich authentic dataset!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
