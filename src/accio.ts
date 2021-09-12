import { FieldType } from "./field_type";
import { Collection } from "./collection";

export function accio<T>(json: string): Collection<T> {
  const parsed = JSON.parse(json);
  return new Collection<T>(parsed);
}

export const Types = {
  Array: new FieldType("array"),
  Boolean: new FieldType("boolean"),
  Date: new FieldType("date"),
  Object: new FieldType("object"),
  Number: new FieldType("number"),
  String: new FieldType("string"),
  NotDate: new FieldType("not_date"),
};
