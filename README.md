# Accio

An easy way to search for deeply nested data in large datasets

## Quickstart

### Quickstart: Node - JavaScript

1. Initialize your project as a Node project.

    ```
    $ npm init -y
    ```

    _Note: `-y` skips all of the prompts._

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

## API

`.object(field: string)`

Get a field that is an object. You can call `object`, `array()` or `field()` on this object.

`.array(field: string)`

Get a field that is an array. You can call `find()`, `findOne()`, or `first()` on this array.

`.find(fields: {[key: string]: string | FieldType})`

Find objects in an array that match the fields. For example, `.find({ id: 1 })` will find and return all objects in an array with an `id` of `1`.

`.findOne(fields: {[key: string]: string | FieldType})`

Find the first object that matches the fields. For example, `.findOne({ id: 1 })` will find and return the first object that has an `id` of `1`.

`.first()`

This can only be called after `.array()`, `find()`, and `findOne()`. It gets the first item from the array.

`.field()`

Get a field's value in an object. For example, calling `object("test").field("hello")` on `{ test: { hello: "world" } }` will return `world`.
