# API Reference

## Functions

### accio(json: string)

* Description
    * This functions turns a JSON string into a searchable `Collection`. 
* Example
    ```typescript
    import { accio } from "@drashland/accio";
    import { readFileSync } from "fs";

    const data = readFileSync("./data.json", "utf-8");

    const collection = accio(data); // The JSON data is now a searchable collection
    ```

## Classes

### Collection

This is a searchable object with methods to help you narrow down your search to a specific item within the collection.

A collection is a class that wraps itself around an array or object. When constructed, the array or object is stored in the collection's `data` property. This data property is searched in the collection's methods.

#### Methods

##### `.array(input: string): Collection`

* Description
    * This method targets an array in the collection _that is an object_ so that you can search it further.
* Returns
    * A `Collection` object that can be searched further. If this is the array you want to get, then you can call `.get()` on the `Collection` and it will return the array.
* Example
    ```typescript
    import { accio } from "@drashland/accio";
    
    const data = JSON.stringify({
      field_1: {
        field_1_1: ["hello from field_1_1"]
      },
      field_2: "hello world",
      field_3: ["hello"],
    });

    const array = accio(data)
      .object("field_1")       // Target the object with the name "field_1"
      .array("field_1_1");     // Target the array in the object with the name "field_1_1"

    console.log(array); // Outputs Collection {}
    console.log(array.get()); // Outputs [ "hello from field_1_1" ]
    ```

##### `.find(fields: {[k: string]: unknown}): this`

* Description
    * This method finds objects in the collection _that is an array_ that match the given fields so that you can search them further.
* Returns
    * The `Collection` object that it searched so you can search it further using any `Collection` method. If the items it found are the items you want to get, then you can call `.get()` on the `Collection` and it will return the items in an array.
* Example
    ```typescript
    import { accio } from "@drashland/accio";
    
    const data = JSON.stringify({
      field_1: {
        field_1_1: ["hello from field_1_1"]
      },
      field_2: "hello world",
      field_3: [
        {
          name: "hello",
          slug: "world_1",
        },
        {
          name: "world",
          slug: "world_1",
        },
        {
          name: "world",
          slug: "world_2",
        },
      ],
    });

    const result = accio(data)
      .array("field_3")         // Target the array with the name "field_3"
      .find({                   // In that array, find all objects with a "name" field ...
        name: "world"           // ... that has a value of "world"
      });

    console.log(result); // Outputs Collection {}
    console.log(result.get()); // Outputs [ { name: "world", slug: "world_1" }, { name: "world", slug: "world_2" } ]
    ```

##### `.findOne(fields: {[k: string]: unknown}): Collection`

* Description
    * This method finds objects in the collection _that is an array_ that match the given fields so that you can search them further.
* Returns
    * The first item that matched the fields as a `Collection` _that is an object_. If this is the object you want to get, then you can call `.get()` on the `Collection` and it will return the object.
* Example
    ```typescript
    import { accio } from "@drashland/accio";
    
    const data = JSON.stringify({
      field_1: {
        field_1_1: ["hello from field_1_1"]
      },
      field_2: "hello world",
      field_3: [
        {
          name: "hello",
          slug: "world_1",
        },
        {
          name: "world",
          slug: "world_1",
        },
        {
          name: "world",
          slug: "world_2",
        },
      ],
    });

    const result = accio(data)
      .array("field_3")         // Target the array with the name "field_3"
      .findOne({                // In that array, find the first matching object with a "name" field ...
        name: "world"           // ... that has a value of "world"
      });

    console.log(result); // Outputs Collection {}
    console.log(result.get()); // Outputs { name: "world", slug: "world_1" }
    ```

##### `.first(): Collection`

* Description
    * This method returns the first item in the `Collection` _that is an array_ so that you can search it further.
* Returns
    * The first item in the `Collection` _that is an array_. If this is the object you want to get, then you can call `.get()` on the `Collection` and it will return the object.
* Example
    ```typescript
    import { accio } from "@drashland/accio";
    
    const data = JSON.stringify({
      field_1: {
        field_1_1: ["hello from field_1_1"]
      },
      field_2: "hello world",
      field_3: [
        {
          name: "hello",
          slug: "world_1",
        },
        {
          name: "world",
          slug: "world_1",
        },
        {
          name: "world",
          slug: "world_2",
        },
      ],
    });

    const result = accio(data)
      .array("field_3")         // Target the array with the name "field_3"
      .first();                 // Get the first item in the array

    console.log(result); // Outputs Collection {}
    console.log(result.get()); // Outputs { name: "world", slug: "world_1" }
    ```

##### `.get()`

* Description
    * This method gets the collection in its raw form.
* Returns
    * The collection in its raw form. If the collection is an array, then it returns an array. If the collection is an object, then it returns an object.
* Example
    ```typescript
    import { accio } from "@drashland/accio";

    const data = JSON.stringify({
      field_1: {"hello": "world"},
      field_2: "hello world",
      field_3: ["hello"],
    });

    const array = accio(data)
      .array("field_3");

    console.log(array.get()); // Outputs [ "hello" ]

    const object = doc
      .object("field_1");

    console.log(object.get()); // Outputs { hello: "world" }
    ```

##### `.object(input: string): Collection`

* Description
    * This method targets an object in the collection _that is an object_ so that you can search it further.
* Returns
    * A `Collection` object that can be searched further. If this is the object you want to get, then you can call `.get()` on the `Collection` and it will return the object.
* Example
    ```typescript
    import { accio } from "@drashland/accio";
    
    const data = JSON.stringify({
      field_1: {
        field_1_1: {
          field_1_1_1: ["hello from field_1_1_1"],
        }
      },
      field_2: "hello world",
      field_3: [
        {
          name: "hello",
          slug: "world_1",
        },
        {
          name: "world",
          slug: "world_1",
        },
        {
          name: "world",
          slug: "world_2",
        },
      ],
    });

    const result = accio(data)
      .object("field_1")        // Target the object with the name "field_1"
      .object("field_1_1");     // In that object, target the object with the name "field_1_1"

    console.log(result); // Outputs Collection {}
    console.log(result.get()); // Outputs { field_1_1_1: [ "hello from field_1_1_1" ] }
    ```

##### `.stringify()`

* Description
    * This method calls `JSON.stringify()` on the collection.
* Returns
    * A JSON string.
* Example
    ```typescript
    import { accio } from "@drashland/accio";

    const data = JSON.stringify({
      field_1: {
        field_1_1: {
          field_1_1_1: ["hello from field_1_1_1"],
        }
      },
      field_2: "hello world",
      field_3: [
        {
          name: "hello",
          slug: "world_1",
        },
        {
          name: "world",
          slug: "world_1",
        },
        {
          name: "world",
          slug: "world_2",
        },
      ],
    });

    const result = accio(data)
      .object("field_1")        // Target the object with the name "field_1"
      .object("field_1_1")      // In that object, target the object with the name "field_1_1"
      .stringify();             // Call JSON.stringify() on "field_1_1"

    console.log(result); // Outputs {"field_1_1_1":["hello from field_1_1_1"]}
    ```
