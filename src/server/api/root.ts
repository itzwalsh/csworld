import { createTRPCRouter } from "~/server/api/trpc";
import { profileRouter } from "./routers/profile";
import { nadesRouter } from "./routers/nades";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  nades: nadesRouter,
  profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
