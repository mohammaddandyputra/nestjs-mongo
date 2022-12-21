import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductSchema, Product } from '../../schema/product.schema';
import {
  ProductWarrantyClaimSchema,
  ProductWarrantyClaim,
} from '../../schema/product_warranty_claim.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductWarrantyClaim.name, schema: ProductWarrantyClaimSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
