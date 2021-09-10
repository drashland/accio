import { Document } from "../../../src/document";
import { Types } from "../../../src/accio";

const data = JSON.stringify({
  objects: {
    1: "Nested 1 deep",
    2: {
      1: "Nested 2 deep",
    },
    3: {
      2: {
        1: "Nested 3 deep",
      },
      1: {
        1: "Nested 3 deep",
      },
    },
    4: {
      3: {
        2: {
          1: "Nested 4 deep",
        },
      },
      2: {
        2: {
          1: "Nested 4 deep",
        },
      },
      1: {
        1: "Nested 3 deep",
      },
    },
    5: {
      4: {
        3: {
          2: {
            1: "Nested 5 deep",
          },
        },
      },
      3: {
        3: {
          2: {
            1: "Nested 5 deep",
          },
        },
      },
      2: {
        1: "Nested 3 deep",
      },
      1: {
        1: "Nested 3 deep",
      },
    },
  },
  arrays: [
    {
      5: [
        {
          4: [
            {
              3: [
                {
                  2: [
                    {
                      1: "Nested 5 deep"
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      4: [
        {
          3: [
            {
              2: [
                {
                  1: "Nested 5 deep array"
                },
              ],
            },
          ],
        },
      ],
    },
    {
      4: true,
      3: [
        {
          2: [
            {
              1: "Nested 3 deep boolean"
            }
          ]
        }
      ]
    },
    {
      4: "2021-09-10T00:57:00.474Z",
      3: [
        {
          2: [
            {
              1: ["Nested 3 deep date"]
            }
          ]
        }
      ]
    },
    {
      4: 4.4,
      3: [
        {
          2: [
            {
              1: "Nested 3 deep number"
            }
          ]
        }
      ]
    },
    {
      4: {},
      3: [
        {
          2: [
            {
              1: "Nested 3 deep object"
            }
          ]
        }
      ]
    },
    {
      4: "some string",
      3: [
        {
          2: [
            {
              1: ["Nested 3 deep array some string"]
            }
          ]
        }
      ]
    },
  ]
});

const doc = new Document(data);

describe("document.ts", () => {
  describe("field()", () => {
    it("handles objects", () => {
      let result = doc
        .object("objects")
        .field("1");
      expect(result).toBe("Nested 1 deep")

      result = doc
        .object("objects")
        .object("2")
        .field("1");
      expect(result).toBe("Nested 2 deep")

      result = doc
        .object("objects")
        .object("3")
        .object("2")
        .field("1");
      expect(result).toBe("Nested 3 deep")

      result = doc
        .object("objects")
        .object("4")
        .object("3")
        .object("2")
        .field("1");
      expect(result).toBe("Nested 4 deep")

      result = doc
        .object("objects")
        .object("5")
        .object("4")
        .object("3")
        .object("2")
        .field("1");
      expect(result).toBe("Nested 5 deep")
    });

    it("handles arrays: simple", () => {
      const result = doc
        .array("arrays")
        .first()
        .array("5")
        .first()
        .array("4")
        .first()
        .array("3")
        .first()
        .array("2")
        .first()
        .field("1")

      expect(result).toBe("Nested 5 deep");
    });

    it("handles arrays: complex (Types.Array)", () => {
      const onArrayField = doc
        .array("arrays")
        .findOne({
          4: Types.Array
        })
        .array("4")
        .first()
        .array("3")
        .first()
        .array("2")
        .first()
        .field("1")

      expect(onArrayField).toBe("Nested 5 deep array");
    });

    it("handles arrays: complex (Types.Boolean)", () => {
      const onBooleanField = doc
        .array("arrays")
        .findOne({
          4: Types.Boolean
        })
        .array("3")
        .first()
        .array("2")
        .findOne({
          1: Types.String
        })
        .field("1");

      expect(onBooleanField).toBe("Nested 3 deep boolean");
    });

    it("handles arrays: complex (Types.Date)", () => {
      const onDateField = doc
      .array("arrays")
      .findOne({
        4: Types.Date
      })
      .array("3")
      .first()
      .array("2")
      .findOne({
        1: Types.Array
      })
      .field("1");

      expect(onDateField).toStrictEqual(["Nested 3 deep date"]);
    });

    it("handles arrays: complex (Types.Number)", () => {
      const onNumberField = doc
      .array("arrays")
      .findOne({
        4: Types.Number
      })
      .array("3")
      .first()
      .array("2")
      .findOne({
        1: Types.String
      })
      .field("1");

      expect(onNumberField).toBe("Nested 3 deep number");
    });

    it("handles arrays: complex (Types.Object)", () => {
      const onObjectField = doc
      .array("arrays")
      .findOne({
        4: Types.Object
      })
      .array("3")
      .first()
      .array("2")
      .findOne({
        1: Types.String
      })
      .field("1");

      expect(onObjectField).toStrictEqual("Nested 3 deep object");
    });

    // it("handles arrays: complex (Types.String)", () => {
    //   const onStringField = doc
    //   .array("arrays")
    //   .find({
    //     4: Types.String,
    //   })
    //   .first()
    //   .array("3")
    //   .first()
    //   .array("2")
    //   .findOne({
    //     1: Types.String
    //   })
    //   .field("1");

    //   expect(onStringField).toBe("Nested 3 deep");
    // });
  });
});
