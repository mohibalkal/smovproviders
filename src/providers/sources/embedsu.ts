import { type UseableFetcher } from "@/fetchers/types";
import { type SourcererOptions, type SourcererOutput } from "@/providers/base";
import { flags } from "@/entrypoint/utils/targets";
import { type MovieScrapeContext, type ShowScrapeContext } from "@/utils/context";

const BASE_URL = "https://embed.su";

async function scrapeContent(
  imdbId: string | undefined,
  type: "movie" | "show",
  season?: number,
  episode?: number,
  fetcher?: UseableFetcher
): Promise<Array<{ embedId: string; url: string; quality: string; server: string }>> {
  if (!imdbId) return [];
  const url = `${BASE_URL}/api/v1/get-streams`;
  
  try {
    const response = await fetcher?.(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": BASE_URL,
      },
      body: JSON.stringify({
        imdb_id: imdbId,
        type,
        season,
        episode,
      }),
    });

    if (!response?.ok) {
      throw new Error(`HTTP error! status: ${response?.status ?? 'unknown'}`);
    }

    const data = await response.json();
    return data.data.map((stream: any) => ({
      embedId: `embedsu-${stream.server}-${stream.quality}`,
      url: stream.stream_url,
      quality: stream.quality,
      server: stream.server,
    }));
  } catch (error) {
    console.error("EmbedSU scraper error:", error);
    return [];
  }
}

export const embedSuScraper: SourcererOptions = {
  id: "embedsu",
  name: "EmbedSU",
  rank: 140,
  flags: [flags.CORS_ALLOWED],
  scrapeMovie: async (ctx: MovieScrapeContext): Promise<SourcererOutput> => {
    const embeds = await scrapeContent(
      ctx.media.imdbId,
      "movie",
      undefined,
      undefined,
      ctx.fetcher
    );
    return { 
      embeds: embeds.map(e => ({ embedId: e.embedId, url: e.url })),
      stream: []
    };
  },
  scrapeShow: async (ctx: ShowScrapeContext): Promise<SourcererOutput> => {
    const embeds = await scrapeContent(
      ctx.media.imdbId,
      "show",
      ctx.media.season?.number,
      ctx.media.episode?.number,
      ctx.fetcher
    );
    return { 
      embeds: embeds.map(e => ({ embedId: e.embedId, url: e.url })),
      stream: []
    };
  },
};
