import {
  registerFunctionPlugin,
  registerValuePlugin,
} from "@thebigrick/catalyst-pluginizr";
import { getSearchResults } from "@bigcommerce/catalyst-core/components/header/_actions/get-search-results";
import { ProductCardFragment } from "@bigcommerce/catalyst-core/components/product-card/fragment";
import { graphql } from "@bigcommerce/catalyst-core/client/graphql";
import { AddToCartFragment } from "@bigcommerce/catalyst-core/components/product-card/add-to-cart/fragment";
import { PricingFragment } from "@bigcommerce/catalyst-core/client/fragments/pricing";

registerFunctionPlugin<typeof getSearchResults>({
  name: "Get Serach Results",
  resourceId:
    "@bigcommerce/catalyst-core/components/header/_actions/get-search-results:getSearchResults",
  wrap: (fn, searchTerm) => {
    return fn("casa");
  },
});

registerValuePlugin<typeof ProductCardFragment>({
  name: "Product Card Fragment",
  resourceId:
    "@bigcommerce/catalyst-core/components/product-card/fragment:ProductCardFragment",
  wrap: (arg) => {
    return graphql(
      `
        fragment ProductCardFragment on Product {
          entityId
          sku # This was added
          name
          defaultImage {
            altText
            url: urlTemplate(lossy: true)
          }
          path
          brand {
            name
            path
          }
          reviewSummary {
            numberOfReviews
            averageRating
          }
          ...AddToCartFragment
          ...PricingFragment
        }
      `,
      [AddToCartFragment, PricingFragment],
    );
  },
});
