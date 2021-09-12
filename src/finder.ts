import { FieldType } from "./field_type";

export class Finder {
  /**
   * Find objects in the given data.
   *
   * @param fields - A set of fields to "query" each object in the data.
   *
   * @returns The matched objects in an array.
   */
  public find<T>(data: T[], fields: { [field: string]: unknown }): T[] {
  }
}
