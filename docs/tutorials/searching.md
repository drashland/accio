# Searching

Accio has a `.search()` method that you can use to search for items in your dataset. This is useful if you do not know what your dataset looks like, but still want to get items from it.

The `.search()` method returns an array of results. If there are results in the array, they will be in the following format:

```
{
  location: string;  // This field tells you exactly where Accio found the item (top means the beginning of the object)
  value: any;        // This field is the item Accio found at the above location
}
```

## Steps

For simplicity, this tutorial will use Node and JavaScript.

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
    const { accio } = require("../../lib/cjs/accio");
    const { readFileSync } = require("fs");

    const data = readFileSync("./data.json", "utf-8");

    const results = accio(data)
      .search({                  // In the collection, search for all items that have a "title" ...
        title: "Bug Fixes"       // .. field with a value of "Bug Fixes"
      })
      .get();

    console.log(results);
    ```

## Verification

1. Run your `app.js` file.

    ```
    $ node app.js    
    ```
    
    You should see the following:
    
    ```javascript
    [
      {
        location: 'top.versions[0].release_notes[1]',
        value: { title: 'Bug Fixes', body: [Array] }
      },
      {
        location: 'top.versions[1].release_notes[1]',
        value: { title: 'Bug Fixes', body: [Array] }
      }
    ]
    ```

## Options

The `.search()` method takes in an optional `options` object to help you transform your data. The options are as follows:

```javascript
{
  flatten: boolean;                 // Example: true
  projection: Array<number|string>; // Example: [ "1", 2, "3", "four" ]
  transformer: Function;            // Example: (results) => { results.value.map(doSomething) }
}
```

You can use one or all options with the `.search()` method. If you use all options, they will occur in the following order:

* Projection
* Flatten
* Transformer

### Flatten

You can flatten your search results to only return the `value` field in your search results set. For example ...

```javascript
const { accio } = require("../../lib/cjs/accio");
const { readFileSync } = require("fs");

const data = readFileSync("./data.json", "utf-8");

const results = accio(data)
  .search( 
    {
      title: "Bug Fixes"  // In the collection, search for all items that have a "title" field with a value of "Bug Fixes"
    },
    {
      flatten: true       // Return only the value field of the search results
    }
  )
  .get();

console.log(results);

// Outputs the following:
//
//   [
//     { title: 'Bug Fixes', body: [Array] }
//     { title: 'Bug Fixes', body: [Array] }
//   ]
```

### Projection

Just like MongoDB's `projection` option, you can tell the `.search()` method to only return the fields that you are interested in. For example ...

```javascript
const { accio } = require("../../lib/cjs/accio");
const { readFileSync } = require("fs");

const data = readFileSync("./data.json", "utf-8");

const results = accio(data)
  .search( 
    {
      title: "Bug Fixes"  // In the collection, search for all items that have a "title" field with a value of "Bug Fixes"
    },
    {
      projection: [
        "body"            // Return ONLY a body field in the value field of the search results
      ]
    }
  )
  .get();

console.log(results);

// Outputs the following:
//
//   [
//     {
//       location: 'top.versions[0].release_notes[1]',
//       value: { body: [Array] }
//     },
//     {
//       location: 'top.versions[1].release_notes[1]',
//       value: { body: [Array] }
//     }
//   ]
```

### Transformer

If you want to transform your data further, you can use this option to transform your data to your liking.

```javascript
const { accio } = require("../../lib/cjs/accio");
const { readFileSync } = require("fs");

const data = readFileSync("./data.json", "utf-8");

const results = accio(data)
  .search( 
    {
      title: "Bug Fixes"  // In the collection, search for all items that have a "title" field with a value of "Bug Fixes"
    },
    {
      transformer: (result) => {
        if (result.body) {
          result.has_body = true;
        }
      ]
    }
  )
  .get();

console.log(results);

// Outputs the following:
//
//   [
//     {
//       location: 'top.versions[0].release_notes[1]',
//       value: { title: 'Bug Fixes', body: [Array], has_body: true }
//     },
//     {
//       location: 'top.versions[1].release_notes[1]',
//       value: { title: 'Bug Fixes', body: [Array], has_body: true }
//     }
//   ]
```