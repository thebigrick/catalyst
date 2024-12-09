import { PluginFC } from "@thebigrick/catalyst-pluginizr";
import React from "react";
import { Header } from "@bigcommerce/catalyst-core/components/header";

const myTestPlugin: PluginFC<typeof Header> = {
  name: "My Plugin 2",
  component: "@bigcommerce/catalyst-core/components/header:Header",
  wrap: ({ WrappedComponent, ...props }) => {
    return (
      <div className="plugin-wrapper">
        PLUGIN test 35
        <WrappedComponent {...props} />
      </div>
    );
  },
};

export default myTestPlugin;
