import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Commitment from "@/models/commitment.model";
import DealLink from "@/models/deal-link.model";
import BroadcastLog, { IBroadcastRecipient } from "@/models/broadcast-log.model";
import {
  sendBroadcastEmail,
  generateWhatsAppLink,
  cleanPhoneNumber,
} from "@/lib/broadcast";

export async function GET(req: NextRequest) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (sessionClaims?.metadata?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const offeringId = searchParams.get("offeringId");
  const audience = searchParams.get("audience") || "all_verified";

  if (!offeringId) {
    return NextResponse.json(
      { error: "Offering ID is required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    // Fetch stored deal link
    const dealLink = await DealLink.findOne({ offeringId }).lean();

    // Query commitments and populate user verification
    const records = await Commitment.find({
      offeringId,
      status: { $ne: "cancelled" },
    })
      .populate("userId", "name email phoneNumber verificationStatus investorStatus citizenship")
      .lean();

    // Filter strictly for verified investors
    const verifiedRecords = records.filter((r: any) => {
      const user = r.userId || {};
      return user.verificationStatus === "verified";
    });

    // Apply audience filter
    const audienceFiltered = verifiedRecords.filter((r: any) => {
      if (audience === "commitments_only") return r.type === "commitment";
      if (audience === "interests_only") return r.type === "interest";
      return true;
    });

    // Deduplicate by user ID (take largest amount if multiple exist)
    const userMap = new Map<string, any>();
    audienceFiltered.forEach((r: any) => {
      const u = r.userId || {};
      const uId = u._id ? u._id.toString() : r.userId?.toString();
      if (!uId) return;

      const existing = userMap.get(uId);
      if (!existing || (r.amount && (!existing.amount || r.amount > existing.amount))) {
        userMap.set(uId, {
          userId: uId,
          userName: r.userName || u.name || "Verified Investor",
          userEmail: r.userEmail || u.email,
          userPhone: u.phoneNumber || null,
          hasValidPhone: !!cleanPhoneNumber(u.phoneNumber),
          type: r.type,
          amount: r.amount || null,
          offeringId: r.offeringId,
          offeringTitle: r.offeringTitle,
        });
      }
    });

    const recipients = Array.from(userMap.values());

    return NextResponse.json({
      offeringId,
      thirdPartyUrl: dealLink?.thirdPartyUrl || "",
      instructions: dealLink?.instructions || "",
      totalVerifiedRecipients: recipients.length,
      recipientsWithPhone: recipients.filter((r) => r.hasValidPhone).length,
      recipients,
    });
  } catch (error: any) {
    console.error("Failed to preview broadcast recipients:", error);
    return NextResponse.json(
      { error: "Failed to preview broadcast audience" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (sessionClaims?.metadata?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      offeringId,
      offeringTitle,
      targetAudience = "all_verified",
      thirdPartyUrl,
      subject,
      customMessage = "",
      sendEmail = true,
      sendWhatsApp = true,
    } = body;

    if (!offeringId || !thirdPartyUrl) {
      return NextResponse.json(
        { error: "Offering ID and Third-Party Platform URL are required." },
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

    // Persist or update the link in DealLink collection
    await DealLink.findOneAndUpdate(
      { offeringId },
      {
        $set: {
          thirdPartyUrl: trimmedUrl,
          updatedBy: userId,
        },
      },
      { upsert: true }
    );

    // Fetch all commitments for this offering
    const records = await Commitment.find({
      offeringId,
      status: { $ne: "cancelled" },
    })
      .populate("userId", "name email phoneNumber verificationStatus investorStatus citizenship")
      .lean();

    // Filter strictly for verified investors
    const verifiedRecords = records.filter((r: any) => {
      const user = r.userId || {};
      return user.verificationStatus === "verified";
    });

    // Apply audience filter
    const audienceFiltered = verifiedRecords.filter((r: any) => {
      if (targetAudience === "commitments_only") return r.type === "commitment";
      if (targetAudience === "interests_only") return r.type === "interest";
      return true;
    });

    // Deduplicate by user ID
    const userMap = new Map<string, any>();
    audienceFiltered.forEach((r: any) => {
      const u = r.userId || {};
      const uId = u._id ? u._id.toString() : r.userId?.toString();
      if (!uId) return;

      const existing = userMap.get(uId);
      if (!existing || (r.amount && (!existing.amount || r.amount > existing.amount))) {
        userMap.set(uId, {
          userId: uId,
          userName: r.userName || u.name || "Verified Investor",
          userEmail: r.userEmail || u.email,
          userPhone: u.phoneNumber || null,
          type: r.type,
          amount: r.amount || null,
        });
      }
    });

    const uniqueRecipients = Array.from(userMap.values());

    if (uniqueRecipients.length === 0) {
      return NextResponse.json(
        {
          error:
            "No verified investors found who have committed capital or expressed interest in this offering.",
        },
        { status: 400 }
      );
    }

    const emailSubject =
      subject ||
      `Priority Access: ${offeringTitle || offeringId} SPV Subscription & Closing Portal`;

    const broadcastResults: IBroadcastRecipient[] = [];
    const whatsappRoster: Array<{
      userName: string;
      userEmail: string;
      userPhone: string | null;
      whatsAppLink: string | null;
      emailStatus: string;
    }> = [];

    let emailsSent = 0;
    let whatsappProcessed = 0;

    // Process each verified investor
    for (const recipient of uniqueRecipients) {
      let emailStatus: "sent" | "failed" | "skipped" = "skipped";
      let whatsappStatus: "sent" | "link_generated" | "failed" | "skipped" = "skipped";
      let errorMsg: string | undefined;
      let whatsAppLink: string | null = null;

      // 1. Send Email
      if (sendEmail && recipient.userEmail) {
        const emailRes = await sendBroadcastEmail({
          to: recipient.userEmail,
          userName: recipient.userName,
          offeringTitle: offeringTitle || offeringId,
          type: recipient.type,
          amount: recipient.amount,
          thirdPartyUrl: trimmedUrl,
          customMessage,
          subject: emailSubject,
        });

        if (emailRes.success) {
          emailStatus = "sent";
          emailsSent += 1;
        } else {
          emailStatus = "failed";
          errorMsg = emailRes.error;
        }
      }

      // 2. Process WhatsApp
      if (sendWhatsApp && recipient.userPhone) {
        whatsAppLink = generateWhatsAppLink(recipient.userPhone, {
          userName: recipient.userName,
          offeringTitle: offeringTitle || offeringId,
          thirdPartyUrl: trimmedUrl,
          customMessage,
        });

        if (whatsAppLink) {
          whatsappStatus = "link_generated";
          whatsappProcessed += 1;
        }
      }

      broadcastResults.push({
        userId: recipient.userId,
        userName: recipient.userName,
        userEmail: recipient.userEmail,
        userPhone: recipient.userPhone,
        type: recipient.type,
        amount: recipient.amount,
        emailStatus,
        whatsappStatus,
        error: errorMsg,
      });

      whatsappRoster.push({
        userName: recipient.userName,
        userEmail: recipient.userEmail,
        userPhone: recipient.userPhone,
        whatsAppLink,
        emailStatus,
      });
    }

    // Persist audit record in BroadcastLog
    await BroadcastLog.create({
      offeringId,
      offeringTitle: offeringTitle || offeringId,
      adminUserId: userId,
      targetAudience,
      thirdPartyUrl: trimmedUrl,
      subject: emailSubject,
      customMessage,
      totalRecipients: uniqueRecipients.length,
      emailsSent,
      whatsappProcessed,
      recipients: broadcastResults,
    });

    return NextResponse.json({
      success: true,
      message: `Broadcast successfully dispatched to ${uniqueRecipients.length} verified investor(s).`,
      totalRecipients: uniqueRecipients.length,
      emailsSent,
      whatsappProcessed,
      whatsappRoster,
    });
  } catch (error: any) {
    console.error("Broadcast execution error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to execute broadcast." },
      { status: 500 }
    );
  }
}

