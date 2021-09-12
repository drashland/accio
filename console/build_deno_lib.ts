const decoder = new TextDecoder();
const encoder = new TextEncoder();

Deno.run({ cmd: ["mkdir", "-p", "lib/deno"] });
Deno.run({ cmd: ["cp", "src/accio.ts", "lib/deno/accio.ts"] });
Deno.run({ cmd: ["cp", "src/collection.ts", "lib/deno/collection.ts"] });
Deno.run({ cmd: ["cp", "src/document.ts", "lib/deno/document.ts"] });
Deno.run({ cmd: ["cp", "src/field_type.ts", "lib/deno/field_type.ts"] });
Deno.run({ cmd: ["chmod", "700", "lib/deno/*.ts"] });

const filesToRewrite = [
  "/lib/deno/accio.ts",
  "/lib/deno/collection.ts",
  "/lib/deno/document.ts",
  "/lib/deno/field_type.ts",
]

filesToRewrite.forEach((file: string) => {
  let filepath = Deno.realPathSync(".") + file;
  console.log(`Writing the following file:`, filepath);
  let contents = decoder.decode(Deno.readFileSync(filepath));

  const importStatements = contents.match(/import.*";/g);

  if (importStatements) {
    const importStatementsWithExtensions = importStatements
      .map((statement: string) => {
        return statement.replace(/";/, `.ts";`);
      });

    importStatements.forEach((statement: string, index: number) => {
      contents = contents.replace(statement, importStatementsWithExtensions[index]);
    });

    Deno.writeFileSync(file, encoder.encode(contents));
  }
});
