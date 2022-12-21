import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { statusClaim } from './product.interface';

export class BodyCreateProductDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Product name',
  })
  title: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Image file you want to upload',
    type: 'string',
    format: 'binary',
  })
  file: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Warranty or not',
  })
  is_warranty: boolean;
}

export class BodyUpdateProductDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Product name',
  })
  title: string;

  @ApiProperty({
    description: 'Image file you want to upload',
    type: 'string',
    format: 'binary',
  })
  file: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Warranty or not',
  })
  is_warranty: boolean;
}

export class ParamProductDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Product ID',
  })
  id: string;
}

export class ParamWarrantyProductDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Product ID',
  })
  id: string;
}

export class BodyApprovalWarrantyProductDTO {
  @IsNotEmpty()
  @IsEnum(statusClaim)
  @ApiProperty({
    description: 'Product ID',
    enum: ['PENDING', 'ACCEPT', 'REJECT'],
  })
  status: statusClaim;
}
