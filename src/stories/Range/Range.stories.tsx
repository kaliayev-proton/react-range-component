import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Range } from "./Range";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Design System/Range",
  component: Range,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof Range>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Range> = (args) => (
  <div style={{ display: "flex", justifyContent: "center" }}>
    <Range {...args} />
  </div>
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  value: [1, 100],
};

export const Secondary = Template.bind({});
Secondary.args = {
  value: [1, 100],
};

export const Large = Template.bind({});
Large.args = {
  value: [1, 100],
};

export const Small = Template.bind({});
Small.args = {
  value: [1, 100],
};
