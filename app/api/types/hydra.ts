export interface HydraResponse<TData> {
  "@context": string;
  "@id": string;
  "@type": string;
  member: TData[];
  totalItems: number;
}
