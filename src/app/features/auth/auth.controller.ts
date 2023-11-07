import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { LoginDto } from './dto';
import { Public, AuthUser } from '../../common/decorators';
import { JWTPayloadUser } from '../../core/authentication/jwt';
import { LocalAuthGuard } from '../../core/authentication/local';
import { UserEntity } from '../users/entities';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: UserEntity })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(res, req.user as UserEntity);
  }

  @Get('me')
  async me(@AuthUser() user: JWTPayloadUser) {
    return new UserEntity(await this.authService.me(user));
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }
}
