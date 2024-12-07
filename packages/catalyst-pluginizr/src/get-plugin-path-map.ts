import fs from 'node:fs';
import path from 'node:path';

import getPackageBaseUrl from './config/get-package-base-url';
import getPackageName from './config/get-package-name';
import getPluginsBasePath from './config/get-plugins-base-path';

/**
 * Get the plugin path map by scanning the plugins folder
 * @param {string} relativeTo
 * @returns {Record<string, string>}
 */
const getPluginPathMap = (relativeTo: string): Record<string, string> => {
  const plugins: Record<string, string> = {};

  const pluginsFullPath = getPluginsBasePath();
  const pluginFolders = fs.readdirSync(pluginsFullPath);

  // eslint-disable-next-line no-restricted-syntax
  for (const pluginFolder of pluginFolders) {
    const pluginPath = path.join(pluginsFullPath, pluginFolder);

    try {
      const packageName = getPackageName(path.join(pluginPath));
      const tsConfigBaseUrl = getPackageBaseUrl(pluginPath);

      plugins[packageName] = path
        .resolve(relativeTo, path.join(pluginsFullPath, pluginFolder, tsConfigBaseUrl))
        .replace(/\\/g, '/');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      /* empty */
    }
  }

  return plugins;
};

export default getPluginPathMap;
