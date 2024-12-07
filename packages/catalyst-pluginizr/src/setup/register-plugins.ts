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

      return `import '${packageName}/register-plugins';`;
    })
    .filter((importStatement) => importStatement !== null);

  const fileContent =
    // eslint-disable-next-line prefer-template
    '/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved */\n\n' +
    '// Do not edit this file manually, it is auto-generated by catalyst-pluginizr\n\n' +
    importStatements.join('\n') +
    '\n';

  fs.writeFileSync(selfRegisterFilePath, fileContent);
};

export default registerPlugins;
