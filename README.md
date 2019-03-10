# rollup-plugin-tailwind

Transform TailwindCSS classes to CSS-in-JS compatible object at build time. Tested with Emotion and Glamor but any CSS-in-JS library that accepts the same style object should work without a problem.

## Installation

```bash
npm install --save-dev rollup-plugin-tailwind
```

## Usage

```ts
// rollup.config.js
import tailwind from 'rollup-plugin-tailwind';

export default {
  input: 'index.js',
  output: {
    file: 'bundle.js',
    format: 'cjs',
  },
  plugins: [
    tailwind()
  ]
})
```

## Example

Before:

```tsx
import { css } from "emotion";

const classes = css(tailwind`text-white capitalize`);
```

After:

```tsx
import { css } from "emotion";

const classes = css({
  color: "#fff",
  textTransform: "capitalize"
});
```

## Options

### `config`

- Type: `String` _(default: tailwind.config.js)_

Changes the path of Tailwind configuration file

```ts
tailwind({
  config: "tailwind.js"
});
```

### `function`

- Type: `String` _(default: tailwind)_

Changes the function name plugin is looking for to transform

```ts
tailwind({
  function: "tw"
});
```

### `only`

- Type: `Array<String>` _(default: [])_

Array of minimatch strings to only include certain files

```ts
tailwind({
  only: ["*.js"]
});
```
