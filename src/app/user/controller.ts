import * as express from 'express';
import * as model from './model';

export async function getUsers (req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    let users: model.User[] = await model.UserModel.find();
    res.send(users);
  } catch (err) {
    res.status(500);
    res.send(err);
  }
}

export async function getUser (req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    // TODO check if userid is id or username
    let user: model.User | null = await model.UserModel.findOne({ '_id': req.params.userid });
    res.send(user);
  } catch (err) {
    res.status(500);
    res.send(err);
  }
}

export async function addUser (req: express.Request, res: express.Response, next: express.NextFunction) {
  let user: model.UserModel = new model.UserModel({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email
  });
  try {
    await user.save();
  } catch (err) {
    res.status(500);
    res.send(err);
  }
}

export async function updateUser (req: express.Request, res: express.Response, next: express.NextFunction) {
}

export async function deleteUser (req: express.Request, res: express.Response, next: express.NextFunction) {
}
