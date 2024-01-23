import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ResponseDto } from 'src/utils/response.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /**
   * signup user
   * @param createUserDto 
   * @returns ResponseDto
   */
  @Post('/signup')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<ResponseDto> {
    return await this.authService.signUp(createUserDto);
  }

  /**
   * login user
   * @param loginDto 
   * @returns LoginResponseDto
   */
  @Post('/login')
  async login(@Body() loginDto:LoginDto): Promise<LoginResponseDto> {
    return await this.authService.loginUser(loginDto);
  }

  /**
   * forgot password
   * @param token 
   * @returns ResponseDto
   */
  @Post('/forgot-password')
  async forgotPassword(@Body() email: string): Promise<ResponseDto> {
    return await this.authService.forgotPassword(email);
  }

  /**
   * reset password
   * @param password 
   * @param token 
   * @returns ResponseDto
   */
  @Post('/reset-password')
  async resetPassword(
    @Body() password: string,
    @Param('token') token: string,): Promise<ResponseDto> {
    return await this.authService.resetPassword(password, token);
  }

}
