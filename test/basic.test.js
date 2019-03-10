const tailwind = require("../pkg/dist-node/index").default;
const { rollup } = require("rollup");

const generateCode = async file => {
  const bundle = await rollup({
    input: file,
    plugins: [
      tailwind({
        config: "test/samples/tailwind.config.js",
        only: ["*.js"]
      })
    ]
  });
  const { output } = await bundle.generate({ format: "es" });
  return output[0].code;
};

describe("transform tailwind", () => {
  test("normal selectors", async () => {
    const code = await generateCode("test/samples/normal_selectors.js");
    expect(code).toMatchSnapshot();
  });

  test("hover selectors", async () => {
    const code = await generateCode("test/samples/hover_selectors.js");
    expect(code).toMatchSnapshot();
  });

  test("media selectors", async () => {
    const code = await generateCode("test/samples/media_selectors.js");
    expect(code).toMatchSnapshot();
  });

  test("focus selectors", async () => {
    const code = await generateCode("test/samples/focus_selectors.js");
    expect(code).toMatchSnapshot();
  });
});
