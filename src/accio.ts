import { FieldType } from "./field_type";
import { Document } from "./document";

export function accio<T>(data: string): Document<T> {
  return new Document<T>(data);
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