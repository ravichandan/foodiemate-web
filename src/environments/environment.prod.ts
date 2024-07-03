// export const environment = {
//   production: true
// }

import * as config from '../config/config.json';

export const environment = {
  ...(config as any).default,
  production: true,
};
