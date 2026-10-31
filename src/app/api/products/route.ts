import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const productCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(2, "Category is required"),
  productType: z.enum(["READY_MADE", "MADE_TO_ORDER", "CUSTOMISABLE", "COMMISSION"]),
  price: z.number().positive("Price must be a positive number"),
  currency: z.string().default("USD"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  images: z.array(z.string().url()).min(1, "At least one image URL is required"),
  materials: z.string().optional(),
  measurements: z.string().optional(),
  leadTimeDays: z.number().int().min(1).default(3),
  customizationOptions: z
    .array(
      z.object({
        name: z.string().min(1),
        type: z.string().default("SELECT"),
        values: z.string(), // JSON string array of { label, extra }
        extraPrice: z.number().default(0),
      })
    )
    .optional(),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "SELLER" && user.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Unauthorized. Approved seller status required to publish marketplace products." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = productCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid product data" },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      category,
      productType,
      price,
      currency,
      stock,
      images,
      materials,
      measurements,
      leadTimeDays,
      customizationOptions,
    } = parsed.data;

    const product = await prisma.product.create({
      data: {
        sellerId: user.id,
        title,
        description,
        category,
        productType,
        price,
        currency,
        stock,
        images: JSON.stringify(images),
        materials: materials || "Artisanal textiles, natural organic fibers",
        measurements: measurements || "Standard sizing or custom tailored upon request",
        leadTimeDays,
        status: "ACTIVE",
        customizationOptions: customizationOptions && customizationOptions.length > 0
          ? {
              create: customizationOptions.map((opt) => ({
                name: opt.name,
                type: opt.type,
                values: opt.values,
                extraPrice: opt.extraPrice,
              })),
            }
          : undefined,
      },
      include: {
        customizationOptions: true,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (err: any) {
    console.error("Create product error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

