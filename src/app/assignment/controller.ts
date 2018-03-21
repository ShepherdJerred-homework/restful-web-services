import * as express from 'express';
import * as model from './model';
import * as classModel from '../class/model';

export async function getAssignmentFromParameter (req: express.Request, res: express.Response, next: express.NextFunction, assignnum: string) {
  let classs: classModel.ClassDocument = res.locals.class;
  let assignment: model.AssignmentDocument;

  await classs.populate('assignments').execPopulate();

  let assignmentNumber: number = parseInt(assignnum, 10);
  assignment = classs.assignments[assignmentNumber - 1] as model.AssignmentDocument;

  res.locals.assignment = assignment;
}

export async function getAssignmentsForClass (req: express.Request, res: express.Response, next: express.NextFunction) {
  let classs = res.locals.class as classModel.ClassDocument;
  try {
    await classs.populate('assignments').execPopulate();
    res.json(classs.assignments);
  } catch (err) {
    res.status(500);
    res.json({ message: err });
  }
}

export async function getAssignment (req: express.Request, res: express.Response, next: express.NextFunction) {
  let assignment: model.AssignmentDocument = res.locals.assignment;
  res.json(assignment);
}

export async function addAssignment (req: express.Request, res: express.Response, next: express.NextFunction) {
  let classs = res.locals.class as classModel.ClassDocument;
  let assignment: model.AssignmentDocument = new model.AssignmentModel({
    class: req.body.class,
    title: req.body.title,
    points: req.body.points,
    due: new Date(req.body.due)
  });
  try {
    assignment = await assignment.save();
    await classs.update({ _id: classs._id }, { $push: { assignments: assignment } });
    res.json(assignment);
  } catch (err) {
    res.status(500);
    res.json({ message: err });
  }
}

export async function updateAssignment (req: express.Request, res: express.Response, next: express.NextFunction) {
  let classs = res.locals.class as classModel.ClassDocument;
  let assignment: model.AssignmentDocument = res.locals.assignment;

  let classId = req.body.class;
  if (classId) {
    assignment.class = classId;
  }

  let title = req.body.title;
  if (title) {
    assignment.title = title;
  }

  let points = req.body.points;
  if (points) {
    assignment.points = points;
  }

  let due = req.body.due;
  if (due) {
    assignment.due = new Date(due);
  }

  try {
    assignment = await assignment.save();
    if (classId) {
      await classs.update({ _id: classs._id }, { $pull: { assignments: assignment } });
      await classs.update({ _id: classId._id }, { $push: { assignments: assignment } });
    }
    res.json(assignment);
  } catch (err) {
    res.status(500);
    res.json({ message: err });
  }

}

export async function deleteAssignment (req: express.Request, res: express.Response, next: express.NextFunction) {
  let classs = res.locals.class as classModel.ClassDocument;
  let assignment: model.AssignmentDocument = res.locals.assignment;
  try {
    assignment = await model.AssignmentModel.deleteOne({ _id: assignment._id });
    await classs.update({ _id: classs._id }, { $pull: { assignments: assignment } });
    res.json(assignment);
  } catch (err) {
    res.status(500);
    res.json({ message: err });
  }
}
