import { CatalystPlugin } from "@thebigrick/catalyst-pluginizr/pluginizer/interface";
import getRequestConfig from "@bigcommerce/catalyst-core/i18n/request";

const getRequestConfigPlugin: CatalystPlugin<
  typeof getRequestConfig,
  100
> = () => {};

export default getRequestConfigPlugin;
