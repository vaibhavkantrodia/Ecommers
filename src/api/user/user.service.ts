import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, mongo } from 'mongoose';
import { ErrorHandlerService } from 'src/utils/error-handler.service';
import { User } from './schema/user.schema';
import { ResponseDto } from 'src/utils/response.dto';
import { MESSAGES } from 'src/constant/messages';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private errorHandlerService: ErrorHandlerService,
  ) { }

  //get all users
  async getAllUsers(): Promise<ResponseDto> {
    try {
      const user = await this.userModel.find();
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGES.USER_LIST_FETCH_SUCCESS_MESSAGE,
        data: user,
      }
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  //get user by id
  async getUserById(userId: string): Promise<ResponseDto> {
    try {
      
      const user = await this.userModel.findById(userId);
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGES.USER_FETCH_SUCCESS_MESSAGE,
        data: user,
      }
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  //update user by id
  async updateUser(updateUserDto: UpdateUserDto,userId: string): Promise<ResponseDto> {
    try {
      const user = await this.userModel.findOneAndUpdate({ _id: userId }, updateUserDto, { new: true });
      if (!user) {
        throw new HttpException(MESSAGES.USER_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
      }
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGES.USER_UPDATE_MESSAGE,
        data: user,
      }
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  //delete user by id
  async deleteUser(userId: string): Promise<ResponseDto> {
    try {
      const user = await this.userModel.findOneAndDelete({ _id: userId });
      if (!user) {
        throw new HttpException(MESSAGES.USER_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
      }
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGES.USER_DELETE_MESSAGE,
      }
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }
}
