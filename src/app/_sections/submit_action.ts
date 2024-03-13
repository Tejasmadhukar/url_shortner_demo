"use server";
import { type create_tinyurl_model } from "~/server/api/models";
import { type z } from "zod";
import { revalidatePath } from "next/cache";
import { api } from "~/trpc/server";

export async function createUrlAction(
  data: z.infer<typeof create_tinyurl_model>,
) {
  await api.create_tinyurl.mutate(data);
  revalidatePath("/");
}
