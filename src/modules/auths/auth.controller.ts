import {
  Body,
  Response,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { Utils } from 'src/utils/util';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { IChangePassword, ILogin, IRegistration } from './auth.interface';
import { AuthService } from './auth.service';
import { User } from 'src/schema/user.schema';
import {
  BodyChangePasswordDTO,
  BodyLoginDTO,
  BodyRegisterDTO,
} from './auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private util = new Utils();

  // Register Account
  @ApiOperation({ summary: 'Register Account' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: BodyRegisterDTO })
  @Post('/register')
  @UseInterceptors(FileInterceptor(''))
  @ApiCreatedResponse({ description: 'Register success' })
  async postRegister(
    @Body() body: BodyRegisterDTO,
    @Response() res: any,
  ): Promise<User> {
    const payload: IRegistration = {
      ...body,
    };

    const data = await this.authService.signUp(payload);
    return this.util.responseSuccess(res, 'Register successfully', data, 201);
  }

  // Login Account
  @ApiOperation({ summary: 'Sign In Account' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: BodyLoginDTO })
  @Post('/login')
  @UseInterceptors(FileInterceptor(''))
  @ApiCreatedResponse({ description: 'Login success' })
  async postLogin(
    @Body() body: BodyLoginDTO,
    @Response() res: any,
  ): Promise<User> {
    const payload: ILogin = {
      ...body,
    };
    const data = await this.authService.signIn(payload);
    return this.util.responseSuccess(res, 'Success', data, 200);
  }

  // Change Password
  @ApiOperation({ summary: 'Change Password Account' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: BodyChangePasswordDTO })
  @Post('/change-password')
  @UseInterceptors(FileInterceptor(''))
  @ApiCreatedResponse({ description: 'Password changed success' })
  async postChangePassword(
    @Body() body: BodyChangePasswordDTO,
    @Response() res: any,
  ): Promise<User> {
    const payload: IChangePassword = {
      ...body,
    };
    const data = await this.authService.changePassword(payload);
    return this.util.responseSuccess(
      res,
      'Password changed successfully',
      data,
      201,
    );
  }
}
