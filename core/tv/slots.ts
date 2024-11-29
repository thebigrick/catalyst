/* eslint @typescript-eslint/ban-ts-comment: 0 */

import { useMemo } from 'react';
import { ClassValue, TVProps } from 'tailwind-variants';

export type SlotsToClasses<S extends string> = {
  [key in S]?: ClassValue;
};

export type SlotsReturn<S extends string> = Record<S, () => string>;
export type SlotsFn<S extends string, P extends TVProps<any, any, any, any, any>> = (
  props: P,
) => Record<S, (props: P) => string>;

export const getSlots = <S extends string, P extends TVProps<any, any, any, any, any>>(
  slotsFn: SlotsFn<S, P>,
  classNames: SlotsToClasses<S> | undefined,
  props: P,
): SlotsReturn<S> => {
  const slots = slotsFn(props);

  // @ts-expect-error
  return Object.keys(slots).reduce<SlotsReturn<S>>(
    (acc, k) => ({
      ...acc,
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment
      [k]: () => slots[k]({ class: classNames?.[k] }),
    }),
    // @ts-expect-error
    {},
  );
};

export const useSlots = <S extends string, P extends TVProps<any, any, any, any, any>>(
  slotsFn: SlotsFn<S, P>,
  classNames: SlotsToClasses<S> | undefined,
  props: P,
) => {
  return useMemo(() => getSlots(slotsFn, classNames, props), [slotsFn, classNames, props]);
};
