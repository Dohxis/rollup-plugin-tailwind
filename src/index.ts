import { parse } from "acorn";
import { walk } from "estree-walker";
import postcss from "postcss";
import postcssJs from "postcss-js";
import tailwindcss from "tailwindcss";
import MagicString from "magic-string";
import fs from "fs";
import { formatTailwindObject } from "./helpers/formatTailwindObject";
import { processSelectors } from "./helpers/processSelectors";
import { ensureArray } from "./helpers/ensureArray";
import { shouldProceed } from "./helpers/shouldProceed";

interface PluginOptions {
  config?: string;
  function?: string;
  only?: Array<string>;
}

export default function tailwind(options: PluginOptions = {}) {
  const tailwindConfigFile = options.config
    ? `${process.cwd()}/${options.config}`
    : `${process.cwd()}/tailwind.config.js`;
  const functionName = options.function ? options.function : "tailwind";
  const only = ensureArray(options.only);

  if (!fs.existsSync(tailwindConfigFile)) {
    throw Error("Cannot find Tailwind configuration file");
  }

  const tailwindConfig = require(tailwindConfigFile);
  let tailwind;

  postcss()
    .use(tailwindcss(tailwindConfigFile))
    .process("@tailwind components; @tailwind utilities;", { from: undefined })
    .then(result => {
      tailwind = formatTailwindObject(postcssJs.objectify(result.root));
    });

  return {
    name: "transform-tailwind",
    renderChunk(code, { facadeModuleId }) {
      if (!shouldProceed(only, facadeModuleId)) {
        return;
      }

      const ast = parse(code, {
        ecmaVersion: 6,
        sourceType: "module"
      });
      const magicString = new MagicString(code);

      walk(ast, {
        enter(node) {
          if (
            node.type !== "CallExpression" ||
            node.callee.name !== functionName
          ) {
            return;
          }

          const selectors = node.arguments[0].value.split(" ");
          const processedSelectors = processSelectors(
            tailwind,
            tailwindConfig,
            selectors
          );

          magicString.overwrite(
            node.start,
            node.end,
            JSON.stringify(processedSelectors)
          );
        }
      });

      return magicString.toString();
    }
  };
}
