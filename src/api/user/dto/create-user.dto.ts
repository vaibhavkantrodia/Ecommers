import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, Matches, } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'xyz' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '9724472510' })
  @IsNotEmpty()
  @IsNumber()
  phone: number;

  @ApiProperty({ example: 'xyz@gmail.com' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @ApiProperty({ example: '*****' })
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,16}$/, {
    message: 'Your password must be at least 8 characters long, contain at least one number and have a mixture of uppercase and lowercase letters.'
  })
  password: string;

}
