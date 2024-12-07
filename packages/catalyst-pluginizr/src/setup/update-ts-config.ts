import fs from 'node:fs';
import path from 'node:path';

import getPackageBaseUrl from '../config/get-package-base-url';
import getSelfRoot from '../config/get-self-root';
import getPluginPathMap from '../get-plugin-path-map';

/**
 * Update the tsconfig.json file with the plugin paths
 * @returns {void}
 */
const updateTsConfig = (): void => {
  const selfRoot = getSelfRoot();

  const selfBaseUrl = getPackageBaseUrl(selfRoot);
  const selfBaseUrlPath = path.join(selfRoot, selfBaseUrl);
  const pluginsPathMap = getPluginPathMap(path.join(selfRoot, selfBaseUrl));

  const selfTsConfigFile = path.join(selfRoot, 'tsconfig.json');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const selfTsConfig = JSON.parse(fs.readFileSync(selfTsConfigFile, 'utf-8'));

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  selfTsConfig.compilerOptions.paths = Object.keys(pluginsPathMap).reduce<Record<string, string[]>>(
    (acc, key) => {
      acc[key] = [path.relative(selfBaseUrlPath, pluginsPathMap[key]).replace(/\\/g, '/')];

      return acc;
    },
    {},
  );

  fs.writeFileSync(selfTsConfigFile, JSON.stringify(selfTsConfig, null, 2));
};

export default updateTsConfig;
