# Quickstart: Browser - JavaScript

1. Create your `index.html` file.

    ```html
    <!doctype html>
    <html>
      <head>
        <title>Drash Land - Accio</title>
      </head>
      <body>
        <p>Open up your console to see Accio working.</p>
        <script type="module">
          import { accio } from "https://unpkg.com/@drashland/accio@1.2.0/lib/esm/accio.js";
          (async() => {
            const response = await fetch("https://raw.githubusercontent.com/drashland/accio/main/example_data.json");
            const data = await response.text();

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
              .get();                  // Finally, get the item

            console.log(result.type);
            console.log(result.text);
          })();
        </script>
      </body>
    </html>
    ```

2. Open your `index.html` file so that it opens up in your browser. Once open, open up your browser's console to see Accio working.

    You should see something like the following:
    
    ```
    bullet                                                        index.html:27
    Fix issue with date objects not being correctly validated.    index.html:28
    ```
