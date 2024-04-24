import * as z from "zod";

export const userSchema = z.object({
  username: z.string().min(3).max(20).nonempty(),
  name: z.string().min(3).max(20).nonempty(),
  image: z.string().optional(),
  bio: z.string().optional(),
});
