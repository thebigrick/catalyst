import { Plugin } from "@thebigrick/catalyst-pluginizr";
import React from "react";

const myTestPlugin: Plugin = {
  name: "My Plugin",
  component: "header",
  wrap: (Component) => (props) => {
    return (
      <div className="plugin-wrapper">
        CIAONE2
        <Component {...props} />
      </div>
    );
  },
};

export default myTestPlugin;
