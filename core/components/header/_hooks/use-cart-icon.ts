import { useLocale } from 'next-intl';
import { useEffect } from 'react';
import { z } from 'zod';

import { useCart } from '~/components/header/cart-provider';
import { ComponentHook } from '~/hooks/component-hook';

const CartQuantityResponseSchema = z.object({
  count: z.number(),
});

export interface CartIconProps {
  count?: number;
}

const useCartIcon: ComponentHook<CartIconProps, { count: number }> = ({ count: serverCount }) => {
  const { count, setCount } = useCart();
  const locale = useLocale();

  useEffect(() => {
    async function fetchCartQuantity() {
      const response = await fetch(`/api/cart-quantity/?locale=${locale}`);
      const parsedData = CartQuantityResponseSchema.parse(await response.json());

      setCount(parsedData.count);
    }

    if (serverCount !== undefined) {
      setCount(serverCount);
    } else {
      // When a page is rendered statically via the 'force-static' route config option, cookies().get() always returns undefined,
      // which ultimately means that the `serverCount` here will always be undefined on initial render, even if there actually is
      // a populated cart. Thus, we perform a client-side check in this case.
      void fetchCartQuantity();
    }
  }, [serverCount, locale, setCount]);

  return {
    data: { count },
    handlers: {},
    refs: {},
  };
};

export default useCartIcon;
