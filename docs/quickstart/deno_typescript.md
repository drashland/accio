# Quickstart: Deno - TypeScript

1. Create your `data.json` file. You can copy the [`example_data.json`](../../example_data.json) file from this repository.

2. Create your `app.ts` file.

    ```typescript
    import { accio } from "https://unpkg.com/@drashland/accio@1.1.1/lib/deno/accio.ts";
    const decoder = new TextDecoder();
    
    const data = decoder.decode(Deno.readFileSync("./data.json"));
    
    const result = accio(data)
      .array("versions")       // Target the array named "versions"
      .findOne({               // In the array, find one object that has a name field ...
        name: "v0.0.3",        // ... with the value of "v0.0.3"
      })
      .array("release_notes")  // In the object, target the array named "release_notes"
      .findOne({               // In the array, find one object that has a title field ...
        title: "Bug Fixes",    // ... with the value of "Bug Fixes"
      })
      .array("body")           // In the object, target the array named "body"
      .first()                 // Target the first object in the array

    // Create the typing for the result
    type SomeType = {
      type: string;
      text: string;
    };

    // Use the `.get()` call and pass in the typing to get a typed result
    const typedResult = result.get<SomeType>();
    
    console.log(typedResult.type);
    console.log(typedResult.text);
    ```

5. Run your `app.ts` file.

    ```
    $ deno run --allow-read app.ts
    ```

    You should see the following:

    ```
    bullet
    Fix issue with date objects not being correctly validated.
