'use client';

import { Loader2, Search, X } from 'lucide-react';
import { ComponentPropsWithRef, ElementRef, forwardRef } from 'react';

import inputSlots, { InputSlots } from '~/components/ui/header/_styles/input-slots';
import useTvSlots, { SlotsToClasses } from '~/hooks/use-tv-slots';

import { Button } from '../button';

interface Props extends ComponentPropsWithRef<'input'> {
  pending?: boolean;
  showButton?: boolean;
  onClickClear?: () => void;
  showClear?: boolean;
  classNames?: SlotsToClasses<InputSlots>;
  variant?: 'alternate';
}

export const Input = forwardRef<ElementRef<'input'>, Props>((props, ref) => {
  const { className, pending, showClear, onClickClear, classNames, ...otherProps } = props;

  const slots = useTvSlots(inputSlots, classNames, props);

  return (
    <div className={slots.wrapper()}>
      <input className={slots.base()} ref={ref} type="text" {...otherProps} />
      <span aria-hidden="true" className={slots.searchIcon()}>
        <Search />
      </span>
      {showClear && !pending && (
        <Button
          aria-label="Clear search"
          className={slots.clearButton()}
          onClick={onClickClear}
          type="button"
        >
          <X />
        </Button>
      )}
      {pending && (
        <span aria-hidden="true" className={slots.loadingWrapper()}>
          <Loader2 aria-hidden="true" className={slots.loadingSpinner()} />
          <span className="sr-only">Processing...</span>
        </span>
      )}
    </div>
  );
});
