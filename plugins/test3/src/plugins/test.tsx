import { ComponentPlugin } from "@thebigrick/catalyst-pluginizr";
import React from "react";
import { Header } from "@bigcommerce/catalyst-core/components/header";

const myTestPlugin: ComponentPlugin<typeof Header> = {
  name: "My Plugin 2",
  resourceId: "@bigcommerce/catalyst-core/components/header:Header",
  wrap: ({ WrappedComponent, ...props }) => {
    return (
      <div>
        <div className={"bg-red-500"}> Lorem Ipsum</div>
        <WrappedComponent {...props} />
        Ipsum Lorem
      </div>
    );
  },
};

export default myTestPlugin;
