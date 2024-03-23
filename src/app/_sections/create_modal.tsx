"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
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
import { format } from "date-fns";
import { Switch } from "~/components/ui/switch";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "~/components/ui/calendar";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { create_tinyurl_model } from "~/server/api/models";
import { createUrlAction } from "./submit_action";
import { useState } from "react";
import { getActualTinyBaseUrl } from "~/trpc/shared";
const FormSchema = create_tinyurl_model;

export function CreateForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [loading, setloading] = useState(false);
  const [resultUrl, setresultUrl] = useState("");

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setloading(true);
    const tinyurlid = await createUrlAction(data);
    const tinyurl = `${getActualTinyBaseUrl()}/${tinyurlid}`;
    setresultUrl(tinyurl);
    setloading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Create Url</Button>
      </DialogTrigger>
      <DialogContent className=" m:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create an url</DialogTitle>
          <DialogDescription>
            Make an url here, changes will be reflected on the homepage table
            where you can manage it.
          </DialogDescription>
        </DialogHeader>
        {resultUrl.length !== 0 && (
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input id="link" defaultValue={resultUrl} readOnly />
            </div>
          </div>
        )}
        {loading && <h1>Making url...</h1>}
        {!loading && resultUrl.length == 0 && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-6"
            >
              <FormField
                control={form.control}
                name="actual_url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="put your url here" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isAuthRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Authentication</FormLabel>
                      <FormDescription>
                        Users who click on the link will need to be
                        authenticated
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isNotificationRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Notification</FormLabel>
                      <FormDescription>
                        You will be notified if someone opens your tiny url. You
                        need to have Authentication enabled for this to work.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date (Optional, default today)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] bg-transparent pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span className="text-white">Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 text-white opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date <
                            new Date(
                              new Date().setDate(new Date().getDate() - 1),
                            ) ||
                            date >
                            new Date(
                              new Date().setMonth(new Date().getMonth() + 1),
                            )
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Enter the date from which you want your url to be valid.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date (Optional, default next day)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] bg-transparent pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span className="text-white">Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 text-white opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() ||
                            date >
                            new Date(
                              new Date().setMonth(new Date().getMonth() + 1),
                            )
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Enter the date till which you want your url to be valid.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="items-center justify-center">
                <Button type="submit" variant="secondary">
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
        {resultUrl.length !== 0 && (
          <DialogFooter className="items-center justify-center">
            <Button variant="secondary" onClick={() => setresultUrl("")}>
              Make a new Url
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
