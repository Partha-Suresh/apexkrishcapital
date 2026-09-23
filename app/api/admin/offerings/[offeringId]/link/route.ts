import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import DealLink from "@/models/deal-link.model";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ offeringId: string }> }
) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (sessionClaims?.metadata?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { offeringId } = await params;
  if (!offeringId) {
    return NextResponse.json({ error: "Offering ID is required" }, { status: 400 });
  }

  try {
    await dbConnect();
    const dealLink = await DealLink.findOne({ offeringId }).lean();

    return NextResponse.json({
      offeringId,
      thirdPartyUrl: dealLink?.thirdPartyUrl || "",
      instructions: dealLink?.instructions || "",
      updatedAt: dealLink?.updatedAt?.toISOString() || null,
    });
  } catch (error: any) {
    console.error("Failed to fetch deal link:", error);
    return NextResponse.json(
      { error: "Failed to retrieve deal link" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ offeringId: string }> }
) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (sessionClaims?.metadata?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { offeringId } = await params;
  if (!offeringId) {
    return NextResponse.json({ error: "Offering ID is required" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { thirdPartyUrl, instructions } = body;

    if (!thirdPartyUrl || typeof thirdPartyUrl !== "string") {
      return NextResponse.json(
        { error: "Third-party platform URL is required." },
        { status: 400 }
      );
    }

    const trimmedUrl = thirdPartyUrl.trim();
    if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
      return NextResponse.json(
        { error: "URL must begin with https:// or http://" },
        { status: 400 }
      );
    }

    await dbConnect();

    const updated = await DealLink.findOneAndUpdate(
      { offeringId },
      {
        $set: {
          thirdPartyUrl: trimmedUrl,
          instructions: typeof instructions === "string" ? instructions.trim() : "",
          updatedBy: userId,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({
      success: true,
      dealLink: {
        offeringId: updated.offeringId,
        thirdPartyUrl: updated.thirdPartyUrl,
        instructions: updated.instructions,
        updatedAt: updated.updatedAt?.toISOString() || null,
      },
    });
  } catch (error: any) {
    console.error("Failed to save deal link:", error);
    return NextResponse.json(
      { error: "Failed to save deal link" },
      { status: 500 }
    );
  }
}

