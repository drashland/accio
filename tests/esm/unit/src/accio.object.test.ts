import { accio, FieldTypes } from "../../../../lib/esm/src/accio";

const data = JSON.stringify({
  objects: {
    1: "Nested 1 deep",
    2: {
      1: "Nested 2 deep",
      2: "Next to 1",
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
                      1: "Nested 5 deep",
                      2: "Next to 1",
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
                  2: "Next to 1",
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
              2: "Next to 1",
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
              2: "Next to 1",
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
              2: "Next to 1",
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
              2: "Next to 1",
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
              2: "Next to 1",
            },
          ],
        },
      ],
    },
  ],
});

describe("accio.ts: data is an object", () => {
  it("handles objects: nested 1 deep", () => {
    const result = accio(data)
      .object("objects")
      .get<{ 1: string }>();
    expect(result[1]).toBe("Nested 1 deep");
  });

  it("handles objects: nested 2 deep", () => {
    const result = accio(data)
      .object("objects")
      .object("2")
      .get<{ 1: string }>();
    expect(result[1]).toBe("Nested 2 deep");
  });

  it("handles objects: nested 3 deep", () => {
    const result = accio(data)
      .object("objects")
      .object("3")
      .object("2")
      .get<{ 1: string }>();
    expect(result[1]).toBe("Nested 3 deep");
  });

  it("handles objects: nested 4 deep", () => {
    const result = accio(data)
      .object("objects")
      .object("4")
      .object("3")
      .object("2")
      .get();
    expect(result[1]).toBe("Nested 4 deep");
  });

  it("handles objects: nested 5 deep", () => {
    const result = accio(data)
      .object("objects")
      .object("5")
      .object("4")
      .object("3")
      .object("2")
      .get();
    expect(result[1]).toBe("Nested 5 deep");
  });

  it("handles arrays: simple", () => {
    const result = accio(data)
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
      .get<{ 1: string }>();

    expect(result[1]).toBe("Nested 5 deep");
  });

  it("handles arrays: complex (FieldTypes.Array)", () => {
    const onArrayField = accio(data)
      .array("arrays")
      .findOne({
        4: [FieldTypes.Array],
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

  it("handles arrays: complex (FieldTypes.Boolean)", () => {
    const onBooleanField = accio(data)
      .array("arrays")
      .findOne({
        4: [FieldTypes.Boolean],
      })
      .array("3")
      .first()
      .array("2")
      .findOne({
        1: [FieldTypes.String],
      })
      .get<{ 1: string }>();

    expect(onBooleanField[1]).toBe("Nested 3 deep boolean");
  });

  it("handles arrays: complex (FieldTypes.Date)", () => {
    const onDateField = accio(data)
      .array("arrays")
      .findOne({
        4: [FieldTypes.Date],
      })
      .array("3")
      .first()
      .array("2")
      .findOne({
        1: [FieldTypes.Array],
      })
      .get<{ 1: string }>();

    expect(onDateField[1]).toStrictEqual(["Nested 3 deep date"]);
  });

  it("handles arrays: complex (FieldTypes.Number)", () => {
    const onNumberField = accio(data)
      .array("arrays")
      .findOne({
        4: [FieldTypes.Number],
      })
      .array("3")
      .first()
      .array("2")
      .findOne({
        1: [FieldTypes.String],
      })
      .get<{ 1: string }>();

    expect(onNumberField[1]).toBe("Nested 3 deep number");
  });

  it("handles arrays: complex (FieldTypes.Object)", () => {
    const onObjectField = accio(data)
      .array("arrays")
      .findOne({
        4: [FieldTypes.Object],
      })
      .array("3")
      .findOne({
        2: [FieldTypes.Array],
      })
      .array("2")
      .findOne({
        1: [FieldTypes.String],
      })
      .get<{ 1: string }>();

    expect(onObjectField[1]).toStrictEqual("Nested 3 deep object");
  });

  it("handles arrays: complex (FieldTypes.String && FieldTypes.NotDate)", () => {
    const onStringField = accio(data)
      .array("arrays")
      .find({
        4: [FieldTypes.String, FieldTypes.NotDate],
      })
      .first()
      .array("3")
      .first()
      .array("2")
      .findOne({
        1: [FieldTypes.Array],
      })
      .get<{ 1: string }>();

    expect(onStringField[1]).toStrictEqual([
      "Nested 3 deep array some string",
    ]);
  });

  it("searches objects", () => {
    const results = accio(data)
      .object("objects")
      .search({
        1: [FieldTypes.String, FieldTypes.NotDate],
      })
      .get();

    const expected = [
      {
        location: "top.2",
        value: { "1": "Nested 2 deep", "2": "Next to 1" },
      },
      { location: "top.3.1", value: { "1": "Nested 3 deep" } },
      { location: "top.3.2", value: { "1": "Nested 3 deep" } },
      { location: "top.4.1", value: { "1": "Nested 3 deep" } },
      { location: "top.4.2.2", value: { "1": "Nested 4 deep" } },
      { location: "top.4.3.2", value: { "1": "Nested 4 deep" } },
      { location: "top.5.1", value: { "1": "Nested 3 deep" } },
      { location: "top.5.2", value: { "1": "Nested 3 deep" } },
      { location: "top.5.3.3.2", value: { "1": "Nested 5 deep" } },
      { location: "top.5.4.3.2", value: { "1": "Nested 5 deep" } },
    ];

    expect(results).toStrictEqual(expected);
  });

  it("searches objects and returns projected fields", () => {
    const results = accio(data)
      .object("objects")
      .search(
        {
          1: [FieldTypes.String, FieldTypes.NotDate],
        },
        {
          projection: [
            2,
          ],
        },
      )
      .get();

    const expected = [
      { location: "top.2", value: { "2": "Next to 1" } },
      { location: "top.3.1", value: {} },
      { location: "top.3.2", value: {} },
      { location: "top.4.1", value: {} },
      { location: "top.4.2.2", value: {} },
      { location: "top.4.3.2", value: {} },
      { location: "top.5.1", value: {} },
      { location: "top.5.2", value: {} },
      { location: "top.5.3.3.2", value: {} },
      { location: "top.5.4.3.2", value: {} },
    ];

    expect(results).toStrictEqual(expected);
  });

  it("searches objects: flatten", () => {
    const results = accio(data)
      .object("objects")
      .search(
        {
          1: [FieldTypes.String, FieldTypes.NotDate],
        },
        {
          flatten: true,
          projection: [
            2,
          ],
        },
      )
      .get();

    const expected = [
      { "2": "Next to 1" },
    ];

    expect(results).toStrictEqual(expected);
  });

  it("searches arrays: projection", () => {
    const results = accio(data)
      .object("arrays")
      .search(
        {
          1: [FieldTypes.String],
        },
        {
          projection: [
            2,
          ],
        },
      )
      .get();

    const expected = [
      {
        location: "top[0].5[0].4[0].3[0].2[0]",
        value: { "2": "Next to 1" },
      },
      { location: "top[1].4[0].3[0].2[0]", value: { "2": "Next to 1" } },
      { location: "top[2].3[0].2[0]", value: { "2": "Next to 1" } },
      { location: "top[4].3[0].2[0]", value: { "2": "Next to 1" } },
      { location: "top[5].3[0].2[0]", value: { "2": "Next to 1" } },
    ];

    expect(results).toStrictEqual(expected);
  });

  it("searches arrays: flatten", () => {
    const results = accio(data)
      .object("arrays")
      .search(
        {
          1: [FieldTypes.String],
        },
        {
          flatten: true,
          projection: [
            2,
          ],
          transformer: (result) => {
            if (result["2"]) {
              result.has_two = true;
            }
            return result;
          },
        },
      )
      .get();

    const expected = [
      { "2": "Next to 1", has_two: true },
      { "2": "Next to 1", has_two: true },
      { "2": "Next to 1", has_two: true },
      { "2": "Next to 1", has_two: true },
      { "2": "Next to 1", has_two: true },
    ];

    expect(results).toStrictEqual(expected);
  });
});
