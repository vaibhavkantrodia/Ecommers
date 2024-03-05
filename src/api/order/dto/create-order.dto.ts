import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";
import { Product } from "src/api/product/schema/product.schema";

export class CreateOrderDto {

    @ApiProperty()
    @IsString()
    userId: string;

    @ApiProperty()
    @IsString()
    orderId: string;

    @ApiProperty()
    @IsString()
    @IsArray()
    productId: Product[];

    @ApiProperty()
    @IsNumber()
    quantity: number;

    @ApiProperty()
    @IsNumber()
    amount: number;
}