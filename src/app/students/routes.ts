import * as express from 'express';
import * as controller from './controller';
import * as userController from '../user/controller';
import * as classController from '../class/controller';
import * as userModel from '../user/model';

export const router: express.Router = express.Router();

router.use('/', userController.authenticate);

router.param('classid', classController.getClassFromParameter);

router.param('userid', userController.getUserFromParameter);

router.get('/:classid', userController.restrictToRole([userModel.Role.teacher, userModel.Role.admin]), controller.getStudentsInClass);

router.put('/:classid/:userid', userController.restrictToRole([userModel.Role.teacher, userModel.Role.admin]), controller.addStudentToClass);

router.delete('/:classid/:userid', userController.restrictToRole([userModel.Role.teacher, userModel.Role.admin]), controller.removeStudentFromClass);
