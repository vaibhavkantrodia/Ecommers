import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {  USER_Role } from 'src/enum/role.enum';
import { USER_STATUS } from 'src/enum/user-status.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: string;

  @Prop()
  name: string;

  @Prop()
  phone: number;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({type:String, enum:USER_Role, default:USER_Role.USER})
  role: string;

  @Prop({type:String, enum:USER_STATUS, default:USER_STATUS.ACTIVE})
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);