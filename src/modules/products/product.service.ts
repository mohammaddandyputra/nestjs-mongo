import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../../schema/product.schema';
import {
  ProductWarrantyClaim,
  ProductWarrantyClaimDocument,
} from '../../schema/product_warranty_claim.schema';
import {
  IApprovalWarrantyClaim,
  ICreateProduct,
  IDeleteProduct,
  IUpdateProduct,
  IWarrantyClaim,
} from './product.interface';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly ProductModel: Model<ProductDocument>,

    @InjectModel(ProductWarrantyClaim.name)
    private readonly ProductWarrantyClaimModel: Model<ProductWarrantyClaimDocument>,
  ) {}

  async productList(): Promise<any> {
    const products: any = await this.ProductModel.find();

    return products;
  }

  async createProduct(payload: ICreateProduct): Promise<any> {
    const product: any = await new this.ProductModel({
      ...payload,
      created_at: Date.now(),
    }).save();

    return product;
  }

  async updateProduct(payload: IUpdateProduct): Promise<any> {
    const { id, ...data } = payload;

    if (!payload.file) {
      delete data.file;
    }

    const product: any = await this.ProductModel.findByIdAndUpdate(id, {
      $set: data,
    });

    if (!product) {
      throw new HttpException('Product not found', 404);
    }

    return product;
  }

  async destoyProduct(id: IDeleteProduct): Promise<any> {
    const product: any = await this.ProductModel.findByIdAndRemove(id);

    if (!product) {
      throw new HttpException('Product not found', 404);
    }

    return product;
  }

  async warrantyClaim(payload: IWarrantyClaim): Promise<ProductWarrantyClaim> {
    const { product_id, created_by } = payload;
    const product: any = await this.ProductModel.findById(product_id);

    if (!product) {
      throw new HttpException('Product not found', 404);
    }

    const findWarrantyClaim: any = await this.ProductWarrantyClaimModel.findOne(
      { product_id, created_by },
    );

    if (findWarrantyClaim) {
      throw new HttpException(
        'You have already filed a warranty claim on this product',
        400,
      );
    }

    if (!product.is_warranty) {
      throw new HttpException('This product is not guaranteed', 400);
    }

    const warranty_claim: any = await new this.ProductWarrantyClaimModel({
      ...payload,
      created_at: Date.now(),
    }).save();

    return warranty_claim;
  }

  async findWarrantyClaimList(): Promise<ProductWarrantyClaim> {
    const warranty_claim: any = await this.ProductWarrantyClaimModel.find();

    return warranty_claim;
  }

  async approvalWarrantyClaim(payload: IApprovalWarrantyClaim): Promise<any> {
    const { id, ...data }: IApprovalWarrantyClaim = payload;
    const warranty_claim: any =
      await this.ProductWarrantyClaimModel.findByIdAndUpdate(id, {
        $set: data,
      });

    if (!warranty_claim) {
      throw new HttpException('ID warranty not found', 404);
    }

    return warranty_claim;
  }
}
