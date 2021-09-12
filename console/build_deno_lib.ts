const decoder = new TextDecoder();
const encoder = new TextEncoder();

Deno.run({ cmd: ["cp", "src/accio.ts", "lib/deno/accio.ts"] });
Deno.run({ cmd: ["cp", "src/collection.ts", "lib/deno/collection.ts"] });
Deno.run({ cmd: ["cp", "src/document.ts", "lib/deno/document.ts"] });
Deno.run({ cmd: ["cp", "src/field_type.ts", "lib/deno/field_type.ts"] });

const filesToRewrite = [
  "./lib/deno/accio.ts",
  "./lib/deno/collection.ts",
  "./lib/deno/document.ts",
  "./lib/deno/field_type.ts",
]

filesToRewrite.forEach((file: string) => {
  let contents = decoder.decode(Deno.readFileSync(file));

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
