import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema/order.schema';
import { Model } from 'mongoose';
import { ErrorHandlerService } from 'src/utils/error-handler.service';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import { Product } from '../product/schema/product.schema';
import { User } from '../user/schema/user.schema';
import { Cart } from '../cart/schema/cart.schema';
import { ORDER_STATUS } from 'src/enum/order-status.enum';
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

    async createOrder(user: User) {
        try {
            const userCart = await this.cartModel.findOne({ user: user._id }).populate('product').populate('user');
            const order = await this.instance.orders.create({
                amount: userCart.price*100,
                currency: 'INR',
                receipt: 'receipt#1',

            });

            await this.orderModel.create({
                user: userCart.user,
                orderId: order.id,
                amount: userCart.price,
                productId: userCart.productId,
                quantity: userCart.quantity,
                status: ORDER_STATUS.CREATED,
            });
            return order
        } catch (error) {
            await this.errorHandlerService.HttpException(error);
        }
    }
}