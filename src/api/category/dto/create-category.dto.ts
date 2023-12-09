import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({ example: 'xyz' })
    @IsNotEmpty()
    @IsString()
    name:string

    @IsOptional()
    @IsString()
    image:string
}
