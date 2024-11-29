import { tv } from 'tailwind-variants';

const inputSlots = tv({
  slots: {
    wrapper: 'relative',
    base: 'peer w-full appearance-none border-2 border-gray-200 px-12 py-3 text-base placeholder:text-gray-500 hover:border-primary focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:bg-gray-100 disabled:hover:border-gray-200',
    searchIcon:
      'pointer-events-none absolute start-3 top-0 flex h-full items-center peer-hover:text-primary peer-focus-visible:text-primary peer-disabled:text-gray-200',
    clearButton:
      'absolute end-1.5 top-1/2 w-auto -translate-y-1/2 border-0 bg-transparent p-1.5 text-black hover:bg-transparent hover:text-primary focus-visible:text-primary peer-hover:text-primary peer-focus-visible:text-primary',
    loadingWrapper:
      'pointer-events-none absolute end-3 top-0 flex h-full items-center text-primary peer-disabled:text-gray-200',
    loadingSpinner: 'animate-spin',
  },
  variants: {
    style: {
      alternate: {
        base: 'bg-black text-white',
      },
    },
  },
});

export type InputSlots = keyof ReturnType<typeof inputSlots>;

export default inputSlots;
