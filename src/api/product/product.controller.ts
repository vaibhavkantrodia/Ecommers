import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { GetProductListDto } from './dto/getProductList.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  CreateProductResponse,
  GetProductDetailResponse,
  GetProductListResponse,
} from './dto/product-response';
import { ResponseDto } from 'src/utils/response.dto';

@ApiTags('product')
@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * create product endpoint
   * @param createProductDto
   * @param file
   * @returns
   */
  @Post('/createProduct')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: any,
  ): Promise<CreateProductResponse> {
    return await this.productService.createProduct(createProductDto, file);
  }

  /**
   * get product list by category endpoint
   * @param getProductListDto
   * @returns
   */
  @Get('/:category')
  async getProductListByCategory(
    @Query() getProductListDto: GetProductListDto,
  ): Promise<GetProductListResponse> {
    return await this.productService.getProductListByCategory(
      getProductListDto,
    );
  }

  /**
   * get product detail by id endpoint
   * @param productId
   * @returns GetProductDetailResponse
   */
  @Get('/:productId')
  async getProductDetail(
    @Param('productId') productId: string,
  ): Promise<GetProductDetailResponse> {
    return await this.productService.getProductDetailById(productId);
  }

  /**
   * update product endpoint
   * @param productId
   * @param updateProductDto
   * @returns
   */
  @Patch('/:productId')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async updateProduct(
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file: any,
  ) {
    return await this.productService.updateProduct(
      productId,
      updateProductDto,
      file,
    );
  }

  /**
   * delete product endpoint
   * @param productId
   * @returns ResponseDto
   */
  @Delete('/:productId')
  async deleteProduct(
    @Param('productId') productId: string,
  ): Promise<ResponseDto> {
    return await this.productService.deleteProduct(productId);
  }
}
