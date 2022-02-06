# Vite React Components Library

## Description

Development of React Components library following CDD (Component-Driven Development) methodology.

## How to create a new component

1. Create a new folder in stories folder with the name of your feature.
2. Create a `.tsx` file with the name of the feature and its `.stories.tsx` pair.
3. We define in the story file the states of the feature with the next structure:

```ts
export default {
  component: Feature,
  title: "Feature",
};

const Template = (args) => <Feature {...args} />;
export const Default = Template.bind({});
Default.args = {
  feature: {
    id: "1",
    title: "Test feature",
    state: "FEATURE_INBOX",
    updatedAt: new Date(2021, 0, 1, 9, 0),
  },
};
```

There ir a story per different state, and there is as many stories as states in the component specification
