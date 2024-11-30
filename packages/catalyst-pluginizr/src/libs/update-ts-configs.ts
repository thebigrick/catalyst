import getPluginConfigs from "./get-plugin-configs";
import fs from "node:fs";
import path from "node:path";
import getCoreConfig from "./get-core-config";
import getPluginizrConfig from "./get-pluginizr-config";
import getGeneratedPath from "./get-generated-path";

/**
 * Update tsconfig paths for plugins
 */
const updatePluginTsConfigs = () => {
  const pluginConfigs = getPluginConfigs();
  const pluginizrConfig = getPluginizrConfig();

  for (const pluginName in pluginConfigs) {
    const pluginConfig = pluginConfigs[pluginName];
    const tsConfig = JSON.parse(
      fs.readFileSync(pluginConfig.tsConfigPath, "utf-8"),
    );

    const pluginizrRelativePath = path
      .relative(pluginConfig.srcPath, pluginizrConfig.srcPath)
      .replace(/\\/g, "/");

    // TODO: Clean up old paths from tsconfig
    const pluginsCompilerPaths = Object.keys(pluginConfigs).reduce<
      Record<string, string[]>
    >((acc, key) => {
      const otherPluginConfig = pluginConfigs[key];

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
      [`${pluginizrConfig.packageName}/*`]: [`${pluginizrRelativePath}/*`],
      ...pluginsCompilerPaths,
    };

    fs.writeFileSync(
      pluginConfig.tsConfigPath,
      JSON.stringify(tsConfig, null, 2),
    );
  }
};

const updateCoreTsConfig = () => {
  const coreConfig = getCoreConfig();
  const tsConfig = JSON.parse(
    fs.readFileSync(coreConfig.tsConfigPath, "utf-8"),
  );
  const generatedPath = getGeneratedPath(coreConfig.packageName);
  const relativeGeneratedPath = path.relative(
    coreConfig.srcPath,
    generatedPath,
  );

  tsConfig.compilerOptions.paths = {
    ...tsConfig.compilerOptions.paths,
    [`~/*`]: [`${relativeGeneratedPath}/*`, `${coreConfig.baseUrl}/*`],
  };

  fs.writeFileSync(coreConfig.tsConfigPath, JSON.stringify(tsConfig, null, 2));
};

const updateTsConfigs = () => {
  updatePluginTsConfigs();
  updateCoreTsConfig();
};

export default updateTsConfigs;
