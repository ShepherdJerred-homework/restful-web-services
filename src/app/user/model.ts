import '../mongoose';
import * as mongoose from 'mongoose';

export interface User {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  role: Role;
  salt: string;
  password: string;
}

export enum Role {
  'admin',
  'teacher',
  'student'
}

export interface UserDocument extends User, mongoose.Document {
}

let UserSchema: mongoose.Schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    matches: /^[a-zA-Z\d]([a-zA-Z\d]|[_-][a-zA-Z\d])+$/,
    maxlength: 32,
    unique: true
  },
  firstname: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    matches: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/
  },
  role: {
    type: String,
    required: true,
    enum: [
      'admin',
      'teacher',
      'student'
    ]
  },
  salt: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

export let UserModel: mongoose.Model<UserDocument> = mongoose.model<UserDocument>('User', UserSchema);
