# Traversing

Accio allows you to traverse through your datasets with the `.object()` and
`.array()` methods.

## Steps

For simplicity, this tutorial will use Node and JavaScript.

Let's say you have the following dataset ...

```
{
  object_1: {
    object_2: {
      array_1: [
        {
          array_2: [
            {
              hello: "world"
            }
          ]
        }
      ]
    }
  }
```

... and you want to get the `hello` field in `array_2`.

1. Initialize your project as a Node project.

   ```
   $ npm init -y
   ```

   _Note: `-y` skips all of the prompts._

2. Install Accio.

   ```
   $ npm install @drashland/accio
   ```

3. Create your `app.js` file.

   ```javascript
   const { accio } = require("@drashland/accio");

   const data = JSON.stringify({
     object_1: {
       object_2: {
         array_1: [
           {
             array_2: [
               {
                 hello: "world",
               },
             ],
           },
         ],
       },
     },
   });

   const result = accio(data)
     .object("object_1") // Target the object named "object_1"
     .object("object_2") // In the object, target the object named "object_2"
     .array("array_1") // In the object, target the array named "array_1"
     .first() // Target the first object in the array
     .array("array_2") // In the object, target the array named "array_2"
     .first() // Target the first object in the array
     .get(); // Finally, get the item

   console.log(result.hello);
   ```

## Verification

1. Run your `app.js` file.

   ```
   $ node app.js
   ```

   You should see the following:

   ```
   world
   ```
