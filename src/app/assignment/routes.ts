import * as express from 'express';
import * as controller from './controller';

export const router: express.Router = express.Router();

router.get('/:classid', controller.getAssignmentsForClass);

router.get('/:classid/:assignnum', controller.getAssignment);

router.post('/:classid', controller.addAssignment);

router.put('/:classid/:assignnum', controller.updateAssignment);

router.delete('/:classid/:assignnum', controller.deleteAssignment);
