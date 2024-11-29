'use client';

import { Loader2 as Spinner, Search, X } from 'lucide-react';
import { ComponentPropsWithRef, ElementRef, forwardRef } from 'react';

import inputSlots, { InputSlots } from '~/components/ui/header/_styles/input-slots';
import { SlotsToClasses, useSlots } from '~/tv/slots';

import { Button } from '../button';

interface Props extends ComponentPropsWithRef<'input'> {
  pending?: boolean;
  showButton?: boolean;
  onClickClear?: () => void;
  showClear?: boolean;
  classNames?: SlotsToClasses<InputSlots>;
}

export const Input = forwardRef<ElementRef<'input'>, Props>(
  ({ className, pending, showClear, onClickClear, classNames, ...props }, ref) => {
    const slots = useSlots(inputSlots, classNames, { style: 'alternate' });

    return (
      <div className={slots.wrapper()}>
        <input className={slots.base()} ref={ref} type="text" {...props} />
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
            <Spinner aria-hidden="true" className={slots.loadingSpinner()} />
            <span className="sr-only">Processing...</span>
          </span>
        )}
      </div>
    );
  },
);
