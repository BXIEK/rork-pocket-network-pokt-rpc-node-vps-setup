import { z } from "zod";
import { publicProcedure } from "../../../create-context";

export default publicProcedure
  .input(z.object({ 
    nodeUrl: z.string().url()
  }))
  .query(async ({ input }) => {
    try {
      // Get height
      const heightResponse = await fetch(`${input.nodeUrl}/v1/query/height`);
      const height = heightResponse.ok ? await heightResponse.json() : null;

      // Get peers
      const peersResponse = await fetch(`${input.nodeUrl}/v1/query/peers`);
      const peers = peersResponse.ok ? await peersResponse.json() : null;

      // Get node info
      const infoResponse = await fetch(`${input.nodeUrl}/v1/query/node`);
      const info = infoResponse.ok ? await infoResponse.json() : null;

      return {
        success: true,
        nodeInfo: {
          height: height?.height || 0,
          peers: peers?.peers?.length || 0,
          info,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  });