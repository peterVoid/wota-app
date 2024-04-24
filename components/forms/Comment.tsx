"use client";
import { commentSchema } from "@/lib/schemas/post.validate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { addComment } from "@/lib/actions/post.action";

interface Props {
  headPost: string;
  currentUserId: string;
  imageUser: string;
  path: string;
}

const Comment = ({ headPost, currentUserId, imageUser, path }: Props) => {
  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      text: "",
    },
  });

  const handleAddComment = async (values: z.infer<typeof commentSchema>) => {
    await addComment(headPost, currentUserId, values.text, path);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleAddComment)}
        className="comment-form"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel>
                <Image
                  src={imageUser}
                  alt="Image User"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  className="no-focus text-light-1 outline-none"
                  placeholder="e.g WHOAA!"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">
          Comment
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
