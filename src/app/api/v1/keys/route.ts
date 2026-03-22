import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { randomBytes, createHash } from "crypto";

// ─────────────────────────────────────────────
// POST /api/v1/keys
// Generates a new API key for the authenticated user
// ─────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Optional: Parse body for a custom key name
    let name = "Generated Key";
    try {
      const body = await req.json();
      if (body.name && typeof body.name === "string") {
        name = body.name.slice(0, 50); // limit length
      }
    } catch {
      // Ignored if body is empty
    }

    // 2. Generate securely random key
    // 2. Generate securely random key
    // Format: sk-nexus-[48 chars hex]
    const rawBytes = randomBytes(24).toString("hex");
    const rawKey = `sk-nexus-${rawBytes}`;
    
    // Hash and Mask for DB
    const hashedKey = createHash("sha256").update(rawKey).digest("hex");
    const maskedKey = `sk-nexus-...${rawBytes.slice(-4)}`;

    // 3. Save to database
    const newApiKey = await prisma.apiKey.create({
      data: {
        hashedKey,
        maskedKey,
        userId: userId,
        name: name,
        status: "ACTIVE",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "API Key generated successfully.",
        data: {
          id: newApiKey.id,
          key: rawKey,
          maskedKey: newApiKey.maskedKey,
          name: newApiKey.name,
          createdAt: newApiKey.createdAt,
          status: newApiKey.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API Keys] Error generating key:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
