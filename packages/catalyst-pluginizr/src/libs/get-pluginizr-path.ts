import path from 'node:path';

/**
 * Get the path to the pluginizr package
 */
const getPluginizrPath = (): string => {
  return path.join(__dirname, "..", "..");
};

export default getPluginizrPath;
