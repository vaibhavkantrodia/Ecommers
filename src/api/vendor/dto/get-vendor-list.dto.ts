import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GetVendorListDto {

    @ApiProperty({ default: 10 })
    @IsNumber()
    @IsNotEmpty()
    limit: number;

    @ApiProperty({ default: 1 })
    @IsNumber()
    @IsNotEmpty()
    page: number;

    @ApiProperty({ default: '' })
    @IsString()
    search: string;
}
