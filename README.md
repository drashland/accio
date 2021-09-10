# Accio

An easy way to search for deeply nested data in large datasets

## Quickstart

### Quickstart: Node - JavaScript

1. Initialize your project as a Node project.

    ```
    $ npm init -y
    ```

    _Note: `-y` skips all of the prompts.

2. Install Accio.

    ```
    $ npm install @drashland/accio
    ```

3. Create your `dataset.json` file.

    ```json
    {
      "project": "Accio",
      "type": "Package",
      "organization": "Drash Land",
      "versions": [
        {
          "name": "v0.0.3",
          "release_notes": [
            {
              "title": "Features",
              "body": [
                "Add support for arrays.",
                "Add support for objects."
              ]
            },
            {
              "title": "Bug Fixes",
              "body": [
                "Fix issue with date objects not being correctly validated.",
                "Fix issue with collections not being stored as arrays."
              ]
            }
          ]
        },
        {
          "name": "v0.0.2",
          "release_notes": [
            {
              "title": "Features",
              "body": [
                "Add ability to find an object in an array based on a field's type."
              ]
            },
            {
              "title": "Bug Fixes",
              "body": [
                "Fix issue with first() not being callable on nested arrays."
              ]
            }
          ]
        }
        {
          "name": "v0.0.1",
          "release_notes": [
            {
              "title": "Features",
              "body": [
                "Add support for booleans.",
                "Add support for dates.",
                "Add support for numbers.",
                "Add support for strings."
              ]
            }
          ]
        }
      ],
      "maintainers": [
        {
          "name": "Eric"
        },
        {
          "name": "Breno"
        },
        {
          "name": "Ed"
        },
        {
          "name": "Sara"
        }
      ]
    }
    ```

4. Create your `app.js` file and `require` your `dataset.json` file.

    ```javascript
    const accio = require("accio");
    const fs = require("fs");
    const json = fs.readFileSync("./dataset.json", "utf-8");
    
    const data = accio(json);
    
    // Try to find the `body` in the `release_notes` of an object with `name: "v0.0.2"`
    // in the `versions` of the dataset
    const result = data
      .array("versions")
      .findOne({
        name: "v0.0.2",
      })
      .array("release_notes")
      .findOne({
        title: "Bug Fixes",
      })
      .field("body")
      
    console.log(result);
    ```

5. Run your `app.js` file.

    ```
    $ node app.js
    ```
    
    You should see the following output:
    
    ```
    ["Fix issue with first() not beeing callable on nested arrays."]
    ```
