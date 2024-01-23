import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schema/cart.schema';
import { Model } from 'mongoose';
import { ErrorHandlerService } from 'src/utils/error-handler.service';
import { Product } from '../product/schema/product.schema';
import { ResponseDto } from 'src/utils/response.dto';
import { MESSGES } from 'src/constant/messages';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly errorHandlerService: ErrorHandlerService
  ) { }

  // create Cart
  async createCart(createCartDto: CreateCartDto): Promise<ResponseDto> {
    try {
      const { price, user, product, quantity } = createCartDto;

      const productDetail = await this.productModel.findById(product);
      if (!productDetail) {
        throw new HttpException(MESSGES.PRODUCT_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
      }

      const existsCart = await this.cartModel.findOne({ product });
      if (existsCart) {

        if(quantity <= productDetail.quantity){
          throw new HttpException(MESSGES.OUT_OF_STOCK, HttpStatus.NOT_FOUND);
        }
        existsCart.quantity += quantity;
        const newPrice = productDetail.price * quantity;
        existsCart.price += newPrice;
        existsCart.save();
        return {
          statusCode: HttpStatus.OK,
          message: MESSGES.CART_UPDATE_MESSAGE,
          data: existsCart
        };
      } 
        const cart = await this.cartModel.create({
          price: productDetail.price,
          user,
          product,
          quantity
        });
        return {
          statusCode: HttpStatus.OK,
          message:MESSGES.CART_CREATE_MESSAGE,
          data: cart
        };
      
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  //get Cart by user

 async getCartByUser(user: string): Promise<ResponseDto>  {
    try {
      const cart = await this.cartModel.find({ user }).populate('product').populate('user');
      return {
        statusCode: HttpStatus.OK,
        message: MESSGES.CART_FETCH_SUCCESS,
        data: cart
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

async  removeCart(id: string): Promise<ResponseDto> {
    try {
      const cart = this.cartModel.findByIdAndDelete(id);
      if (!cart) {
        throw new HttpException(MESSGES.CART_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
      }
      return {
        statusCode: HttpStatus.OK,
        message: MESSGES.CART_DELETE_MESSAGE,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }
}
