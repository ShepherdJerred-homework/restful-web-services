import * as express from 'express';
import * as model from './model';
import * as util from 'util';
import * as crypto from 'crypto';
import * as mongoose from 'mongoose';

let pbkdf2 = util.promisify(crypto.pbkdf2);

// todo must be teacher or admin
export async function getUsers (req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    let users: model.User[] = await model.UserModel.find();
    res.json(users);
  } catch (err) {
    res.status(500);
    res.send(err);
  }
}

// todo must be teacher or admin
export async function getUser (req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    let user: model.User | null;

    // TODO a valid username may be interpreted as a object id
    if (mongoose.Types.ObjectId.isValid(req.params.userid)) {
      user = await model.UserModel.findOne({ '_id': req.params.userid });
    } else {
      user = await model.UserModel.findOne({ 'username': req.params.userid });
    }

    res.json(user);
  } catch (err) {
    res.status(500);
    res.send(err);
  }
}

// todo must be admin
export async function addUser (req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    let salt = crypto.randomBytes(64);
    let saltBase64 = salt.toString('base64');
    let passwordHash = await pbkdf2(req.body.password, salt, 10000, 256, 'sha512');
    let passwordHashBase64 = passwordHash.toString('base64');

    let user: model.UserDocument = new model.UserModel({
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      role: req.body.role,
      salt: saltBase64,
      password: passwordHashBase64
    });

    user = await user.save();
    res.json(user);
  } catch (err) {
    res.status(500);
    res.send(err);
  }
}

// todo must be admin
export async function updateUser (req: express.Request, res: express.Response, next: express.NextFunction) {
}

// todo must be admin
export async function deleteUser (req: express.Request, res: express.Response, next: express.NextFunction) {

}
