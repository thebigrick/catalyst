import { CatalystPackageConfig } from '../pluginizer/interface';
import getCorePath from './get-core-path';
import getPackageConfig from './get-package-config';

/**
 * Get the core package configuration
 */
const getCoreConfig = (): CatalystPackageConfig => {
  return getPackageConfig(getCorePath());
};

export default getCoreConfig;
