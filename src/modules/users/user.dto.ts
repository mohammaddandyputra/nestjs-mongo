import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class BodyApprovalUserDTO {
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: 'Approve or not',
  })
  is_verify: boolean;
}
