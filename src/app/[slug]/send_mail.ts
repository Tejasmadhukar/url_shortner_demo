import "server-only";
import { createTransport } from "nodemailer";
import { env } from "~/env";
import { db } from "~/server/db";

const transporter = createTransport({
  url: env.EMAIL_SERVER,
  from: env.EMAIL_FROM,
});

export async function NotifyOnClick(
  user_id: string,
  who_opened: string,
  click_time: Date,
  link: string,
) {
  const user = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, user_id),
  });

  if (!user) return "User not found";

  const message = {
    from: env.EMAIL_FROM,
    to: user.email,
    subject: "Somebody opened your link !!!!!",
    text: `${who_opened} used clicked on your link ${link} on ${click_time.toLocaleString()}`,
    html: `<p>${who_opened} used clicked on your link ${link} on ${click_time.toLocaleString()}</p>`,
  };

  await transporter.sendMail(message);
}
