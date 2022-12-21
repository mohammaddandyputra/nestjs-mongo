import {
  Body,
  Response,
  Controller,
  UseGuards,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Utils } from 'src/utils/util';
import { UserDecorator } from '../guards/user.decorator';
import { JwtAuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../guards/role.decorator';
import { User } from 'src/schema/user.schema';
import { IApprovalUser } from './user.interface';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { BodyApprovalUserDTO } from './user.dto';

@ApiTags('users')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  private util = new Utils();

  // Profile User
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/profile')
  async getProfile(@Response() res: any, @UserDecorator() user): Promise<any> {
    const data: any = await this.userService.getProfile(user.user_id);
    return this.util.responseSuccess(res, 'User found', data, 201);
  }

  // User Lists
  @ApiBearerAuth()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/users')
  async getUsers(@Response() res: any): Promise<User> {
    const data: any = await this.userService.findAllUsers();
    return this.util.responseSuccess(res, 'User lists', data, 201);
  }

  // Approval User
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: BodyApprovalUserDTO })
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch('/users/reject/:id')
  async approvalUser(
    @Body() body: BodyApprovalUserDTO,
    @Response() res: any,
    @Param('id') user_id: string,
  ): Promise<User> {
    const payload: IApprovalUser = {
      id: user_id,
      is_verify: body.is_verify,
    };
    const data: any = await this.userService.approvalUser(payload);
    return this.util.responseSuccess(
      res,
      'User has been successfully rejected',
      data,
      201,
    );
  }
}
