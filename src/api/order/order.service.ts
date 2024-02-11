import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema/order.schema';
import { Model } from 'mongoose';
import { ErrorHandlerService } from 'src/utils/error-handler.service';
import Razorpay from 'razorpay';

@Injectable()
export class OrderService {
    private instance: any

    constructor(
        @InjectModel(Order.name) private orderModel: Model<Order>,
        private errorHandlerService: ErrorHandlerService,
    ) {
        this.instance = new Razorpay({
            key_id: 'YOUR_KEY_ID',
            key_secret: 'YOUR_KEY_SECRET',
        });
    }
}