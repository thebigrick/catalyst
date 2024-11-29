/* eslint-disable @typescript-eslint/no-explicit-any */
import { RefObject } from 'react';

export interface ComponentHookResult<
  TData extends Record<string, any> = Record<string, any>,
  THandlers extends Record<string, (...args: any[]) => void> = Record<
    string,
    (...args: any[]) => void
  >,
  TRefs extends Record<string, RefObject<any>> = Record<string, RefObject<any>>,
> {
  data: TData;
  handlers: THandlers;
  refs: TRefs;
}

export type ComponentHook<
  TProps = any,
  TData extends Record<string, any> = Record<string, any>,
  THandlers extends Record<string, (...args: any[]) => void> = Record<
    string,
    (...args: any[]) => void
  >,
  TRefs extends Record<string, RefObject<any>> = Record<string, RefObject<any>>,
> = (props: TProps) => ComponentHookResult<TData, THandlers, TRefs>;
