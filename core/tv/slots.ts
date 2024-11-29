import { ClassValue } from 'tailwind-variants';

export type SlotsToClasses<S extends string> = {
  [key in S]?: ClassValue;
};

export const getSlots = <Slots extends string>(
  slotsFn: () => Record<Slots, (props: { class?: ClassValue }) => string>,
  classNames: SlotsToClasses<Slots> | undefined,
): Record<Slots, () => string> => {
  const slots = slotsFn();

  return Object.keys(slots).reduce<Record<Slots, () => string>>((acc, k: string) => {
    return {
      ...acc,
      [k]: slots[k]({ class: classNames?.[key] }),
    };
  }, {});
};
