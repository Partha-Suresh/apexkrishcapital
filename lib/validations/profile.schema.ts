import { z } from "zod";

/**
 * Standardized Zod schema for Investor Profile Form and API validation
 */
export const investorProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(50, "First name must be 50 characters or less.")
    .regex(/^[a-zA-ZÀ-ÿ\s.'-]+$/, "First name contains invalid characters."),

  middleName: z
    .string()
    .trim()
    .max(50, "Middle name must be 50 characters or less.")
    .optional()
    .or(z.literal("")),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(50, "Last name must be 50 characters or less.")
    .regex(/^[a-zA-ZÀ-ÿ\s.'-]+$/, "Last name contains invalid characters."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required.")
    .refine(
      (val) => {
        const formatValid = /^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,5}\)?[-.\s]?)?[\d\s.-]{5,16}$/.test(
          val
        );
        const digits = val.replace(/\D/g, "");
        return formatValid && digits.length >= 7 && digits.length <= 15;
      },
      {
        message: "Please enter a valid phone number (e.g. +1 (555) 019-2834 or 10-15 digits).",
      }
    ),

  investorStatus: z.enum([
    "Not Accredited",
    "Accredited investor(1M+)",
    "Qualified client(2M+)",
    "Qualified purchaser(5M+)",
  ]),

  citizenship: z.enum(["US", "Non-US"]),

  avatar: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
});

export type InvestorProfileFormData = z.infer<typeof investorProfileSchema>;

export type ProfileFormErrors = Partial<Record<keyof InvestorProfileFormData, string>>;
