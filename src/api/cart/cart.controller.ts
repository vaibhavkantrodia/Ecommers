import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/utils/response.dto';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  /**
   * create cart endpoint
   * @param createCartDto 
   * @returns ResponseDto
   */
  @Post('/createCart')
  async create(@Body() createCartDto: CreateCartDto): Promise<ResponseDto> {
    return await this.cartService.createCart(createCartDto);
  }

  /**
   * get all cart endpoint
   * @returns ResponseDto
   */
  @Get(':user')
  async findOne(@Param('user') user: string): Promise<ResponseDto> {
    return await this.cartService.getCartByUser(user);
  }

  /**
   * delete cart endpoint
   * @param id 
   * @returns ResponseDto
   */
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ResponseDto> {
    return await this.cartService.removeCart(id);
  }
}
