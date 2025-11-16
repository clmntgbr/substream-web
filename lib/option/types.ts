export interface Option {
  id: string;
  subtitleFont: string;
  subtitleSize: number;
  subtitleColor: string;
  subtitleBold: boolean;
  subtitleItalic: boolean;
  subtitleUnderline: boolean;
  subtitleOutlineColor: string;
  subtitleOutlineThickness: number;
  subtitleShadow: number;
  subtitleShadowColor: string;
  format: string;
  chunkNumber: number;
  yAxisAlignment: number;
  isResume: boolean;
  language: string;
}

export interface OptionState {
  option: Option | null;
  loading: boolean;
  error: string | null;
}

export type OptionAction =
  | { type: "CREATE_OPTION_SUCCESS"; payload: Option | null }
  | { type: "CREATE_OPTION_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };
