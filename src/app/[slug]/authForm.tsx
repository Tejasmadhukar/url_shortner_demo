"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { EmailAuthRequiredAction } from "./actions";

const FormSchema = z.object({
  email: z.string().email({ message: "Must be a valid email" }),
});

export function UrlOnMail({ tinyurl }: { tinyurl: string }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [loading, setloading] = useState(false);
  const [done, setdone] = useState(false);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setloading(true);
    await EmailAuthRequiredAction(data.email, tinyurl);
    setloading(false);
    setdone(true);
  }

  return (
    <>
      {done && <h1>URL sent successfully, check your mail !</h1>}
      {loading && !done && <h1>Sending URL to your mail...</h1>}
      {!done && !loading && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-1/3 space-y-6 "
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="xyz@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the mail where you will receive the url
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant="secondary" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}
