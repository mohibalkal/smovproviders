// تعريفات أساسية للمكتبة
export interface Fetcher {
  (url: string, options: DefaultedFetcherOptions): Promise<FetcherResponse>;
}

// إضافة تعريف UseableFetcher
export type UseableFetcher = (url: string, init: RequestInit) => Promise<FetcherResponse>;

export interface DefaultedFetcherOptions {
  method: string;
  headers: Record<string, string>;
  body?: string | Record<string, any> | FormData;
  query: Record<string, string>;
  readHeaders: string[];
}

export interface FetcherResponse {
  ok: boolean;
  status: number;
  statusCode: number;  // أضفنا هذا
  headers: Headers;
  text(): Promise<string>;
  json(): Promise<any>;
  finalUrl: string;  // جعلناه إلزامي
  body?: any;
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
}

// تحديث Provider interface
export interface Provider {
  id: string;
  name: string;
  rank: number;
  scrapeMovie?: (ctx: MovieContext) => Promise<RunOutput>;
  scrapeShow?: (ctx: ShowContext) => Promise<RunOutput>;
}

export interface ProviderBuilder extends Provider {
  id: string;
  name: string;
  rank: number;
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

// تحديث السياقات
export interface MovieContext {
  media: Media;
  fetcher: Fetcher;
}

export interface ShowContext extends MovieContext {
  season: number;
  episode: number;
}

export type Targets = "browser" | "node" | "any";

export interface Flags {
  target: Targets;
  debug?: boolean;
}
