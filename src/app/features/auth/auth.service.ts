import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/services/users.service';
import { ConfigType } from '@nestjs/config';
import { UserEntity } from '../users/entities';
import { Response } from 'express';
import { Environment } from '../../../util/enum';
import { JWTPayloadUser } from '../../core/authentication/jwt';
import { appConfigFactory } from '../../core/configuration/app';
import { plainToInstance } from 'class-transformer';
import { convertToMilliseconds } from '../../common/helpers';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private jwtService: JwtService,
    @Inject(appConfigFactory.KEY)
    private appConfig: ConfigType<typeof appConfigFactory>,
    private moduleRef: ModuleRef,
  ) {}

  private usersService: UsersService;
  private logger = new Logger(AuthService.name);

  async onModuleInit() {
    this.usersService = await this.moduleRef.resolve(
      UsersService,
      { id: 1 },
      {
        strict: false,
      },
    );
  }

  async validateUser(email: string, password?: string) {
    return this.usersService.validateUser(email, password);
  }

  login(res: Response, user: UserEntity) {
    const serializedUser = plainToInstance(UserEntity, user);
    const payload = { user: serializedUser };

    res.cookie(this.appConfig.auth.cookieName, this.jwtService.sign(payload), {
      httpOnly: true,
      maxAge: convertToMilliseconds(this.appConfig.auth.expiresIn),
      sameSite:
        this.appConfig.nodeEnv === Environment.Production ? 'none' : 'lax',
      secure: this.appConfig.nodeEnv === Environment.Production,
      domain: this.appConfig.baseDomain,
    });

    return serializedUser;
  }

  logout(res: Response) {
    res.clearCookie(this.appConfig.auth.cookieName, {
      httpOnly: true,
      sameSite:
        this.appConfig.nodeEnv === Environment.Production ? 'none' : 'lax',
      secure: this.appConfig.nodeEnv === Environment.Production,
      domain: this.appConfig.baseDomain,
    });
    return;
  }

  me(user: JWTPayloadUser) {
    return this.usersService.findOne({ id: user.id });
  }
}
