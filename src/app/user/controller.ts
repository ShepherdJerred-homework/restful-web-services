import * as express from 'express';
import * as model from './model';

export function getUsers (req: express.Request, res: express.Response, next: express.NextFunction) {
  model.UserModel.find().then((users: model.User[]) => {
    res.send(users);
  }).catch((err: any) => {
    console.log(err);
    res.sendStatus(500);
  });
}

export function getUser (req: express.Request, res: express.Response, next: express.NextFunction) {
  
}

export function addUser (req: express.Request, res: express.Response, next: express.NextFunction) {

}

export function updateUser (req: express.Request, res: express.Response, next: express.NextFunction) {

}

export function deleteUser (req: express.Request, res: express.Response, next: express.NextFunction) {

}
