import { Injectable, HttpException } from '@nestjs/common';
import { IApprovalUser, IUserProfile } from './user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
  ) {}

  async getProfile(user_id: IUserProfile): Promise<any> {
    const user: any = await this.UserModel.findById(user_id);

    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return user;
  }

  async findAllUsers(): Promise<any> {
    const users: any = await this.UserModel.find();

    return users;
  }

  async approvalUser(payload: IApprovalUser): Promise<any> {
    const { id, is_verify } = payload;

    const user: any = await this.UserModel.findByIdAndUpdate(id, {
      $set: { is_verify },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }
}
