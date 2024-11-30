import React, { ReactElement } from "react";

export interface CatalystPlugin<
  TSourceFn extends (...args: any[]) => any,
  TPluginPriority = 100,
> {
  (
    callback: TSourceFn,
    ...args: Parameters<TSourceFn>
  ): ReturnType<TSourceFn> | TSourceFn | any;
}

export interface CatalystFCPlugin<
  TSourceComponent extends React.FC<unknown>,
  TPluginPriority = 100,
> {
  (
    props: (TSourceComponent extends React.FC<infer P> ? P : never) & {
      SourceElement: TSourceComponent;
    },
  ): ReactElement;
}

export interface CatalystPackageConfig {
  packageName: string;
  tsConfigPath: string;
  packageJsonPath: string;
  path: string;
  srcPath: string;
  baseUrl: string;
}

export interface CatalystPluginConfig extends CatalystPackageConfig {}
