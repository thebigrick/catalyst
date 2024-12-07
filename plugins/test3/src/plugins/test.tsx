import { Plugin } from "@thebigrick/catalyst-pluginizr";
import React from "react";

const myTestPlugin: Plugin = {
  name: "My Plugin",
  component: "@bigcommerce/catalyst-core/components/header:Header",
  wrap: (Component) => (props) => {
    return (
      <div className="plugin-wrapper">
        PLUGIN test 3
        <Component {...props} />
      </div>
    );
  },
};

export default myTestPlugin;
