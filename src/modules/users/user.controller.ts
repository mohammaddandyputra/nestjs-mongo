import {
  Body,
  Response,
  Controller,
  UseGuards,
  Get,
  Param,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Utils } from 'src/utils/util';
import { UserDecorator } from '../guards/user.decorator';
import { JwtAuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../guards/role.decorator';
import { User } from 'src/schema/user.schema';
import { IApprovalUser } from './user.interface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { BodyApprovalUserDTO } from './user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('users')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  private util = new Utils();

  // Profile User
  @ApiOperation({ summary: 'View Own Account' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/profile')
  async getProfile(@Response() res: any, @UserDecorator() user): Promise<any> {
    const data: any = await this.userService.getProfile(user.user_id);
    return this.util.responseSuccess(res, 'User found', data, 201);
  }

  // User Lists
  @ApiOperation({ summary: 'User Lists' })
  @ApiBearerAuth()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/users')
  async getUsers(@Response() res: any): Promise<User> {
    const data: any = await this.userService.findAllUsers();
    return this.util.responseSuccess(res, 'User lists', data, 201);
  }

  // Approval User
  @ApiOperation({ summary: 'Approval Account' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: BodyApprovalUserDTO })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'User ID',
  })
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch('/users/approval/:id')
  @UseInterceptors(FileInterceptor(''))
  async approvalUser(
    @Body() body: BodyApprovalUserDTO,
    @Response() res: any,
    @Param('id') user_id: string,
  ): Promise<User> {
    const payload: IApprovalUser = {
      id: user_id,
      is_verify: body.is_verify,
    };
    const { message, data }: any = await this.userService.approvalUser(payload);
    return this.util.responseSuccess(
      res,
      `User has been successfully ${message}`,
      data,
      201,
    );
  }
}
