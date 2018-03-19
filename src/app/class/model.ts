import '../mongoose';
import * as mongoose from 'mongoose';
import * as user from '../user/model';
import * as assignment from '../assignment/model';

export interface Class {
  department: string;
  number: number;
  title: string;
  teacher: number | user.User;
  students: number[] | user.User[];
  assignments: number[] | assignment.Assignment[];
}

export interface ClassDocument extends Class, mongoose.Document {
}

let ClassSchema: mongoose.Schema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 4,
    uppercase: true
  },
  number: {
    type: Number,
    required: true,
    validate: {
      validator: (i: number) => {
        return Number.isInteger(i);
      },
      message: '{VALUE} must be an integer',
      min: 100,
      max: 999
    }
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  teacher: {
    type: user.UserModel,
    required: true,
    ref: 'User',
    validate: {
      // TODO check for teacher role
      validator: (id: mongoose.Schema.Types.ObjectId) =>
        user.UserModel.findById(id).then(user => user !== null) as any,
      message: 'User ${VALUE} does not exist'
    }
  },
  students: {
    type: [user.UserModel],
    required: true,
    ref: 'User',
    validate: {
      // TODO check for student role
      validator: (id: mongoose.Schema.Types.ObjectId) =>
        user.UserModel.findById(id).then(user => user !== null) as any,
      message: 'User ${VALUE} does not exist'
    }
  },
  assignments: {
    type: [assignment.AssignmentModel],
    required: true,
    ref: 'Assignment'
  }
});

export let ClassModel: mongoose.Model<ClassDocument> = mongoose.model<ClassDocument>('Class', ClassSchema);
