import { type Targets } from '@/entrypoint/utils/targets';
import { type Fetcher, type FetcherResponse } from '@/fetchers/types';

export type { Fetcher, FetcherResponse };

// إضافة تعريف UseableFetcher
export interface UseableFetcher {
  <T = any>(url: string, init?: FetcherOptions): Promise<T>;
  full: <T = any>(url: string, init?: FetcherOptions) => Promise<FetcherResponse<T>>;
}

export interface DefaultedFetcherOptions {
  method: 'HEAD' | 'GET' | 'POST';
  headers: Record<string, string>;
  body?: string | Record<string, any> | FormData;
  query: Record<string, string>;
  readHeaders: string[];
}

export interface FetcherOptions {
  method?: 'HEAD' | 'GET' | 'POST';
  headers?: Record<string, string>;
  body?: string | Record<string, any> | FormData;
  query?: Record<string, string>;
  readHeaders?: string[];
}

// تحديث تعريف Stream
export interface Stream {
  id: string;
  type: "file" | "hls";
  quality?: StreamQuality;
  server?: string;
  url?: string;
  qualities?: Record<string, { type: "mp4"; url: string }>;
  playlist?: string;
  headers?: Record<string, string>;
  preferredHeaders?: Record<string, string>;
  captions?: {
    language: string;
    url: string;
  }[];
}

// إضافة تعريف StreamQuality
export type StreamQuality = "auto" | "1080" | "720" | "480" | "360" | "240";

export interface RunOutput {
  stream: Stream | Stream[];
  embeds?: string[];
}

export interface ProviderMakerOptions {
  fetcher: Fetcher;
  proxiedFetcher: Fetcher;
  target: Targets;
  consistentIpForRequests?: boolean;
  providers: Provider[];
}

// تحديث Provider interface
export interface Provider {
  id: string;
  name: string;
  rank: number;
  scrapeMovie?: (ctx: MovieContext) => Promise<RunOutput>;
  scrapeShow?: (ctx: ShowContext) => Promise<RunOutput>;
}

export interface ProviderBuilder {
  id: string;
  name: string;
  rank: number;
  scrapeMovie?: (ctx: MovieContext) => Promise<RunOutput>;
  scrapeShow?: (ctx: ShowContext) => Promise<RunOutput>;
}

export interface Media {
  type: "movie" | "show";
  title: string;
  releaseYear?: number;
  tmdbId?: string;
  imdbId?: string;
  season?: number;
  episode?: number;
}

export interface MovieContext {
  media: Media;
  fetcher: UseableFetcher;
}

export interface ShowContext extends MovieContext {
  season: number;
  episode: number;
}

export { type Targets };

export interface Flags {
  target: Targets;
  debug?: boolean;
}
