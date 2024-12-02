import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../../common/dto/create-user.dto';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //AUTH-001 (회원 가입)
  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  async register(@Body() createUserDto : CreateUserDto) {
    const { email, nickname, password } = createUserDto;
    console.log(`${Date.now()}async register(): {email: ${email}, nickname: ${nickname}, password: ${password} }`);
    return this.authService.register(email, nickname, password);
  }

  //AUTH-002 (사용자 로그인)
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  async login(
      @Body('email') email: string,
      @Body('password') password: string,
      @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token } = await this.authService.login(email, password);

    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return { message: 'Login successful' };
  }

  //AUTH-003 (사용자 로그아웃)
  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  logout(@Res() res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return res.status(200).json({ message: 'Logout successful' });
  }
}
