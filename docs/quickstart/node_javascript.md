# Quickstart: Node - JavaScript

1. Initialize your project as a Node project.

    ```
    $ npm init -y
    ```

    _Note: `-y` skips all of the prompts._

2. Install Accio.

    ```
    $ npm install @drashland/accio
    ```

3. Create your `data.json` file. You can copy the [`example_data.json`](../../example_data.json) file from this repository.

4. Create your `app.js` file.

    ```javascript
    const { accio } = require("@drashland/accio");
    const { readFileSync } = require("fs");
    
    const data = readFileSync("./data.json", "utf-8");
    const doc = accio(data);
    
    const result = doc
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
      .get();                  // Finally, get the item

    console.log(result.type);
    console.log(result.text);
    ```

5. Run your `app.js` file.

    ```
    $ node app.js
    ```

    You should see the following:

    ```
    bullet
    Fix issue with date objects not being correctly validated.
