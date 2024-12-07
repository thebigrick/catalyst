import fs from 'node:fs';
import path from 'node:path';

import getPackageBaseUrl from '../config/get-package-base-url';
import getPluginsConfig from '../config/get-plugins-config';
import getSelfRoot from '../config/get-self-root';

const selfRegisterFile = 'plugins.ts';

/**
 * Register plugins
 * @returns {void}
 */
const registerPlugins = (): void => {
  const selfRoot = getSelfRoot();
  const pluginsConfig = Object.values(getPluginsConfig(selfRoot));

  const getSelfBaseUrl = getPackageBaseUrl(getSelfRoot());
  const selfRegisterFilePath = path.join(getSelfRoot(), getSelfBaseUrl, selfRegisterFile);

  const importStatements = pluginsConfig
    .map((pluginConfig) => {
      const { packageName, srcPath } = pluginConfig;

      const pluginRegisterFile = path.join(srcPath, 'register-plugins.ts');

      if (!fs.existsSync(pluginRegisterFile)) {
        return null;
      }

      return `import '${packageName}/register-plugins.ts';`;
    })
    .filter((importStatement) => importStatement !== null);

  fs.writeFileSync(selfRegisterFilePath, importStatements.join('\n'));
};

export default registerPlugins;
