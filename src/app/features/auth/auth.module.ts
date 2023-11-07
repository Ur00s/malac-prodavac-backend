import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard, JwtStrategy } from '../../core/authentication/jwt';
import { LocalStrategy, LocalAuthGuard } from '../../core/authentication/local';

@Global()
@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    LocalAuthGuard,
    JwtAuthGuard,
    JwtStrategy,
  ],
  exports: [AuthService, JwtAuthGuard, LocalAuthGuard],
})
export class AuthModule {}
