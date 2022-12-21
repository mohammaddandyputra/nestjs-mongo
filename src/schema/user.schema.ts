// import { Document, Schema } from 'mongoose';

// export const UserSchema = new Schema({
//   fullname: { type: String, required: true },
//   email: { type: String, required: true },
//   password: { type: String, required: true },
//   is_verify: { type: Boolean, required: true },
//   role: { type: String, required: true },
// });

// export interface User extends Document {
//   id: string;
// fullname: string;
// email: string;
// password: string;
// is_verify: boolean;
// role: string;
// }

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  is_verify: boolean;

  @Prop({ required: true })
  role: string;

  @Prop()
  created_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
