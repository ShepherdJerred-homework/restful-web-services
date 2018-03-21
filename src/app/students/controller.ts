import * as express from 'express';
import * as classModel from '../class/model';
import * as userModel from '../user/model';

export async function getStudentsInClass (req: express.Request, res: express.Response, next: express.NextFunction) {
  let classs = res.locals.class as classModel.ClassDocument;
  try {
    await classs.populate('students').execPopulate();
    res.json(classs.students);
  } catch (err) {
    res.status(500);
    res.json({ message: err });
  }
}

export async function addStudentToClass (req: express.Request, res: express.Response, next: express.NextFunction) {
  let classs = res.locals.class as classModel.ClassDocument;
  let user = res.locals.user as userModel.UserDocument;

  try {
    await classs.update({ $push: { 'students': user._id } });
    classs = await classModel.ClassModel.findOne({ _id: classs.id }).populate('students') as classModel.ClassDocument;
    res.json(classs.students);
  } catch (err) {
    res.status(500);
    res.json({ message: err });
  }
}

export async function removeStudentFromClass (req: express.Request, res: express.Response, next: express.NextFunction) {
  let classs = res.locals.class as classModel.ClassDocument;
  let user = res.locals.user as userModel.UserDocument;

  try {
    await classs.update({ $pull: { 'students': user._id } });
    classs = await classModel.ClassModel.findOne({ _id: classs.id }).populate('students') as classModel.ClassDocument;
    res.json(classs.students);
  } catch (err) {
    res.status(500);
    res.json({ message: err });
  }
}
