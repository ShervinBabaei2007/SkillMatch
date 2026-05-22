import { z } from "zod";

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const registrationSchema = z.object({
  // .trim() removes accidental spaces at the start/end of the user's input
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters long." }),

  // We add .or(z.literal("")) so Zod accepts an empty text box without throwing an error
  birthday: z.string().trim().optional().or(z.literal("")),

  age: z.coerce
    .number({ message: "Age must be a valid number." })
    .int({ message: "Age must be a whole number." })
    .min(18, { message: "You must be at least 18 years old." }),

  city: z.string().trim().optional().or(z.literal("")),

  email: z
    .string()
    .trim()
    .pipe(z.email({ error: "Please enter a valid email address." })),

  phone: z.string().trim().regex(phoneRegex, {
    message: "Invalid format. Try adding your country code (e.g., +1 555 123 4567).",
  }),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
