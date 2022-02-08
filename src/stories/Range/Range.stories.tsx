import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Range } from "./Range";

export default {
  title: "Design System/Range",
  component: Range,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof Range>;

const Template: ComponentStory<typeof Range> = (args) => (
  <div style={{ display: "flex", justifyContent: "center" }}>
    <Range {...args} />
  </div>
);

export const Primary = Template.bind({});
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
