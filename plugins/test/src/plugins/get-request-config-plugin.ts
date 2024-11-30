import { CatalystPlugin } from "@thebigrick/catalyst-pluginizr/pluginizer/interface";
import getRequestConfig from "@bigcommerce/catalyst-core/i18n/request";
import anotherFn from "@test/test1/plugins/another-fn";

const getRequestConfigPlugin: CatalystPlugin<
  typeof getRequestConfig,
  100
> = () => {
  anotherFn();
};

export default getRequestConfigPlugin;
