import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { ResponseDto } from 'src/utils/response.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('userList')
  async getAllUsers(): Promise<ResponseDto> {
    return await this.userService.getAllUsers();
  }

  @Get(':userId')
  async getUserById(@Param('userId') userId: string): Promise<ResponseDto> {
    return await this.userService.getUserById(userId);
  }

  @Patch('update/:userId')
  updateUser(@Body() updateUserDto: UpdateUserDto,@Param('userId') userId: string): Promise<ResponseDto> {
    return this.userService.updateUser(updateUserDto,userId);
  }

  @Delete('delete/:userId')
  async deleteUser(@Param('userId') userId: string): Promise<ResponseDto> {
    return await this.userService.deleteUser(userId);
  }
}
