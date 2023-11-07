import { Environment } from '../../src/util/enum';
import { devSetup, prodSetup } from './setups';

const main = async () => {
  if (process.env.NODE_ENV.toLowerCase() === Environment.Production) {
    await prodSetup();
  } else if (process.env.NODE_ENV.toLowerCase() === Environment.Development) {
    await devSetup();
  }
};

main();
