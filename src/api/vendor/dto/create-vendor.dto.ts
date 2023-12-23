import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty,  IsString } from "class-validator"

export class CreateVendorDto {
    @ApiProperty({ example: 'xyz' })
    @IsNotEmpty()
    @IsString()
    companyName:string

    @ApiProperty({ example: 'xyz' })
    @IsString()
    @IsNotEmpty()
    companyAddress:string

    @ApiProperty({ example: '9876543210' })
    @IsString()
    @IsNotEmpty()
    companyPhone:string

    @ApiProperty({ example: 'Id' })
    @IsString()
    @IsNotEmpty()
    userId:string
}
