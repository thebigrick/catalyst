import getCatalystBasePath from './get-catalyst-base-path';
import path from 'node:path';

/**
 * Get the base path of the plugins.
 */
const getPluginsBasePath = (): string => {
  return path.join(getCatalystBasePath(), "plugins");
};

export default getPluginsBasePath;
