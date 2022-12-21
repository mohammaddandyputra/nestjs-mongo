import {
  Controller,
  Response,
  Get,
  Post,
  Param,
  UseGuards,
  Patch,
  Delete,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Utils } from 'src/utils/util';
import { JwtAuthGuard } from '../guards/auth.guard';
import { UserDecorator } from '../guards/user.decorator';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../guards/role.decorator';
import { Product } from 'src/schema/product.schema';
import {
  IApprovalWarrantyClaim,
  ICreateProduct,
  IUpdateProduct,
  IWarrantyClaim,
  statusClaim,
} from './product.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { parse } from 'path';
import { v4 as uuidv4 } from 'uuid';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  BodyApprovalWarrantyProductDTO,
  BodyCreateProductDTO,
  BodyUpdateProductDTO,
  ParamProductDTO,
  ParamWarrantyProductDTO,
} from './product.dto';

export const storage = {
  storage: diskStorage({
    destination: './storage/products',
    filename: (req, file, cb) => {
      const filename: string =
        parse(file.originalname).name.replace(/\s/g, '') + uuidv4();

      const extension: string = parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@ApiTags('products')
@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  private util = new Utils();

  // Product lists
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/product')
  getProduct(@Response() res: any): Promise<Product> {
    const data: any = this.productService.productList();
    return this.util.responseSuccess(res, 'Product lists', data, 200);
  }

  // Create Product
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: BodyCreateProductDTO })
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('file', storage))
  @Post('/product')
  async postProduct(
    @Body() body: BodyCreateProductDTO,
    @Response() res: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Product> {
    const payload: ICreateProduct = {
      ...body,
      file: file.filename,
    };

    const data: any = await this.productService.createProduct(payload);
    return this.util.responseSuccess(
      res,
      'Product added successfully',
      data,
      201,
    );
  }

  // Update Product
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: ParamProductDTO })
  @ApiBody({ type: BodyUpdateProductDTO })
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch('/product/:id')
  async updateProduct(
    @Body() body: BodyUpdateProductDTO,
    @Response() res: any,
    @Param('id') id: ParamProductDTO,
  ): Promise<Product> {
    const payload: IUpdateProduct = {
      ...body,
      ...id,
    };

    const data: any = await this.productService.updateProduct(payload);
    return this.util.responseSuccess(
      res,
      'Product updated successfully',
      data,
      201,
    );
  }

  // Delete Product
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: ParamProductDTO })
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('/product/:id')
  async deleteProduct(
    @Response() res: any,
    @Param('id') id: ParamProductDTO,
  ): Promise<any> {
    const data: any = await this.productService.destoyProduct(id);
    return this.util.responseSuccess(
      res,
      'Deleted product successfully',
      data,
      204,
    );
  }

  // Claim warranty
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: ParamWarrantyProductDTO })
  @Roles('USER')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/product/warranty/:id')
  async warrantyClaim(
    @Response() res: any,
    @Param('id') id: ParamWarrantyProductDTO,
    @UserDecorator() user: any,
  ): Promise<any> {
    const payload: IWarrantyClaim = {
      ...id,
      status: statusClaim.PENDING,
      created_by: user.user_id,
    };

    const data: any = await this.productService.warrantyClaim(payload);
    return this.util.responseSuccess(
      res,
      'Warranty claim successfully',
      data,
      201,
    );
  }

  // Product Warranty Lists
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/product/warranty')
  async getWarrantyClaim(@Response() res: any): Promise<any> {
    const data: any = await this.productService.findWarrantyClaimList();
    return this.util.responseSuccess(res, 'Warranty claim lists', data, 200);
  }

  // Approval Warranty Product
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: ParamWarrantyProductDTO })
  @ApiBody({ type: BodyApprovalWarrantyProductDTO })
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch('/product/warranty/:id')
  async approvalWarrantyClaim(
    @Body() body: BodyApprovalWarrantyProductDTO,
    @Response() res: any,
    @Param('id') id: ParamWarrantyProductDTO,
    @UserDecorator() user,
  ): Promise<Product> {
    const payload: IApprovalWarrantyClaim = {
      ...body,
      ...id,
      claim_by: user.user_id,
      claim_at: new Date(),
    };

    const data: any = await this.productService.approvalWarrantyClaim(payload);
    return this.util.responseSuccess(
      res,
      'Product updated successfully',
      data,
      201,
    );
  }
}
