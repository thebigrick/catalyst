import fs from 'node:fs';
import path from 'node:path';

import getPackageBaseUrl from '../config/get-package-base-url';
import getPackageName from '../config/get-package-name';
import getSelfRoot from '../config/get-self-root';
import getPluginPathMap from '../get-plugin-path-map';

const selfRegisterFile = 'plugins.ts';

/**
 * Register plugins
 * @returns {void}
 */
const registerPlugins = (): void => {
  const selfRoot = getSelfRoot();
  const pluginPaths = Object.values(getPluginPathMap(selfRoot));

  const getSelfBaseUrl = getPackageBaseUrl(getSelfRoot());
  const selfRegisterFilePath = path.join(getSelfRoot(), getSelfBaseUrl, selfRegisterFile);

  const importStatements = pluginPaths
    .map((pluginBasePath) => {
      const packageName = getPackageName(pluginBasePath);
      const baseUrl = getPackageBaseUrl(pluginBasePath);

      const pluginRegisterFile = path.join(pluginBasePath, baseUrl, 'register-plugins.ts');

      if (!fs.existsSync(pluginRegisterFile)) {
        return null;
      }

      return `import '${packageName}/register-plugins.ts';`;
    })
    .filter((importStatement) => importStatement !== null);

  fs.writeFileSync(selfRegisterFilePath, importStatements.join('\n'));
};

export default registerPlugins;
