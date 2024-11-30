import yaml from 'js-yaml';
import fs from 'node:fs';
import path from 'node:path';
import getCatalystBasePath from './get-catalyst-base-path';
import getPluginsBasePath from './get-plugins-base-path';

/**
 * Update the pnpm workspace file with plugins path.
 */
const createPluginsWorkspace = () => {
  const pnpmWorkspace = path.join(getCatalystBasePath(), "pnpm-workspace.yaml");
  const fileContent = fs.readFileSync(pnpmWorkspace, "utf8");
  const data = yaml.load(fileContent) as { packages: string[] };

  if (!data.packages.includes("plugins/*")) {
    data.packages.push("plugins/*");
  }

  fs.writeFileSync(pnpmWorkspace, yaml.dump(data));

  const pluginsPath = getPluginsBasePath();
  if (!fs.existsSync(pluginsPath)) {
    fs.mkdirSync(pluginsPath, { recursive: true });
  }
};

export default createPluginsWorkspace;
