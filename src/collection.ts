import { FieldType } from "./field_type";

/**
 * This class is responsible for turning fields in a document into searchable
 * objects. The term "collection" comes from Laravel.
 */
export class Collection<T> {
  #data: T[];
  #original_object_type: string;

  //////////////////////////////////////////////////////////////////////////////
  // FILE MARKER - CONSTRUCTOR /////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  constructor(collection: T) {
    if (Array.isArray(collection)) {
      this.#original_object_type = "array";
      this.#data = collection;
    } else {
      this.#original_object_type = "non-array";
      this.#data = [collection];
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // FILE MARKER - PUBLIC METHODS //////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Get a field.
   */
  get<T>(): T {
    if (this.#original_object_type == "non-array") {
      return this.#data[0] as unknown as T;
    }
    return this.#data as unknown as T;
  }

  /**
   * Get a field that is an array in the collection.
   *
   * @returns The array as a searchable collection.
   */
  public array<T>(input: string): Collection<T> {
    return new Collection<T>(
      (this.#data[0] as unknown as {[k: string]: T})[input]
    );
  }

  /**
   * Find objects in this collection matching the fields.
   *
   * @param fields - A set of fields to "query" each object in the collection.
   *
   * @returns This collection so that it can be searched further.
   */
  public find(fields: { [field: string]: unknown }): this {
    this.#data = this.#data.filter((item: T) => {
      let results: boolean[] = [];

      // Test the item
      for (const field in fields) {
        const objectValue = item[field as keyof T];

        if (!objectValue) {
          results.push(false);
          continue;
        }

        const queryValue = fields[field];

        if (typeof queryValue == "number") {
          if (typeof objectValue == "number") {
            results.push(objectValue == queryValue);
          } else {
            results.push(false);
          }
          continue;
        }

        if (typeof queryValue == "string") {
          if (typeof objectValue == "string") {
            results.push(objectValue == queryValue.trim());
          } else {
            results.push(false);
          }
          continue;
        }

        if (Array.isArray(queryValue) && queryValue[0] instanceof FieldType) {
          results = this.#findBasedOnFieldTypes(
            results,
            objectValue,
            queryValue,
          );
          continue;
        }

        results.push(false);
      }

      const test = (results.indexOf(false) == -1) &&
        (results.length >= Object.keys(fields).length);
      return test;
    });

    return this;
  }

  /**
   * Find an object in this collection matching the fields.
   *
   * @param fields - A set of fields to "query" each object in the collection.
   *
   * @returns The first object in the collection matching the fields.
   */
  public findOne<T>(fields: { [field: string]: unknown }): Collection<T> {
    this.find(fields);
    return new Collection<T>(this.#data[0] as unknown as T);
  }

  /**
   * Get the first field in the collection. The collection must be an array and
   * not an object.
   *
   * @returns The first field as a searchable collection.
   */
  public first(): Collection<T> {
    return new Collection<T>(this.#data[0]);
  }

  /**
   * Get a field that is an object in the collection.
   *
   * @returns The object as a searchable collection.
   */
  public object<T>(input: string): Collection<T> {
    return new Collection<T>(
      (this.#data[0] as unknown as {[k: string]: T})[input]
    );
  }

  /**
   * Stringify this collection.
   *
   * @returns This collection as a string.
   */
  public stringify(): string {
    if (this.#original_object_type == "non-array") {
      return JSON.stringify(this.#data[0] as unknown as T);
    }
    return JSON.stringify(this.#data as unknown as T);
  }

  //////////////////////////////////////////////////////////////////////////////
  // FILE MARKER - PRIVATE METHODS /////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Find an object in this collection based on field types. This is useful if
   * the value of the field being searched is unknown.
   *
   * @param results - The current set of results from `.find()`.
   * @param item - The item containing the field.
   * @param field - The field in the item to evaluate.
   * @param fieldTypes - The field types to use to evaluate the field.
   *
   * @returns An array of test results that determine if the field that was
   * evaluated meets the `fieldTypes` requirements.
   */
  #findBasedOnFieldTypes(
    results: boolean[],
    objectValue: unknown,
    fieldTypes: FieldType[],
  ): boolean[] {
    fieldTypes.forEach((fieldType: FieldType) => {
      let result = false;

      switch (fieldType.type) {
        case "array":
          result = Array.isArray(objectValue);
          break;
        case "boolean":
          result = typeof objectValue == "boolean";
          break;
        case "date":
          result = this.#fieldTypeIsDate(objectValue);
          break;
        case "number":
          result = typeof objectValue == "number";
          break;
        case "not_date":
          result = !this.#fieldTypeIsDate(objectValue);
          break;
        case "object":
          result = this.#fieldTypeIsObject(objectValue);
          break;
        case "string":
          result = typeof objectValue == "string";
          break;
        default:
          result = false;
          break;
      }

      results.push(result);
    });

    return results;
  }

  /**
   * Is the field type a date?
   *
   * @param field - The field to evaluate.
   *
   * @returns True if yes, false if not.
   */
  #fieldTypeIsDate(field: unknown): boolean {
    try {
      if (
        typeof field !== "boolean" &&
        typeof field !== "number" &&
        typeof field !== "object"
      ) {
        const date = (new Date(field as string)).toISOString();
        return true;
      }
    } catch (_error) {
      // Do nothing.
    }

    return false;
  }

  /**
   * Is the field type an object?
   *
   * @param field - The field to evaluate.
   *
   * @returns True if yes, false if not.
   */
  #fieldTypeIsObject(field: unknown): boolean {
    return typeof field == "object" && !Array.isArray(field);
  }
}
