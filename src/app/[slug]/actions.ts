"use server";
import "server-only";
import { db } from "~/server/db";
import { createTransport } from "nodemailer";
import { env } from "~/env";
import { render } from "@react-email/render";
import UrlOnEmail from "emails/open_url";
import NotificationEmail from "emails/notify_click";

const transporter = createTransport({
  url: env.EMAIL_SERVER,
  from: env.EMAIL_FROM,
});

export async function EmailAuthRequiredAction(email: string, tinyurl: string) {
  const tinyurlEntry = await db.query.urls.findFirst({
    where: (tiny, { eq }) => eq(tiny.tinyurl, tinyurl),
  });

  if (!tinyurlEntry) throw new Error("Url does not exsists");

  // auth and notification should be required as only then ui is shown
  if (!tinyurlEntry.isAuthRequired)
    throw new Error(
      "Stop reverse engineering and breaking my app, It is just a demo !",
    );

  const creator = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, tinyurlEntry.userId),
  });

  if (!creator) throw new Error("Stop breaking my app");

  const UrlOnEmailHtml = render(
    UrlOnEmail({
      orignalUrl: tinyurlEntry.forwardedTo,
      creator: creator.email,
    }),
  );

  const UrlOnEmailMessage = {
    from: env.EMAIL_FROM,
    to: email,
    subject: "Your Url is here",
    text: `Do not open this link ${tinyurlEntry.forwardedTo} if you do not recognise ${creator.email}`,
    html: UrlOnEmailHtml,
  };

  if (!tinyurlEntry.isNotificationRequired) {
    await transporter.sendMail(UrlOnEmailMessage);
    return "success";
  }

  const NotificationEmailHtml = render(
    NotificationEmail({ email, url: tinyurlEntry.forwardedTo }),
  );

  const NotificationEmailMessage = {
    from: env.EMAIL_FROM,
    to: email,
    subject: "Somebody opened your url",
    text: `${email} opened your url ${tinyurlEntry.forwardedTo} on ${new Date().toLocaleString()}`,
    html: NotificationEmailHtml,
  };

  const UrlOnEmailPromise = transporter.sendMail(UrlOnEmailMessage);
  const NotificationEmailPromise = transporter.sendMail(
    NotificationEmailMessage,
  );

  try {
    // eslint-disable-next-line
    const [_, __] = await Promise.allSettled([
      UrlOnEmailPromise,
      NotificationEmailPromise,
    ]);
    return "success";
  } catch (error) {
    console.log(error);
  }
}
