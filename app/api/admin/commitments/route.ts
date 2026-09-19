import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Commitment from "@/models/commitment.model";
import User from "@/models/user.model";

export async function GET() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (sessionClaims?.metadata?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await dbConnect();

    const records = await Commitment.find({})
      .populate("userId", "name email investorStatus citizenship verificationStatus")
      .sort({ createdAt: -1 })
      .lean();

    const commitments = records.map((record: any) => {
      const user = record.userId || {};
      return {
        id: record._id.toString(),
        userId: user._id ? user._id.toString() : record.userId?.toString(),
        userName: record.userName || user.name || "Anonymous Investor",
        userEmail: record.userEmail || user.email,
        investorStatus: user.investorStatus || "Accredited",
        citizenship: user.citizenship || "US",
        userVerificationStatus: user.verificationStatus || "pending verification",
        offeringId: record.offeringId,
        offeringTitle: record.offeringTitle,
        type: record.type, // 'interest' | 'commitment'
        amount: record.amount || null,
        status: record.status,
        createdAt: record.createdAt?.toISOString() || null,
        updatedAt: record.updatedAt?.toISOString() || null,
      };
    });

    const totalCommittedCapital = commitments
      .filter((c: any) => c.type === "commitment" && c.status === "active" && c.amount)
      .reduce((sum: number, c: any) => sum + (c.amount || 0), 0);

    const totalCommitmentsCount = commitments.filter(
      (c: any) => c.type === "commitment" && c.status === "active"
    ).length;

    const totalInterestsCount = commitments.filter(
      (c: any) => c.type === "interest" && c.status === "active"
    ).length;

    return NextResponse.json({
      commitments,
      stats: {
        totalCommittedCapital,
        totalCommitmentsCount,
        totalInterestsCount,
      },
    });
  } catch (error: any) {
    console.error("Failed to fetch admin commitments:", error);
    return NextResponse.json(
      { error: "Unable to fetch commitments" },
      { status: 500 }
    );
  }
}

