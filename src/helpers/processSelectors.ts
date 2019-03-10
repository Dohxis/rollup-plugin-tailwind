const isVariant = (name: string) => (selector: string): boolean => {
  return selector.startsWith(`${name}:`);
};

const addSelector = (name: string) => (
  tailwind: any,
  state: any,
  selector: string
): any => {
  const nameWithoutVariant = selector.split(":")[1];
  return {
    ...state,
    [`:${name}`]: {
      ...state[`:${name}`],
      ...tailwind[`.${nameWithoutVariant}`]
    }
  };
};

const addMediaSelector = (
  tailwind: any,
  state: any,
  selector: string,
  config: any
) => {
  const [size, nameWithoutMedia] = selector.split(":");
  const media = `@media (min-width: ${config.screens[size]})`;
  return {
    ...state,
    [media]: { ...state[media], ...tailwind[`.${nameWithoutMedia}`] }
  };
};

export const processSelectors = (
  tailwind: any,
  config: any,
  selectors: Array<string>
) => {
  let state = {};
  const processSelector = [
    {
      isRightSelector: (selector: string): boolean => !selector.includes(":"),
      addToState: (tailwind: Object, state: any, selector: string) => ({
        ...state,
        ...tailwind[`.${selector}`]
      })
    },
    {
      isRightSelector: (
        selector: string,
        { screens }: { screens: Object }
      ): boolean => {
        return Object.keys(screens).some(screen =>
          selector.startsWith(`${screen}:`)
        );
      },
      addToState: addMediaSelector
    },
    {
      name: "hover"
    },
    {
      name: "focus"
    },
    {
      name: "active"
    },
    {
      name: "group-hover"
    },
    {
      name: "focus-within"
    }
  ];

  for (const name of selectors) {
    for (const rule of processSelector) {
      const isRightSelector = rule.name
        ? isVariant(rule.name)
        : rule.isRightSelector;
      const addToState = rule.name ? addSelector(rule.name) : rule.addToState;

      if (isRightSelector(name, config)) {
        state = addToState(tailwind, state, name, config);
        break;
      }
    }
  }

  return state;
};
