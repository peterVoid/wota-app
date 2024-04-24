import * as z from "zod";

export const postSchema = z.object({
  image: z.string().optional(),
  text: z.string().min(3, { message: "Atleast > 3 char" }).max(1000),
});

export const commentSchema = z.object({
  text: z.string().min(3, { message: "At least must than 3 char" }),
});
