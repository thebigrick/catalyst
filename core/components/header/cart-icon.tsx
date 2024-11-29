'use client';

import { ShoppingCart } from 'lucide-react';
import React from 'react';

import useCartIcon, { CartIconProps } from '~/components/header/_hooks/use-cart-icon';
import { Badge } from '~/components/ui/badge';

const CartIcon: React.FC<CartIconProps> = (props) => {
  const {
    data: { count },
  } = useCartIcon(props);

  if (!count) {
    return <ShoppingCart aria-label="cart" />;
  }

  return (
    <>
      <span className="sr-only">Cart Items</span>
      <ShoppingCart aria-hidden="true" />
      <Badge>{count}</Badge>
    </>
  );
};

export default CartIcon;
