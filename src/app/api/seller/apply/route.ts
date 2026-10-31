import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const sellerApplySchema = z.object({
  businessName: z.string().min(2, "Business or atelier name is required"),
  bio: z.string().min(20, "Please provide a detailed bio of at least 20 characters"),
  portfolioUrl: z.string().url("Valid portfolio or lookbook URL is required"),
  productionCapabilities: z
    .string()
    .min(20, "Please detail your studio equipment, throughput, and production workflow"),
  idDocumentRef: z.string().min(5, "Identification document reference is required"),
  addressDocumentRef: z.string().min(5, "Address verification document reference is required"),
  agreeToSellerPolicies: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Seller Terms and Fulfilment Standards" }),
  }),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Age restriction: Minors (16-17) cannot apply to become sellers per Section 6
    if (user.age < 18) {
      return NextResponse.json(
        {
          error:
            "Age Requirement: Commercial seller applications require adulthood (18+). Members aged 16-17 enjoy full community participation but cannot register as commercial sellers.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = sellerApplySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid application data" },
        { status: 400 }
      );
    }

    const {
      businessName,
      bio,
      portfolioUrl,
      productionCapabilities,
      idDocumentRef,
      addressDocumentRef,
    } = parsed.data;

    // Check if user already has an active or pending application
    const existing = await prisma.sellerApplication.findFirst({
      where: {
        applicantId: user.id,
        status: { in: ["PENDING", "APPROVED"] },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error:
            existing.status === "APPROVED"
              ? "You are already an approved seller on OFFFORM."
              : "You already have a pending seller application under review by our curation team.",
        },
        { status: 409 }
      );
    }

    // Create the seller application
    const application = await prisma.sellerApplication.create({
      data: {
        applicantId: user.id,
        businessName,
        bio,
        portfolioUrl,
        productionCapabilities,
        // Sensitive verification references kept in restricted field
        idDocumentUrl: `SECURE_VAULT/kyc/${idDocumentRef}`,
        addressDocumentUrl: `SECURE_VAULT/kyc/${addressDocumentRef}`,
        status: "PENDING",
      },
    });

    // Record policy acceptance for Seller Terms v1.0.0
    await prisma.policyAcceptance.upsert({
      where: {
        userId_policyType_version: {
          userId: user.id,
          policyType: "SELLER",
          version: "1.0.0",
        },
      },
      update: { acceptedAt: new Date() },
      create: {
        userId: user.id,
        policyType: "SELLER",
        version: "1.0.0",
      },
    });

    return NextResponse.json({
      success: true,
      applicationId: application.id,
      status: application.status,
    });
  } catch (err: any) {
    console.error("Seller application error:", err);
    return NextResponse.json({ error: "Failed to submit application. Please try again." }, { status: 500 });
  }
}

