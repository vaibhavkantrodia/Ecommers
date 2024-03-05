import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Product } from "src/api/product/schema/product.schema";
import { ORDER_STATUS } from "src/enum/order-status.enum";

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true})
export class Order {

    _id: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    userId: string;

    @Prop()
    orderId: string;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Product'}])
    productId: Product[];

    @Prop()
    quantity: number;

    @Prop()
    amount: number;

    @Prop({default:ORDER_STATUS.CREATED})
    status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);