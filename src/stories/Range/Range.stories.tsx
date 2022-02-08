import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Range } from "./Range";

export default {
  title: "Design System/Range",
  component: Range,
} as ComponentMeta<typeof Range>;

const Template: ComponentStory<typeof Range> = (args) => (
  <div style={{ display: "flex", justifyContent: "center" }}>
    <Range {...args} />
  </div>
);

export const Exercise1 = Template.bind({});
Exercise1.args = {
  range: [1, 100],
};

export const Exercise2 = Template.bind({});
Exercise2.args = {
  range: [3, 12, 28, 55, 78, 93],
};
