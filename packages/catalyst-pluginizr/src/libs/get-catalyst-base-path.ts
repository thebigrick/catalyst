import path from 'node:path';

/**
 * Get the base path of the Catalyst project.
 */
const getCatalystBasePath = (): string => {
  return path.resolve(__dirname, "../../../../");
};

export default getCatalystBasePath;
