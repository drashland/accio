import { FieldType } from "./field_type";

type TQueryFields = {
  [k: string]: unknown;
};

type TSearchResult = {
  location: string;
  value: unknown
}

/**
 * This class is responsible for turning fields into searchable objects. The
 * term "collection" comes from Laravel.
 */
export class Collection<T> {
  #data: T[];
  #data_original: T[];
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

    this.#data_original = this.#data;
  }

  //////////////////////////////////////////////////////////////////////////////
  // FILE MARKER - PUBLIC METHODS //////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

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
  public find(fields: TQueryFields): this {
    this.#data = this.#data.filter((item: T) => {
      const results = this.#queryItem(item, fields);
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
  public findOne<T>(fields: TQueryFields): Collection<T> {
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
   * Get the results from the search(es).
   *
   * @returns The data in the form of the T generic.
   */
  public get<T>(): T {
    if (this.#original_object_type == "non-array") {
      return this.#data[0] as unknown as T;
    }
    return this.#data as unknown as T;
  }

  /**
   * Target the item in this collection
   * 
   * @param index - The index of the item in the data.
   * 
   * @returns The item.
   */
  public index(index: number): Collection<T> {
    if (this.#original_object_type != "array") {
      throw new Error(`Cannot call 'index()' on a collection that is not an array.`);
    }

    return new Collection<T>(this.#data[index]);
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

  public search(
    fields: TQueryFields,
    results: TSearchResult[] = []
  ): Collection<TSearchResult[]> {
    if (this.#original_object_type == "non-array") {
      return new Collection<TSearchResult[]>(this.#searchObject(this.#data[0], fields, "top", results));
    }

    return new Collection<TSearchResult[]>(this.#searchArray(this.#data, fields, "top", results));
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

  /**
   * Based on the evaluations, does the item that was queried in
   * `this.#queryItem()` pass the query?
   * 
   * @param evaluations - A results set.
   * @param fields - The fields that were used to query the item.
   * 
   * @returns True if the item passes the query, false if not.
   */
  #passesQuery(evaluations: boolean[], fields: TQueryFields): boolean {
    return (evaluations.indexOf(false) == -1)
      && (evaluations.length >= Object.keys(fields).length);
  }

  /**
   * Query the item in question to see if it matches the fields.
   * 
   * @param item - The item in quesiton.
   * @param fields - The fields to query the item against.
   * 
   * @returns A results set that can be further evaluated to see if the item
   * matches the fields.
   */
  #queryItem(item: T, fields: { [field: string]: unknown }): boolean[] {
    let results: boolean[] = [];

    if (!item || typeof item != "object") {
      results.push(false);
      return results;
    }

    // Test the item
    for (const field in fields) {
      const objectValue = item[field as keyof T];

      if (!objectValue) {
        results.push(false);
        continue;
      }

      const queryValue = fields[field];

      if (typeof queryValue == "boolean") {
        if (typeof objectValue == "boolean") {
          results.push(objectValue == queryValue);
        } else {
          results.push(false);
        }
        continue;
      }

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

    return results;
  }

  /**
   * Search the given array for items that match the fields.
   *
   * @param array - The array to search.
   * @param fields - The fields to use to query items in the array.
   * @param location - The current location of the search.
   * @param results - The set of results that matched the fields.
   * 
   * @returns All results that matched the fields.
   */
  #searchArray(
    array: T[],
    fields: TQueryFields,
    location: string,
    results: TSearchResult[] = []
  ): TSearchResult[] {
    array.forEach((item: T, index: number) => {

      if (Array.isArray(item)) {
        results.concat(
          this.#searchArray(
            item,
            fields,
            location,
            results,
          )
        );
      }

      if (!Array.isArray(item) && typeof item == "object") {
        // Firstly, does this object meet the query? If so, then add it to the
        // results
        if (this.#passesQuery(this.#queryItem(item, fields), fields)) {
          results.push({
            location: `${location}[${index}]`,
            value: item
          });
        }

        // Next, search this object recursively to find all items that match the
        // query and add them to the results
        results.concat(
          this.#searchObject(
            item,
            fields,
            `${location}[${index}]`,
            results,
          )
        );
      }
    });

    return results;
  }

  /**
   * Search the given object for items that match the fields.
   *
   * @param object - The object to search.
   * @param fields - The fields to use to query items in the array.
   * @param location - The current location of the search.
   * @param results - The set of results that matched the fields.
   * 
   * @returns All results that matched the fields.
   */
  #searchObject(
    object: T,
    fields: TQueryFields,
    location: string,
    results: TSearchResult[] = []
  ): TSearchResult[] {
    for (const itemField in object) {
      const objectValue = object[itemField as keyof T];

      // Firstly, does this object meet the query? If so, then add it to the
      // results.
      if (this.#passesQuery(this.#queryItem(objectValue as unknown as T, fields), fields)) {
        results.push({
          location: `${location}.${itemField}`,
          value: objectValue
        });
      }

      if (Array.isArray(objectValue)) {
        results.concat(
          this.#searchArray(
            objectValue as unknown as T[],
            fields,
            `${location}.${itemField}`,
            results,
          )
        );
      }

      if (!Array.isArray(objectValue) && typeof objectValue == "object") {
        results.concat(
          this.#searchObject(
            objectValue as unknown as T,
            fields,
            `${location}.${itemField}`,
            results,
          )
        );
      }
    }

    return results;
  }
}
