import * as express from 'express';
import * as model from './model';
import * as util from 'util';
import * as crypto from 'crypto';
import * as mongoose from 'mongoose';
import * as basicAuth from 'basic-auth';

let pbkdf2 = util.promisify(crypto.pbkdf2);

async function getUserById (id: string) {
  return model.UserModel.findOne({ '_id': id });
}

async function getUserByUsername (username: string) {
  return model.UserModel.findOne({ 'username': username });
}

export function checkUserIsTeacher (req: express.Request, res: express.Response, next: express.NextFunction) {
  if (res.locals.login.role === 'teacher') {
    next();
  } else {
    res.status(401);
    res.json('{ error: "You are not allowed to perform this action" }');
  }
}

export function checkUserIsAdmin (req: express.Request, res: express.Response, next: express.NextFunction) {
  if (res.locals.login.role === 'admin') {
    next();
  } else {
    res.status(401);
    res.json('{ error: "You are not allowed to perform this action" }');
  }
}

export async function authenticate (req: express.Request, res: express.Response, next: express.NextFunction) {
  let user = basicAuth(req);

  if (user && user.name && user.pass) {
    let targetUser: model.User | null = await getUserByUsername(user.name);
    if (targetUser && targetUser.password === user.pass) {
      res.locals.login = targetUser;
      next();
      return;
    }
  }

  res.status(401);
  res.setHeader('WWW-Authenticate', 'Basic realm=""');
  res.json('{ error: "You must be logged in to view this resource" }');
}

export async function getUserFromParameter (req: express.Request, res: express.Response, next: express.NextFunction) {
  let user: model.User | null;

  try {
    // TODO a valid username may be interpreted as a object id
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
      res.json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500);
    res.send(err);
  }
}

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
  let user: model.UserDocument = res.locals.user;
  res.json(user);
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
    // TODO this code is repeated
    let salt = crypto.randomBytes(64);
    let saltBase64 = salt.toString('base64');
    let passwordHash = await pbkdf2(password, salt, 10000, 256, 'sha512');
    let passwordHashBase64 = passwordHash.toString('base64');
    user.salt = saltBase64;
    user.password = passwordHashBase64;
  }

  user = await user.save();
  res.json(user);
}

// todo must be admin
export async function deleteUser (req: express.Request, res: express.Response, next: express.NextFunction) {
  let user: model.UserDocument = res.locals.user;
  try {
    user = await user.remove();
    res.json(user);
  } catch (err) {
    res.status(500);
    res.send(err);
  }
}
