import './mongoose';
import * as mongoose from 'mongoose';
import * as classs from '../class/model';

export interface Assignment {
  class: classs.Class;
  title: string;
  points: number;
  due: Date;
}

export interface AssignmentDocument extends Assignment, mongoose.Document {
}

let AssignmentSchema: mongoose.Schema = new mongoose.Schema({
  class: {
    type: classs.ClassModel,
    required: true,
    ref: 'Class'
  },
  title: {
    type: String,
    trim: true,
    maxlength: 200
  },
  points: {
    type: Number,
    default: 100,
    min: 0
  },
  due: {
    type: Date,
    default: () => {
      let now = new Date();
      return now.setDate(now.getDate() + 2);
    }
  }
});

export let AssignmentModel: mongoose.Model<AssignmentDocument> = mongoose.model<AssignmentDocument>('Class', AssignmentSchema);
