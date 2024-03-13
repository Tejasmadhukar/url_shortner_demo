import { z } from "zod";

export const create_tinyurl_model = z
  .object({
    isAuthRequired: z.boolean().default(false),
    isNotificationRequired: z.boolean().default(false),
    startTime: z.date().min(new Date(new Date().getDate())).default(new Date()),
    endTime: z
      .date()
      .min(new Date(new Date().setDate(new Date().getDate())))
      .default(new Date(new Date().getTime() + 24 * 60 * 60 * 1000)),
    actual_url: z.string().url({
      message: "Must be a valid url",
    }),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End date cannot be earlier than start date",
    path: ["endTime"],
  })
  .refine(
    (data) => {
      if (data.isNotificationRequired) {
        return data.isAuthRequired;
      }
      return true;
    },
    {
      message:
        "For notification on click to be enabled, you need to enable authentication on opening the url",

      path: ["isNotificationRequired"],
    },
  );
