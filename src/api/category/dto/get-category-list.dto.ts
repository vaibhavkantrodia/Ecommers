import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class GetCategoryListDto {
    @ApiProperty({ example: 'totalCount' })
    @IsNumber()
    totalCount: number;

    @ApiProperty({ example: 'limit' })
    @IsNumber()
    limit: number;

    @ApiProperty({ example: 'page' })
    @IsNumber()
    page: number;
}
