import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { ResponseDto } from 'src/utils/response.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  /**
   * get all users endpoint
   * @returns ResponseDto
   */
  @Get('userList')
  async getAllUsers(): Promise<ResponseDto> {
    return await this.userService.getAllUsers();
  }

  /**
   * get user by id endpoint
   * @param userId 
   * @returns ResponseDto
   */
  @Get(':userId')
  async getUserById(@Param('userId') userId: string): Promise<ResponseDto> {
    return await this.userService.getUserById(userId);
  }

  /**
   * update user endpoint
   * @param updateUserDto 
   * @param userId 
   * @returns ResponseDto
   */
  @Patch('update/:userId')
  updateUser(@Body() updateUserDto: UpdateUserDto,@Param('userId') userId: string): Promise<ResponseDto> {
    return this.userService.updateUser(updateUserDto,userId);
  }

  /**
   * delete user endpoint
   * @param userId 
   * @returns ResponseDto
   */
  @Delete('delete/:userId')
  async deleteUser(@Param('userId') userId: string): Promise<ResponseDto> {
    return await this.userService.deleteUser(userId);
  }
}
