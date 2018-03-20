import * as express from 'express';
import * as model from './model';
import * as util from 'util';
import * as crypto from 'crypto';
import * as mongoose from 'mongoose';
import * as basicAuth from 'basic-auth';

let pbkdf2 = util.promisify(crypto.pbkdf2);

export function restrictToRole (roles: model.Role[]) {
  return function (req: express.Request, res: express.Response, next: express.NextFunction) {
    console.log(roles);
    if (roles.indexOf(res.locals.login.role) > -1) {
      next();
    } else {
      res.status(403);
      res.json({ message: 'You are not allowed to perform this action' });
    }
  };
}

export async function authenticate (req: express.Request, res: express.Response, next: express.NextFunction) {
  let user = basicAuth(req);

  if (user && user.name && user.pass) {
    let targetUser: model.User | null = await getUserByUsername(user.name);

    if (targetUser && base64ToBuffer(targetUser.password).equals(await hashPassword(user.pass, base64ToBuffer(targetUser.salt)))) {
      res.locals.login = targetUser;
      next();
      return;
    }
  }

  res.status(401);
  res.setHeader('WWW-Authenticate', 'Basic realm="My Realm"');
  res.json({ message: 'You must be logged in to view this resource' });
}

export async function getUserFromParameter (req: express.Request, res: express.Response, next: express.NextFunction) {
  let user: model.User | null;

  try {
    // a valid username may be interpreted as a object id
    if (mongoose.Types.ObjectId.isValid(req.params.userid)) {
      user = await getUserById(req.params.userid);
    } else {
      user = await getUserByUsername(req.params.userid);
    }

    if (user) {
      res.locals.user = user;
      next();
    } else {
      res.status(404);
      res.json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500);
    res.json({ message: err });
  }
}

export async function getUsers (req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    let users: model.User[] = await model.UserModel.find();
    res.json(users);
  } catch (err) {
    res.status(500);
    res.json({ message: err });
  }
}

export async function getUser (req: express.Request, res: express.Response, next: express.NextFunction) {
  let user: model.UserDocument = res.locals.user;
  res.json(user);
}

export async function addUser (req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    let salt = generateSalt();
    let hashedPassword = await hashPassword(req.body.password, salt);

    let user: model.UserDocument = new model.UserModel({
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      role: req.body.role,
      salt: bufferToBase64(salt),
      password: bufferToBase64(hashedPassword)
    });

    user = await user.save();
    res.json(user);
  } catch (err) {
    res.status(500);
    res.json({ message: err });
  }
}

export async function updateUser (req: express.Request, res: express.Response, next: express.NextFunction) {
  let user: model.UserDocument = res.locals.user;

  let username = req.body.username;
  if (username) {
    user.username = username;
  }

  let firstname = req.body.firstname;
  if (firstname) {
    user.firstname = firstname;
  }

  let lastname = req.body.lastname;
  if (lastname) {
    user.lastname = lastname;
  }

  let email = req.body.email;
  if (email) {
    user.email = email;
  }

  let role = req.body.role;
  if (role) {
    user.role = role;
  }

  let password = req.body.password;
  if (password) {
    let salt = generateSalt();
    let hashedPassword = await hashPassword(password, salt);
    user.salt = bufferToBase64(salt);
    user.password = bufferToBase64(hashedPassword);
  }

  user = await user.save();
  res.json(user);
}

export async function deleteUser (req: express.Request, res: express.Response, next: express.NextFunction) {
  let user: model.UserDocument = res.locals.user;
  try {
    user = await user.remove();
    res.json(user);
  } catch (err) {
    res.status(500);
    res.json({ message: err });
  }
}

async function getUserById (id: string) {
  return model.UserModel.findOne({ '_id': id });
}

async function getUserByUsername (username: string) {
  return model.UserModel.findOne({ 'username': username });
}

function generateSalt (): Buffer {
  return crypto.randomBytes(64);
}

function hashPassword (password: string, salt: Buffer): Promise<Buffer> {
  return pbkdf2(password, salt, 10000, 256, 'sha512');
}

function bufferToBase64 (input: Buffer): string {
  return input.toString('base64');
}

function base64ToBuffer (input: string): Buffer {
  return Buffer.from(input, 'base64');
}
