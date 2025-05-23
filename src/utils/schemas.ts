import { z } from 'zod';

export const createUserSchema = z.object({
  username: z
    .string({ message: 'Username is required' })
    .min(3, { message: 'Username must be at least 3 characters long' }),
  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'Email must be valid' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, {
      message: 'Password must contain at least one special character',
    }),
});

export const loginUserSchema = z.object({
  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'Email must be valid' }),
  password: z.string({ message: 'Password is required' }).min(6),
});

export const sendVerificationLinkSchema = loginUserSchema.pick({
  email: true,
});

export const verifyAccountQuerySchema = z.object({
  token: z
    .string()
    .min(3, { message: 'Token must be at least 3 characters long' }),
});

export const resetPassswordSchema = createUserSchema
  .omit({ username: true, email: true })
  .merge(verifyAccountQuerySchema);

export const updateUserProfileSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .optional(),
  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'Email must be valid' })
    .optional(),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .optional(),
  bio: z
    .string()
    .min(3, { message: 'Bio must be at least 3 characters long' })
    .optional(),
  avatar: z.string().url({ message: 'Avatar must be a valid url' }).optional(),
});

export const createLinkSchema = z.object({
  title: z
    .string({ message: 'Link is required' })
    .min(3, { message: 'Link must be at least 3 characters long' }),
  description: z
    .string({ message: 'Description is required' })
    .min(3, { message: 'Description must be at least 3 characters long' }),
  url: z.string().url({ message: 'URL must be a valid url' }),
  imageUrl: z
    .string()
    .url({ message: 'Avatar must be a valid url' })
    .optional(),
});

export const updateLinkSchema = createLinkSchema.partial().merge(
  z.object({
    isActive: z.boolean().optional(),
  }),
);

export const linkParamSchema = z.object({
  linkId: z.string().cuid(),
});
