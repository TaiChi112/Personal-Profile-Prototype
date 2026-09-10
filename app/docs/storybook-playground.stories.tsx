import type { Meta, StoryObj } from "@storybook/react";
import { CollaborativePlayground } from "@/app/components/mdx/CollaborativePlayground";

const meta = {
  title: "Components/CollaborativePlayground",
  component: CollaborativePlayground,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CollaborativePlayground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    template: "react",
    files: {
      "/App.js": `export default function App() {
  return <h1>Hello Collaborative World</h1>
}`,
    },
  },
};

export const Vanilla: Story = {
  args: {
    template: "vanilla",
    files: {
      "/index.js": `document.getElementById("app").innerHTML = "<h1>Hello Collaborative World</h1>";`,
    },
  },
};
