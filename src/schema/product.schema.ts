import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  file: string;

  @Prop({ required: true })
  is_warranty: boolean;

  @Prop({ required: true })
  created_at: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
