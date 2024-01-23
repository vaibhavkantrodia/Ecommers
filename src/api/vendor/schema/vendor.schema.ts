import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type VendorDocument = HydratedDocument<Vendor>;

@Schema()
export class Vendor {
    _id: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    userId: string;
   
    @Prop()
    companyName: string;

    @Prop()
    companyAddress: string;

    @Prop()
    companyPhone: string;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);