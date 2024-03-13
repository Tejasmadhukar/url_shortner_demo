import { permanentRedirect, redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { NotifyOnClick } from "./send_mail";

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

  if (!(new Date() < url.endTime && new Date() >= url.startTime)) {
    return NextResponse.json(
      {
        message: `This url started at ${url.startTime.toLocaleString()} and ends at ${url.endTime.toLocaleString()}. If you're seeing this message then it is not in valid time range`,
      },
      { status: 400 },
    );
  }

  if (url.isAuthRequired) {
    const session = await getServerAuthSession();
    if (!session?.user.email) {
      return redirect("/api/auth/signin");
    }
    if (url.isNotificationRequired) {
      await NotifyOnClick(url.userId, session.user.email, new Date());
    }
  }

  return permanentRedirect(url.forwardedTo);
}
