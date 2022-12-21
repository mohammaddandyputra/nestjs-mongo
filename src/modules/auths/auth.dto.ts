import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from './auth.interface';

export class BodyRegisterDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Your Fullname' })
  fullname: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'Your Email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Your Password' })
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  @ApiProperty({
    description: 'ADMIN or USER',
    enum: ['ADMIN', 'USER'],
  })
  role: Role;

  is_verify: boolean;
}

export class BodyLoginDTO {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'Your Email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Your Password' })
  password: string;
}

export class BodyChangePasswordDTO {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'Your Email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Your Old Password' })
  old_password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'New Password' })
  new_password: string;
}
