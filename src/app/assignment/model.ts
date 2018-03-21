import '../mongoose';
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
    type: mongoose.Schema.Types.ObjectId,
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
}, {
  toJSON: {
    getters: false,
    virtuals: false,
    transform: (doc, obj, options) => {
      obj.id = obj._id;
      obj.due = obj.due.toLocaleString();
      delete obj._id;
      delete obj.__v;
      return obj;
    }
  }
});

export let AssignmentModel: mongoose.Model<AssignmentDocument> = mongoose.model<AssignmentDocument>('Assignment', AssignmentSchema);
