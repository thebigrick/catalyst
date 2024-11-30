import getPluginConfigs from './get-plugin-configs';
import fs from 'node:fs';
import path from 'node:path';
import getCoreConfig from './get-core-config';
import getPluginizrConfig from './get-pluginizr-config';

/**
 * Update tsconfig paths for plugins
 */
const updateTsConfigs = () => {
  const pluginsConfig = getPluginConfigs();
  const coreConfig = getCoreConfig();
  const pluginizrConfig = getPluginizrConfig();

  for (const pluginName in pluginsConfig) {
    const pluginConfig = pluginsConfig[pluginName];
    const tsConfig = JSON.parse(
      fs.readFileSync(pluginConfig.tsConfigPath, "utf-8"),
    );

    const coreRelativePath = path
      .relative(pluginConfig.srcPath, coreConfig.srcPath)
      .replace(/\\/g, "/");

    const pluginizrRelativePath = path
      .relative(pluginConfig.srcPath, pluginizrConfig.srcPath)
      .replace(/\\/g, "/");

    tsConfig.compilerOptions.paths = {
      [`${coreConfig.packageName}/*`]: [`${coreRelativePath}/*`],
      [`${pluginizrConfig.packageName}/*`]: [`${pluginizrRelativePath}/*`],
      ...tsConfig.compilerOptions.paths,
    };

    fs.writeFileSync(
      pluginConfig.tsConfigPath,
      JSON.stringify(tsConfig, null, 2),
    );
  }
};

export default updateTsConfigs;
