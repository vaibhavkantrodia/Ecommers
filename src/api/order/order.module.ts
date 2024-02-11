import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from './schema/order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schema/user.schema';
import { ErrorHandlerService } from 'src/utils/error-handler.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name:Order.name, schema: OrderSchema},
      {name:User.name, schema: UserSchema}
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService,ErrorHandlerService],
})
export class OrderModule {}