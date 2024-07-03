// export const environment = {
//   production: false
// }
import * as config from '../config/local_config.json';

export const environment = {
  ...(config as any).default,
  production: false,
};
