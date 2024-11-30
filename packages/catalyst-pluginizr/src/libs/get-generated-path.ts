import getPluginizrConfig from './get-pluginizr-config';
import path from 'node:path';

/**
 * Get generated path
 * @param packageName
 */
const getGeneratedPath = (packageName: string) => {
  const pluginizrConfig = getPluginizrConfig();

  return path.join(pluginizrConfig.path, "generated", packageName);
};

export default getGeneratedPath;
