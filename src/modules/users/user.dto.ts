import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class BodyApprovalUserDTO {
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => {
    const bool: boolean = value === 'true' ? true : false;
    return bool;
  })
  @ApiProperty({
    description: 'Approve or not',
  })
  is_verify: boolean;
}
