import { Plugin } from "@thebigrick/catalyst-pluginizr";
import React from "react";

const myTestPlugin: Plugin = {
  name: "My Plugin",
  component: "@bigcommerce/catalyst-core/components/header:Header",
  wrap: (Component) => (props) => {
    return (
      <div className="plugin-wrapper">
        <Component {...props} />
        PLUGIN test 2
      </div>
    );
  },
};

export default myTestPlugin;
