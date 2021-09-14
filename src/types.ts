export type TQueryFields = {
  [k: string]: unknown;
};

export type TSearchOptions = {
  projection?: Array<number | string>;
  flatten?: boolean;
};

export type TSearchResult = {
  location?: string;
  value?: unknown;
};
