import { permanentRedirect, redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";

export async function GET(request: Request) {
  const urlParts = request.url.split("/");
  const slug = urlParts[urlParts.length - 1];

  if (!slug) {
    return new Response("Your tinyurl is not valid. 404");
  }

  try {
    const url = await db.query.urls.findFirst({
      where: (url, { eq }) => eq(url.tinyurl, slug),
    });

    if (!url) {
      return new Response("This tinyurl was not found in database 400");
    }

    if (url.isAuthRequired) {
      const session = await getServerAuthSession();
      if (!session) {
        redirect("/api/auth/signin");
      }
    }

    permanentRedirect(url.forwardedTo);
  } catch (error) {
    return new Response("Error could not connect to databse");
  }
}
