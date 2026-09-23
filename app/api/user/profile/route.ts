import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import User from "@/models/user.model";
import { dbConnect } from "@/lib/dbConnect";
import { sendProfileUpdateNotification } from "@/lib/email";
import { investorProfileSchema } from "@/lib/validations/profile.schema";

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

// Rate limiting configuration to protect Nodemailer SMTP quota and prevent spam/flooding
const MAX_UPDATES_PER_HOUR = 5; // Maximum profile updates allowed per 1-hour rolling window
const MAX_UPDATES_PER_DAY = 15; // Maximum profile updates allowed per 24-hour rolling window
const MIN_COOLDOWN_SECONDS = 15; // Minimum interval required between consecutive updates

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

    // Validate payload using Zod Schema
    const validationResult = investorProfileSchema.safeParse({
      firstName: body.firstName,
      middleName: body.middleName,
      lastName: body.lastName,
      email: email,
      phone: body.phone,
      investorStatus: body.investorStatus,
      citizenship: body.citizenship,
      avatar: body.avatar || clerkUser.imageUrl || "",
    });

    if (!validationResult.success) {
      const issues = validationResult.error.issues || [];
      const firstError = issues[0]?.message || "Invalid profile data.";
      const fieldErrors: Record<string, string[]> = {};
      issues.forEach((issue) => {
        const fieldName = issue.path[0]?.toString();
        if (fieldName) {
          if (!fieldErrors[fieldName]) fieldErrors[fieldName] = [];
          fieldErrors[fieldName].push(issue.message);
        }
      });

      return NextResponse.json(
        {
          error: firstError,
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      firstName,
      middleName,
      lastName,
      phone,
      investorStatus,
      citizenship,
      avatar,
    } = validationResult.data;

    const { sessionClaims } = await auth();
    const isAdmin = sessionClaims?.metadata?.role === "admin";

    await dbConnect();
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    const now = new Date();
    const nowTime = now.getTime();

    // Check if user already exists to enforce rate limiting and detect duplicate saves
    if (existingUser) {
      // 1. Check if the submitted profile payload is completely identical to DB
      const isUnchanged =
        existingUser.firstName === firstName.trim() &&
        (existingUser.middleName || "") === (middleName?.trim() || "") &&
        existingUser.lastName === lastName.trim() &&
        existingUser.phoneNumber === phone.trim() &&
        existingUser.investorStatus === investorStatus &&
        existingUser.citizenship === citizenship &&
        (existingUser.avatar || "") === (avatar || clerkUser.imageUrl || "");

      if (isUnchanged) {
        return NextResponse.json({
          success: true,
          message: "Profile is already up to date.",
          user: existingUser,
        });
      }

      // 2. Cooldown check between successive saves
      if (existingUser.lastProfileUpdateAt) {
        const lastUpdate = new Date(existingUser.lastProfileUpdateAt).getTime();
        const elapsedSec = (nowTime - lastUpdate) / 1000;
        if (elapsedSec < MIN_COOLDOWN_SECONDS) {
          const remaining = Math.ceil(MIN_COOLDOWN_SECONDS - elapsedSec);
          return NextResponse.json(
            {
              error: `Please wait ${remaining} second${remaining > 1 ? "s" : ""} before saving your profile again.`,
            },
            { status: 429 }
          );
        }
      }

      // 3. Hourly and Daily rolling window rate limit checks
      const oneHourAgo = nowTime - 60 * 60 * 1000;
      const oneDayAgo = nowTime - 24 * 60 * 60 * 1000;

      const rawHistory: (Date | string)[] = existingUser.profileUpdateHistory || [];
      const historyTimestamps = rawHistory
        .map((t) => new Date(t).getTime())
        .filter((t) => !isNaN(t) && t > oneDayAgo);

      const inLastHour = historyTimestamps.filter((t) => t > oneHourAgo);

      if (inLastHour.length >= MAX_UPDATES_PER_HOUR) {
        const oldestInHour = Math.min(...inLastHour);
        const minutesLeft = Math.max(
          1,
          Math.ceil((oldestInHour + 60 * 60 * 1000 - nowTime) / 60000)
        );
        return NextResponse.json(
          {
            error: `Profile update limit reached (${MAX_UPDATES_PER_HOUR} updates per hour). To protect system resources and email services, please wait ${minutesLeft} minute${minutesLeft > 1 ? "s" : ""} before saving again.`,
          },
          { status: 429 }
        );
      }

      if (historyTimestamps.length >= MAX_UPDATES_PER_DAY) {
        return NextResponse.json(
          {
            error: `Daily profile update limit reached (${MAX_UPDATES_PER_DAY} updates per 24 hours). Please try again tomorrow.`,
          },
          { status: 429 }
        );
      }
    }

    const fullName = `${firstName.trim()} ${
      middleName?.trim() ? middleName.trim() + " " : ""
    }${lastName.trim()}`;

    // Filter existing history to last 24h and add current timestamp
    const oneDayAgo = nowTime - 24 * 60 * 60 * 1000;
    const existingTimestamps = (existingUser?.profileUpdateHistory || [])
      .map((t: any) => new Date(t).getTime())
      .filter((t: number) => !isNaN(t) && t > oneDayAgo);

    const updatedHistory = [...existingTimestamps, nowTime].map((t) => new Date(t));

    const updatePayload: any = {
      email: normalizedEmail,
      name: fullName,
      firstName: firstName.trim(),
      middleName: middleName?.trim() || "",
      lastName: lastName.trim(),
      phoneNumber: phone.trim(),
      avatar: avatar || clerkUser.imageUrl || "",
      investorStatus,
      citizenship,
      lastProfileUpdateAt: now,
      profileUpdateHistory: updatedHistory,
    };

    if (isAdmin) {
      updatePayload.role = "admin";
      updatePayload.verificationStatus = "verified";
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: normalizedEmail },
      { $set: updatePayload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    try {
      await sendProfileUpdateNotification({
        ...updatedUser.toObject(),
        email: normalizedEmail,
      });
    } catch (mailError) {
      console.error("Failed to send profile update email:", mailError);
    }

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

