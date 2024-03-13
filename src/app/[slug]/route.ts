import { permanentRedirect, redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";

export async function GET(request: Request) {
  const urlParts = request.url.split("/");
  const slug = urlParts[urlParts.length - 1];

  if (!slug) {
    return NextResponse.json(
      { message: "This tinyurl is not valid" },
      { status: 400 },
    );
  }

  const url = await db.query.urls.findFirst({
    where: (url, { eq }) => eq(url.tinyurl, slug),
  });

  if (!url) {
    return NextResponse.json(
      { message: "This tinyurl was not found" },
      { status: 404 },
    );
  }

  if (url.isAuthRequired) {
    const session = await getServerAuthSession();
    if (!session) {
      return redirect("/api/auth/signin");
    }
  }

  return permanentRedirect(url.forwardedTo);
}
