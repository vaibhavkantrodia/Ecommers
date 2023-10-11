import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'abc.xyz@bytestechnolab.com' })
  @IsEmail()
  @IsNotEmpty()
  @Matches(/([a-z,A-Z]+).([a-z,A-Z]+)@bytestechnolab.com$/)
  email: string;

  @ApiProperty({ example: '********' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
