import { NextConfig } from 'next';
import { WebpackConfigContext } from 'next/dist/server/config-shared';

import getPluginsConfig from './config/get-plugins-config';

/**
 * Enhance the Next.js configuration with Catalyst plugins support
 * @param {NextConfig} nextConfig
 * @returns {NextConfig}
 */
const withCatalystPluginizr = (nextConfig: NextConfig): NextConfig => {
  const basePath = nextConfig.basePath || '';
  const pluginsConfig = getPluginsConfig(basePath);

  const mapping = Object.values(pluginsConfig).reduce((acc, pluginConfig) => {
    return {
      ...acc,
      [pluginConfig.packageName]: pluginConfig.srcPath,
    };
  }, {});

  const pluginPackages = Object.keys(pluginsConfig);

  return {
    ...nextConfig,
    transpilePackages: [...(nextConfig.transpilePackages || []), ...pluginPackages],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webpack: (config: any, context: WebpackConfigContext) => {
      if (typeof nextConfig.webpack === 'function') {
        // eslint-disable-next-line no-param-reassign,@typescript-eslint/no-unsafe-assignment
        config = nextConfig.webpack(config, context);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      config.resolve.alias = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        ...config.resolve.alias,
        ...mapping,
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return config;
    },
  };
};

export default withCatalystPluginizr;
