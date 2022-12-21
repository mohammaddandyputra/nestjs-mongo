import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductWarrantyClaimDocument = ProductWarrantyClaim & Document;

@Schema()
export class ProductWarrantyClaim {
  @Prop({ required: true })
  product_id: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: false })
  claim_by: string;

  @Prop({ required: false })
  claim_at: Date;

  @Prop({ required: true })
  created_at: Date;

  @Prop({ required: true })
  created_by: string;
}

export const ProductWarrantyClaimSchema =
  SchemaFactory.createForClass(ProductWarrantyClaim);
