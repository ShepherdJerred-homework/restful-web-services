import * as express from 'express';
import * as controller from './controller';
import * as model from './model';

export const router: express.Router = express.Router();

router.use('/', controller.authenticate);

router.param('userid', controller.getUserFromParameter);

router.get('/', controller.restrictToRole([model.Role.teacher, model.Role.admin]), controller.getUsers);

router.get('/:userid', controller.restrictToRole([model.Role.teacher, model.Role.admin]), controller.getUser);

router.post('/', controller.restrictToRole([model.Role.admin]), controller.addUser);

router.put('/:userid', controller.restrictToRole([model.Role.admin]), controller.updateUser);

router.delete('/:userid', controller.restrictToRole([model.Role.admin]), controller.deleteUser);
