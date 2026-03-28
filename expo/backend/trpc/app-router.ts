import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import nodeInfoRoute from "./routes/node/info/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  node: createTRPCRouter({
    info: nodeInfoRoute,
  }),
});

export type AppRouter = typeof appRouter;