import { permanentRedirect } from "next/navigation";
import { db } from "~/server/db";
import { UrlOnMail } from "./authForm";

export default async function Redirect({
  params,
}: {
  params: { slug: string };
}) {
  const tinyurl = params.slug;

  const url = await db.query.urls.findFirst({
    where: (tiny, { eq }) => eq(tiny.tinyurl, tinyurl),
  });

  if (!url) return <h1>No Url found</h1>;

  if (!(new Date() < url.endTime && new Date() >= url.startTime))
    return (
      <h1>
        This url started at {url.startTime.toUTCString()} and ends at
        {url.endTime.toUTCString()}. If you are seeing this message then url has
        not started yet or has expired.
      </h1>
    );

  if (!url.isAuthRequired) return permanentRedirect(url.forwardedTo);

  return <UrlOnMail tinyurl={tinyurl} />;
}
