import * as express from 'express';
import * as controller from './controller';
import * as userController from '../user/controller';
import * as classController from '../class/controller';
import * as userModel from '../user/model';

export const router: express.Router = express.Router();

router.use('/', userController.authenticate);

router.param('classid', classController.getClassFromParameter);

router.param('assignnum', controller.getAssignmentFromParameter)

router.get('/:classid', userController.restrictToRole([userModel.Role.student, userModel.Role.teacher, userModel.Role.admin]), controller.getAssignmentsForClass);

router.get('/:classid/:assignnum', userController.restrictToRole([userModel.Role.student, userModel.Role.teacher, userModel.Role.admin]), controller.getAssignment);

router.post('/:classid', userController.restrictToRole([userModel.Role.teacher, userModel.Role.admin]), controller.addAssignment);

router.put('/:classid/:assignnum', userController.restrictToRole([userModel.Role.teacher, userModel.Role.admin]), controller.updateAssignment);

router.delete('/:classid/:assignnum', userController.restrictToRole([userModel.Role.teacher, userModel.Role.admin]), controller.deleteAssignment);
