import getPluginConfigs from './get-plugin-configs';
import fs from 'node:fs';
import path from 'node:path';
import getCoreConfig from './get-core-config';
import getPluginizrConfig from './get-pluginizr-config';
import getGeneratedPath from './get-generated-path';

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

    // TODO: Clean up old paths from tsconfig
    const pluginsCompilerPaths = Object.keys(pluginsConfig).reduce<
      Record<string, string[]>
    >((acc, key) => {
      const otherPluginConfig = pluginsConfig[key];

      const generatedPath = getGeneratedPath(otherPluginConfig.packageName);
      const generatedRelativePath = path
        .relative(otherPluginConfig.srcPath, generatedPath)
        .replace(/\\/g, "/");

      if (key === pluginName) {
        acc[`${otherPluginConfig.packageName}/*`] = [
          `${generatedRelativePath}/*`,
          "./*",
        ];
        return acc;
      } else {
        const otherPluginRelativePath =
          path
            .relative(pluginConfig.srcPath, otherPluginConfig.srcPath)
            .replace(/\\/g, "/") || ".";

        acc[`${otherPluginConfig.packageName}/*`] = [
          `${generatedRelativePath}/*`,
          `${otherPluginRelativePath}/*`,
        ];

        return acc;
      }
    }, {});

    tsConfig.compilerOptions.paths = {
      ...tsConfig.compilerOptions.paths,
      [`${coreConfig.packageName}/*`]: [`${coreRelativePath}/*`],
      [`${pluginizrConfig.packageName}/*`]: [`${pluginizrRelativePath}/*`],
      ...pluginsCompilerPaths,
    };

    fs.writeFileSync(
      pluginConfig.tsConfigPath,
      JSON.stringify(tsConfig, null, 2),
    );
  }
};

export default updateTsConfigs;
