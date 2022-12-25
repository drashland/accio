# Quickstart: Deno - JavaScript

1. Create your `data.json` file. You can copy the
   [`example_data.json`](../../example_data.json) file from this repository.

2. Create your `app.js` file.

   ```javascript
   import { accio } from "https://unpkg.com/@drashland/accio@1.2.0/lib/esm/accio.js";
   const decoder = new TextDecoder();

   const data = decoder.decode(Deno.readFileSync("./data.json"));

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
     .first() // Target the first object in the array
     .get(); // Finally, get the item

   console.log(result.type);
   console.log(result.text);
   ```

3. Run your `app.js` file.

   ```
   $ deno run --allow-read app.js
   ```

   You should see the following:

   ```
   bullet
   Fix issue with date objects not being correctly validated.
   ```
