import getPluginsBasePath from './get-plugins-base-path';
import { CatalystPluginConfig } from '../pluginizer/interface';
import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import getPackageConfig from './get-package-config';

/**
 * Get a list of installed plugins and their configurations
 */
const getPluginConfigs = (): Record<string, CatalystPluginConfig> => {
  const result: Record<string, CatalystPluginConfig> = {};
  const basePath = getPluginsBasePath();

  const pluginPaths = fs.readdirSync(basePath);

  for (const p of pluginPaths) {
    try {
      const packageConfig = getPackageConfig(path.join(basePath, p));
      result[packageConfig.packageName] = packageConfig;
    } catch (e: any) {
      console.log(chalk.bgRed.white(e.message));
    }
  }

  return result;
};

export default getPluginConfigs;
