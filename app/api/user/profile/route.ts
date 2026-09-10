import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import User from "@/models/user.model";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email =
      clerkUser.primaryEmailAddress?.emailAddress ||
      clerkUser.emailAddresses?.[0]?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: "No email address found" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    return NextResponse.json({
      user: user || null,
      clerkInfo: {
        email,
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        imageUrl: clerkUser.imageUrl || "",
      },
    });
  } catch (error: any) {
    console.error("Failed to fetch user profile:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email =
      clerkUser.primaryEmailAddress?.emailAddress ||
      clerkUser.emailAddresses?.[0]?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: "No email address found" }, { status: 400 });
    }

    const body = await req.json();
    const { firstName, middleName, lastName, phone, investorStatus, citizenship, avatar } =
      body;

    // Validate non-optional fields
    if (!firstName?.trim()) {
      return NextResponse.json({ error: "First name is required" }, { status: 400 });
    }
    if (!lastName?.trim()) {
      return NextResponse.json({ error: "Last name is required" }, { status: 400 });
    }
    if (!phone?.trim()) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }
    if (!investorStatus) {
      return NextResponse.json({ error: "Investor status is required" }, { status: 400 });
    }
    if (!citizenship) {
      return NextResponse.json({ error: "Citizenship is required" }, { status: 400 });
    }

    await dbConnect();

    const fullName = `${firstName.trim()} ${
      middleName?.trim() ? middleName.trim() + " " : ""
    }${lastName.trim()}`;

    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      {
        email: email.toLowerCase().trim(),
        name: fullName,
        firstName: firstName.trim(),
        middleName: middleName?.trim() || "",
        lastName: lastName.trim(),
        phoneNumber: phone.trim(),
        avatar: avatar || clerkUser.imageUrl || "",
        investorStatus,
        citizenship,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Failed to save user profile:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

