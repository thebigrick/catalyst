import { CatalystPackageConfig } from '../pluginizer/interface';
import getPackageConfig from './get-package-config';
import getPluginizrPath from './get-pluginizr-path';

/**
 * Get the pluginizr package configuration
 */
const getPluginizrConfig = (): CatalystPackageConfig => {
  return getPackageConfig(getPluginizrPath());
};

export default getPluginizrConfig;
