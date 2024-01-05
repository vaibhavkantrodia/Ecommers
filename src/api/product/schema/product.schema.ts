import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { PRODUCT_STATUS } from 'src/enum/product-status.enum';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  _id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  category: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' })
  vendor: string;

  @Prop()
  name: string;

  @Prop()
  image: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  quantity: number;

  @Prop({ type: String, enum: PRODUCT_STATUS, default: PRODUCT_STATUS.ACTIVE })
  status: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
