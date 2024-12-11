import { PluginFC } from "@thebigrick/catalyst-pluginizr";
import React from "react";
import RootLayout from "@bigcommerce/catalyst-core/app/[locale]/layout";

const myTestPlugin: PluginFC<typeof RootLayout> = {
  name: "My Plugin",
  component: "@bigcommerce/catalyst-core/app/[locale]/layout",
  wrap: async ({ WrappedComponent, ...props }) => {
    const params = await props.params;

    return (
      <WrappedComponent
        {...props}
        params={Promise.resolve({ ...params, locale: "it" })}
      />
    );
  },
};

export default myTestPlugin;
