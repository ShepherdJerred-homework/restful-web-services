import * as express from 'express';
import * as model from './model';
import * as mongoose from 'mongoose';
import * as userModel from '../user/model';

export async function getClassFromParameter (req: express.Request, res: express.Response, next: express.NextFunction, classid: string) {
  let classs: model.Class | null;

  try {
    if (mongoose.Types.ObjectId.isValid(classid)) {
      classs = await getClassById(classid);
    } else {
      classs = await getClassByDepartmentAndNumber(classid);
    }

    if (classs) {
      res.locals.class = classs;
      next();
    } else {
      res.status(404);
      res.json({ message: 'Class not found' });
    }
  } catch (err) {
    res.status(500);
    res.json({ message: err });
  }
}

function getClassById (id: string) {
  return model.ClassModel.findOne({ '_id': id });
}

function getClassByDepartmentAndNumber (departmentAndNumber: string) {
  let department: string = departmentAndNumber.substring(0, 4).toUpperCase();
  let courseNumber: number = Number.parseInt(departmentAndNumber.substring(4, 7), 10);
  return model.ClassModel.findOne({ 'department': department, 'number': courseNumber });
}

export async function getClasses (req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    res.json(await model.ClassModel.find().populate('teacher', 'firstname lastname email'));
  } catch (err) {
    res.status(500);
    res.json({ message: err });
  }
}

export function getClass (req: express.Request, res: express.Response, next: express.NextFunction) {
  let classs: model.ClassDocument = res.locals.class;
  res.json(classs);
}

export async function addClass (req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    let teacher = req.body.teacher;
    if (!mongoose.Types.ObjectId.isValid(teacher)) {
      try {
        await userModel.UserModel.findOne({ 'username': teacher });
      } catch (err) {
        res.status(400);
        res.json({ message: 'Teacher not found' });
      }
    }
    let classs: model.ClassDocument = new model.ClassModel({
      department: req.body.department,
      number: req.body.number,
      title: req.body.title,
      teacher: teacher
    });
    classs = await classs.save();
    res.json(classs);
  } catch (err) {
    res.status(500);
    res.json({ message: err });
  }
}

export function updateClass (req: express.Request, res: express.Response, next: express.NextFunction) {
}

export function deleteClass (req: express.Request, res: express.Response, next: express.NextFunction) {
}
