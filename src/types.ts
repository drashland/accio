export type TQueryFields = {
  [k: string]: unknown;
};

export type TSearchOptions = {
  projection?: Array<number | string>;
  flatten?: boolean;
  transformer?: (result: TSearchResult) => TSearchResult;
};

export type TSearchResult = {
  [key: string]: unknown;
  location?: string;
  value?: unknown;
};
