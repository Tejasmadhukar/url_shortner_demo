"use server";

import { revalidatePath } from "next/cache";
import { api } from "~/trpc/server";

export async function DeleteTinyurls(ids: string[]) {
  await api.delete_tinyurls.mutate(ids);
  revalidatePath("/");
}

export async function DeleteAllTinyurls() {
  await api.delete_allurls.mutate();
  revalidatePath("/");
}
