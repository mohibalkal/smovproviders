export interface Fetcher {
  (url: string, options?: FetcherOptions): Promise<FetcherResponse>;
}

export interface FetcherOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  query?: Record<string, string>;
  readHeaders?: string[];
}

export interface FetcherResponse {
  ok: boolean;
  status: number;
  headers: Headers;
  text(): Promise<string>;
  json(): Promise<any>;
  finalUrl?: string;
  body?: any;
}

export interface Stream {
  type: "file" | "hls";
  qualities?: Record<string, { type: "mp4"; url: string }>;
  playlist?: string;
  headers?: Record<string, string>;
}

export interface RunOutput {
  stream: Stream | Stream[];
  embeds?: string[];
}

export interface ProviderMakerOptions {
  fetcher: Fetcher;
  proxiedFetcher: Fetcher;
}

export interface ProviderBuilder {
  id: string;
  name: string;
  rank: number;
  scrapeMovie?: (ctx: any) => Promise<RunOutput>;
  scrapeShow?: (ctx: any) => Promise<RunOutput>;
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
