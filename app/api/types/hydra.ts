export interface HydraView {
  "@id": string;
  "@type": string;
  first?: string;
  last?: string;
  next?: string;
  previous?: string;
}

export interface HydraResponse<TData> {
  "@context": string;
  "@id": string;
  "@type": string;
  member: TData[];
  totalItems: number;
  view?: HydraView;
}
