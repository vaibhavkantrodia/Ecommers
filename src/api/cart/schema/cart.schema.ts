import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { PRODUCT_STATUS } from 'src/enum/product-status.enum';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
    _id: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: string;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Product'}])
    productId: string[];

    @Prop()
    price: number;

    @Prop()
    quantity: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
