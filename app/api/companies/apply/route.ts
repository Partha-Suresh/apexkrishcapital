import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import CompanyApplication from "@/models/company-application.model";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      companyName,
      founderName,
      workEmail,
      phoneNumber,
      websiteUrl,
      pitchDeckUrl,
      stage,
      targetRaiseAmount,
      currentArr,
      sector,
      summary,
    } = body;

    if (!companyName || !founderName || !workEmail || !targetRaiseAmount || !summary) {
      return NextResponse.json(
        { error: "Please provide all required fields (Company Name, Founder Name, Email, Target Raise, Summary)." },
        { status: 400 }
      );
    }

    await dbConnect();

    const application = await CompanyApplication.create({
      companyName: companyName.trim(),
      founderName: founderName.trim(),
      workEmail: workEmail.toLowerCase().trim(),
      phoneNumber: phoneNumber ? phoneNumber.trim() : undefined,
      websiteUrl: websiteUrl ? websiteUrl.trim() : undefined,
      pitchDeckUrl: pitchDeckUrl ? pitchDeckUrl.trim() : undefined,
      stage: stage || "Series A",
      targetRaiseAmount: targetRaiseAmount.trim(),
      currentArr: currentArr ? currentArr.trim() : undefined,
      sector: sector || "AI & Frontier Tech",
      summary: summary.trim(),
      status: "pending_review",
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully. Our investment committee will review your materials.",
      applicationId: application._id,
    });
  } catch (error) {
    console.error("Error submitting company application:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit company application." },
      { status: 500 }
    );
  }
}
