import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateOrderDto {

    @ApiProperty()
    @IsString()
    userId: string;

    @ApiProperty()
    @IsString()
    @IsArray()
    productId: [string];

    @ApiProperty()
    @IsNumber()
    quantity: number;

    @ApiProperty()
    @IsNumber()
    price: number;
}