import path from 'node:path';
import getCatalystBasePath from './get-catalyst-base-path';

/**
 * Get the path to the catalyst core
 */
const getCorePath = (): string => {
  return path.join(getCatalystBasePath(), "core");
};

export default getCorePath;
