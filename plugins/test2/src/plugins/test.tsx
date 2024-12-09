import { PluginFC } from "@thebigrick/catalyst-pluginizr";
import React from "react";
import { Header } from "@bigcommerce/catalyst-core/components/header";

const myTestPlugin: PluginFC<typeof Header> = {
  name: "My Plugin",
  component: "@bigcommerce/catalyst-core/app/[locale]/layout",
  wrap: ({ WrappedComponent, ...props }) => {
    return (
      <div className="plugin-wrapper">
        Layout wrapper
        <WrappedComponent {...props} />
      </div>
    );
  },
};

export default myTestPlugin;
