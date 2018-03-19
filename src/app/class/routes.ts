import * as express from 'express';
import * as controller from './controller';

export const router: express.Router = express.Router();

router.get('/:classid', controller.getStudentsInClass);

router.put('/:classid/:userid', controller.addStudentToClass);

router.delete('/:classid/:userid', controller.removeStudentFromClass);
