import { accio, Types } from "../../../src/accio";

const data = JSON.stringify([
  [
    {
      1: "Nested 2 deep in array"
    }
  ],
  {
    5: [
      {
        4: [
          {
            3: [
              {
                2: [
                  {
                    1: "Nested 5 deep",
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
                1: "Nested 5 deep array",
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
            1: "Nested 3 deep boolean",
          },
        ],
      },
    ],
  },
  {
    4: "2021-09-10T00:57:00.474Z",
    3: [
      {
        2: [
          {
            1: ["Nested 3 deep date"],
          },
        ],
      },
    ],
  },
  {
    4: 4.4,
    3: [
      {
        2: [
          {
            1: "Nested 3 deep number",
          },
        ],
      },
    ],
  },
  {
    4: {},
    3: [
      {
        2: [
          {
            1: "Nested 3 deep object",
          },
        ],
      },
    ],
  },
  {
    4: "some string",
    3: [
      {
        2: [
          {
            1: ["Nested 3 deep array some string"],
          },
        ],
      },
    ],
  },
]);

describe("accio.ts: data is an array", () => {
  it("handles arrays: simple", () => {
    const result = accio(data)
      .index(1)
      .array("5")
      .first()
      .array("4")
      .first()
      .array("3")
      .first()
      .array("2")
      .first()
      .get<{ 1: string }>();

    // expect(result[1]).toBe("Nested 5 deep");
  });

  it("handles arrays: complex (Types.Array)", () => {
    const onArrayField = accio(data)
      .findOne({
        4: [Types.Array],
      })
      .array("4")
      .first()
      .array("3")
      .first()
      .array("2")
      .first()
      .get<{ 1: string }>();

    expect(onArrayField[1]).toBe("Nested 5 deep array");
  });

  it("handles arrays: complex (Types.Boolean)", () => {
    const onBooleanField = accio(data)
      .findOne({
        4: [Types.Boolean],
      })
      .array("3")
      .first()
      .array("2")
      .findOne({
        1: [Types.String],
      })
      .get<{ 1: string }>();

    expect(onBooleanField[1]).toBe("Nested 3 deep boolean");
  });

  it("handles arrays: complex (Types.Date)", () => {
    const onDateField = accio(data)
      .findOne({
        4: [Types.Date],
      })
      .array("3")
      .first()
      .array("2")
      .findOne({
        1: [Types.Array],
      })
      .get<{ 1: string }>();

    expect(onDateField[1]).toStrictEqual(["Nested 3 deep date"]);
  });

  it("handles arrays: complex (Types.Number)", () => {
    const onNumberField = accio(data)
      .findOne({
        4: [Types.Number],
      })
      .array("3")
      .first()
      .array("2")
      .findOne({
        1: [Types.String],
      })
      .get<{ 1: string }>();

    expect(onNumberField[1]).toBe("Nested 3 deep number");
  });

  it("handles arrays: complex (Types.Object)", () => {
    const onObjectField = accio(data)
      .findOne({
        4: [Types.Object],
      })
      .array("3")
      .findOne({
        2: [Types.Array],
      })
      .array("2")
      .findOne({
        1: [Types.String],
      })
      .get<{ 1: string }>();

    expect(onObjectField[1]).toStrictEqual("Nested 3 deep object");
  });

  it("handles arrays: complex (Types.String && Types.NotDate)", () => {
    const onStringField = accio(data)
      .find({
        4: [Types.String, Types.NotDate],
      })
      .first()
      .array("3")
      .first()
      .array("2")
      .findOne({
        1: [Types.Array],
      })
      .get<{ 1: string }>();

    expect(onStringField[1]).toStrictEqual([
      "Nested 3 deep array some string",
    ]);
  });

  it("searches arrays", () => {
    const results = accio(data)
      .search({
        1: [Types.String],
      })
      .stringify();

    // console.log(accio(data).search({1: [Types.String]}).get());
      
    expect(results).toBe(`[{\"location\":\"top[0]\",\"value\":{\"1\":\"Nested 2 deep in array\"}},{\"location\":\"top[1].5[0].4[0].3[0].2[0]\",\"value\":{\"1\":\"Nested 5 deep\"}},{\"location\":\"top[2].4[0].3[0].2[0]\",\"value\":{\"1\":\"Nested 5 deep array\"}},{\"location\":\"top[3].3[0].2[0]\",\"value\":{\"1\":\"Nested 3 deep boolean\"}},{\"location\":\"top[5].3[0].2[0]\",\"value\":{\"1\":\"Nested 3 deep number\"}},{\"location\":\"top[6].3[0].2[0]\",\"value\":{\"1\":\"Nested 3 deep object\"}}]`);
  });
});
