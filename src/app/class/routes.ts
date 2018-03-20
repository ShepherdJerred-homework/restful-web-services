import * as express from 'express';
import * as controller from './controller';

export const router: express.Router = express.Router();

router.get('/', controller.getClasses);

router.get('/:classid', controller.getClass);

router.post('/', controller.addClass);

router.post('/:classid', controller.updateClass);

router.delete('/:classid', controller.deleteClass);
