import * as express from 'express';
import * as model from './model';
import * as util from 'util';
import * as crypto from 'crypto';

let pbkdf2 = util.promisify(crypto.pbkdf2);

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
    let user: model.User | null;
    if (isNaN(req.params.userid)) {
      user = await model.UserModel.findOne({ 'username': req.params.userid });
    } else {
      user = await model.UserModel.findOne({ '_id': req.params.userid });
    }
    // TODO check if userid is id or username
    // TODO don't send salt or password
    res.send(user);
  } catch (err) {
    res.status(500);
    res.send(err);
  }
}

export async function addUser (req: express.Request, res: express.Response, next: express.NextFunction) {
  let salt = crypto.randomBytes(64);
  let encryptedBuffer = await pbkdf2(req.body.password, salt, 10000, 256, 'sha512');
  let encryptedPassword = encryptedBuffer.toString('base64');

  let user: model.UserDocument = new model.UserModel({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    salt: salt,
    password: encryptedPassword
  });
  try {
    user = await user.save();
    res.send(user);
  } catch (err) {
    res.status(500);
    res.send(err);
  }
}

export async function updateUser (req: express.Request, res: express.Response, next: express.NextFunction) {
}

export async function deleteUser (req: express.Request, res: express.Response, next: express.NextFunction) {
}
