"use client";

import { Sandpack, SandpackProps } from "@codesandbox/sandpack-react";

interface PlaygroundProps extends Omit<SandpackProps, "template"> {
  /**
   * The template to use for the sandbox.
   * Commonly "react", "react-ts", "vanilla", "vanilla-ts", etc.
   * Default is "react".
   */
  template?: SandpackProps["template"];
}

export function Playground({ template = "react", ...props }: PlaygroundProps) {
  return (
    <div className="my-6 sandbox-container">
      <Sandpack
        template={template}
        theme="dark"
        options={{
          showNavigator: true,
          showTabs: true,
          closableTabs: true,
        }}
        {...props}
      />
    </div>
  );
}
