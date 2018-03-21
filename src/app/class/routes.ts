import * as express from 'express';
import * as controller from './controller';
import * as userController from '../user/controller';
import * as userModel from '../user/model';

export const router: express.Router = express.Router();

router.use('/', userController.authenticate);

router.param('classid', controller.getClassFromParameter);

router.get('/', userController.restrictToRole([userModel.Role.student, userModel.Role.teacher, userModel.Role.admin]), controller.getClasses);

router.get('/:classid', userController.restrictToRole([userModel.Role.student, userModel.Role.teacher, userModel.Role.admin]), controller.getClass);

router.post('/', userController.restrictToRole([userModel.Role.teacher, userModel.Role.admin]), controller.addClass);

router.put('/:classid', userController.restrictToRole([userModel.Role.teacher, userModel.Role.admin]), controller.updateClass);

router.delete('/:classid', userController.restrictToRole([userModel.Role.teacher, userModel.Role.admin]), controller.deleteClass);
