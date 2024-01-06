import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateCartDto {

    @ApiProperty()
    user: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    product: string;

    @ApiProperty()
    @IsNumber({ maxDecimalPlaces: 0 })
    @IsNotEmpty()
    @IsPositive()
    quantity: number;

    @IsNumber()
    @IsOptional()
    price: number;
}
