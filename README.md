# Accio

An easy way to search for deeply nested data in large datasets

## Quickstart

The below quickstart uses Node and TypeScript. If this quickstart does not fit
your needs, check out the other guides below:

- [Quickstart: Browser - JavaScript](./docs/quickstart/browser_javascript.md)
- [Quickstart: Node - JavaScript](./docs/quickstart/node_javascript.md)
- [Quickstart: Deno - JavaScript](./docs/quickstart/deno_javascript.md)
- [Quickstart: Deno - TypeScript](./docs/quickstart/deno_typescript.md)

### Quickstart: Node - TypeScript

1. Initialize your project as a Node project.

   ```
   $ npm init -y
   ```

   _Note: `-y` skips all of the prompts._

2. Install Accio and the `ts-node` CLI.

   ```
   $ npm install @drashland/accio
   $ npm install -g ts-node
   ```

3. Create your `data.json` file. You can copy the
   [`example_data.json`](./example_data.json) file from this repository.

4. Create your `app.ts` file.

   ```typescript
   import { accio } from "@drashland/accio";
   import { readFileSync } from "fs";

   const data = readFileSync("./data.json", "utf-8");

   const result = accio(data)
     .array("versions") // Target the array named "versions"
     .findOne({ // In the array, find one object that has a name field ...
       name: "v0.0.3", // ... with the value of "v0.0.3"
     })
     .array("release_notes") // In the object, target the array named "release_notes"
     .findOne({ // In the array, find one object that has a title field ...
       title: "Bug Fixes", // ... with the value of "Bug Fixes"
     })
     .array("body") // In the object, target the array named "body"
     .first(); // Target the first object in the array

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
   $ ts-node app.ts
   ```

   You should see the following:

   ```
   bullet
   Fix issue with date objects not being correctly validated.
   ```

## Tutorials

- [Searching](./docs/tutorials/searching.md)
- [Traversing](./docs/tutorials/traversing.md)

## API

View the full API documentation [here](./docs/api_reference.md).

---

Want to contribute? Follow the Contributing Guidelines
[here](https://github.com/drashland/.github/blob/master/CONTRIBUTING.md). All
code is released under the
[MIT License](https://github.com/drashland/deno-drash/blob/main/LICENSE).
