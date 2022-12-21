import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schema/user.schema';
import { sign } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { IChangePassword, ILogin, IRegistration } from './auth.interface';
const SALT_ROUND = 10;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
  ) {}

  async signUp(payload: IRegistration): Promise<any> {
    const { role } = payload;

    role === 'ADMIN' ? (payload.is_verify = true) : (payload.is_verify = false);
    payload.password = bcrypt.hashSync(payload.password, SALT_ROUND);

    const data: any = await new this.UserModel({
      ...payload,
      created_at: Date.now(),
    }).save();
    return data;
  }

  async signIn(payload: ILogin): Promise<any> {
    const { email, password } = payload;
    const user = await this.UserModel.findOne({ email });

    if (!user) {
      throw new HttpException('Account not found', 404);
    }

    const match: boolean = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new HttpException('Password incorrect', 400);
    }

    if (!user.is_verify) {
      throw new HttpException(
        'Account not verified, please contact administrator ',
        400,
      );
    }

    const userData = {
      user_id: user._id,
      fullname: user.fullname,
      role: user.role,
    };
    const token = sign(userData, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXP,
    });

    return token;
  }

  async changePassword(payload: IChangePassword): Promise<any> {
    const { email, old_password, new_password } = payload;

    const user = await this.UserModel.findOne({ email });
    if (!user) {
      throw new HttpException('Account not found', 404);
    }

    const match: boolean = await bcrypt.compare(old_password, user.password);
    if (!match) {
      throw new HttpException('Old password incorrect', 400);
    }

    const data = await this.UserModel.findByIdAndUpdate(user._id, {
      password: bcrypt.hashSync(new_password, SALT_ROUND),
    });

    return data;
  }
}
