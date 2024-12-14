import { registerFnPlugin } from "@thebigrick/catalyst-pluginizr/src/registry";
import { getSearchResults } from "@bigcommerce/catalyst-core/components/header/_actions/get-search-results";
import { ProductCardFragment } from "@bigcommerce/catalyst-core/components/product-card/fragment";

registerFnPlugin<typeof getSearchResults>({
  name: "Get Serach Results",
  functionId:
    "@bigcommerce/catalyst-core/components/header/_actions/get-search-results:getSearchResults",
  wrap: (fn, searchTerm) => {
    return fn("casa");
  },
});

registerFnPlugin<typeof ProductCardFragment>({
  name: "Product Card Fragment",
  functionId:
    "@bigcommerce/catalyst-core/components/product-card/fragment:ProductCardFragment",
  wrap: (arg) => {
    return arg;
  },
});
