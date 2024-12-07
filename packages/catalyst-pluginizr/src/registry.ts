import { Plugin } from './types';

const plugins: Record<string, Plugin[]> = {};

export const register = (plugin: Plugin) => {
  plugins[plugin.component] ??= [];
  plugins[plugin.component].push(plugin);
};

export const getPlugins = (component: string): Plugin[] => {
  return plugins[component] ?? [];
};
