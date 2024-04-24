"use client";
import { postSchema } from "@/lib/schemas/post.validate";
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
import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { Trash } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { createdThread } from "@/lib/actions/post.action";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  currentUserId: string;
}

const CreatePost = ({ currentUserId }: Props) => {
  const pathname = usePathname();
  const [images, setImages] = useState("");
  const router = useRouter();
  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      image: "",
      text: "",
    },
  });

  const handleChangeImage = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const fileReader = new FileReader();
    if (e.target.files && e.target.files?.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image")) null;
      fileReader.onload = async (event) => {
        const result = await event.target?.result?.toString();
        if (!result) null;
        setImages(result!);
      };

      fileReader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof postSchema>) {
    await createdThread({
      currentId: currentUserId,
      images: images ? images : null,
      text: values.text,
      path: pathname,
    });

    router.push("/");
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10 flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">
                {images.length > 0 ? (
                  <div className="flex gap-2 flex-wrap">
                    <div className="relative">
                      <Image
                        key={images}
                        src={images}
                        alt="Image Photo"
                        width={100}
                        height={100}
                        className="object-cover"
                      />
                      <Trash
                        className="absolute top-0 right-0 cursor-pointer"
                        size={25}
                        color="black"
                        onClick={() => setImages("")}
                      />
                    </div>
                  </div>
                ) : null}
              </FormLabel>
              <FormControl>
                <Input
                  className="bg-white"
                  type="file"
                  onChange={(e: any) => handleChangeImage(e)}
                  onKeyDown={(e: any) => {
                    if (e === "Enter") {
                      e.preventDefault();
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base-semibold text-light-2">
                Status
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary-500">
          Post
        </Button>
      </form>
    </Form>
  );
};

export default CreatePost;
