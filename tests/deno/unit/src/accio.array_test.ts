import { accio, FieldTypes, Types } from "../../../../src/accio.ts";
import { assertEquals } from "../../deps.ts";

const data = JSON.stringify([
  [
    {
      1: "Nested 2 deep in array",
    },
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
            2: ["Next to 1"],
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

Deno.test("accio.ts: data is an array", async (t) => {
  await t.step("handles arrays: simple", () => {
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

    assertEquals(result[1], "Nested 5 deep");
  });

  await t.step("handles arrays: complex (FieldTypes.Array)", () => {
    const onArrayField = accio(data)
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

    assertEquals(onArrayField[1], "Nested 5 deep array");
  });

  await t.step("handles arrays: complex (FieldTypes.Boolean)", () => {
    const onBooleanField = accio(data)
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

    assertEquals(onBooleanField[1], "Nested 3 deep boolean");
  });

  await t.step("handles arrays: complex (FieldTypes.Date)", () => {
    const onDateField = accio(data)
      .findOne({
        4: [FieldTypes.Date],
      })
      .array("3")
      .first()
      .array("2")
      .findOne({
        1: [FieldTypes.Array],
      })
      .get<{ 1: string[] }>();

    assertEquals(onDateField[1], ["Nested 3 deep date"]);
  });

  await t.step("handles arrays: complex (FieldTypes.Number)", () => {
    const onNumberField = accio(data)
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

    assertEquals(onNumberField[1], "Nested 3 deep number");
  });

  await t.step("handles arrays: complex (FieldTypes.Object)", () => {
    const onObjectField = accio(data)
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

    assertEquals(onObjectField[1], "Nested 3 deep object");
  });

  await t.step(
    "handles arrays: complex (FieldTypes.String && FieldTypes.NotDate)",
    () => {
      const onStringField = accio(data)
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
        .get<{ 1: string[] }>();

      assertEquals(onStringField[1], [
        "Nested 3 deep array some string",
      ]);
    },
  );

  await t.step("searches arrays", () => {
    const results = accio(data)
      .search({
        1: [FieldTypes.String],
      })
      .get();

    assertEquals(results, [
      { location: "top[0]", value: { "1": "Nested 2 deep in array" } },
      {
        location: "top[1].5[0].4[0].3[0].2[0]",
        value: { "1": "Nested 5 deep" },
      },
      {
        location: "top[2].4[0].3[0].2[0]",
        value: { "1": "Nested 5 deep array" },
      },
      {
        location: "top[3].3[0].2[0]",
        value: { "1": "Nested 3 deep boolean" },
      },
      {
        location: "top[5].3[0].2[0]",
        value: {
          "1": "Nested 3 deep number",
          "2": ["Next to 1"],
        },
      },
      {
        location: "top[6].3[0].2[0]",
        value: { "1": "Nested 3 deep object" },
      },
    ]);
  });

  await t.step("searches arrays: flatten", () => {
    const results = accio(data)
      .search(
        {
          1: [FieldTypes.String],
        },
        {
          flatten: true,
        },
      )
      .get();

    assertEquals(results, [
      { "1": "Nested 2 deep in array" },
      { "1": "Nested 5 deep" },
      { "1": "Nested 5 deep array" },
      { "1": "Nested 3 deep boolean" },
      { "1": "Nested 3 deep number", "2": ["Next to 1"] },
      { "1": "Nested 3 deep object" },
    ]);
  });

  await t.step("searches arrays: projection", () => {
    const results = accio(data)
      .search(
        {
          1: [FieldTypes.String],
        },
        {
          flatten: true,
          projection: [
            2,
          ],
        },
      )
      .get();

    assertEquals(results, [
      { "2": ["Next to 1"] },
    ]);
  });

  await t.step("searches arrays: transformer", () => {
    const results = accio(data)
      .search(
        {
          1: [FieldTypes.String],
        },
        {
          transformer: (result: Types.TSearchResult) => {
            if (
              result.value && typeof result.value === "object" &&
              ("1" in result.value)
            ) {
              result.has_one = true;
            }
            return result;
          },
        },
      )
      .get();

    assertEquals(results, [
      {
        location: "top[0]",
        value: { "1": "Nested 2 deep in array" },
        has_one: true,
      },
      {
        location: "top[1].5[0].4[0].3[0].2[0]",
        value: { "1": "Nested 5 deep" },
        has_one: true,
      },
      {
        location: "top[2].4[0].3[0].2[0]",
        value: { "1": "Nested 5 deep array" },
        has_one: true,
      },
      {
        location: "top[3].3[0].2[0]",
        value: { "1": "Nested 3 deep boolean" },
        has_one: true,
      },
      {
        location: "top[5].3[0].2[0]",
        value: { "1": "Nested 3 deep number", "2": ["Next to 1"] },
        has_one: true,
      },
      {
        location: "top[6].3[0].2[0]",
        value: { "1": "Nested 3 deep object" },
        has_one: true,
      },
    ]);
  });
});
