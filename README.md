# yargs-typebox

[![NPM Version](https://img.shields.io/npm/v/yargs-typebox)](https://www.npmjs.com/package/yargs-typebox)
[![NPM Downloads](https://img.shields.io/npm/d18m/yargs-typebox)](https://www.npmjs.com/package/yargs-typebox)
[![Codecov](https://codecov.io/gh/moontaiworks/yargs-typebox/graph/badge.svg)](https://codecov.io/gh/moontaiworks/yargs-typebox)

Use [TypeBox](https://github.com/sinclairzx81/typebox) to define your [yargs](https://www.npmjs.com/package/yargs) arguments.

## Install

### NPM

```bash
npm install yargs-typebox
```

### Yarn

```bash
yarn add yargs-typebox
```

### PNPM

```bash
pnpm add yargs-typebox
```

## Usage

### getOptions(TObject)

Transform a whole TypeBox object into yargs options object.

```typescript
import { type Static, Type } from "@sinclair/typebox";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { getOptions } from "yargs-typebox";

const schema = Type.Object({
  page: Type.Number({ description: "page number" }),
  size: Type.Number({ description: "page size", default: 10 }),
  query: Type.Optional(Type.String()),
  sort: Type.Optional(
    Type.Array(Type.Union([Type.Literal("id"), Type.Literal("createdAt")])),
  ),
  order: Type.Union([Type.Literal("asc"), Type.Literal("desc")], {
    default: "asc",
    implies: ["sort"],
  }),
  pretty: Type.Boolean({ description: "pretty print" }),
  count: Type.Any({ description: "count", count: true }),
});

const options = getOptions(schema);
// {
//   page: {
//     type: "number",
//     demandOption: true,
//     describe: "page number",
//   },
//   size: {
//     type: "number",
//     default: 10,
//     demandOption: false,
//     describe: "page size",
//   },
//   query: {
//     type: "string",
//     demandOption: false,
//   },
//   sort: {
//     type: "array",
//     demandOption: false,
//     choices: ["id", "createdAt"],
//   },
//   order: {
//     type: "string",
//     implies: ["sort"],
//     default: "asc",
//     demandOption: false,
//     choices: ["asc", "desc"],
//   },
//   pretty: {
//     type: "boolean",
//     demandOption: true,
//     describe: "pretty print",
//   },
//   count: {
//     count: true,
//     demandOption: true,
//     describe: "count",
//   },
// }

const argv = yargs(hideBin(process.argv))
  .options(options)
  .help()
  .parse() as Static<typeof schema>;

console.log(argv);
```

### getOption(TSchema)

Transform a single TypeBox schema into yargs option.

```typescript
import { Type } from "@sinclair/typebox";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { getOption } from "yargs-typebox";

const prettyArgument = Type.Boolean({ description: "pretty print" });
const countArgument = Type.Any({ description: "count", count: true });

const prettyOption = getOption(prettyArgument);
// {
//   type: "boolean",
//   demandOption: true,
//   describe: "pretty print",
// }
const countOption = getOption(countArgument);
// {
//   count: true,
//   demandOption: true,
//   describe: "count",
// }

const argv = yargs(hideBin(process.argv))
  .option("pretty", prettyOption)
  .option("count", countOption)
  .help()
  .parse();

console.log(argv);
```

## API Document

For more informations, see the [API documentation](https://moontaiworks.github.io/yargs-typebox/).
