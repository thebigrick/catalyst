import createPluginsWorkspace from "./libs/create-plugins-workspace";
import updateTsConfigs from "./libs/update-ts-configs";

const setup = async () => {
  createPluginsWorkspace();
  updateTsConfigs();
};

(async () => {
  await setup();
})();
