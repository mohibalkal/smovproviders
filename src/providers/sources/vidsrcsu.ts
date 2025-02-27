import { type UseableFetcher } from "@/fetchers/types";
import { type SourcererOptions, type SourcererOutput } from "@/providers/base";
import { flags } from "@/entrypoint/utils/targets";
import { type MovieScrapeContext, type ShowScrapeContext } from "@/utils/context";

const BASE_URL = "https://vidsrc.su";

async function scrapeContent(
  tmdbId: string | undefined,
  type: "movie" | "show",
  season?: number,
  episode?: number,
  fetcher?: UseableFetcher
): Promise<Array<{ embedId: string; url: string; quality: string; server: string }>> {
  if (!tmdbId) return [];
  const url = `${BASE_URL}/api/v1/get-streams`;
  
  try {
    const response = await fetcher?.(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": BASE_URL,
      },
      body: JSON.stringify({
        tmdb_id: tmdbId,
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
      embedId: `vidsrcsu-${stream.server}-${stream.quality}`,
      url: stream.stream_url,
      quality: stream.quality,
      server: stream.server,
    }));
  } catch (error) {
    console.error("VidSrcSu scraper error:", error);
    return [];
  }
}

export const vidsrcsuScraper: SourcererOptions = {
  id: "vidsrcsu",
  name: "VidSrcSu",
  rank: 160,
  flags: [flags.CORS_ALLOWED],
  scrapeMovie: async (ctx: MovieScrapeContext): Promise<SourcererOutput> => {
    const embeds = await scrapeContent(
      ctx.media.tmdbId,
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
      ctx.media.tmdbId,
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
