/* eslint @typescript-eslint/ban-ts-comment: 0 */

import { useMemo } from 'react';
import type { extendTailwindMerge } from 'tailwind-merge';
import { ClassValue, TVProps, TVReturnType, TVVariants } from 'tailwind-variants';
import type { DefaultScreens } from 'tailwind-variants/transformer';

type TVGeneratedScreens = DefaultScreens;
type TVSlots = Record<string, ClassValue> | undefined;
type MergeConfig = Parameters<typeof extendTailwindMerge>[0];
type LegacyMergeConfig = Extract<MergeConfig, { extend?: unknown }>['extend'];

interface TWMConfig {
  twMerge?: boolean;
  twMergeConfig?: MergeConfig & LegacyMergeConfig;
}

export type TVConfig<
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  V extends TVVariants | undefined = undefined,
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  EV extends TVVariants | undefined = undefined,
> = {
  responsiveVariants?:
    | boolean
    | TVGeneratedScreens[]
    | { [K in keyof V | keyof EV]?: boolean | TVGeneratedScreens[] };
} & TWMConfig;

export type SlotsToClasses<S extends string> = {
  [key in S]?: ClassValue;
};

export const getSlots = <
  V extends TVVariants<S, B, EV>,
  C extends TVConfig<V, EV>,
  B extends ClassValue = undefined,
  S extends TVSlots = undefined,
  // @ts-expect-error
  E extends TVReturnType = TVReturnType<
    V,
    S,
    B,
    C,
    // @ts-expect-error
    EV extends undefined ? {} : EV,
    // @ts-expect-error
    ES extends undefined ? {} : ES
  >,
  EV extends TVVariants<ES, B, E['variants'], ES> = E['variants'],
  ES extends TVSlots = E['slots'] extends TVSlots ? E['slots'] : undefined,
>(
  slotsFn: TVReturnType<V, S, B, C, EV, ES, E>,
  // @ts-expect-error
  classNames: SlotsToClasses<keyof ReturnType<typeof slotsFn>> | undefined,
  props: TVProps<V, S, C, EV, ES> | Record<string, unknown>,
): ReturnType<TVReturnType<V, S, B, C, EV, ES, E>> => {
  // @ts-expect-error
  const slots = slotsFn(props);

  // @ts-expect-error
  return Object.keys(slots).reduce<ReturnType<TVReturnType<V, S, B, C, EV, ES, E>>>(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    (acc, k: string) => ({
      // @ts-expect-error
      ...acc,
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment
      [k]: () => slots[k]({ ...props, class: classNames?.[k] }),
    }),
    // @ts-expect-error
    {},
  );
};

export const useSlots = <
  V extends TVVariants<S, B, EV>,
  C extends TVConfig<V, EV>,
  B extends ClassValue = undefined,
  S extends TVSlots = undefined,
  // @ts-expect-error
  E extends TVReturnType = TVReturnType<
    V,
    S,
    B,
    C,
    // @ts-expect-error
    EV extends undefined ? {} : EV,
    // @ts-expect-error
    ES extends undefined ? {} : ES
  >,
  EV extends TVVariants<ES, B, E['variants'], ES> = E['variants'],
  ES extends TVSlots = E['slots'] extends TVSlots ? E['slots'] : undefined,
>(
  slotsFn: TVReturnType<V, S, B, C, EV, ES, E>,
  // @ts-expect-error
  classNames: SlotsToClasses<keyof ReturnType<typeof slotsFn>> | undefined,
  props: TVProps<V, S, C, EV, ES> | Record<string, unknown>,
): ReturnType<TVReturnType<V, S, B, C, EV, ES, E>> => {
  return useMemo(() => getSlots(slotsFn, classNames, props), [slotsFn, classNames, props]);
};
