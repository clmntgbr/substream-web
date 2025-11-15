export interface HydraView {
  first?: string;
  last?: string;
  next?: string;
  previous?: string;
}

export interface Hydra<TData> {
  member: TData[];
  totalItems: number;
  view?: HydraView;
}
