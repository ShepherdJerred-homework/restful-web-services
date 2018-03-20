import * as express from 'express';
import * as controller from './controller';
import * as model from './model';

export const router: express.Router = express.Router();

router.get('/', controller.authenticate, controller.restrictToRole([model.Role.teacher, model.Role.admin]), controller.getUsers);

router.get('/:userid', controller.authenticate, controller.restrictToRole([model.Role.teacher, model.Role.admin]), controller.getUserFromParameter, controller.getUser);

router.post('/', controller.authenticate, controller.restrictToRole([model.Role.admin]), controller.addUser);

router.put('/:userid', controller.authenticate, controller.restrictToRole([model.Role.admin]), controller.getUserFromParameter, controller.updateUser);

router.delete('/:userid', controller.authenticate, controller.restrictToRole([model.Role.admin]), controller.getUserFromParameter, controller.deleteUser);
