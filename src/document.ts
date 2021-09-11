import { FieldType } from "./field_type";

export class Document<T> {

  #data: T;

  constructor(data: string) {
    this.#data = JSON.parse(data);
  }

  field(input: string): T[keyof T] {
    return this.#data[input];
  }

  array<T>(input: string): Collection<T> {
    return new Collection(this.#data[input]);
  }

  object<T>(input: string): Collection<T> {
    return new Collection(this.#data[input]);
  }
}

export class Collection<T> {
  #data: T[];
  #original_object_type: string;

  constructor(collection: T) {
    if (Array.isArray(collection)) {
      this.#original_object_type = "array";
      this.#data = collection;
    } else {
      this.#original_object_type = "non-array";
      this.#data = [collection];
    }
  }

  get<T>(): T {
    if (this.#original_object_type == "non-array") {
      return this.#data[0] as unknown as T;
    }
    return this.#data as unknown as T;
  }

  public first(): Collection<T> {
    return new Collection<T>(this.#data[0]);
  }

  public array<T>(input: string): Collection<T> {
    return new Collection<T>(this.#data[0][input]);
  }

  public object<T>(input: string): Collection<T> {
    return new Collection<T>(this.#data[0][input]);
  }

  public find(fields: {[key: string]: unknown}): this {
    this.#data = this.#data.filter((item: T) => {
      let results = [];

      // Test the item
      for (const key in fields) {

        if (!item[key]) {
          results.push(false);
          continue;
        }

        const value = fields[key];

        if (typeof value == "number") {
          results.push(item[key] == value);
          continue;
        }

        if (typeof value == "string") {
          results.push(item[key] == value.trim());
          continue;
        }

        if (Array.isArray(value) && value[0] instanceof FieldType) {
          results = this.#findBasedOnFieldTypes(
            results,
            item,
            key,
            value
          );
          continue;
        }

        results.push(false);
      }

      const test = (results.indexOf(false) == -1)
        && (results.length >= Object.keys(fields).length);
      return test;
    });

    return this;
  }

  #findBasedOnFieldTypes(
    results: boolean[],
    item: T,
    key: string,
    fieldTypes: FieldType[]
  ): boolean[] {
    fieldTypes.forEach((fieldType: FieldType) => {
      let result = false;

      switch (fieldType.type) {
        case "array":
          result = Array.isArray(item[key]);
          break;
        case "boolean":
          result = typeof item[key] == "boolean";
          break;
        case "date":
          result = this.#fieldTypeIsDate(item[key]);
          break;
        case "number":
          result = typeof item[key] == "number";
          break;
        case "not_date":
          result = !this.#fieldTypeIsDate(item[key]);
          break;
        case "object":
          result = this.#fieldTypeIsObject(item[key]);
          break;
        case "string":
          result = typeof item[key] == "string";
          break;
        default:
          result = false;
          break;
      }

      results.push(result);
    });

    return results;
  }

  #fieldTypeIsObject(field: unknown): boolean {
    return typeof field == "object" && !Array.isArray(field);
  }

  #fieldTypeIsDate(field: unknown): boolean {
    try {
      if (
        typeof field !== "boolean"
        && typeof field !== "number"
        && typeof field !== "object"
      ) {
        const date = (new Date(field as string)).toISOString();
        return true;
      }
    } catch (_error) {
      // Do nothing.
    }

    return false;
  }

  public findOne<T>(fields: {[key: string]: unknown }): Collection<T> {
    this.find(fields);
    return new Collection<T>(this.#data[0] as unknown as T);
  }

  public stringify(): string {
    if (this.#original_object_type == "non-array") {
      return JSON.stringify(this.#data[0] as unknown as T);
    }
    return JSON.stringify(this.#data as unknown as T);
  }
}

