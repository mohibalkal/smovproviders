import { type EmbedOptions, type EmbedOutput } from "@/providers/base";
import { type EmbedScrapeContext } from "@/utils/context";
import { type Stream, type Qualities } from "@/providers/streams";
import { nanoid } from "nanoid";
import { flags } from "@/entrypoint/utils/targets";

export const smashyStreamDScraper: EmbedOptions = {
  id: "smashystream-d",
  name: "SmashyStream D",
  rank: 150,
  async scrape(ctx: EmbedScrapeContext): Promise<EmbedOutput> {
    try {
      const stream: Stream = {
        id: nanoid(),
        type: "file",
        flags: [flags.CORS_ALLOWED],
        captions: [],
        qualities: {
          "1080": {
            type: "mp4",
            url: ctx.url
          }
        },
        headers: {
          Referer: ctx.url
        }
      };

      return {
        stream: [stream]
      };
    } catch (error) {
      throw new Error(`Failed to scrape SmashyStreamD: ${error}`);
    }
  }
};
