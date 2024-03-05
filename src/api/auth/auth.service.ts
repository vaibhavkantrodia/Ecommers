import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/schema/user.schema';
import { MESSAGES } from 'src/constant/messages';
import { ResponseDto } from 'src/utils/response.dto';
import { ErrorHandlerService } from 'src/utils/error-handler.service';
import { LoginDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { EmailService } from 'src/helper/email-helper.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private errorHandlerService: ErrorHandlerService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) { }

  // create user
  async signUp(createUserDto: CreateUserDto): Promise<ResponseDto> {
    try {
      const { name, email, phone, password } = createUserDto;
      const existsUser = await this.userModel.findOne({ email });
      if (existsUser) {
        throw new HttpException(MESSAGES.EMAIL_ALREADY_EXISTS_MESSAGE, HttpStatus.BAD_REQUEST);
      }
      const existsPhone = await this.userModel.findOne({ phone });
      if (existsPhone) {
        throw new HttpException(MESSAGES.PHONE_ALREADY_EXISTS_MESSAGE, HttpStatus.BAD_REQUEST);
      }
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await this.userModel.create({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email:email.toLowerCase(),
        phone,
        password: hashedPassword,
      });

      // const emailVerificationLink = `http://localhost:3000/verify-email/${user._id}`;
      // await this.emailService.sendEmail(email, 'Verify email', emailVerificationLink);
      return {
        statusCode: HttpStatus.CREATED,
        message: MESSAGES.USER_CREATE_MESSAGE,
        data: user,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  // login user
  async loginUser(loginDto: LoginDto): Promise<LoginResponseDto> {
    try {
      const user = await this.userModel.findOne({ email: loginDto.email });
      if (!user) {
        throw new HttpException(MESSAGES.USER_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
      }
      const isMatch = await bcrypt.compare(loginDto.password, user.password);
      if (!isMatch) {
        throw new HttpException(MESSAGES.INVALID_CREDENTIALS_MESSAGE, HttpStatus.BAD_REQUEST);
      }
      const accessToken = await this.jwtService.sign({ email: loginDto.email });
      return {
        accessToken,
        statusCode: HttpStatus.OK,
        message: MESSAGES.LOGIN_SUCCESSFULLY_MESSAGE,
        data: user,
      }
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  // forgot password
  async forgotPassword(email: string): Promise<ResponseDto> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new HttpException(MESSAGES.USER_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
      }
      const accessToken = await this.jwtService.sign({ email });
      const resetPasswordLink = `http://localhost:3000/reset-password/${accessToken}`;
      await this.emailService.sendEmail(email, 'Reset password', resetPasswordLink)
      
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGES.FORGOT_PASSWORD_SENT,
        data: user,
      };
    }
    catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  } 

  // reset password
  async resetPassword(password: string, token: string): Promise<ResponseDto> {
    try {
      const { email } = await this.jwtService.verify(token);
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await this.userModel.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });
      if (!user) {
        throw new HttpException(MESSAGES.USER_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
      }
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGES.PASSWORD_RESET_SUCCESSFULLY_MESSAGE,
        data: user,
      };
    }
    catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }
}
