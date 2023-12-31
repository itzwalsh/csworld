import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";
import type { Nade } from "@prisma/client";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

const addUserDataToNades = async (nades: Nade[]) => {
  const userList = await clerkClient.users.getUserList({
    userId: nades.map((nade) => nade.authorId),
    limit: 100,
  });

  const users = userList.map(filterUserForClient);

  return nades.map((nade) => {
    const author = users.find((user) => user.id === nade.authorId);

    if (!author) {
      console.error("AUTHOR NOT FOUND", nade);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author for nade not found. nade ID: ${nade.id}, USER ID: ${nade.authorId}`,
      });
    }
    if (!author.username) {
      // user the ExternalUsername
      if (!author.externalUsername) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Author has no Discord Account: ${author.id}`,
        });
      }
      author.username = author.externalUsername;
    }
    return {
      nade,
      author: {
        ...author,
        username: author.username ?? "(username not found)",
      },
    };
  });
};

// Create a new ratelimiter, that allows 5 requests every 1 minute per authorId
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
});

export const nadesRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const nade = await ctx.prisma.nade.findUnique({
        where: { id: input.id },
      });

      if (!nade) throw new TRPCError({ code: "NOT_FOUND" });

      return (await addUserDataToNades([nade]))[0];
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const nades = await ctx.prisma.nade.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });

    return addUserDataToNades(nades);
  }),

  getNadesByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(({ ctx, input }) =>
      ctx.prisma.nade
        .findMany({
          where: {
            authorId: input.userId,
          },
          take: 100,
          orderBy: [{ createdAt: "desc" }],
        })
        .then(addUserDataToNades)
    ),

  getNadesByMap: publicProcedure
    .input(
      z.object({
        map: z.string(),
      })
    )
    .query(({ ctx, input }) =>
      ctx.prisma.nade
        .findMany({
          where: {
            map: input.map,
          },
          take: 100,
          orderBy: [{ createdAt: "desc" }],
        })
        .then(addUserDataToNades)
    ),

  create: privateProcedure
    .input(
      z.object({
        game: z.string().min(1).max(15),
        map: z.string().min(1).max(15),
        start: z.string().min(1).max(15),
        end: z.string().min(1).max(15),
        type: z.string(),
        team: z.string(),
        tick: z.string(),
        technique: z.string(),
        description: z.string().min(1).max(100),
        videoUrl: z
          .string()
          .url("Must provide youtube URL")
          .startsWith("https://www.youtube.com")
          .min(1)
          .max(50),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      //add rate limiter :)
      const { success } = await ratelimit.limit(authorId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const nade = await ctx.prisma.nade.create({
        data: {
          game: input.game,
          map: input.map,
          start: input.start,
          end: input.end,
          type: input.type,
          team: input.team,
          tick: input.tick,
          technique: input.technique,
          description: input.description,
          videoUrl: input.videoUrl,
          authorId,
        },
      });

      return nade;
    }),
});
