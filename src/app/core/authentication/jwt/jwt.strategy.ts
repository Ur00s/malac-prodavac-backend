import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { appConfigFactory } from '../../configuration/app/app-config.factory';
import { JwtPayload } from './jwt-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(appConfigFactory.KEY)
    private readonly config: ConfigType<typeof appConfigFactory>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.cookieJwtExtractorBuilder(config),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.security.secretKey,
    });
  }

  private static cookieJwtExtractorBuilder(
    config: ConfigType<typeof appConfigFactory>,
  ) {
    return (req: Request): string => {
      return req.cookies?.[config.auth.cookieName] || null;
    };
  }

  async validate({ user }: JwtPayload) {
    return user;
  }
}
