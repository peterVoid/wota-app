"use client";
import { userSchema } from "@/lib/schemas/user.validate";
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
import { ChangeEvent } from "react";
import { Textarea } from "../ui/textarea";
import { updateUser } from "@/lib/actions/user.action";
import { useRouter } from "next/navigation";

interface Props {
  dataUser: {
    id: string | undefined;
    image: string;
    username: string;
    name: string;
    bio: string;
  };
}

const UserForm = ({ dataUser }: Props) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: dataUser
      ? dataUser
      : {
          bio: "",
          image: "",
          name: "",
          username: "",
        },
  });

  const handleChangeImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();
    const reader = new FileReader();

    if (e.target.files) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image")) null;

      reader.onload = async (event) => {
        const result = await event.target?.result?.toString();
        fieldChange(result!);
      };

      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof userSchema>) {
    await updateUser({
      userId: dataUser.id!,
      username: values.username!,
      name: values.name,
      bio: values.bio!,
      imageUrl: values.image!,
    });

    router.push("/");
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="Profile Photo"
                    width={100}
                    height={100}
                    priority
                    className="rounded-full object-contain"
                  />
                ) : (
                  <Image
                    src={"/assets/user.svg"}
                    alt="Profile Photo"
                    width={50}
                    height={50}
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleChangeImage(e, field.onChange)}
                  className="account-form_image-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white font-medium">Username</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Username" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Name"
                  className="account-form_input no-focus"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-white font-medium">Bio</FormLabel>
              <FormControl>
                <Textarea
                  rows={15}
                  {...field}
                  className="account-form_input no-focus"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary-500">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default UserForm;
