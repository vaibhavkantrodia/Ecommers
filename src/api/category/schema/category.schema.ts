import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CATEGORY_STATUS } from 'src/enum/category-status.enum';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  _id: string;

  @Prop()
  name: string;
  
  @Prop()
  image: string;

  @Prop({ type: String, enum: CATEGORY_STATUS, default: CATEGORY_STATUS.ACTIVE })
  status: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);