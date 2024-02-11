import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true})
export class Order {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    userId: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product'})
    productId: string;

    @Prop()
    quantity: number;

    @Prop()
    price: number;

    @Prop()
    paymentId: string;

    @Prop()
    paymentStatus: string;

    @Prop()
    totalAmount: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);