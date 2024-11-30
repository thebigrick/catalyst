import fs from 'node:fs';
import path from 'node:path';
import { CatalystPackageConfig } from '../pluginizer/interface';

/**
 * Get a package configuration
 */
const getPackageConfig = (packagePath: string): CatalystPackageConfig => {
  const packageJsonPath = path.join(packagePath, "package.json");
  const tsConfigPath = path.join(packagePath, "tsconfig.json");

  if (!fs.existsSync(packageJsonPath) || !fs.existsSync(tsConfigPath)) {
    throw new Error(
      `Skipping ${packagePath} as it does not have package.json or tsconfig.json`,
    );
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, "utf-8"));

  const baseUrl = tsConfig.compilerOptions?.baseUrl || ".";

  return {
    packageName: packageJson.name,
    tsConfigPath: tsConfigPath,
    packageJsonPath: packageJsonPath,
    path: packagePath,
    srcPath: path.join(packagePath, baseUrl),
  };
};

export default getPackageConfig;
