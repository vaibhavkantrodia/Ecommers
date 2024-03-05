import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema/order.schema';
import mongoose, { Model } from 'mongoose';
import { ErrorHandlerService } from 'src/utils/error-handler.service';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import { Product } from '../product/schema/product.schema';
import { User } from '../user/schema/user.schema';
import { Cart } from '../cart/schema/cart.schema';
import { CreateOrderResponse } from './dto/order.response';
import { MESSAGES } from 'src/constant/messages';
dotenv.config();

@Injectable()
export class OrderService {
  instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
  });

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private errorHandlerService: ErrorHandlerService,
  ) { }

  async createOrder(user: User): Promise<CreateOrderResponse> {
    try {
      const userCart = await this.cartModel.findOne({ user: user._id });
      const order = await this.instance.orders.create({
        amount: userCart.price,
        currency: 'INR',
        receipt: 'receipt#1',
      });

      const createOrder = await this.orderModel.create({
        userId: user._id,
        productId: userCart.productId,
        orderId: order.id,
        quantity: userCart.quantity,
        amount: userCart.price,
      });
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGES.ORDER_CREATED_SUCCESS,
        data: createOrder,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }


  async getOrderDetailById(orderId: string): Promise<CreateOrderResponse> {
    try {
      const order = await this.orderModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(orderId),
          }
        },
        {
          '$lookup': {
            'from': 'products',
            'localField': 'productId',
            'foreignField': '_id',
            'as': 'productId'
          }
        }, {
          '$unwind': {
            'path': '$productId',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$lookup': {
            'from': 'vendors',
            'localField': 'productId.vendor',
            'foreignField': '_id',
            'as': 'productId.vendor'
          }
        },
         {
          '$unwind': {
            'path': '$productId.vendor',
            'preserveNullAndEmptyArrays': true
          }
        }
      ])
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGES.ORDER_FETCH_SUCCESS,
        data: order,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }
}