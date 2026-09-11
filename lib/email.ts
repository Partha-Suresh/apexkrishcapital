import nodemailer from "nodemailer";

export const PROFILE_NOTIFICATION_TO =
  process.env.PROFILE_NOTIFICATION_TO || "parthasureshm@gmail.com";

export async function sendProfileUpdateNotification(user: Record<string, any>) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPort = Number(process.env.SMTP_PORT || 587);

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn(
      "Profile update notification skipped: SMTP_HOST, SMTP_USER, and SMTP_PASS must be configured."
    );
    return { sent: false, reason: "missing_smtp_configuration" };
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const userDetails = {
    Name: user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    Email: user.email,
    "First Name": user.firstName || "",
    "Middle Name": user.middleName || "",
    "Last Name": user.lastName || "",
    Phone: user.phoneNumber || "",
    "Investor Status": user.investorStatus || "",
    Citizenship: user.citizenship || "",
    Avatar: user.avatar || "",
    "Created At": user.createdAt ? new Date(user.createdAt).toISOString() : "",
    "Updated At": user.updatedAt ? new Date(user.updatedAt).toISOString() : "",
  };

  const detailRows = Object.entries(userDetails)
    .map(([label, value]) => `${label}: ${value || "N/A"}`)
    .join("\n");

  const subject = `Investor profile updated: ${user.name || user.email}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || smtpUser,
    to: PROFILE_NOTIFICATION_TO,
    subject,
    text: `Investor profile updated\n\n${detailRows}`,
    html: `
      <h2>Investor profile updated</h2>
      <p>The following investor profile details were saved:</p>
      <ul>
        ${Object.entries(userDetails)
          .map(
            ([label, value]) =>
              `<li><strong>${label}:</strong> ${value || "N/A"}</li>`
          )
          .join("")}
      </ul>
    `,
  });

  return { sent: true, to: PROFILE_NOTIFICATION_TO };
}
