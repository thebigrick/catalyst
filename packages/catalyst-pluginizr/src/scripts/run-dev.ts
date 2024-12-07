import { watch } from "chokidar";
import path from "node:path";

import getPluginsBasePath from "../config/get-plugins-base-path";
import setupPlugins from "../setup/setup-plugins";
import updateTsConfig from "../setup/update-ts-config";

const watchFiles = ["package.json", "tsconfig.json"];

/**
 * Run the development environment
 * @returns {void}
 */
const runDev = (): void => {
  setupPlugins();

  const targetFolder = getPluginsBasePath();
  const watchPatterns = [
    targetFolder,
    ...watchFiles.map((file) => path.join(targetFolder, "**", file)),
  ];

  const watcher = watch(watchPatterns, {
    persistent: true,
    ignoreInitial: false,
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100,
    },
  });

  watcher
    .on("add", (file: string) => {
      const fileName = path.basename(file);

      if (watchFiles.includes(fileName)) {
        updateTsConfig();
      }
    })
    .on("change", (file: string) => {
      const fileName = path.basename(file);

      if (watchFiles.includes(fileName)) {
        updateTsConfig();
      }
    })
    .on("unlink", (file: string) => {
      const fileName = path.basename(file);

      if (watchFiles.includes(fileName)) {
        updateTsConfig();
      }
    });

  process.on("SIGINT", () => {
    watcher
      .close()
      .then(() => {
        process.exit(0);
      })
      .catch(() => {
        process.exit(1);
      });
  });
};

runDev();
