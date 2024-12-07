import { NextConfig } from 'next';
import { WebpackConfigContext } from 'next/dist/server/config-shared';

import getPluginPathMap from './get-plugin-path-map';

/**
 * Adds the plugin path map to the webpack config aliases
 * @param {NextConfig} nextConfig
 * @returns {NextConfig}
 */
const withCatalystPluginizr = (nextConfig: NextConfig): NextConfig => {
  const basePath = nextConfig.basePath || '';
  const mapping = getPluginPathMap(basePath);

  return {
    ...nextConfig,
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
