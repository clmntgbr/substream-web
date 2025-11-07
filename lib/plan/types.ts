export interface Plan {
  id?: string;
  name: string;
  price: number;
  interval: string;
  maxVideosPerMonth: number;
  maxSizeInMegabytes: number;
  maxDurationMinutes: number;
  features: string[];
}
