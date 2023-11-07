import { Environment } from '../../../../util/enum';

export interface AppConfig {
  nodeEnv: Environment;
  apiPort: number;
  baseDomain: string;
  protocol: string;
  maxFileSizeB: number;
  multerDest: string;
  userMediaDest: string;
  productMediaDest: string;

  security: {
    secretKey: string;
    passwordSaltRounds: number;
  };

  auth: {
    cookieName: string;
    expiresIn: string;
  };

  throttler: {
    ttl: number;
    limit: number;
  };
}
