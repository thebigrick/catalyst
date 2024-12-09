import { registerFcPlugin } from "@thebigrick/catalyst-pluginizr";
import myTestPlugin from "./plugins/test";
import { registerFnPlugin } from "@thebigrick/catalyst-pluginizr/src/registry";
import { useCart } from "@bigcommerce/catalyst-core/components/header/cart-provider";

registerFcPlugin(myTestPlugin);
registerFnPlugin<typeof useCart>({
  name: "My Function Plugin",
  functionId:
    "@bigcommerce/catalyst-core/components/header/cart-provider:useCart",
  wrap: (fn) => {
    console.log("Function Plugin");
    return fn();
  },
});
