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

  object<T>(input: string): CollectionObject<T> {
    return new CollectionObject(this.#data[input]);
  }
}

export class CollectionObject<T> {
  #collection: T;

  constructor(collection: T) {
    this.#collection = collection;
  }

  public field(input: string): T[keyof T] {
    return this.#collection[input];
  }

  public array<T>(input: string): Collection<T> {
    return new Collection(this.#collection[input]);
  }

  public object<T>(input: string): CollectionObject<T> {
    return new CollectionObject(this.#collection[input]);
  }

  toString(): string {
    return JSON.stringify(this.#collection);
  }
}

export class Collection<T> {
  #collection: T[];

  constructor(collection: T) {
    if (Array.isArray(collection)) {
      this.#collection = collection;
    } else {
      this.#collection = [collection];
    }
  }

  public first(): CollectionObject<T> {
    return new CollectionObject(this.#collection[0]);
  }

  public array<T>(input: string): Collection<T> {
    return new Collection(this.#collection[input]);
  }

  public object<T>(input: string): CollectionObject<T> {
    return new CollectionObject(this.#collection[input]);
  }

  public find(fields: {[key: string]: string | FieldType}): this {
    this.#collection = this.#collection.filter((item: T) => {
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
          results.push(item[key].trim() == value.trim());
          continue;
        }

        if ((value as unknown) instanceof FieldType) {
          const fieldType = (value as FieldType).type;

          switch (fieldType) {
            case "array":
              results.push(Array.isArray(item[key]));
              break;
            case "boolean":
              results.push(typeof item[key] == "boolean");
              break;
            case "date":
              try {
                if (
                  typeof item[key] !== "boolean"
                  && typeof item[key] !== "number"
                  && typeof item[key] !== "object"
                ) {
                  const date = (new Date(item[key])).toISOString();
                  results.push(true);
                } else {
                  results.push(false);
                }
              } catch (error) {
                results.push(false);
              }
              break;
            case "number":
              results.push(typeof item[key] == "number");
              break;
            case "object":
              results.push(
                typeof item[key] == "object"
                && !Array.isArray(item[key])
              );
              break;
            case "string":
              results.push(typeof item[key] == "string");
              break;
            default:
              results.push(false);
              break;
          }

          continue;
        }

        results.push(false);
      }

      const test = (results.indexOf(false) == -1)
        && (results.length == Object.keys(fields).length);
      return test;
    });

    return this;
  }

  public findOne(fields: {[key: string]: string | FieldType }): CollectionObject<T> {
    this.find(fields);
    return new CollectionObject(this.#collection[0]);
  }
}

