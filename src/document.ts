import { Collection } from "./collection";

/**
 * This class is responsible for turning JSON strings into parsable documents.
 * The term "documents" was taken from MongoDB.
 */
export class Document<T> {

  #data: T;

  //////////////////////////////////////////////////////////////////////////////
  // FILE MARKER - CONSTRUCTOR /////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  constructor(data: string) {
    this.#data = JSON.parse(data);
  }

  //////////////////////////////////////////////////////////////////////////////
  // FILE MARKER - PUBLIC METHODS //////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Get a field from the document.
   *
   * @returns The value of the field.
   */
  get<T>(input: string): T {
    return this.#data[input] as unknown as T;
  }

  /**
   * Get a field that is an array from the document.
   *
   * @returns A Collection that is searchable.
   */
  array<T>(input: string): Collection<T> {
    return new Collection(this.#data[input]);
  }

  /**
   * Get a field that is an object from the document.
   *
   * @returns A Collection that is searchable.
   */
  object<T>(input: string): Collection<T> {
    return new Collection(this.#data[input]);
  }
}
