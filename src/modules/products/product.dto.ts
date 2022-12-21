import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { statusClaim } from './product.interface';

export class BodyCreateProductDTO {
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
  @Transform(({ value }) => {
    const bool: boolean = value === 'true' ? true : false;
    return bool;
  })
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
    required: false,
  })
  file: string;

  @IsNotEmpty()
  @Transform(({ value }) => {
    const bool: boolean = value === 'true' ? true : false;
    return bool;
  })
  @ApiProperty({
    description: 'Warranty or not',
  })
  is_warranty: boolean;
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
