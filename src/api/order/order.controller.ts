import {  Controller, Param, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/decorator/getUser.decorator';
import { User } from '../user/schema/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorator/roles.decorator';
import { RolesGuard } from '../auth/guard/role.guard ';
import { USER_ROLE } from 'src/enum/role.enum';
import { CreateOrderResponse } from './dto/order.response';

@ApiTags('order')
@ApiBearerAuth()
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post('createOrder')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_ROLE.CUSTOMER)
  async create(@GetUser() user: User): Promise<CreateOrderResponse> {
    return await this.orderService.createOrder(user);
  }

  @Post('/:orderId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_ROLE.CUSTOMER || USER_ROLE.ADMIN)
  async getOrderDetailById(@Param('orderId') orderId: string): Promise<CreateOrderResponse> {
    return await this.orderService.getOrderDetailById(orderId);
  }
}