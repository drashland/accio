import { FieldType } from "./field_type.ts";
import { Collection } from "./collection.ts";
import * as Types from "./types.ts";

export function accio<T>(json: unknown): Collection<T> {
  if (typeof json === "string") {
    return new Collection<T>(JSON.parse(json));
  }

  return new Collection<T>(json as T);
}

export const FieldTypes = {
  Array: new FieldType("array"),
  Boolean: new FieldType("boolean"),
  Date: new FieldType("date"),
  Object: new FieldType("object"),
  Number: new FieldType("number"),
  String: new FieldType("string"),
  NotDate: new FieldType("not_date"),
};

export { Types };
