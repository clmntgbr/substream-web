export interface MercureMessage<T = unknown> {
  type: string;
  data: T;
  topic: string;
}

export interface MercureOptions {
  topics: string[];
  onMessage: (message: MercureMessage) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  enabled?: boolean;
}

export interface MercureHubConfig {
  url: string;
  jwtSecret: string;
}
