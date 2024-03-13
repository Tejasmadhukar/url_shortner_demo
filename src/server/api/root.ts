import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { urls } from "../db/schema";
import { create_tinyurl_model } from "./models";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  getall_tinyurls: protectedProcedure.query(async ({ ctx }) => {
    try {
      const urls = await ctx.db.query.urls.findMany({
        where: (urls, { eq }) => eq(urls.userId, ctx.session.user.id),
      });
      return urls;
    } catch (error) {
      throw new TRPCError({
        message: "database operation failed",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),
  delete_tinyUrl: protectedProcedure
    .input(
      z.object({
        urlId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.db.delete(urls).where(eq(urls.id, input.urlId));
      } catch (error) {
        throw new TRPCError({
          message: "database operation failed",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  create_tinyurl: protectedProcedure
    .input(create_tinyurl_model)
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .insert(urls)
        .values({
          forwardedTo: input.actual_url,
          endTime: input.endTime,
          userId: ctx.session.user.id,
          isAuthRequired: input.isAuthRequired,
          isNotificationRequired: input.isNotificationRequired,
          startTime: input.startTime,
        })
        .returning();
      if (!result[0]?.tinyurl) {
        throw new TRPCError({
          message: "tiny url was not returned by db",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      return result[0].tinyurl;
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
