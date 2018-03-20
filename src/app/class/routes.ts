import * as express from 'express';
import * as controller from './controller';
import * as userController from '../user/controller';
import * as model from '../user/model';

export const router: express.Router = express.Router();

router.use('/', userController.authenticate);

router.param('classid', controller.getClassFromParameter);

router.get('/', userController.restrictToRole([model.Role.student, model.Role.teacher, model.Role.admin]), controller.getClasses);

router.get('/:classid', userController.restrictToRole([model.Role.student, model.Role.teacher, model.Role.admin]), controller.getClass);

router.post('/', userController.restrictToRole([model.Role.teacher, model.Role.admin]), controller.addClass);

router.post('/:classid', userController.restrictToRole([model.Role.teacher, model.Role.admin]), controller.updateClass);

router.delete('/:classid', userController.restrictToRole([model.Role.teacher, model.Role.admin]), controller.deleteClass);
