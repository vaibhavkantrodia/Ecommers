import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ResponseDto } from 'src/utils/response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
 async createUser(@Body() createUserDto: CreateUserDto):Promise<ResponseDto> {
    return await this.authService.signUp(createUserDto);
  }
}
